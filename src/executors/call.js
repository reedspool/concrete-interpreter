// #+TITLE: Call Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/call.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/Call.org::+begin_src js][No heading:1]]
import { Category } from "concrete-parser";
export const service = (C) => (sendParent, receiveParent) => {
    // Make a copy of args to mess with it.
    const args = [ ...C.activeFrame.arguments ];
    
    // // The last block must be a tape
    const tape = args.pop();
    
    if (! tape) {
        throw new Error("call! requires at least one argument, a tape");
    }
    
    if (! tape.is(Category.Value, "Tape")) {
        throw new Error("Final argument to call! must be a tape");
    }
        
    // First clear arguments, since after call_tape the step interpreter will be our new frame.
    sendParent({ type: "CLEAR_ARGUMENTS" });
    sendParent({ type: "CALL_TAPE", tape, arguments: args });
    sendParent("DONE_NO_ADVANCE");
};
// No heading:1 ends here
