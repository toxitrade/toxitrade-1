/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@deriv/core$': '<rootDir>/packages/core/src',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'es6',
          module: 'commonjs',
          jsx: 'react-jsx',
          esModuleInterop: true,
          strict: true,
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'hooks/**/*.ts',
    'packages/core/src/**/*.ts',
    '!packages/core/src/**/*.d.ts',
  ],
};
