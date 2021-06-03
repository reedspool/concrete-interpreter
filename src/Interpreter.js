// Preamble


// [[file:../literate/Interpreter.org::*Preamble][Preamble:1]]
import * as RunMachine from "./RunMachine";
import { parseFile } from "concrete-parser";
import { interpret } from "xstate";
import { InvertedPromise as Promise } from "inverted-promise";
import { create as createExecutor } from "./executors/AlgebraicExecutorFactory";
import { service as getExecutorService } from "./executors/get";
import { service as setExecutorService } from "./executors/set";
import { service as setInfixExecutorService } from "./executors/setInfix";
import { service as ifExecutorService } from "./executors/if";
import { service as jumpExecutorService } from "./executors/jump";
import { service as callExecutorService } from "./executors/call";
import { service as printExecutorService } from "./executors/print";
import { service as jsDebugExecutorService } from "./executors/jsDebug";
import { service as explicitReturnExecutorService } from "./executors/explicitReturn";
// Preamble:1 ends here

// Interpret File

// Every time we instantiate a new run machine and start it up in an XState interpreter. It won't do anything until it gets the source.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:1]]
export const interpretFile = async (source) => {
    const runMachine = RunMachine.init();
    const runInterpreter = interpret(runMachine).start();
// Interpret File:1 ends here



// Prepare a promise that will resolve to the result of the interpreted program.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:2]]
    const result = Promise();
// Interpret File:2 ends here



// Before starting anything, set up the event listeners for the completion of the interpretation of the program. The machine will either end successfully which we catch with =onDone()=, or in failure which we catch with =onError()=.

// The first thing to do in either case is stop the interpreter itself.

// Second, check if the program ended in error. If it did, report that error by rejecting our promise.

// If the program ended successfully, resolve the result promise with the reported result, which is an array of blocks.

// Convert all the blocks in that array to their JS equivalents. This might error if any of those blocks are unable to convert to JS.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:3]]
    runInterpreter.onDone(({ data }) => {
        runInterpreter.stop();

        if (data.error) result.reject(data);
        else result.resolve(
            data.results.map(block => block.asJS()));
    });
// Interpret File:3 ends here



// Parse the source and send it to the interpreter. It won't do anything since it starts paused.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:4]]
    const tree = await parseFile(source);
// Interpret File:4 ends here



// If the tree is empty, do not even start the interpreter. If we did start the interpreter, it would halt before receiving the first "STEP", which would be an error.

// Return the equivalent of no result, which is an empty array.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:5]]
    if (tree.isEmpty()) {
        result.resolve([]);
        return result;
    }
// Interpret File:5 ends here



// Before turning the interpreter on, send the program so it can prepare.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:6]]
    runInterpreter.send({ type: "LOAD_PROGRAM", source : tree });
// Interpret File:6 ends here



// Next, add all global values and executors.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:7]]
    [
        { label: "get", service: getExecutorService },
        { label: "set", service: setExecutorService },
        { label: "->", service: setInfixExecutorService },
        { label: "if", service: ifExecutorService },
        { label: "jump", service: jumpExecutorService },
        { label: "call", service: callExecutorService },
        { label: "print", service: printExecutorService },
        { label: "debugger", service: jsDebugExecutorService },
        { label: "return", service: explicitReturnExecutorService },
// Interpret File:7 ends here



// A lot of binary, algebraic operators in JS are very similar in their construction, so create them by factory instead of in their own files.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:8]]
        { label: "add", service: createExecutor((a, b) => a + b) },
        { label: "+", service: createExecutor((a, b) => a + b) },
        { label: "subtract", service: createExecutor((a, b) => a - b) },
        { label: "-", service: createExecutor((a, b) => a - b) },
        { label: "multiply", service: createExecutor((a, b) => a * b) },
        { label: "*", service: createExecutor((a, b) => a * b) },
        { label: "divide", service: createExecutor((a, b) => a / b) },
        { label: "/", service: createExecutor((a, b) => a / b) },
        { label: "modulus", service: createExecutor((a, b) => a % b) },
        { label: "%", service: createExecutor((a, b) => a % b) },
// Interpret File:8 ends here



// Zero is the only false-y value in Concrete. There are no proper boolean values (yet). For all operators which return booleans, convert them to either a 1 or 0.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:9]]
        { label: "equal", service: createExecutor((a, b) => a === b, (n) => n ? 1 : 0) },
        { label: "=", service: createExecutor((a, b) => a === b, (n) => n ? 1 : 0) },
        { label: "and", service: createExecutor((a, b) => a && b, (n) => n ? 1 : 0) },
        { label: "&", service: createExecutor((a, b) => a && b, (n) => n ? 1 : 0) },
        { label: "or", service: createExecutor((a, b) => a || b, (n) => n ? 1 : 0) },
        { label: "|", service: createExecutor((a, b) => a || b, (n) => n ? 1 : 0) },
        { label: "lessThan", service: createExecutor((a, b) => a < b, (n) => n ? 1 : 0) },
        { label: "<", service: createExecutor((a, b) => a < b, (n) => n ? 1 : 0) },
        { label: "greaterThan", service: createExecutor((a, b) => a > b, (n) => n ? 1 : 0) },
        { label: ">", service: createExecutor((a, b) => a > b, (n) => n ? 1 : 0) },
        { label: "not", service: createExecutor((a) => a, (n) => n == 0 ? 1 : 0) },
        { label: "~", service: createExecutor((a) => a, (n) => n == 0 ? 1 : 0) },
    ].forEach(
        ({ label, service }) => runInterpreter.send(
            { type: "LOAD_GLOBAL_LABEL", label, service }));
// Interpret File:9 ends here



// Finally, switch the interpreter into gear by telling it to run.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:10]]
    runInterpreter.send("RUN");
// Interpret File:10 ends here



// Return the result promise and we're done.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:11]]
    return result;
};
// Interpret File:11 ends here
