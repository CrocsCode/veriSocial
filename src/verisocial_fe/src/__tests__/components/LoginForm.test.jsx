import { screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { renderProviders } from '../../utils/renderProviders';
import LoginPage from '../../pages/LoginPage';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LoginForm Component', () => {
  it('updates inputs and submits login', () => {
    const store = configureStore({ reducer: state => state });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderProviders(<LoginPage />, { store });

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');

    fireEvent.click(loginButton);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LOGIN_REQUEST',
        payload: { email: 'test@example.com', password: 'password123' },
      })
    );
  });
});
