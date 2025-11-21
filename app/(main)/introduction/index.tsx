import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { MAIN_ROUTES } from "@/src/constant/routes";
import { handleNotificationPermission } from "@/src/services/notificationPermissionService";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";

export default function Introduction() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(1);

  // Disable back button on screen 2
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentScreen === 2) {
          // Prevent going back from screen 2
          setCurrentScreen(1);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [currentScreen])
  );

  const handleNext = () => {
    if (currentScreen === 1) {
      setCurrentScreen(2);
    } else {
      // Navigate to dashboard
      router.replace(`/(main)/${MAIN_ROUTES.DASHBOARD}`);
    }
  };

  const handleSkip = () => {
    // Navigate to screen 2
    setCurrentScreen(2);
  };

  const handleTurnOnNotifications = async () => {
    const granted = await handleNotificationPermission();
    
    // Navigate to screen 2 only if permission is granted
    if (granted) {
      setCurrentScreen(2);
    }
  };

  if (currentScreen === 1) {
    return (
      <Screen1
        onNext={handleTurnOnNotifications}
        onSkip={handleSkip}
      />
    );
  }

  return <Screen2 onNext={handleNext} />;
}

