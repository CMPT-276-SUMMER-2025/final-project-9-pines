const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './', // your Next.js root directory
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
}

module.exports = createJestConfig(customJestConfig)
