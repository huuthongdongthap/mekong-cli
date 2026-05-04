/**
 * Jest setup - initialize test environment
 */

// Suppress console.error in tests unless needed
global.console.error = jest.fn();

// Reset modules before each test
beforeEach(() => {
  jest.resetModules();
});

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));