// Preamble


// [[file:../literate/StepwiseMachine.org::*Preamble][Preamble:1]]
import { Machine, sendParent } from "xstate";
import { assign } from "@xstate/immer";
import { Frame } from "./Frame";
import { Category } from "concrete-parser";
// Preamble:1 ends here

// Definition

// Begin the definition, we'll explain each state in turn:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:1]]
export const definition = {
    id: "StepwiseInterpreter",
    strict: true,
// Definition:1 ends here



// The interpreter will always start in the "empty" state, because it doesn't have any code to run. It will proceed if it receives some code to run.

// The "states" object is left open, because there are many more to define.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:2]]
    initial: "empty",
    states: {
        empty: {
            on: {
                LOAD_PROGRAM: {
                    target: "run",
                    actions: [ "loadProgram" ]
                }
            }
        },
// Definition:2 ends here



// Once the program is loaded, we are going to be inside "run" until the program finishes or crashes.

// The "run" state is complex. It always starts in the sub-state where it checks if the reader head is beyond the edge. This is important because the loaded program might be empty, in which case it should immediately halt. Otherwise, we proceed to the normal "read" phase.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:3]]
        run: {
            initial: "checkPastTapeEdge",
            states: {
                checkPastTapeEdge: {
                    always: [
                        {
                            cond: "isBeyondEdge",
                            target: "#StepwiseInterpreter.halted"
                        },
                        "read"
                    ]
                },
// Definition:3 ends here



// To interpret a Concrete program is to loop over each cell of the program's tape and take some action. Which action to take depends on which block is in the current cell. We record it before acting on that information to facilitate the intended "step-wise" nature.

// At the beginning of the program, the reader head is at the first cell. Later, the program will return to this state but the reader head will have progressed to a different cell.

// Upon proceeding, we branch depending on the category of that block.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:4]]
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
// Definition:4 ends here



// TODO


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:5]]
                executeOp: {},
// Definition:5 ends here



// If there is a comma preceding the current block, we grow the argument list by appending the current block. If there is no comma, the argument list will only contain the current block, dumping its previous contents.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:6]]
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
// Definition:6 ends here



// In general, once we've done whatever we're going to do with this block, we move one place to the right. There are exceptions to this, such as if a tape halts or if the head jumps.

// After advancing, we go "back to the top" in the read-eval-advance cycle, first checking if we've moved past the edge of the tape and must halt.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:7]]
                advance: {
                    entry: [ "reportReadyToStep" ],
                    on : {
                        STEP: {
                            target: "checkPastTapeEdge",
                            actions: [ "advanceHead" ]
                        }
                    }
                },
// Definition:7 ends here



// Closing "run" internal states map as well as itself.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:8]]
            }
        },
// Definition:8 ends here



// A program which has completed interpretation normally will find itself, finally, in the "halted" state


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:9]]
        halted: {
            type : "final",
            entry : [ "haltFrame", "storeResult" ],
            data : (C) => C
        },
// Definition:9 ends here



// The other way a program can end is in the error state.


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:10]]
        error: {
            type : "final",
            entry : [ "haltFrame", "storeResult" ],
            data : (C) => C
        },
// Definition:10 ends here



// We're done with states, so close the state map:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:11]]
    },
// Definition:11 ends here




// And finally, close up the definition:


// [[file:../literate/StepwiseMachine.org::*Definition][Definition:12]]
};
// Definition:12 ends here

// Configuration

// Start with actions.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
// Configuration:1 ends here



// When the program loads, the source is an Abstract Syntax Tree. We need to create an active stack frame for it.

// The rest of the stack is empty.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:2]]
        loadProgram: assign((C, E) => {
            C.source = E.source;
            C.activeFrame = Frame(C.source);
            C.stack = [];
        }),
// Configuration:2 ends here



// Determine what is the category of the block at the head of the current cell.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:3]]
        recordCurrentBlockAtHead : assign((C, E) => {
            C.currentBlock = C.activeFrame.getBlockAtHead();
        }),
// Configuration:3 ends here



// Depending on the circumstances, we do or do not clear the current argument list before adding the current block. See "executeValue" above.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:4]]
        appendArgumentsWithCurrentBlock : assign((C, E) => {
            C.activeFrame.appendBlockToArguments(C.currentBlock);
        }),
        replaceArgumentsWithCurrentBlock : assign((C, E) => {
            C.activeFrame.clearArguments();
            C.activeFrame.appendBlockToArguments(C.currentBlock);
        }),
// Configuration:4 ends here



// Advance the head of the tape one to the right.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:5]]
        advanceHead : assign((C, E) => {
            C.activeFrame.advance();
        }),
// Configuration:5 ends here



// When the program ends or the current tape ends, we set the frame to halted.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:6]]
        haltFrame : assign((C, E) => {
            C.activeFrame.halt();
        }),
// Configuration:6 ends here



// When the program ends or the current tape ends, put the result in an easy-to-grab place.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:7]]
        storeResult : assign((C, E) => {
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



// Done with actions, now onto guards. Note guards appear in the above machine in "cond" fields. See XState docs for more.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:10]]
    },
    guards: {
// Configuration:10 ends here



// Many guards are obvious from the perspective of the machine, we just defer them to other objects.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:11]]
        isBeyondEdge : (C, E) => C.activeFrame.isBeyondEdge(),
        isCommaAtHead : (C, E) => C.activeFrame.isCommaAtHead(),
// Configuration:11 ends here



// We need to check the category of the current block in order to branch execution.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:12]]
        isCurrentBlockValue : (C, E) => C.currentBlock.is(Category.Value),
        isCurrentBlockOp : (C, E) => C.currentBlock.is(Category.Op),
// Configuration:12 ends here



// Close final config maps.


// [[file:../literate/StepwiseMachine.org::*Configuration][Configuration:13]]
    }
}
// Configuration:13 ends here

// Initialize

// Start with an empty context.


// [[file:../literate/StepwiseMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config).withContext({});
// Initialize:1 ends here
