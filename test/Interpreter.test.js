// Preamble


// [[file:../literate/InterpreterTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/Interpreter";
// Preamble:1 ends here

// Tests

// Simple empty source should not have a result.


// [[file:../literate/InterpreterTests.org::*Tests][Tests:1]]
it("Empty source produces no result", async () => {
    const input = "";
    const result = await interpretFile(input);
    expect(result).toEqual([]);
});
// Tests:1 ends here

// [[file:../literate/InterpreterTests.org::*Tests][Tests:2]]
it("A number produces a JS number as a result", async () => {
    const input = "3355.4432";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(3355.4432);
});
// Tests:2 ends here

// [[file:../literate/InterpreterTests.org::*Tests][Tests:3]]
it("A string produces a JS string as a result", async () => {
    const input = "\"Hello World!\"";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Tests:3 ends here

// [[file:../literate/InterpreterTests.org::*Tests][Tests:4]]
it("A blank produces a JS `null` as a result", async () => {
    const input = "_";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(null);
});
// Tests:4 ends here

// [[file:../literate/InterpreterTests.org::*Tests][Tests:5]]
it("Multiple blocks with a comma separating them produces both as a result", async () => {
    const input = "1, 2";
    const result = await interpretFile(input);
    expect(result).toEqual([1, 2]);
});
// Tests:5 ends here

// [[file:../literate/InterpreterTests.org::*Tests][Tests:6]]
it("Multiple blocks without a comma separating them produces only the latter as a result", async () => {
    const input = "1 2";
    const result = await interpretFile(input);
    expect(result).toEqual([2]);
});
// Tests:6 ends here
