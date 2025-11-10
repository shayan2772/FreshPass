import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import RegisterStepThree from "./components/RegisterStepThree";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";

export default function RegisterNextSteps() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLetsGo = () => {
    router.push(`/${MAIN_ROUTES.COMPLETE_PROFILE}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RegisterStepThree onBack={handleBack} onLetsGo={handleLetsGo} />
    </SafeAreaView>
  );
}


