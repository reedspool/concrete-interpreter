// #+TITLE: Stack Frame
// #+PROPERTY: header-args    :comments both :tangle ../src/Frame.js

// Factory because I hate =new= keyword.


// [[file:../literate/Frame.org::+begin_src js][No heading:1]]
export const Frame = (...args) => new _Frame(...args);
// No heading:1 ends here

// [[file:../literate/Frame.org::+begin_src js][No heading:2]]
class _Frame {
    constructor (tree) {
        this.tree = tree;
        this.length = this.tree.tape.cells.length;
        this.head = 0;
        this.halted = false;
        this.arguments = [];
    }

    isBeyondEdge() { return this.head >= this.length; }

    advance() { this.head++; }
    
    halt() { this.halted = true; }
    
    getBlockAtHead() { return this.tree.tape.cells[this.head]; }

    isCommaAtHead() { return this.tree.tape.commas[this.head]; }

    clearArguments() { this.arguments = []; }
    
    appendBlockToArguments(block) { this.arguments.push(block); }
}
// No heading:2 ends here
