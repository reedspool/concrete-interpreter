// #+TITLE: Get Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/get.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/Get.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ address ] = C.activeFrame.arguments;
// No heading:1 ends here



// First, set up for when we get the response from the step interpreter. We will just place the result and finish.


// [[file:../../literate/executors/Get.org::+begin_src js][No heading:2]]
    receiveParent(({ type, block }) => {
        switch(type) {
            case "RESPONSE_EXECUTOR" :
                sendParent({ type: "PLACE_OP_RESULT", block });
                sendParent("DONE");
                break;
            default :
                throw new Error(`Unexpected event type ${type}`);
        }
    })
// No heading:2 ends here



// Then, send the request to get the block at 


// [[file:../../literate/executors/Get.org::+begin_src js][No heading:3]]
    sendParent({ type: "REQUEST_BLOCK_AT_ADDRESS", address });
};
// No heading:3 ends here
