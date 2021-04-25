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

// Add Executor
    

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:1]]
it("Simplest add executor", async () => {
    const input = "0 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Add Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:2]]
it("Simple add executor", async () => {
    const input = "1, 2, 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(6);
});
// Add Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:3]]
it("Add executor works on strings too", async () => {
    const input = "\"Hello \", \"World!\" add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Add Executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:4]]
it("Add executor works on numbers and strings, the same way JS does", async () => {
    const input = "\"Hello \", 250, \"th World!\" add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello " + 250 + "th World!");
});
// Add Executor:4 ends here

// Multiply Executor


// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:1]]
it("Simplest multiply executor", async () => {
    const input = "0 multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Multiply Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:2]]
it("Simple multiply executor", async () => {
    const input = "1, 2, 3, 4 multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(24);
});
// Multiply Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:3]]
it("Multiply executor turns Strings to NaNs", async () => {
    const input = "\"Hello \", \"World!\" multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBeNaN();
});
// Multiply Executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:4]]
it("Multiply expects at least one argument", async () => {
    const input = "multiply! _";
    expect(interpretFile(input)).rejects.toHaveProperty("error");
});
// Multiply Executor:4 ends here

// Basic labels


// [[file:../literate/InterpreterTests.org::*Basic labels][Basic labels:1]]
it("Simple labeled block as result", async () => {
    const input = "abcd: 5 abcd";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic labels:1 ends here

// [[file:../literate/InterpreterTests.org::*Basic labels][Basic labels:2]]
it("Labeled block points to another labeled block as result", async () => {
    const input = "abcd: efgh, efgh: 5 abcd";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic labels:2 ends here
