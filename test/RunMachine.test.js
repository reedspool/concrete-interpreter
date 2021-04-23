// Preamble


// [[file:../literate/RunMachineTests.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import * as RunMachine from "../src/RunMachine";
import { Frame } from "../src/Frame";
import { parseFile } from "concrete-parser";
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
expect.extend({ toMatchState });

const runMachine =
    Machine(RunMachine.definition)
        .withConfig(RunMachine.config)
        // Supply empty context to avoid warning
        .withContext({});

let interpreter;

beforeEach(() => {
    interpreter = TestInterpreter(runMachine);
})
// Preamble:1 ends here

// Tests


// [[file:../literate/RunMachineTests.org::*Tests][Tests:1]]
it("Can be instantiated", () => {
    expect(runMachine).toBeDefined();
    expect(interpreter).toBeDefined();
})
// Tests:1 ends here
