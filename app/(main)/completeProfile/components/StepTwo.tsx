import React, { useMemo, useState, useCallback } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import {
  CountryPicker,
  CountryItem,
  Style as CountryPickerStyle,
} from "react-native-country-codes-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import {
  setBusinessName,
  setFullName,
  setPhoneNumber,
  setCountryDetails,
} from "@/src/state/slices/completeProfileSlice";

const PHONE_PLACEHOLDERS: Record<string, string> = {
  US: "234 123 4455",
  NG: "803 123 4567",
  GB: "7123 456789",
  CA: "204 123 4455",
  IN: "91234 56789",
  AU: "412 345 678",
  ZA: "73 123 4567",
};

const getPhonePlaceholder = (countryIso: string) =>
  PHONE_PLACEHOLDERS[countryIso] ?? "234 123 4455";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap: 5,
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    formGroup: {
      gap: moderateHeightScale(16),
      marginTop: moderateHeightScale(10),
    },
    field: {},
    label: {},
    inputContainer: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(6),
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    textInput: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      flex: 1,
    },
    phoneInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(6),
      gap: moderateWidthScale(12),
    },
    countrySelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
    },
    countryCodeText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    divider: {
      width: 1,
      height: heightScale(20),
      backgroundColor: theme.darkGreen,
    },
    clearButton: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(20 / 2),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
  });

export default function StepTwo() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const insets = useSafeAreaInsets();
  const {
    businessName,
    fullName,
    countryCode,
    countryIso,
    phoneNumber,
    phonePlaceholder,
  } = useAppSelector((state) => state.completeProfile);
  const [pickerVisible, setPickerVisible] = useState(false);

  console.log("countryCode", countryCode);

  const handleCountrySelect = useCallback(
    (country: CountryItem) => {
      dispatch(
        setCountryDetails({
          countryCode: country.dial_code,
          countryIso: country.code,
          phonePlaceholder: getPhonePlaceholder(country.code),
        })
      );
      setPickerVisible(false);
    },
    [dispatch]
  );

  const pickerStyles = useMemo<CountryPickerStyle>(
    () => ({
      modal: {
        backgroundColor: (colors as Theme).background,
        borderTopLeftRadius: moderateWidthScale(24),
        borderTopRightRadius: moderateWidthScale(24),
        paddingHorizontal: moderateWidthScale(20),
        paddingTop: moderateHeightScale(20),
        paddingBottom: moderateHeightScale(16) + insets.bottom,
        gap: moderateHeightScale(16),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        height: Dimensions.get("window").height / 1.5,
      },
      textInput: {
        borderRadius: moderateWidthScale(999),
        borderWidth: 1,
        borderColor: (colors as Theme).borderLight,
        paddingHorizontal: moderateWidthScale(16),
        fontSize: fontSize.size16,
        fontFamily: fonts.fontRegular,
        color: (colors as Theme).darkGreen,
        backgroundColor: (colors as Theme).white,
        flex: 1,
      },
      line: {
        backgroundColor: (colors as Theme).borderLight,
      },
      itemsList: {
        paddingBottom: moderateHeightScale(12),
      },
      countryButtonStyles: {
        paddingVertical: moderateHeightScale(12),
        borderBottomWidth: 1,
        borderBottomColor: (colors as Theme).borderLight,
        backgroundColor: (colors as Theme).background,
      },
      dialCode: {
        fontSize: fontSize.size16,
        fontFamily: fonts.fontRegular,
        color: (colors as Theme).darkGreen,
      },
      countryName: {
        fontSize: fontSize.size16,
        fontFamily: fonts.fontRegular,
        color: (colors as Theme).darkGreen,
      },
      backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      },
    }),
    [colors, insets.bottom]
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>Tell us more about you</Text>
        <Text style={styles.subtitle}>
          Tell us more about you and your business.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.field}>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Business name"
                placeholderTextColor={(colors as Theme).lightGreen2}
                value={businessName}
                onChangeText={(value) => dispatch(setBusinessName(value))}
              />
              {!!businessName && (
                <Pressable
                  onPress={() => dispatch(setBusinessName(""))}
                  style={styles.clearButton}
                  hitSlop={moderateWidthScale(10)}
                >
                  <Feather
                    name="x"
                    size={moderateWidthScale(12)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Your full name"
                placeholderTextColor={(colors as Theme).lightGreen2}
                value={fullName}
                onChangeText={(value) => dispatch(setFullName(value))}
              />
              {!!fullName && (
                <Pressable
                  onPress={() => dispatch(setFullName(""))}
                  style={styles.clearButton}
                  hitSlop={moderateWidthScale(10)}
                >
                  <Feather
                    name="x"
                    size={moderateWidthScale(12)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <View style={styles.phoneInputContainer}>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={styles.countrySelector}
            hitSlop={moderateWidthScale(10)}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <AntDesign
              name="caret-down"
              size={moderateWidthScale(12)}
              color={(colors as Theme).darkGreen}
            />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder={phonePlaceholder}
            placeholderTextColor={(colors as Theme).lightGreen2}
            value={phoneNumber}
            onChangeText={(value) => dispatch(setPhoneNumber(value))}
            keyboardType="phone-pad"
          />
          {!!phoneNumber && (
            <Pressable
              onPress={() => dispatch(setPhoneNumber(""))}
              style={styles.clearButton}
              hitSlop={moderateWidthScale(10)}
            >
              <Feather
                name="x"
                size={moderateWidthScale(12)}
                color={(colors as Theme).darkGreen}
              />
            </Pressable>
          )}

          <CountryPicker
            show={pickerVisible}
            pickerButtonOnPress={handleCountrySelect}
            onBackdropPress={() => setPickerVisible(false)}
            onRequestClose={() => setPickerVisible(false)}
            inputPlaceholder="Search country"
            inputPlaceholderTextColor={(colors as Theme).lightGreen2}
            searchMessage="No country found"
            style={pickerStyles}
            popularCountries={["US", "NG", "GB", "CA"]}
            initialState={""}
            enableModalAvoiding
            lang="en"
          />
        </View>
      </View>
    </View>
  );
}
