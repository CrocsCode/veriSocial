// Register Password Validation

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9).");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*).");
  }
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot have more than 2 identical characters in a row.");
  }

  return errors;
};
