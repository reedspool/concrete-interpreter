// Preamble


// [[file:../literate/StepwiseMachine.org::*Preamble][Preamble:1]]
import { Machine, sendParent, send } from "xstate";
import { assign } from "@xstate/immer";
import { Frame } from "./Frame";
import { Category } from "concrete-parser";
const MAX_STEPS = 100;
// Preamble:1 ends here

// Definition

// Begin the definition, we'll explain each state in turn:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:1]]
export const definition = {
    id: "StepwiseInterpreter",
    strict: true,
// Definition:1 ends here



// At any time until the interpreter finalizes, users can load new global implementations.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:2]]
    on: {
        LOAD_GLOBAL_LABEL: { actions: [ "loadGlobalLabel" ] }
    },
// Definition:2 ends here



// Initialize key structures in machine context immediately upon creation.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:3]]
    initial: "uninitialized",
    states: {
        uninitialized: {
            entry: [ "initialize" ],
            always: "empty"
        },
// Definition:3 ends here



// After initializing, the interpreter will always start in the "empty" state, because it doesn't have any code to run. It will proceed if it receives some code to run.

// The "states" object is left open, because there are many more to define.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:4]]
        empty: {
            on: {
                LOAD_PROGRAM: {
                    target: "run",
                    actions: [ "loadProgram" ]
                }
            }
        },
// Definition:4 ends here



// Once the program is loaded, we are going to be inside "run" until the program finishes or crashes.

// The "run" state is complex. It always starts in the sub-state where it checks if the reader head is beyond the edge. This is important because the loaded program might be empty, in which case it should immediately halt.

// If the tape is past the edge, then the current tape halts. This tape might have been called by another, indicated by the stack not being empty. Then, this is an implicit return.

// If the tape is past the edge but the stack is empty, then the entire program is done.

// Otherwise, we proceed to the normal "read" phase.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:5]]
        run: {
            initial: "checkPastTapeEdge",
            states: {
                checkPastTapeEdge: {
                    entry: [ assign((C, E) => { C.steps += 1; if (C.steps > MAX_STEPS) throw new Error("max steps") })],
                    always: [
                        {
                            cond: "isBeyondEdgeAndStackIsNonEmpty",
                            target: "return"
                        },
                        {
                            cond: "isBeyondEdge",
                            target: "#StepwiseInterpreter.halted"
                        },
                        {
                            target: "read"
                        }
                    ]
                },
// Definition:5 ends here



// To interpret a Concrete program is to loop over each cell of the program's tape and take some action. Which action to take depends on which block is in the current cell. We record it before acting on that information to facilitate the intended "step-wise" nature.

// At the beginning of the program, the reader head is at the first cell. Later, the program will return to this state but the reader head will have progressed to a different cell.

// Upon proceeding, we branch depending on the category of that block.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:6]]
                read: {
                    entry: [ "recordCurrentBlockAtHead", "reportReadyToStep" ],
                    on : {
                        STEP: [
                            {
                                cond: "isCurrentBlockValue",
                                target: "executeValue"
                            },
                            {
                                cond: "isCurrentBlockOp",
                                target: "executeOp"
                            },
                            {
                                actions: [ "reportErrorInvalidCategoryOfCurrentBlock" ],
                                target: "#StepwiseInterpreter.error"
                            }
                        ]
                    }
                },
// Definition:6 ends here



// Ops act on their arguments, or the tape around them. They are the blocks which /do/ things. What happens depends on the block itself, so we have to dispatch based on that block to a variety of executors.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:7]]
                executeOp: {
                    invoke: {
                        id : "executor",
                        src : "dispatchOnExecutor",
                        // data : (C, E) => C,
                        onError : {
                            // Toggle on for executor error loggging
                            // actions: [(C, E) => console.log("Executor Error:", E)],
                            target : "#StepwiseInterpreter.error"
                        },
                        onDone: {
                            target: "advance",
                            actions: [ "clearArguments" ]
                        }
                    },
// Definition:7 ends here



// Op executors can do a huge variety of things during their invocation. All those things are received as events, and handled by this machine.

// This first important action is a way to replicate the "onDone" above for those services which do not finalize themselves, like callback services.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:8]]
                    on: {
                        DONE: { target: "advance", actions: [ "clearArguments" ] },
                        DONE_NO_ADVANCE: { target: "no_advance" },
                        EXPLICIT_RETURN: { target: "return" },
                        CLEAR_ARGUMENTS: { actions: [ "clearArguments" ] },
                        CALL_TAPE : { actions: [ "exec_callTape" ] },
                        PLACE_OP_RESULT : { actions: [ "exec_placeResult" ] },
                        PLACE_BLOCK_AT_ADDRESS : { actions: [ "exec_placeBlockAtAddress" ] },
                        MOVE_HEAD_TO_ADDRESS : { actions: [ "exec_moveHeadToAddress" ]},
                        REQUEST_BLOCK_AT_ADDRESS : { actions: [ "exec_reqBlockAtAddress" ] },
                    }
                },
// Definition:8 ends here



// If there is a comma preceding the current block, we grow the argument list by appending the current block. If there is no comma, the argument list will only contain the current block, dumping its previous contents.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:9]]
                executeValue: {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: [
                            {
                                cond: "isCommaAtHead",
                                target: "advance",
                                actions: [ "appendArgumentsWithCurrentBlock" ]
                            },
                            {
                                target: "advance",
                                actions: [ "replaceArgumentsWithCurrentBlock" ]
                            }
                        ]
                    }
                },
// Definition:9 ends here



// In general, once we've done whatever we're going to do with this block, we move one place to the right. There are exceptions to this, such as if a tape halts or if the head jumps.

// After advancing, we go "back to the top" in the read-eval-advance cycle, first checking if we've moved past the edge of the tape and must halt.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:10]]
                advance: {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: {
                            target: "checkPastTapeEdge",
                            actions: [ "advanceHead" ]
                        }
                    }
                },
// Definition:10 ends here



// For those executors which do not advance the head, we still want the step machine to act the same way, so make the same exact state but which does not advance.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:11]]
                no_advance: {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: {
                            target: "checkPastTapeEdge",
                        }
                    }
                },
// Definition:11 ends here



// The machine enters the "return" state when a called tape is complete. If the tape has a result, place it where results go. Usually, this is immediately to the right of the call identifier which spawned the tape.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:12]]
                "return" : {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: {
                            target: "pop",
                            actions: [ "placeResultOnLowerFrame" ]
                        }
                    }
                },
