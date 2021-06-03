// #+TITLE: Else Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/else.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// For this we just defer to the machine to do all the work.


// [[file:../../literate/executors/Else.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ block ] = C.activeFrame.arguments;

    // Always clear arguments
    sendParent({ type: "CLEAR_ARGUMENTS" });

    // If the previous test was false, proceed without doing anything
    if (C.shouldExecuteElse) {
        sendParent("DONE");
        return;
    }

    // If the previous test was truthy, skip the conditional body and continue as normal
    sendParent({ type: "DONE_SKIP_NEXT_BLOCK" });
};
// No heading:1 ends here
