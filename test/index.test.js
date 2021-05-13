// Preamble


// [[file:../literate/IndexTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/index";
import * as Interpreter from "../src/Interpreter";
// Preamble:1 ends here

// Tests


// [[file:../literate/IndexTests.org::*Tests][Tests:1]]
it("Exposes everything it needs to.", () => {
    expect(interpretFile).toBeDefined();
    expect(interpretFile).toBe(Interpreter.interpretFile);
})
// Tests:1 ends here
