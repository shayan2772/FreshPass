import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { moderateWidthScale, moderateHeightScale } from "@/src/theme/dimensions";
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SocialLoginButtonProps {
  icon: React.ReactNode; // SVG icon component
  title: string;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      borderRadius: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(10),
      paddingHorizontal: moderateWidthScale(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen,
    },
    iconContainer: {
      width: moderateWidthScale(24),
      height: moderateWidthScale(24),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
  });

export default function SocialLoginButton({
  icon,
  title,
  onPress,
}: SocialLoginButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

