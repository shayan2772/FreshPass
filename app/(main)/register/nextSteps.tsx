import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import RegisterStepThree from "./components/RegisterStepThree";
import { useRouter } from "expo-router";

export default function RegisterNextSteps() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLetsGo = () => {
    // TODO: connect with onboarding completion flow
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        animated
        translucent
        backgroundColor={(colors as Theme).background}
        barStyle={"dark-content"}
      />
      <RegisterStepThree onBack={handleBack} onLetsGo={handleLetsGo} />
    </SafeAreaView>
  );
}


