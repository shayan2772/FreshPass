import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import DashboardHeader from "@/src/components/DashboardHeader";
import { useRouter } from "expo-router";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
  });

export default function BookingScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DashboardHeader />
    </View>
  );
}
