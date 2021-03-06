// Preamble


// [[file:../literate/InterpreterTests.org::*Preamble][Preamble:1]]
import { interpretFile } from "../src/Interpreter";
// Preamble:1 ends here

// Simple

// Simple empty source should not have a result.


// [[file:../literate/InterpreterTests.org::*Simple][Simple:1]]
it("Empty source produces no result", async () => {
    const input = "";
    const result = await interpretFile(input);
    expect(result).toEqual([]);
});
// Simple:1 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:2]]
it("A number produces a JS number as a result", async () => {
    const input = "3355.4432";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(3355.4432);
});
// Simple:2 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:3]]
it("A string produces a JS string as a result", async () => {
    const input = "\"Hello World!\"";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Simple:3 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:4]]
it("A blank produces a JS `null` as a result", async () => {
    const input = "_";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(null);
});
// Simple:4 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:5]]
it("Multiple blocks with a comma separating them produces both as a result", async () => {
    const input = "1, 2";
    const result = await interpretFile(input);
    expect(result).toEqual([1, 2]);
});
// Simple:5 ends here

// [[file:../literate/InterpreterTests.org::*Simple][Simple:6]]
it("Multiple blocks without a comma separating them produces only the latter as a result", async () => {
    const input = "1 2";
    const result = await interpretFile(input);
    expect(result).toEqual([2]);
});
// Simple:6 ends here

