import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { moderateHeightScale } from "@/src/theme/dimensions";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: moderateHeightScale(12),
    },
    title: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    description: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
    },
  });

export default function StepSix() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 6 placeholder</Text>
      <Text style={styles.description}>
        Placeholder content. Replace with final step details later.
      </Text>
    </View>
  );
}


