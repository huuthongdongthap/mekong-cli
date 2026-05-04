/**
 * Jest configuration for Droppii Training OS
 * Test all API endpoints with supertest, coverage ≥ 70%
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/api/**/*.js',
    'src/auth/**/*.js',
    'src/middleware/**/*.js',
    'src/models/**/*.js',
    'src/utils/**/*.js',
    '!src/dashboard/**',  // exclude frontend
    '!src/server.js'      // exclude main server
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 15000
};