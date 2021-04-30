// #+TITLE: JavaScript Debugger Executor service
// #+PROPERTY: header-args    :comments both :tangle ../../src/executors/jsDebug.js

// Executors must be XState services and for this one we've chosen the callback type of service.

// Insert a JS =debugger;= statement into a running concrete program. Do nothing else.


// [[file:../../literate/executors/JSDebug.org::+begin_src js][No heading:1]]
export const service = (C) => (sendParent, receiveParent) => {
    // Reference context so we can inspect it, otherwise JIT gets rid of it.
    C;
    debugger;
    sendParent("DONE");
};
// No heading:1 ends here
