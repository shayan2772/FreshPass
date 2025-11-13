/**
 * Utility functions for Step Four - Address related helpers
 */

export const buildAddressSummary = (
  street?: string,
  area?: string,
  postal?: string
) => {
  const parts = [street, area, postal].filter((value) => !!value?.trim());
  return parts.join(", ");
};

