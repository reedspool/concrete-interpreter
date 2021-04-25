// #+TITLE: Multiply Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/multiply.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/Multiply.org::+begin_src js][No heading:1]]
import { ValueBlock } from "concrete-parser";
// No heading:1 ends here



// There is no type checking. Like in JS, we just assume the user did everything right.


// [[file:../../literate/executors/Multiply.org::+begin_src js][No heading:2]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ first, ...rest ] = C.activeFrame.arguments;

    if (! first) throw new Error("Multiply requires at least one argument, got zero");
    
    const result = rest.reduce(
        (memo, block) => memo * block.asJS(), first.asJS());
    const block = ValueBlock.fromJS(result);
    sendParent({ type: "PLACE_OP_RESULT", block });
    sendParent("DONE");
};
// No heading:2 ends here
