# CodeHike Component Tests

This directory contains tests for the CodeHike components using Bun's built-in test runner.

## Running Tests

You can run the tests using the following commands:

```bash
# Run tests once
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Test Structure

The tests are organized by component, with each component having its own test file:

- `components/codehike/code.test.tsx`: Tests for the CodeHike code component

## Mocking Strategy

Since CodeHike components rely on external libraries and browser APIs, we use Bun's mocking capabilities to isolate the components for testing:

1. **codehike/code**: We mock the `Pre` component to capture the props passed to it
2. **document.documentElement**: We mock the classList to simulate dark/light mode
3. **next/dynamic**: We mock the dynamic import to test the component directly

## Adding New Tests

When adding new tests:

1. Follow the existing patterns for mocking dependencies
2. Use descriptive test names that explain what is being tested
3. Test both the happy path and edge cases
4. Keep tests focused on a single behavior or feature

## Coverage Goals

We aim for high test coverage of the CodeHike components, focusing on:

- Component rendering
- Props handling
- Theme detection and application
- Annotation handlers
- Dynamic loading behavior
