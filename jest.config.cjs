module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['text', 'lcov', 'json', 'clover'],
    testEnvironment: 'jsdom',
    transform : {
        "^.+\\.js$": "babel-jest"
    },
    moduleFileExtensions: ["js", "json"]
}