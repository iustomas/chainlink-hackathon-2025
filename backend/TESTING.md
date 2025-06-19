# Testing Guide

This document explains how to run tests for the backend API.

## Test Structure

The tests are organized into two main categories:

1. **Unit Tests** (`health.controller.test.ts`) - Test individual controller functions
2. **Integration Tests** (`health.integration.test.ts`) - Test complete HTTP endpoints

## Running Tests

### All Tests

```bash
npm test
```

### Tests with UI

```bash
npm run test:ui
```

### Specific Test File

```bash
npm test health.controller.test.ts
npm test health.integration.test.ts
```

### Watch Mode

```bash
npm test -- --watch
```

## Test Coverage

The tests cover:

### Health Controller Unit Tests

- ✅ Basic health status endpoint (`getStatus`)
- ✅ Detailed health information endpoint (`getDetails`)
- ✅ Response structure validation
- ✅ Data type validation
- ✅ Timestamp format validation
- ✅ System information accuracy

### Health Endpoints Integration Tests

- ✅ HTTP status codes
- ✅ Response body structure
- ✅ Content-Type headers
- ✅ Error handling (404 for non-existent routes)
- ✅ Real HTTP requests using Hono's `app.request()`

## Test Dependencies

- **Vitest** - Test runner and assertion library
- **@vitest/ui** - Visual test interface
- **supertest** - HTTP testing (for integration tests)

## Writing New Tests

### Unit Tests

```typescript
import { describe, it, expect, vi } from "vitest";
import { yourController } from "./your.controller.js";

describe("Your Controller", () => {
  it("should do something", () => {
    // Arrange
    const mockContext = { json: vi.fn() };

    // Act
    yourController.someMethod(mockContext);

    // Assert
    expect(mockContext.json).toHaveBeenCalledWith(expectedData);
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect } from "vitest";
import app from "../../app.js";

describe("Your Endpoint", () => {
  it("should return correct response", async () => {
    // Act
    const response = await app.request("/your-endpoint");
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toHaveProperty("expectedProperty");
  });
});
```

## Best Practices

1. **Use descriptive test names** that explain what is being tested
2. **Follow AAA pattern** (Arrange, Act, Assert)
3. **Test both success and error cases**
4. **Mock external dependencies** in unit tests
5. **Use integration tests** for HTTP endpoint testing
6. **Validate response structure and data types**
