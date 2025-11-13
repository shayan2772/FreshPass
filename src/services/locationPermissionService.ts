import * as Location from "expo-location";
import { Platform, Alert, Linking } from "react-native";

export interface LocationPermissionResult {
  granted: boolean;
  canRequestAgain: boolean;
  message: string;
}

/**
 * Request location permission with proper handling for iOS and Android
 * Returns whether permission was granted and if user can request again
 */
export const requestLocationPermission =
  async (): Promise<LocationPermissionResult> => {
    try {
      // Step 1: Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        return {
          granted: false,
          canRequestAgain: true,
          message:
            "Location services are turned off. Please enable location services in your device settings.",
        };
      }

      // Step 2: Request permission (this also returns current status if already granted)
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();

      const { status: requestedStatus } = permissionResponse;

      // Step 3: Handle different permission states
      if (requestedStatus === Location.PermissionStatus.GRANTED) {
        return {
          granted: true,
          canRequestAgain: false,
          message: "",
        };
      }

      // Step 4: Check if permission is permanently blocked
      // Android: has canAskAgain property
      // iOS: doesn't have canAskAgain, but we can detect if permanently blocked
      let canAskAgain = true;

      if (Platform.OS === "android") {
        // Android: Check canAskAgain property if available
        canAskAgain =
          "canAskAgain" in permissionResponse
            ? (permissionResponse as any).canAskAgain
            : true;
      } else {
        // iOS: If status is DENIED, user can still request again
        // Permanently blocked only if user disabled in settings (UNDETERMINED after blocking)
        // For now, treat DENIED as can request again on iOS
        canAskAgain =
          requestedStatus === Location.PermissionStatus.DENIED ||
          requestedStatus === Location.PermissionStatus.UNDETERMINED;
      }

      // Step 5: Return appropriate response
      if (canAskAgain) {
        // First time deny: can request again, don't show alert
        return {
          granted: false,
          canRequestAgain: true,
          message: "Location permission is required to use your current location.",
        };
      }

      // Permanently blocked: can't request again, show alert with settings option
      return {
        granted: false,
        canRequestAgain: false,
        message:
          "Location permission was denied. Please enable location access in your device settings.",
      };
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return {
        granted: false,
        canRequestAgain: true,
        message: "Unable to request location permission. Please try again.",
      };
    }
  };

/**
 * Show alert with option to open device settings
 */
export const showLocationPermissionAlert = (
  message: string,
  onOpenSettings: () => void
) => {
  Alert.alert(
    "Location Permission Required",
    message,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Open Settings",
        onPress: onOpenSettings,
      },
    ],
    { cancelable: true }
  );
};

/**
 * Open device settings (iOS or Android)
 */
export const openLocationSettings = async (): Promise<void> => {
  try {
    if (Platform.OS === "ios") {
      // iOS: Open app settings
      await Linking.openURL("app-settings:");
    } else {
      // Android: Open location settings
      await Linking.openSettings();
    }
  } catch (error) {
    console.error("Error opening settings:", error);
    Alert.alert(
      "Unable to open settings",
      "Please manually enable location permissions in your device settings."
    );
  }
};

/**
 * Complete location permission flow with alert handling
 * Returns true if permission granted, false otherwise
 */
export const handleLocationPermission = async (): Promise<boolean> => {
  const result = await requestLocationPermission();

  if (result.granted) {
    return true;
  }

  // Only show alert if permission is permanently blocked (can't request again)
  // First time deny: canRequestAgain = true, don't show alert (silent deny)
  // Second time deny (blocked): canRequestAgain = false, show alert with settings option
  if (!result.canRequestAgain) {
    showLocationPermissionAlert(result.message, async () => {
      await openLocationSettings();
    });
  }

  return false;
};

