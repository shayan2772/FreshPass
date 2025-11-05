import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { moderateWidthScale } from "@/src/theme/dimensions";
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type UserType = "business" | "client";

interface RadioOptionProps {
  title: string;
  subtitle: string;
  option: UserType;
  selectedOption: UserType | null;
  onPress: (option: UserType) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    optionCard: {
      backgroundColor: theme.darkGreen15,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(12),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    radioButton: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(10),
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonSelected: {
      borderColor: theme.darkGreen,
    },
    radioButtonUnselected: {
      borderColor: theme.lightGreen,
    },
    radioButtonInner: {
      width: moderateWidthScale(10),
      height: moderateWidthScale(10),
      borderRadius: moderateWidthScale(10/2),
      backgroundColor: theme.orangeBrown,
    },
    optionContent: {
      flex: 1,
      gap: 2,
    },
    optionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    optionSubtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function RadioOption({
  title,
  subtitle,
  option,
  selectedOption,
  onPress,
}: RadioOptionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const isSelected = selectedOption === option;

  return (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={() => onPress(option)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioButton,
          isSelected
            ? styles.radioButtonSelected
            : styles.radioButtonUnselected,
        ]}
      >
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

