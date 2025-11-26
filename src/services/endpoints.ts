/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API routes
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

/**
 * Staff endpoints
 */
export const staffEndpoints = {
  register: `${BASE_URL}/staff/auth/register`,
};

/**
 * Customer endpoints
 */
export const customerEndpoints = {
  // Authentication

  register: `${BASE_URL}/customer/auth/register`,
};

/**
 * Business endpoints
 */
export const businessEndpoints = {
  register: `${BASE_URL}/api/register`,
};
