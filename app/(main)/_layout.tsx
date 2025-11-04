import { Stack } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
import { useMemo } from "react";
import { Platform, StyleSheet } from "react-native";
import { MAIN_ROUTES } from "@/src/constant/routes";


const createStyles = (theme: any) =>
  StyleSheet.create({
    contentStyle: {
      backgroundColor: theme.background,
    },
  });

export default function MainLayout() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Stack
      initialRouteName={MAIN_ROUTES.INDEX}
      screenOptions={{
        headerShown: false,
        contentStyle: styles.contentStyle,
        animation: Platform.OS === "ios" ? "default" : "fade_from_bottom",
      }}
    >
      <Stack.Screen name={MAIN_ROUTES.INDEX} />
      <Stack.Screen name={MAIN_ROUTES.HOME} />
    </Stack>
  );
}



