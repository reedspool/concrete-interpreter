// Preamble


// [[file:../literate/ExampleProgramTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/Interpreter";
// Preamble:1 ends here

// Fibonacci


// [[file:../literate/ExampleProgramTests.org::*Fibonacci][Fibonacci:1]]
it("Example - Fibonacci", async () => {
    const input = (n) => `
        fib: (n)[
            n, 1 > _, @recurse jump! 1 return!

            recurse:_

            n, 1 - _, fib! a: _
            n, 2 - _, fib! b: _

            a, b + _
        ]

        ${n}, fib! _
        `;

    expect(await interpretFile(input(0))).toEqual([ 1 ]);
    expect(await interpretFile(input(1))).toEqual([ 1 ]);
    expect(await interpretFile(input(2))).toEqual([ 2 ]);
    expect(await interpretFile(input(3))).toEqual([ 3 ]);
    expect(await interpretFile(input(4))).toEqual([ 5 ]);
    expect(await interpretFile(input(5))).toEqual([ 8 ]);
    expect(await interpretFile(input(6))).toEqual([ 13 ]);
    // expect(await interpretFile(input(7))).toEqual([ 21 ]);
    // expect(await interpretFile(input(8))).toEqual([ 34 ]);
    // expect(await interpretFile(input(9))).toEqual([ 55 ]);
});
// Fibonacci:1 ends here

// FizzBuzz


// [[file:../literate/ExampleProgramTests.org::*FizzBuzz][FizzBuzz:1]]
it.skip("Example - FizzBuzz", async () => {
    const input = (n) => `
        n: ${n}
        i: 0

        start:
          i, n = _, @end jump!
          i, 1 + _, @i set!

        i, 3 % _ ~ fizz: _
        i, 5 % _ ~ buzz: _
        fizz, buzz & fizzbuzz: _

        fizzbuzz, @fb jump!
        fizz, @f jump!
        buzz, @b jump!

        i print! @start jump!
        fb: "FizzBuzz" print! @start jump!
        f: "Fizz" print! @start jump!
        b: "Buzz" print! @start jump!

        end:_
        `;

    expect(await interpretFile(input(100))).toEqual([ 1 ]);
});
// FizzBuzz:1 ends here
