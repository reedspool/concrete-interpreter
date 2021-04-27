// #+TITLE: Algebraic Executor Factory
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/AlgebraicExecutorFactory.js

// Lots of algebraic operators have the same form, only the operator changes. This file is a factory to simplify the creation of binary algebraic operator executors.

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/AlgebraicExecutorFactory.org::+begin_src js][No heading:1]]
import { ValueBlock } from "concrete-parser";
// No heading:1 ends here

// [[file:../../literate/executors/AlgebraicExecutorFactory.org::+begin_src js][No heading:2]]
export const create = (fnBinaryOp, fnJSToBlock = (n) => n) => (C) => (sendParent, receiveParent) => {
    const [ first, ...rest ] = C.activeFrame.arguments;
    const result = rest.reduce(
        (memo, block) => fnBinaryOp(memo, block.asJS()), first.asJS());
    const block = ValueBlock.fromJS(fnJSToBlock(result));
    sendParent({ type: "PLACE_OP_RESULT", block });
    sendParent("DONE");
};
// No heading:2 ends here
