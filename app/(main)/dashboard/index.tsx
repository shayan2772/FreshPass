import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(20),
    },
    placeholderText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      marginTop: moderateHeightScale(40),
    },
  });

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  return (
    <SafeAreaView style={styles.container}  edges={["top","bottom"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateHeightScale(20) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Home</Text>
        <Text style={styles.placeholderText}>
          Dashboard content will be displayed here
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

