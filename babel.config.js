// =babel.config.js=
// :PROPERTIES:
// :header-args: :comments both :tangle babel.config.js
// :END:

// Line-by-line, starting at the beginning:


// [[file:README.org::*=babel.config.js=][=babel.config.js=:1]]
module.exports = {
// =babel.config.js=:1 ends here



// Jest unfortunately does not work out of the box with =import= syntax.

// I solved this issue by adding a single dependency, =@babel/preset-env,= and a single file, =babel.config.js=:


// [[file:README.org::*=babel.config.js=][=babel.config.js=:2]]
    presets: [ "@babel/preset-env" ],
// =babel.config.js=:2 ends here



// When I started using async/await inside my Jest tests, I got this error:

// =ReferenceError: regeneratorRuntime is not defined=

// [[https://github.com/facebook/jest/issues/3126#issuecomment-723998132][This github comment]] suggested the following remedy:


// [[file:README.org::*=babel.config.js=][=babel.config.js=:3]]
    targets: { node: 'current' },
// =babel.config.js=:3 ends here




// And finally:


// [[file:README.org::*=babel.config.js=][=babel.config.js=:4]]
};
// =babel.config.js=:4 ends here
