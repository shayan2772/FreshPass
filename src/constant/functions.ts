import { Platform, I18nManager } from "react-native";

export const getLangLabel = (code: string) => {
  switch (code) {
    case "ur":
      return "اردو";
    case "fr":
      return "Français";
    default:
      return "English";
  }
};

/**
 * Checks if the current layout direction is RTL
 * @param language - Current language code (optional, will check system if not provided)
 * @returns boolean - true if RTL, false if LTR
 */
export const isRTL = (language?: string): boolean => {
  // Check language first if provided
  if (language) {
    return language === "ur";
  }
  
  // For native platforms, check I18nManager
  if (Platform.OS !== "web") {
    return I18nManager.isRTL;
  }
  
  // For web, check document.dir attribute
  if (typeof document !== "undefined") {
    return document.documentElement.dir === "rtl";
  }
  
  return false;
};

/**
 * Sets up RTL (Right-to-Left) direction based on language
 * @param language - Language code (e.g., "ur" for Urdu)
 * @returns boolean - true if app reload is needed (for native platforms), false otherwise
 */
export const setupRTL = (language: string): boolean => {
  const needsRTL = language === "ur";

  // Handle RTL for native platforms
  if (Platform.OS !== "web") {
    const currentIsRTL = I18nManager.isRTL;

    // Only reload if RTL direction needs to change
    if (needsRTL !== currentIsRTL) {
      if (needsRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      } else {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      }
      return true; // Reload needed
    }
    return false; // No reload needed
  } else {
    // Handle RTL for web
    if (typeof document !== "undefined") {
      if (needsRTL) {
        document.documentElement.dir = "rtl";
        document.documentElement.setAttribute("lang", "ur");
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.setAttribute("lang", language);
      }
    }
    return false; // No reload needed for web
  }
};
