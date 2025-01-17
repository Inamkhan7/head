export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['^.+\\.js$'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  moduleDirectories: ['node_modules', 'src'],
};
