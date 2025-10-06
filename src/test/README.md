# Testing Guide

This project uses Vitest for unit and integration testing.

## Running Tests

```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
npm run test:ui     # Run tests with UI
npm run coverage    # Generate coverage report
```

## Writing Tests

Tests are located in `__tests__` directories next to the components they test.

### Example Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { getByRole } = render(<YourComponent onClick={handleClick} />);
    await user.click(getByRole('button'));
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Testing Best Practices

- Test user-facing behavior, not implementation details
- Use `@testing-library/user-event` for simulating user interactions
- Mock external dependencies and API calls
- Keep tests focused and isolated
- Use descriptive test names

## Available Testing Utilities

- `vitest` - Test runner and assertion library
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation
