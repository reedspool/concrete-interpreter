// #+TITLE: Stack Frame
// #+PROPERTY: header-args    :comments both :tangle ../src/Frame.js


// [[file:../literate/Frame.org::+begin_src js][No heading:1]]
import { Category } from "concrete-parser";
// No heading:1 ends here

// [[file:../literate/Frame.org::+begin_src js][No heading:2]]
export const Frame = (...args) => new _Frame(...args);

class _Frame {
    constructor (tape) {
        this.tape = tape;
        this.length = tape.cells.length;
        this.head = 0;
        this.halted = false;
        this.arguments = [];
    }

    isBeyondEdge() { return this.head >= this.length; }

    advance() { this.head++; }

    halt() { this.halted = true; }

    getBlockAtHead() { return this.tape.cells[this.head]; }

    isCommaAtHead() { return this.tape.commas[this.head]; }

    placeResult(block) { this.tape.cells[this.head + 1] = block; }

    clearArguments() { this.arguments = []; }

    moveHeadToLabel(label) { this.head = this.tape.getIndexOfLabel(label); }

    getBlockAtLabel(label) { return this.tape.getBlockAtLabel(label); }
    
    setBlockAtLabel(label, block) { return this.tape.setBlockAtLabel(label, block); }

    appendBlockToArguments(block) { this.arguments.push(block); }
// No heading:2 ends here



// Arguments list can never include ValueIdentifiers, so always resolve them to their true value.


// [[file:../literate/Frame.org::+begin_src js][No heading:3]]
    appendBlockAtHeadValueToArguments() {
        let block = this.getBlockAtHead();

        while (block.is(Category.Value, "ValueIdentifier")) {
            block = this.getBlockAtLabel(block.identifier);
        }

        this.appendBlockToArguments(block);
    }
}
// No heading:3 ends here
