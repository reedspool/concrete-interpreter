// Preamble


// [[file:../literate/ExampleProgramTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/Interpreter";
// Preamble:1 ends here

// Fibonacci


// [[file:../literate/ExampleProgramTests.org::*Fibonacci][Fibonacci:1]]
it("Example - Fibonacci", async () => {
    const input = (n) => `
        fib: (n)[
            n, 1 greaterThan! _, @recurse jump! 1 return!

            recurse:_

            n, 1 subtract! _, fib call! a: _
            n, 2 subtract! _, fib call! b: _

            a, b add! _
        ]

        ${n}, fib call! _
        `;

    // expect(await interpretFile(input(0))).toEqual([ 1 ]);
    // expect(await interpretFile(input(1))).toEqual([ 1 ]);
    // expect(await interpretFile(input(2))).toEqual([ 2 ]);
    // expect(await interpretFile(input(3))).toEqual([ 3 ]);
    // expect(await interpretFile(input(4))).toEqual([ 5 ]);
    // expect(await interpretFile(input(5))).toEqual([ 8 ]);
    // expect(await interpretFile(input(6))).toEqual([ 13 ]);
    // expect(await interpretFile(input(7))).toEqual([ 21 ]);
    // expect(await interpretFile(input(8))).toEqual([ 34 ]);
    // expect(await interpretFile(input(9))).toEqual([ 55 ]);
});
// Fibonacci:1 ends here
