// #+TITLE: Print Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/print.js

// Executors must be XState services and for this one we've chosen the callback type of service.


// [[file:../../literate/executors/Print.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    console.log(C.activeFrame.arguments.map(block => block.asJS()));
    sendParent("DONE");
};
// No heading:1 ends here
