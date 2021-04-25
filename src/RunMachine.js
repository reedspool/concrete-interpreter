// Preamble


// [[file:../literate/RunMachine.org::*Preamble][Preamble:1]]
import { Machine, send, forwardTo } from "xstate";
import { assign } from "@xstate/immer";
import * as StepwiseMachine from "./StepwiseMachine";
// Preamble:1 ends here

// Definition

// Begin the definition, we'll explain each state in turn:


// [[file:../literate/RunMachine.org::*Definition][Definition:1]]
export const definition = {
    id: "RunInterpreter",
    strict: true,
// Definition:1 ends here



// The machine will begin in the live state, but the done state comes first because it is short and easy to comprehend. It's nice to know where you're headed in life.

// The "done" state is the final state, and the whole result of the program will be the "done data" which we got from the child step-wise machine.


// [[file:../literate/RunMachine.org::*Definition][Definition:2]]
    initial: "live",
    states : {
        done: {
            type: "final",
            data: (C, E) => E.data
        },
// Definition:2 ends here



// There are always two parallel states while this machine is "live"; they are "mode" and "stepwise." The former determines if and how often we send "STEP" events to the invoked step-wise machine, and the latter manages that machine invocation.

// When all the inner parallel states complete, the entire machine completes.


// [[file:../literate/RunMachine.org::*Definition][Definition:3]]
        live : {
            onDone: "#RunInterpreter.done",
            type: "parallel",
            states: {
                mode : {
// Definition:3 ends here



// "mode" starts out as paused. Send one of the described events to change to another mode from any mode.

// - Pause: Nothing changes.
// - Run: Keep sending "STEP" to the step-wise machine until it halts.

// When we enter "run", we send a step to the machine, which is enough to set off the engine to keep going until it halts. More details about how this engine works are below.


// [[file:../literate/RunMachine.org::*Definition][Definition:4]]
                    initial : "pause",
                    states : {
                        pause : {},
                        run : {
                            entry: [ "sendStepToStepwiseMachine" ]
                        },
                    },
                    on : {
                        PAUSE : ".pause",
                        RUN   : ".run"
                    }
                },
// Definition:4 ends here



// This machine invokes the step-wise machine exactly once. To restart, just dispose of this whole machine and start a new one.

// This machine is a thin wrapper around the child step-wise machine, so most events forward to the child.

// An exception is "READY_TO_STEP", which comes from the child to tell us it is ready to receive another "STEP". Although this machine is responsible for stepping until the child machine halts, we do not want to overload it, so we wait for it to tell us it is ready before each step.

// We only immediately send a step if "mode" is "run".


// [[file:../literate/RunMachine.org::*Definition][Definition:5]]
                stepwise: {
                    invoke : {
                        src : "stepwise",
                        id : "stepwise",
                        onDone : {
                            actions : [ "reportHalted", "doneRunner" ],
                            target: "#RunInterpreter.done"
                        },
                        onError : {
                            actions : [ "reportError", "doneRunner" ]
                        },
                    },
                    on : {
                        LOAD_PROGRAM : { actions: [ "forwardToStepwiseMachine" ] },
                        LOAD_GLOBAL_LABEL: { actions: [ "forwardToStepwiseMachine" ] },
                        STEP : { actions: [ "forwardToStepwiseMachine" ] },
                        READY_TO_STEP : [
                            {
                                cond: "isModeRun",
                                actions: [ "sendStepToStepwiseMachine" ]
                            },
                            { actions: "noop" }
                        ]
                    },
                },
            },
        },
    },
// Definition:5 ends here



// Close the machine definition.


// [[file:../literate/RunMachine.org::*Definition][Definition:6]]
};
// Definition:6 ends here

// Configuration

// Start with actions.


// [[file:../literate/RunMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
        noop : () => {}, 
        sendStepToStepwiseMachine : send((C, E) => {
            return { type: "STEP" };
        }, { to: "stepwise" }),
        reportHalted: assign((C, E) => {
            C.halted = true;
        }),
        doneRunner : send((C, E) => {
            return { type : "DONE" }
        }),
        reportError: assign((C, E) => {
            C.error = E;
        }),
        forwardToStepwiseMachine : forwardTo("stepwise"),
// Configuration:1 ends here



// Done with actions, now onto guards. Note guards appear in the above machine in "cond" fields. See XState docs for more.


// [[file:../literate/RunMachine.org::*Configuration][Configuration:2]]
    },
    guards: {
// Configuration:2 ends here



// Determine whether we should automatically send a "STEP" event to the step-wise interpreter. First, we only step continuously when this machine is in the mode "run". Second, we do not want to send if the child machine has halted or erred.

// TODO: The second part of this condition seems like a hack, is there a better way? Can we just look for existence of C.halted/C.error?


// [[file:../literate/RunMachine.org::*Configuration][Configuration:3]]
        isModeRun: (C, E, { state }) =>
            state.value?.live?.mode == "run" &&
                state.children.stepwise.state.value !== "halted" &&
                state.children.stepwise.state.value !== "error",
// Configuration:3 ends here




// The crux of this machine is to invoke the step-wise interpreter as a service.


// [[file:../literate/RunMachine.org::*Configuration][Configuration:4]]
    },
    services: {
        stepwise: () => StepwiseMachine.init()
// Configuration:4 ends here



// Close final config maps.


// [[file:../literate/RunMachine.org::*Configuration][Configuration:5]]
    }
}
// Configuration:5 ends here

// Initialize

// Start with an empty context.


// [[file:../literate/RunMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config).withContext({});
// Initialize:1 ends here
