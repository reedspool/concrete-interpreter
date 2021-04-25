// #+TITLE: Add Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/add.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/Add.org::+begin_src js][No heading:1]]
import { ValueBlock } from "concrete-parser";
// No heading:1 ends here



// There is no type checking. In JS, =+= will be converted to either a string or a number, either concatenation or addition. Because of that, we do not want to assume the type and put the additive or string concatenation identities, either zero or the empty string, as the initial value for reduce. We just want to manually take the first value off the list and use that as the initial value. We could use the form of reduce with no initial value, but then the accumulator/memo, the first argument of the reducer function, would be a block and not a JS value.


// [[file:../../literate/executors/Add.org::+begin_src js][No heading:2]]
export const service = (C) => (sendParent, receiveParent) => {
    const [ first, ...rest ] = C.activeFrame.arguments;
    const result = rest.reduce(
        (memo, block) => memo + block.asJS(), first.asJS());
    const block = ValueBlock.fromJS(result);
    sendParent({ type: "PLACE_OP_RESULT", block });
    sendParent("DONE");
};
// No heading:2 ends here
