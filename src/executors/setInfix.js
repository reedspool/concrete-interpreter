// #+TITLE: Infix Set Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/setInfix.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// For this we just defer to the machine to do all the work.


// [[file:../../literate/executors/SetInfix.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ block ] = C.activeFrame.arguments;
    const address = C.activeFrame.getBlockAt(C.activeFrame.head + 1);

    sendParent({ type: "PLACE_BLOCK_AT_ADDRESS", address, block });
    sendParent("DONE");
};
// No heading:1 ends here
