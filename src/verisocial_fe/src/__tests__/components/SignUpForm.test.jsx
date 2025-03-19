import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderProviders } from '../../utils/renderProviders';
import LoginPage from '../../pages/LoginPage';

describe('Login to SignUp Switch', () => {
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