// Definition:12 ends here



// Pop merely disposes of the current frame and replaces it with the frame on top of the stack. Then, it starts back at the top of the loop by checking past the edge for the old frame.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:13]]
                pop : {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: {
                            target: "advance",
                            actions: [ "popFrame" ]
                        }
                    }
                }
// Definition:13 ends here



// Closing "run" internal states map as well as itself.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:14]]
            }
        },
// Definition:14 ends here



// A program which has completed interpretation normally will find itself, finally, in the "halted" state

// When the program is halted, the result of the program is the current arguments list in the active frame.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:15]]
        halted: {
            type : "final",
            entry : [ "haltFrame" ],
            data : (C) => ({ results: C.activeFrame.arguments })
        },
// Definition:15 ends here



// The other way a program can end is in the error state.

// When the program errors, we assume it is from an executor, in which case the current event holds all the data about the error which arose.

// We include the full context of the machine for debugging purposes.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:16]]
        error: {
            type : "final",
            entry : [ "haltFrame" ],
            data : (C, E) => ({ error: E, context: C })
        },
// Definition:16 ends here



// We're done with states, so close the state map:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:17]]
    },
// Definition:17 ends here




// And finally, close up the definition:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:18]]
};
// Definition:18 ends here

// Configuration

// Start with actions.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
// Configuration:1 ends here



// When the machine starts, its context just an empty object. Fill it with some necessary structures.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:2]]
        initialize : assign((C, E) => {
            C.steps = 0;
            C.globalLabelsToExecutorServices = {};
            C.nextFrameId = 0;
            C.frameIdsToIdentifiersToClosedCells = {};
        }),
// Configuration:2 ends here



// When the program loads, the source is an Abstract Syntax Tree. We need to create an active stack frame for it.

// The rest of the stack is empty.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:3]]
        loadProgram: assign((C, E) => {
            C.source = E.source;
            C.activeFrame = Frame(C.nextFrameId++, E.source.tape);
            C.stack = [];
        }),
// Configuration:3 ends here



// Determine what is the category of the block at the head of the current cell.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:4]]
        recordCurrentBlockAtHead : assign((C, E) => {
            C.currentBlock = C.activeFrame.getBlockAtHead();
        }),
// Configuration:4 ends here



// Depending on the circumstances, we do or do not clear the current argument list before adding the current block. See "executeValue" above.

// Either way, if the value is a ValueIdentifier, we have to resolve it to its proper value, but the =Frame= implementation will handle that.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:5]]
        clearArguments: assign((C, E) => {
            C.activeFrame.clearArguments();
        }),
        appendArgumentsWithCurrentBlock : assign((C, E) => {
            C.activeFrame.appendBlockAtHeadValueToArguments();
        }),
        replaceArgumentsWithCurrentBlock : assign((C, E) => {
            C.activeFrame.clearArguments();
            C.activeFrame.appendBlockAtHeadValueToArguments();
        }),
// Configuration:5 ends here



// Advance the head of the tape one to the right.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:6]]
        advanceHead : assign((C, E) => {
            C.activeFrame.advance();
        }),
// Configuration:6 ends here



// When the program ends or the current tape ends, we set the frame to halted.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:7]]
        haltFrame : assign((C, E) => {
            C.activeFrame.halt();
        }),
