// Preamble


// [[file:../literate/InterpreterTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/Interpreter";
// Preamble:1 ends here

// Simple

// Simple empty source should not have a result.


// [[file:../literate/InterpreterTests.org::*Simple][Simple:1]]
it("Empty source produces no result", async () => {
    const input = "";
    const result = await interpretFile(input);
    expect(result).toEqual([]);
});
// Simple:1 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:2]]
it("A number produces a JS number as a result", async () => {
    const input = "3355.4432";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(3355.4432);
});
// Simple:2 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:3]]
it("A string produces a JS string as a result", async () => {
    const input = "\"Hello World!\"";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Simple:3 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:4]]
it("A blank produces a JS `null` as a result", async () => {
    const input = "_";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(null);
});
// Simple:4 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:5]]
it("Multiple blocks with a comma separating them produces both as a result", async () => {
    const input = "1, 2";
    const result = await interpretFile(input);
    expect(result).toEqual([1, 2]);
});
// Simple:5 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:6]]
it("Multiple blocks without a comma separating them produces only the latter as a result", async () => {
    const input = "1 2";
    const result = await interpretFile(input);
    expect(result).toEqual([2]);
});
// Simple:6 ends here

// Executors
    

// [[file:../literate/InterpreterTests.org::*Executors][Executors:1]]
it("Simplest add executor", async () => {
    const input = "0 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Executors:1 ends here

// [[file:../literate/InterpreterTests.org::*Executors][Executors:2]]
it("Simple add executor", async () => {
    const input = "1, 2, 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(6);
});
// Executors:2 ends here

// [[file:../literate/InterpreterTests.org::*Executors][Executors:3]]
it("Add executor works on strings too", async () => {
    const input = "\"Hello \", \"World!\" add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Executors:3 ends here
