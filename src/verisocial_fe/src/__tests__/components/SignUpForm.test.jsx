import { screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderProviders } from '../../utils/renderProviders';
import LoginPage from '../../pages/LoginPage';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SignUpForm Component', () => {
  it('switches to SignUp form from Login form', () => {
    renderProviders(<LoginPage />);

    expect(screen.getByRole('button', { name: /login/i })).toBeDefined();
    expect(screen.queryByPlaceholderText('Confirm your password')).toBeNull();

    fireEvent.click(screen.getAllByText(/sign up/i)[0]);

    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your email')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your password')).toBeDefined();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeDefined();
  });
});