// Configuration:7 ends here



// When the interpreter encounters a run-time error, that is not an exception in the JavaScript run-time. Save an error object without throwing it.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:8]]
        reportErrorInvalidCategoryOfCurrentBlock : assign((C, E) => {
            C.error = new Error("Invalid category of current block");
        }),
// Configuration:8 ends here



// Let our parent know when they can safely send a "STEP" event. When our parent wants to successively step through the whole program, this will ensure they don't send too many "STEP" events. When our parent is a step debugger UI, if they don't receive this event in a very short period of time, they could move to a "working" state to show that the UI isn't ready to be stepped forward yet.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:9]]
        reportReadyToStep : sendParent((C, E) => {
            return { type: "READY_TO_STEP" };
        }),
// Configuration:9 ends here

// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:10]]
        loadGlobalLabel: assign((C, E) => {
            C.globalLabelsToExecutorServices[E.label] = E.service;
        }),
// Configuration:10 ends here



// Pop the stack, disposing of the current frame and replacing it with the top of the stack.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:11]]
        popFrame : assign((C, E) => {
            C.activeFrame = C.stack.pop();
        }),
// Configuration:11 ends here



// Place the result of the current frame on the frame below it. The result of the current frame is just the current arguments list.

// For now, we are just placing the /first/ of that argument list. Perhaps in the future, multiple values of that argument list will match to a number of blanks, or multiple values will result in a tape of values.

// If the arguments list is empty, do nothing.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:12]]
        placeResultOnLowerFrame : assign((C, E) => {
            const [ result ] = C.activeFrame.arguments;
            if (! result) return;
            const lastFrame = C.stack[C.stack.length - 1];
            lastFrame.placeResult(result);
        }),
// Configuration:12 ends here



// There are a huge number of actions that op block executors can take in the course of their invocation. They are all prefixed with `exec_`.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:13]]
        exec_callTape: assign((C, E) => {
            C.stack.push(C.activeFrame);
            C.activeFrame = Frame(C.nextFrameId++, E.tape, E.arguments, C.activeFrame);
        }),
        exec_placeResult: assign((C, E) => {
            C.activeFrame.placeResult(E.block);
        }),
        exec_reqBlockAtAddress : send((C, E) => {
            const block = C.activeFrame.getBlockAtLabel(E.address.identifier);
            return { type : "RESPONSE_EXECUTOR", block };
        }, { to: "executor" }),
        exec_placeBlockAtAddress : assign((C, E) => {
            C.activeFrame.setBlockAtLabel(E.address.identifier, E.block);
        }),
        exec_moveHeadToAddress : assign((C, E) => {
            C.activeFrame.moveHeadToLabel(E.address.identifier);
        }),
// Configuration:13 ends here



// Done with actions, now onto guards. Note guards appear in the above machine in "cond" fields. See XState docs for more.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:14]]
    },
    guards: {
// Configuration:14 ends here



// Many guards are obvious from the perspective of the machine, we just defer them to other objects.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:15]]
        isBeyondEdge : (C, E) => C.activeFrame.isBeyondEdge(),
        isBeyondEdgeAndStackIsNonEmpty : (C, E) => C.activeFrame.isBeyondEdge() && C.stack.length > 0,
        isCommaAtHead : (C, E) => C.activeFrame.isCommaAtHead(),
// Configuration:15 ends here



// We need to check the category of the current block in order to branch execution.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:16]]
        isCurrentBlockValue : (C, E) => C.currentBlock.is(Category.Value),
        isCurrentBlockOp : (C, E) => C.currentBlock.is(Category.Op),
// Configuration:16 ends here



// Given the current block, return the executor service that matches it.

// Before returning, invoke the service creator with the current context. Because we are using Immer, the service won't be able to edit anything about the context.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:17]]
    },
    services: {
        dispatchOnExecutor : (C, E) => {
            const identifier = C.currentBlock.identifier
            const executor = 
                  C.globalLabelsToExecutorServices[identifier];

            if (! executor) throw new Error(`No executor found for identifier "${identifier}"`);

            return executor(C);
        }
// Configuration:17 ends here



// Close final config map.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:18]]
    }
}
// Configuration:18 ends here

// Context

// The context for this machine will be a class, primarily because multiple actions will reuse code, and classes are a simple way to do that.

// This class was not created when the machine implementation began, so much of the code remains in actions.

// In the future, perhaps all actions will just dispatch to this class, e.g. ={ myAction : XStateImmer.assign((C, E) => { C.x = E.y; }) }=, will just be =[ "myAction" ].forEach((action) => XStateImmer.assign((C, E) => C[action](E))=.


// [[file:../literate/StepwiseMachine.org::*Context][Context:1]]
export class Context {
}
// Context:1 ends here

// Initialize

// Start with an empty context.


// [[file:../literate/StepwiseMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config).withContext(new Context);
// Initialize:1 ends here
