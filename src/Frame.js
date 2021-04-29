// #+TITLE: Stack Frame
// #+PROPERTY: header-args    :comments both :tangle ../src/Frame.js


// [[file:../literate/Frame.org::+begin_src js][No heading:1]]
import { Category } from "concrete-parser";
// No heading:1 ends here

// [[file:../literate/Frame.org::+begin_src js][No heading:2]]
export const Frame = (...args) => new _Frame(...args);

class _Frame {
    constructor (id, tape, passedArguments = []) {
        this.id = id;
        this.tape = tape;
        this.length = tape.cells.length;
        this.head = 0;
        this.halted = false;
        this.arguments = [];
        this.passedArguments = passedArguments;
        this.actualArgumentCells = [];
// No heading:2 ends here



// Fill in all actual arguments. The actual arguments are either the passed in value or the default.


// [[file:../literate/Frame.org::+begin_src js][No heading:3]]
        this.tape.params.forEach((param, index) => {
            this.actualArgumentCells[index] =
                passedArguments[index] || param.default;
        });
// No heading:3 ends here



// On frame creation, "capture" all references which are type "local" or "param" on this tape, and "upvalue" on an inner tape. Upvalues on inner tapes might out-live this frame; such upvalues become closures. In that case, this dead frame's ID is the calling card for closures captured by it.

// Additionally, address identifiers are the only identifiers allowable as return values, so they follow the same capture rules as upvalues on inner tapes.

// Because these captured references exist only for this frame, and the tape might become a new frame in the future, the new references are a member of the frame instead of their original home on the tape.

// Start with a copy of the tape's references. Then loop through each block in the tape to look for inner tape upvalues and address blocks to capture.

// For each inner tape, with each of its references we capture, we also set our frame ID on that reference, so that later a reference from that tape can use that ID to find where the block is currently stored. If this frame's life is over, the block will be in the interpreter, keyed by this frame's ID. If this frame is still alive, it will still be in the same place it started. We also store our frame ID on any addresses on this tape, for the same reason.

// If any inner tape's references are upvalues, and also upvalues on this tape, then that reference in this tape must already have an earlier frame ID in their reference from the above process. We just copy that frame ID down. 

// Note, we cannot derive these capture relationships at parse time because inner tapes are not necessarily always called in the context of their parent tape. A user could call an inner tape without first calling its parent tape. This is not implemented yet, but is planned for the near future.


// [[file:../literate/Frame.org::+begin_src js][No heading:4]]
        this.references = {};
        Object.entries(this.tape.references).forEach(([ label, reference]) => {
            this.references[label] = { ...reference, frameId: this.id };
        });

        this.tape.cells.forEach((block) => {
            if (block.is(Category.Value, "Tape")) {
                Object.entries(block.references).forEach(([label, reference]) => {
                    const ourReference = this.references[label];
                    if (reference.type == "upvalue" &&
                        (ourReference.type == "local" ||
                         ourReference.type == "param")) {
                        ourReference.captured = true;
                        reference.frameId = this.id;
                    }
                    if (reference.type == "upvalue" && ourReference.type == "upvalue") {
                        // Error, because an inner tape has been called outside its necessary context. This may not be true, for example in the case of a global called inside an extracted inner tape, but it is an assumption currently and so it we error for safety.
                        if (typeof ourReference.frameId == "undefined") throw new Error(`Inner tape called out of context, reference "${ourReference.label}"`);
                        reference.frameId = ourReference.frameId;
                    }
                });
            }
            else if (block.is(Category.Value, "AddressIdentifier")) {
                const ourReference = this.references[block.identifier];
                if (ourReference.type == "local" || ourReference.type == "param") {
                    ourReference.captured = true;
                    block.frameId = this.id;
                }
            }
        });
    }
// No heading:4 ends here



// At a frame's end of life, all captured references become closed references. Closed references escape the frame, so we return that subset of references along with the blocks they refer to.


// [[file:../literate/Frame.org::+begin_src js][No heading:5]]
    closeReferences () {
        const closedReferences = {};

        Object.entries(this.references).forEach(([label, reference]) => {
            if (reference.captured) {
                if (reference.type == "param") {
                    closedReferences[label] = this.actualArgumentCells[reference.index];
                }
                else if (reference.type == "local") {
                    closedReferences[label] = this.tape.cells[reference.index];
                }
            }
        });

        return closedReferences;
    }
// No heading:5 ends here

// [[file:../literate/Frame.org::+begin_src js][No heading:6]]
    isBeyondEdge() { return this.head >= this.length; }

    advance() { this.head++; }

    halt() { this.halted = true; }

    getBlockAtHead() { return this.tape.cells[this.head]; }

    isCommaAtHead() { return this.tape.commas[this.head]; }

    placeResult(block) { this.tape.cells[this.head + 1] = block; }

    clearArguments() { this.arguments = []; }

    moveHeadToLabel(label) { this.head = this.tape.getIndexOfLabel(label); }

    getBlockAtLabel(label) {
        const { type, index } = this.tape.references[label];

        if (type == "param") return this.actualArgumentCells[index];

        return this.tape.getBlockAtLabel(label);
    }

    setBlockAtLabel(label, block) { return this.tape.setBlockAtLabel(label, block); }

    appendBlockToArguments(block) { this.arguments.push(block); }
// No heading:6 ends here



// Arguments list can never include ValueIdentifiers, so always resolve them to their true value.


// [[file:../literate/Frame.org::+begin_src js][No heading:7]]
    appendBlockAtHeadValueToArguments() {
        let block = this.getBlockAtHead();
        block = this.resolveMaybeValueIdentifier(block);
        this.appendBlockToArguments(block);
    }
// No heading:7 ends here



// Resolving identifiers is a complex process. This method accepts any block and only performs that process if the block is a value identifier. This means callers do not need to check first, and it provides a base case for the recursive flow.

// First, a value identifier may point to another value identifier, in which case we recurse on the same process.

// The simplest case is the value identifier which points to a label on the same tape, in which case this frame handles it all.

// The next simplest case is the value identifier which points to a parameter to the current tape. Again, this frame can handle that.


// [[file:../literate/Frame.org::+begin_src js][No heading:8]]
    resolveMaybeValueIdentifier(block) {
        const { identifier } = block;
        let found;
        
        if (! block.is(Category.Value, "ValueIdentifier")) {
            return block;
        }

        // Local on tape or parameter
        found = this.getBlockAtLabel(identifier);
        if (found) return this.resolveMaybeValueIdentifier(found);

        if (! found) throw new Error(
            `Unable to find label "${identifier}"`);
        
        return found;
    }
}
// No heading:8 ends here
