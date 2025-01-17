export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['^.+\\.js$'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
};
