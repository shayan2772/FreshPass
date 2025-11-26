import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";

interface CustomToggleInsideProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: theme.lightGreen16,
      width: moderateWidthScale(135),
      height: moderateHeightScale(38),
      padding: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(7),
      paddingHorizontal: moderateWidthScale(5),
      borderRadius: 999,
      overflow: "hidden",
    },
    offlineSectionInactive: {},
    offlineSectionActive: {
      backgroundColor: theme.toggleActive,
    },
    onlineSectionInactive: {},
    onlineSectionActive: {
      backgroundColor: theme.toggleActive,
    },
    text: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    textInactive:{
      color: theme.lightGreen,
    }
  });

export default function CustomToggleInside({
  value,
  onValueChange,
  disabled = false,
}: CustomToggleInsideProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={styles.container}
    >
      <View
        style={[
          styles.section,
          !value ? styles.offlineSectionActive : styles.offlineSectionInactive,
        ]}
      >
        <Text style={[styles.text,value &&styles.textInactive]}>Go offline</Text>
      </View>
      <View
        style={[
          styles.section,
          value ? styles.onlineSectionActive : styles.onlineSectionInactive,
        ]}
      >
        <Text style={[styles.text,!value &&styles.textInactive]}>Online</Text>
      </View>
    </Pressable>
  );
}
