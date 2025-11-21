import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { moderateWidthScale, moderateHeightScale } from "@/src/theme/dimensions";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textColor?: string;
  backgroundColor?: string;
}

const createStyles = (theme: Theme, textColor?: string, backgroundColor?: string) =>
  StyleSheet.create({
    button: {
      backgroundColor: backgroundColor || theme.buttonBack,
      borderRadius: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(14),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: textColor || theme.buttonText,
    },
  });

export default function Button({
  title,
  onPress,
  disabled = false,
  containerStyle,
  textColor,
  backgroundColor,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme, textColor, backgroundColor), [colors, textColor, backgroundColor]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        containerStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

