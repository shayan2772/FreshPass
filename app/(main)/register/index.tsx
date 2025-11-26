import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import RegisterStepOne from "./components/RegisterStepOne";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";

export default function Register() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleContinue = (email: string, isSubscribed: boolean) => {
    router.push({
      pathname: `/${MAIN_ROUTES.REGISTER_PASSWORD}`,
      params: { email, isSubscribed: isSubscribed.toString() },
    });
  };

  const handleSocialLogin = (provider: "google" | "apple" | "facebook") => {
    // TODO: handle social login routing
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        animated
        translucent
        backgroundColor={(colors as Theme).background}
        barStyle={"dark-content"}
      />

      <RegisterStepOne
        onBack={handleBack}
        onContinue={handleContinue}
        onSocialLogin={handleSocialLogin}
      />
    </SafeAreaView>
  );
}
