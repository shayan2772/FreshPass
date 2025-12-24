import React, { useMemo } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import DashboardHeaderClient from "../../DashboardHeaderClient";
import DashboardContent from "./DashboardContent";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  return (
    <View style={styles.container}>
      <DashboardHeaderClient />
      <DashboardContent />
    </View>
  );
}
