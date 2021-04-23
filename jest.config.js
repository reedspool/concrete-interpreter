// =jest.config.js=
// :PROPERTIES:
// :header-args: :comments both :tangle jest.config.js
// :END:

// Because my custom packages are not Babel-transformed yet, this project must specifically inform Jest's Babel transformer to *not* ignore it, and transform it as well:

// - =xstate-jest-tools=
// - =concrete-parser=
// - =inverted-promise=


// [[file:README.org::*=jest.config.js=][=jest.config.js=:1]]
module.exports = {
    transformIgnorePatterns: [
        "node_modules/(?!xstate-jest-tools|concrete-parser|inverted-promise)"
    ]
}
// =jest.config.js=:1 ends here
