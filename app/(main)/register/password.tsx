import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import RegisterStepTwo from "./components/RegisterStepTwo";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";

export default function RegisterPassword() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";
  const isSubscribed = params.isSubscribed === "true";

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    router.push(`/${MAIN_ROUTES.REGISTER_NEXT_STEPS}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RegisterStepTwo
        onBack={handleBack}
        onContinue={handleContinue}
        email={email}
        isSubscribed={isSubscribed}
      />
    </SafeAreaView>
  );
}
