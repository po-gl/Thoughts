/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line import/extensions
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  testRegex: 'integration\\.test\\.ts$',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts', 'd.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: tsjPreset.transform,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
