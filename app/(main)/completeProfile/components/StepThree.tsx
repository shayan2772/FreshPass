import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { setAppointmentVolume } from "@/src/state/slices/completeProfileSlice";

interface AppointmentOption {
  id: string;
  title: string;
  description: string;
}

const APPOINTMENT_OPTIONS: AppointmentOption[] = [
  {
    id: "just_starting",
    title: "Just starting",
    description: "I’m building my client base",
  },
  {
    id: "one_to_nine",
    title: "1 - 9 appointments",
    description: "Steady flow of clients",
  },
  {
    id: "ten_to_nineteen",
    title: "10 - 19 appointments",
    description: "Busy and growing",
  },
  {
    id: "twenty_plus",
    title: "20+ appointments",
    description: "High-volume business",
  },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(20),
    },
    header: {
      gap: moderateHeightScale(8),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontExtraBold,
      color: theme.darkGreen,
    },
    subtitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    optionsContainer: {
      gap: moderateHeightScale(12),
    },
    optionCard: {
      borderRadius: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(16),
      gap: moderateHeightScale(4),
    },
    optionSelected: {
      borderColor: theme.orangeBrown,
      backgroundColor: theme.lightBeige,
    },
    optionTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    optionDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function StepThree() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const { appointmentVolume } = useAppSelector(
    (state) => state.completeProfile
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          How many appointments do you typically have per week?
        </Text>
        <Text style={styles.subtitle}>
          This helps us tailor the app to your business volume.
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {APPOINTMENT_OPTIONS.map((option) => {
          const isSelected = appointmentVolume === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, isSelected && styles.optionSelected]}
              onPress={() => dispatch(setAppointmentVolume(option.id))}
              activeOpacity={0.7}
            >
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}


