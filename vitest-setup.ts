import { expect } from 'vitest'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import matchers from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
}

expect.extend(matchers)
