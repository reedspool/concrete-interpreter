// #+TITLE: Explicit Return Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/explicitReturn.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/ExplicitReturn.org::+begin_src js][No heading:1]]
import { Category } from "concrete-parser";
export const service = (C) => (sendParent, receiveParent) => {
    sendParent({ type: "EXPLICIT_RETURN" });
};
// No heading:1 ends here
