// #+TITLE: Call User Tape Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/callUserTape.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// Like Call Executor but calls a user defined tape instead.


// [[file:../../literate/executors/CallUserTape.org::+begin_src js][No heading:1]]
import { Category } from "concrete-parser";
export const service = (C, tape) => (sendParent, receiveParent) => {
    // Make a copy of args to mess with it.
    const args = [ ...C.activeFrame.arguments ];
    
    // First clear arguments, since after call_tape the step interpreter will be our new frame.
    sendParent({ type: "CLEAR_ARGUMENTS" });
    sendParent({ type: "CALL_TAPE", tape, arguments: args });
    sendParent("DONE_NO_ADVANCE");
};
// No heading:1 ends here
