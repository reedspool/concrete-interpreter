// Preamble


// [[file:../literate/Interpreter.org::*Preamble][Preamble:1]]
import * as RunMachine from "./RunMachine";
import { parseFile } from "concrete-parser";
import { interpret } from "xstate";
import { InvertedPromise as Promise } from "inverted-promise";
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

// If the program ended successfully, resolve the result promise with the reported result, which is an array of blocks.

// Convert all the blocks in that array to their JS equivalents. This might error if any of those blocks are unable to convert to JS.

// TODO: How do we get errors out of this thing? Like onError but that doesn't exist.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:3]]
    runInterpreter.onDone(({ data }) => {
        runInterpreter.stop();
        result.resolve(data.map(block => block.asJS()));
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



// Finally, switch the interpreter into gear by telling it to run.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:7]]
    runInterpreter.send("RUN");
// Interpret File:7 ends here



// Return the result promise and we're done.


// [[file:../literate/Interpreter.org::*Interpret File][Interpret File:8]]
    return result;
};
// Interpret File:8 ends here