// Add Executor
    

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:1]]
it("Simplest add executor", async () => {
    const input = "0 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Add Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:2]]
it("Simple add executor", async () => {
    const input = "1, 2, 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(6);
});
// Add Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:3]]
it("Add executor works on strings too", async () => {
    const input = "\"Hello \", \"World!\" add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello World!");
});
// Add Executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:4]]
it("Add executor works on numbers and strings, the same way JS does", async () => {
    const input = "\"Hello \", 250, \"th World!\" add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual("Hello " + 250 + "th World!");
});
// Add Executor:4 ends here

// [[file:../literate/InterpreterTests.org::*Add Executor][Add Executor:5]]
it("Simple add operator executor", async () => {
    const input = "1, 2, 3 + _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(6);
});
// Add Executor:5 ends here

// Subtract Executor
    

// [[file:../literate/InterpreterTests.org::*Subtract Executor][Subtract Executor:1]]
it("Simplest subtract executor", async () => {
    const input = "0 subtract! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Subtract Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Subtract Executor][Subtract Executor:2]]
it("Simple subtract executor", async () => {
    const input = "3, 2, 1 subtract! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Subtract Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Subtract Executor][Subtract Executor:3]]
it("Simple minus operator executor", async () => {
    const input = "3, 2, 1 - _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Subtract Executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Subtract Executor][Subtract Executor:4]]
it("Subtract executor on strings produces NaN", async () => {
    const input = "\"Hello \", \"World!\" subtract! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(NaN);
});
// Subtract Executor:4 ends here

// [[file:../literate/InterpreterTests.org::*Subtract Executor][Subtract Executor:5]]
it("Subtract executor on mixed numbers and strings produces NaN", async () => {
    const input = "\"Hello \", 250, \"th World!\" subtract! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(NaN);
});
// Subtract Executor:5 ends here

// Multiply Executor


// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:1]]
it("Simplest multiply executor", async () => {
    const input = "0 multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(0);
});
// Multiply Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:2]]
it("Simple multiply executor", async () => {
    const input = "1, 2, 3, 4 multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(24);
});
// Multiply Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:3]]
it("Simple multiply operator executor", async () => {
    const input = "1, 2, 3, 4 * _";
    const [ result ] = await interpretFile(input);
    expect(result).toEqual(24);
});
// Multiply Executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:4]]
it("Multiply executor turns Strings to NaNs", async () => {
    const input = "\"Hello \", \"World!\" multiply! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBeNaN();
});
// Multiply Executor:4 ends here

// [[file:../literate/InterpreterTests.org::*Multiply Executor][Multiply Executor:5]]
it("Multiply expects at least one argument", async () => {
    const input = "multiply! _";
    expect(interpretFile(input)).rejects.toHaveProperty("error");
});
// Multiply Executor:5 ends here

// Divide executor


// [[file:../literate/InterpreterTests.org::*Divide executor][Divide executor:1]]
it("Divide executor when result is integer", async () => {
    const input = "10, 2 divide! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Divide executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Divide executor][Divide executor:2]]
it("Divide executor when result is infinite decimal", async () => {
    const input = "10, 3 divide! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(10 / 3);
})
// Divide executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Divide executor][Divide executor:3]]
it("Divide operator executor when result is infinite decimal", async () => {
    const input = "10, 3 / _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(10 / 3);
})
// Divide executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Divide executor][Divide executor:4]]
it("Divide by zero is JS Infinity", async () => {
    const input = "10, 0 divide! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(Infinity);
})
// Divide executor:4 ends here

// Modulus executor


// [[file:../literate/InterpreterTests.org::*Modulus executor][Modulus executor:1]]
it("Modulus executor when result is integer", async () => {
    const input = "10, 2 modulus! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Modulus executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Modulus executor][Modulus executor:2]]
it("Modulus executor when result is infinite decimal", async () => {
    const input = "10, 3 modulus! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(10 % 3);
})
// Modulus executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Modulus executor][Modulus executor:3]]
it("Modulus operator executor when result is infinite decimal", async () => {
    const input = "10, 3 % 1";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(10 % 3);
})
// Modulus executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Modulus executor][Modulus executor:4]]
it("Modulus by zero is JS Infinity", async () => {
    const input = "10, 0 modulus! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(NaN);
})
// Modulus executor:4 ends here

// Basic labels


// [[file:../literate/InterpreterTests.org::*Basic labels][Basic labels:1]]
it("Simple labeled block as result", async () => {
    const input = "abcd: 5 abcd";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic labels:1 ends here

// [[file:../literate/InterpreterTests.org::*Basic labels][Basic labels:2]]
it("Labeled block points to another labeled block as result", async () => {
    const input = "abcd: efgh, efgh: 5 abcd";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic labels:2 ends here

// Basic get and set executors


// [[file:../literate/InterpreterTests.org::*Basic get and set executors][Basic get and set executors:1]]
it("Get value at address", async () => {
    const input = "abcd: 5 @abcd get! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic get and set executors:1 ends here

// [[file:../literate/InterpreterTests.org::*Basic get and set executors][Basic get and set executors:2]]
it("Set value at address", async () => {
    const input = "5, @result set! _ result: _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic get and set executors:2 ends here

// [[file:../literate/InterpreterTests.org::*Basic get and set executors][Basic get and set executors:3]]
it("Set value at address then get it", async () => {
    const input = "5, @result set! result: _ @result get! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic get and set executors:3 ends here

// [[file:../literate/InterpreterTests.org::*Basic get and set executors][Basic get and set executors:4]]
it("Infix set into an address", async () => {
    const input = "5 -> @result result: _ @result get! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// Basic get and set executors:4 ends here

// [[file:../literate/InterpreterTests.org::*Basic get and set executors][Basic get and set executors:5]]
it("Infix set into a value identifier", async () => {
    const input = "42 -> result result: _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(42);
})
// Basic get and set executors:5 ends here

// Conditional and not conditional jumps

// Jump into an argument list to an operator to prove that it actually jumped.


// [[file:../literate/InterpreterTests.org::*Conditional and not conditional jumps][Conditional and not conditional jumps:1]]
it("Unconditional jump", async () => {
    const input = "@end jump! 5, end: 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(3);
})
// Conditional and not conditional jumps:1 ends here



// Acts just like unconditional jump.


// [[file:../literate/InterpreterTests.org::*Conditional and not conditional jumps][Conditional and not conditional jumps:2]]
it("Conditional jump with truthy conditional", async () => {
    const input = "1, @end jump! 5, end: 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(3);
})
// Conditional and not conditional jumps:2 ends here



// Does not jump.


// [[file:../literate/InterpreterTests.org::*Conditional and not conditional jumps][Conditional and not conditional jumps:3]]
it("Conditional jump with falsy conditional doesn't jump", async () => {
    const input = "0, @end jump! 5, end: 3 add! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(8);
})
// Conditional and not conditional jumps:3 ends here

// If


// [[file:../literate/InterpreterTests.org::*If][If:1]]
it("True if", async () => {
    const input = "1 if! { 5, @a set! } a: 4";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// If:1 ends here

// [[file:../literate/InterpreterTests.org::*If][If:2]]
it("false if", async () => {
    const input = "0 if! { 5, @a set! } a: 4";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(4);
})
// If:2 ends here

// If/Else


// [[file:../literate/InterpreterTests.org::*If/Else][If/Else:1]]
it("True if/else", async () => {
    const input = "1 if! { 5, @a set! } else! { 6, @a set! } a: 4";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(5);
})
// If/Else:1 ends here

// [[file:../literate/InterpreterTests.org::*If/Else][If/Else:2]]
it("False if/else", async () => {
    const input = "0 if! { 5, @a set! } else! { 6, @a set! } a: 4";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(6);
})
// If/Else:2 ends here

// While
// :PROPERTIES:
// :CREATED:  [2021-06-02 Wed 20:13]
// :END:


// [[file:../literate/InterpreterTests.org::*While][While:1]]
it("Simple while loop", async () => {
    const input = "a: 3 while! { a, b + _, @b set! a, 1 - _, @a set! } b: 0";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(6);
})
// While:1 ends here

// Equal executor


// [[file:../literate/InterpreterTests.org::*Equal executor][Equal executor:1]]
it("Equal executor when true", async () => {
    const input = "5, 5 equal! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Equal executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Equal executor][Equal executor:2]]
it("Equal operator executor when true", async () => {
    const input = "5, 5 = _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Equal executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Equal executor][Equal executor:3]]
it("Equal executor when false", async () => {
    const input = "5, 42 equal! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Equal executor:3 ends here

// And executor


// [[file:../literate/InterpreterTests.org::*And executor][And executor:1]]
it("And executor when true", async () => {
    const input = "1, 2, 3 and! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// And executor:1 ends here

// [[file:../literate/InterpreterTests.org::*And executor][And executor:2]]
it("And operator executor when true", async () => {
    const input = "1, 2, 3 & _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// And executor:2 ends here

// [[file:../literate/InterpreterTests.org::*And executor][And executor:3]]
it("And executor when false", async () => {
    const input = "1, 0, 3 and! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// And executor:3 ends here

// Or executor


// [[file:../literate/InterpreterTests.org::*Or executor][Or executor:1]]
it("Or executor when true", async () => {
    const input = "1, 0, 3 or! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Or executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Or executor][Or executor:2]]
it("Or operator executor when true", async () => {
    const input = "1, 0, 3 | _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Or executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Or executor][Or executor:3]]
it("Or executor when false", async () => {
    const input = "0, 0, 0 or! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Or executor:3 ends here

// Not executor


// [[file:../literate/InterpreterTests.org::*Not executor][Not executor:1]]
it("Not executor when true", async () => {
    const input = "0 not! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Not executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Not executor][Not executor:2]]
it("Not operator executor when true", async () => {
    const input = "0 ~ _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Not executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Not executor][Not executor:3]]
it("Not executor when false", async () => {
    const input = "42 not! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Not executor:3 ends here

// Less Than Executor


// [[file:../literate/InterpreterTests.org::*Less Than Executor][Less Than Executor:1]]
it("Less than executor when true", async () => {
    const input = "1, 2 lessThan! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Less Than Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Less Than Executor][Less Than Executor:2]]
it("Less than operator executor when true", async () => {
    const input = "1, 2 < _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Less Than Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Less Than Executor][Less Than Executor:3]]
it("Less than executor when false", async () => {
    const input = "5, 2 lessThan! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Less Than Executor:3 ends here

// Greater Than Executor


// [[file:../literate/InterpreterTests.org::*Greater Than Executor][Greater Than Executor:1]]
it("Greater than executor when true", async () => {
    const input = "2, 1 greaterThan! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Greater Than Executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Greater Than Executor][Greater Than Executor:2]]
it("Greater than operator executor when true", async () => {
    const input = "2, 1 > _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(1);
})
// Greater Than Executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Greater Than Executor][Greater Than Executor:3]]
it("Greater than executor when false", async () => {
    const input = "1, 2 greaterThan! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Greater Than Executor:3 ends here

// Call a tape executor


// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:1]]
it("Call an empty tape has no effect", async () => {
    const input = "[ ] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(null);
})
// Call a tape executor:1 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:2]]
it("Call an empty tape with params has no effect", async () => {
    const input = "()[] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(null);
})
// Call a tape executor:2 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:3]]
it("Call a tape puts first implicit return result in right place", async () => {
    const input = "[ 3, 4 ] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(3);
})
// Call a tape executor:3 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:4]]
it("Call a tape with an explicit return puts result in right place", async () => {
    const input = "[ 3, 4 add! _ return! 5, 6 ] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(7);
})
// Call a tape executor:4 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:5]]
it("Call a tape with parameters", async () => {
    const input = "5, (n)[ n, n multiply! _ ] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(25);
})
// Call a tape executor:5 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:6]]
it("Call a tape with a closure", async () => {
    const input = "42, (n)[ [ n ] ] call! _ call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(42);
})
// Call a tape executor:6 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:7]]
it("Call a tape with a user-defined call executor", async () => {
    const input = "a:(n)[ [ n ] ] _ _ _ 42, a! b:_ _ _ _ b! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(42);
})
// Call a tape executor:7 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:8]]
it("Call a tape with a user-defined operator call executor", async () => {
    const input = "=>:(n)[ [ n ] ] _ _ _ 42, => b:_ _ _ _ b! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(42);
})
// Call a tape executor:8 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:9]]
it("Call a tape which sets a value outside its scope", async () => {
    const input = "a: 5 [ 10, @a set! ] call! a, a * _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(100);
})
// Call a tape executor:9 ends here

// [[file:../literate/InterpreterTests.org::*Call a tape executor][Call a tape executor:10]]
it("Call a tape which references a value outside its scope", async () => {
    const input = "a: 5 [ a, a * _ ] call! 50";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(25);
})
// Call a tape executor:10 ends here

// Reference closures

// [[file:../literate/InterpreterTests.org::*Reference closures][Reference closures:1]]
it("Call an empty tape has no effect", async () => {
    const input = "[ ] call! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(null);
})
// Reference closures:1 ends here

// Inline tapes

// [[file:../literate/InterpreterTests.org::*Inline tapes][Inline tapes:1]]
it("Simple Inline tape", async () => {
    const input = "{ 1, 2 + _ }, 4 + _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(7);
})
// Inline tapes:1 ends here

// [[file:../literate/InterpreterTests.org::*Inline tapes][Inline tapes:2]]
it("Inline tape can reference value outside it", async () => {
    const input = "a: 5 { a, 1 + _ }, 7 + _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(13);
})
// Inline tapes:2 ends here

// [[file:../literate/InterpreterTests.org::*Inline tapes][Inline tapes:3]]
it("Inline tape can set value outside it", async () => {
    const input = "a: 5 { 11, @a set! } a, a * _ ";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(121);
})
// Inline tapes:3 ends here

// Aliasing blocks


// [[file:../literate/InterpreterTests.org::*Aliasing blocks][Aliasing blocks:1]]
it.skip("Alias a global executor still works", async () => {
    const input = "abcd: greaterThan 1, 2 abcd! _";
    const [ result ] = await interpretFile(input);
    expect(result).toBe(0);
})
// Aliasing blocks:1 ends here
