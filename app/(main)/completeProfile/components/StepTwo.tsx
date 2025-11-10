import React, { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import {
  setBusinessName,
  setCountryCode,
  setFullName,
  setPhoneNumber,
} from "@/src/state/slices/completeProfileSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(24),
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
    formGroup: {
      gap: moderateHeightScale(16),
    },
    field: {
      gap: moderateHeightScale(8),
    },
    label: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    inputContainer: {
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
    },
    textInput: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    phoneRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    countryCodeContainer: {
      width: widthScale(80),
    },
    phoneNumberContainer: {
      flex: 1,
    },
  });

export default function StepTwo() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const { businessName, fullName, countryCode, phoneNumber } = useAppSelector(
    (state) => state.completeProfile
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tell us more about you</Text>
        <Text style={styles.subtitle}>
          Tell us more about you and your business.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.field}>
          <Text style={styles.label}>Business name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your business name"
              placeholderTextColor={(colors as Theme).lightGreen}
              value={businessName}
              onChangeText={(value) => dispatch(setBusinessName(value))}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your full name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor={(colors as Theme).lightGreen}
              value={fullName}
              onChangeText={(value) => dispatch(setFullName(value))}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.phoneRow}>
            <View style={[styles.inputContainer, styles.countryCodeContainer]}>
              <TextInput
                style={styles.textInput}
                placeholder="+1"
                placeholderTextColor={(colors as Theme).lightGreen}
                value={countryCode}
                onChangeText={(value) => dispatch(setCountryCode(value))}
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.inputContainer, styles.phoneNumberContainer]}>
              <TextInput
                style={styles.textInput}
                placeholder="234 123 4455"
                placeholderTextColor={(colors as Theme).lightGreen}
                value={phoneNumber}
                onChangeText={(value) => dispatch(setPhoneNumber(value))}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


