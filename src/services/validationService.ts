/**
 * Validation service for form inputs
 * Simple and reusable validation functions
 */

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns Object with isValid boolean and error message
 */
export const validateEmail = (email: string): { isValid: boolean; error: string | null } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  // Simple email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates password requirements
 * @param password - Password string to validate
 * @returns Object with isValid boolean and error message
 */
export const validatePassword = (password: string): { isValid: boolean; error: string | null } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: "Password is required" };
  }

  // Minimum 8 characters
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates if two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to match
 * @returns Object with isValid boolean and error message
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error: string | null } => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: null };
};

