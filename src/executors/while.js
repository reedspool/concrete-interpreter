// #+TITLE: While Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/while.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// For this we just defer to the machine to do all the work.


// [[file:../../literate/executors/While.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ block ] = C.activeFrame.arguments;

    // Always clear arguments
    sendParent({ type: "CLEAR_ARGUMENTS" });

    // If the test is true, proceed without doing anything
    if (block.truthy()) {
        sendParent({ type: "SET_JUMP_AFTER_N", target: C.activeFrame.head - 1, n: 2 });
        sendParent("DONE");
        return;
    }

    // If the test is falsy, skip the conditional body and continue as normal
    sendParent({ type: "DONE_SKIP_NEXT_BLOCK" });
};
// No heading:1 ends here
