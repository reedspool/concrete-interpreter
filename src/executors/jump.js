// #+TITLE: Jump Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/jump.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// For this we just defer to the machine to do all the work.

// Note, since we might move the position of the HEAD with this block, we might also not advance.

// If called with one argument, it's an unconditional jump and that argument must be the address.


// [[file:../../literate/executors/Jump.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    let [ block, address ] = C.activeFrame.arguments;

    // If there is only one argument, then it is unconditional.
    if (! address) {
        address = block;

        sendParent({ type: "MOVE_HEAD_TO_ADDRESS", address });
        sendParent({ type: "CLEAR_ARGUMENTS" });
        sendParent("DONE_NO_ADVANCE");
        return;

    }

    // Otherwise it is conditional and we must test the condition
    // Do not jump if this block is falsey, and the step interpreter should
    // proceed as normal in that case.
    if (! block.truthy()) {
        sendParent("DONE");
        return;
    }

    // Otherwise jump in the exact same way as an unconditional jump
    sendParent({ type: "MOVE_HEAD_TO_ADDRESS", address });
    sendParent({ type: "CLEAR_ARGUMENTS" });
    sendParent("DONE_NO_ADVANCE");
};
// No heading:1 ends here
