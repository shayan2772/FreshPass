/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API routes
 * Note: Endpoints are relative paths since axios instance has baseURL configured
 */

/**
 * Staff endpoints
 */
export const staffEndpoints = {
  register: `/staff/auth/register`,
};

/**
 * Customer endpoints
 */
export const customerEndpoints = {
  // Authentication
  register: `/customer/auth/register`,
};

/**
 * Business endpoints
 */
export const businessEndpoints = {
  register: `/api/register`,
  login: `/api/login`,
  categories: `/api/categories`,
  onboarding: `/api/business/onboarding`,
  serviceTemplates: (categoryId: number) => `/api/service-templates?category_id=${categoryId}`,
  services: `/api/services?status=active`,
};
