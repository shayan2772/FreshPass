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
  status: `/api/business/status`,
  profile: `/api/business/profile`,
  subscriptionPlans: (planType: string = "business", status: string = "active", sort: string = "price", direction: string = "asc") => 
    `/api/subscription-plans?plan_type=${planType}&status=${status}&sort=${sort}&direction=${direction}`,
  subscribe: (planId: number) => `/api/subscription-plans/${planId}/subscribe`,
};

/**
 * User endpoints
 */
export const userEndpoints = {
  details: `/api/user/details`,
  update: `/api/user`,
  changePassword: `/api/user/change-password`,
};

/**
 * Stripe payment endpoints
 */
export const stripeEndpoints = {
  paymentSheet: `/api/payment-sheet`,
};

/**
 * Dashboard endpoints
 */
export const dashboardEndpoints = {
  stats: (month?: string) => {
    if (month) {
      return `/api/dashboard/stats?month=${month}`;
    }
    return `/api/dashboard/stats`;
  },
};
