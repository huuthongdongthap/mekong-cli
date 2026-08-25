/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/dist/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  '^@linkedu/api/(.*)$': '<rootDir>/src/$1',
 '^@linkedu/api$': '<rootDir>/src',
 '^@prisma/client$': '<rootDir>/node_modules/@prisma/client',
 },
}
