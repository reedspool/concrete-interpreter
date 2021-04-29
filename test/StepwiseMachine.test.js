// Preamble


// [[file:../literate/StepwiseMachineTests.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import * as StepwiseMachine from "../src/StepwiseMachine";
import { service as callExecutorService } from "../src/executors/call";
import { service as getExecutorService } from "../src/executors/get";
import { Frame } from "../src/Frame";
import { parseFile } from "concrete-parser";
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
expect.extend({ toMatchState });

const stepwiseMachine = StepwiseMachine.init(); 

let interpreter;

beforeEach(() => {
    interpreter = TestInterpreter(stepwiseMachine);
})
// Preamble:1 ends here

// Tests


// [[file:../literate/StepwiseMachineTests.org::*Tests][Tests:1]]
it("Can be instantiated", () => {
    expect(interpreter.S).toMatchState("empty");
})
// Tests:1 ends here

// [[file:../literate/StepwiseMachineTests.org::*Tests][Tests:2]]
it("Can load a program", async () => {
    const tree = await parseFile("1 2 3");
    interpreter.send({ type: "LOAD_PROGRAM", source: tree });
    expect(interpreter.S).toMatchState("run.read");
    expect(interpreter.C.activeFrame).toEqual(Frame(0, tree.tape));
})
// Tests:2 ends here
