// Preamble


// [[file:../literate/FrameTest.org::*Preamble][Preamble:1]]
import { Frame } from "../src/Frame";
import { parseFile, Category } from "concrete-parser";
// Preamble:1 ends here

// Tests


// [[file:../literate/FrameTest.org::*Tests][Tests:1]]
it("Can be instantiated", async () => {
    const tree = await parseFile("1 2 3");
    const frame = Frame(0, tree.tape);
    expect(frame).toBeDefined();
    expect(frame.tape).toBeDefined();
    expect(frame.length).toBe(3);
    expect(frame.head).toBe(0);
    expect(frame.halted).toBe(false);
    expect(frame.getBlockAtHead().is(Category.Value))
        .toBe(true);
});
// Tests:1 ends here

// [[file:../literate/FrameTest.org::*Tests][Tests:2]]
it("Advance until isBeyondEdge", async () => {
    const tree = await parseFile("1 2 3");
    const frame = Frame(0, tree.tape);
    expect(frame.head).toBe(0);
    expect(frame.isBeyondEdge()).toBe(false);
    frame.advance();
    expect(frame.isBeyondEdge()).toBe(false);
    frame.advance();
    expect(frame.isBeyondEdge()).toBe(false);
    frame.advance();
    expect(frame.isBeyondEdge()).toBe(true);
});
// Tests:2 ends here

// [[file:../literate/FrameTest.org::*Tests][Tests:3]]
it("Can work with commas with argument lists", async () => {
    // Simulate what the interpreter would do with argument lists
    const tree = await parseFile("1, 2 3");
    const frame = Frame(0, tree.tape);
    expect(frame.isCommaAtHead()).toBeFalsy();
    frame.appendBlockToArguments(frame.getBlockAtHead());
    
    frame.advance();
    expect(frame.isCommaAtHead()).toBe(true);
    frame.appendBlockToArguments(frame.getBlockAtHead());
    expect(frame.arguments).toHaveLength(2);
    
    frame.advance();
    expect(frame.isCommaAtHead()).toBeFalsy();
    frame.clearArguments();
    frame.appendBlockToArguments(frame.getBlockAtHead());
    expect(frame.arguments).toHaveLength(1);
})
// Tests:3 ends here
