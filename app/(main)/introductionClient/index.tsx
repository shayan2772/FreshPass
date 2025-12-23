import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { handleNotificationPermission } from "@/src/services/notificationPermissionService";
import LocationScreen from "./LocationScreen";
import Notification from "./Notification";
import CoreFeature from "./CoreFeature";
import GenderSelect from "./GenderSelect";
import CategorySelect from "./CategorySelect";

type ScreenType =
  | "location"
  | "notification"
  | "coreFeature"
  | "gender"
  | "category";

export default function IntroductionClient() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("location");

  // Handle back button based on current screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentScreen === "location") {
          // Allow back to role screen
          router.back();
          return true;
        } else if (
          currentScreen === "notification" ||
          currentScreen === "coreFeature" ||
          currentScreen === "gender"
        ) {
          // Prevent going back from these screens
          return true;
        } else if (currentScreen === "category") {
          // Allow back to gender screen
          setCurrentScreen("gender");
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [currentScreen, router])
  );

  const handleLocationNext = () => {
    setCurrentScreen("notification");
  };

  const handleNotificationNext = async () => {
    const granted = await handleNotificationPermission();
    // Continue to next screen regardless of permission
    setCurrentScreen("coreFeature");
  };

  const handleNotificationSkip = () => {
    setCurrentScreen("coreFeature");
  };

  const handleCoreFeatureNext = () => {
    setCurrentScreen("gender");
  };

  const handleGenderNext = () => {
    setCurrentScreen("category");
  };

  const handleCategoryNext = () => {
    // Navigate to dashboard or complete profile
    router.replace("/(main)/dashboard/(home)" as any);
  };

  switch (currentScreen) {
    case "location":
      return <LocationScreen onNext={handleLocationNext} />;
    case "notification":
      return (
        <Notification
          onNext={handleNotificationNext}
          onSkip={handleNotificationSkip}
        />
      );
    case "coreFeature":
      return <CoreFeature onNext={handleCoreFeatureNext} onSkip={handleCoreFeatureNext} />;
    case "gender":
      return <GenderSelect onNext={handleGenderNext} />;
    case "category":
      return <CategorySelect onNext={handleCategoryNext} />;
    default:
      return <LocationScreen onNext={handleLocationNext} />;
  }
}
