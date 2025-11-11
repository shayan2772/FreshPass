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
  CountryCode as PhoneCountryCode,
  getExampleNumber,
  AsYouType,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const examples = require("libphonenumber-js/examples.mobile.json");
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
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import {
  setBusinessName,
  setFullName,
  setPhoneNumber,
  setCountryDetails,
} from "@/src/state/slices/completeProfileSlice";

const FALLBACK_PHONE_PLACEHOLDERS: Record<string, string> = {
  US: "2015550123",
  NG: "8031234567",
  GB: "7123456789",
  CA: "2045550133",
  IN: "9123456789",
  AU: "412345678",
  ZA: "731234567",
  PK: "3071234567",
};

const sanitizePlaceholder = (value: string) =>
  value
    .replace(/[^\d\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatNationalNumber = (
  countryIso: string,
  dialCode: string,
  nationalDigits: string
) => {
  const dialDigits = dialCode.replace(/\D/g, "");
  const digits = nationalDigits.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  try {
    const formatter = new AsYouType(countryIso as PhoneCountryCode);
    const formatted = formatter.input(`+${dialDigits}${digits}`);
    const prefix = `+${dialDigits}`;

    if (formatted.startsWith(prefix)) {
      return formatted.slice(prefix.length).trimStart();
    }

    return formatted.replace(prefix, "").trimStart();
  } catch (error) {
    return digits;
  }
};

const getPlaceholderForCountry = (countryIso: string, dialCode: string) => {
  try {
    const example = getExampleNumber(countryIso as PhoneCountryCode, examples);
    if (example) {
      const formatted = example.formatInternational();
      const prefix = `+${example.countryCallingCode} `;
      if (formatted.startsWith(prefix)) {
        return sanitizePlaceholder(formatted.slice(prefix.length));
      }
      return sanitizePlaceholder(
        formatted.replace(`+${example.countryCallingCode}`, "")
      );
    }
  } catch (error) {
    // ignore and fallback
  }

  const fallbackDigits = FALLBACK_PHONE_PLACEHOLDERS[countryIso] ?? "0000000";

  const formattedFallback = formatNationalNumber(
    countryIso,
    dialCode,
    fallbackDigits
  );

  const sanitizedFallback =
    formattedFallback || sanitizePlaceholder(fallbackDigits);

  return sanitizePlaceholder(sanitizedFallback);
};

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
    phoneField: {
      // gap: moderateHeightScale(6),
      gap: moderateHeightScale(2),
    },
    phoneFieldContainer: {
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(10),
      gap: moderateHeightScale(2),
    },
    inputLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    phoneInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(10),
    },
    segmentWrapper: {
      flex: 1,
      position: "relative",
      justifyContent: "center",
    },
    segInputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: moderateWidthScale(3),
    },
    digitContainer: {
      minWidth: moderateWidthScale(13),
      alignItems: "center",
      justifyContent: "flex-end",
      // backgroundColor:"red"
    },
    digitChar: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
    },
    digitCharPlaceholder: {
      color: theme.lightGreen2,
    },
    digitCharFilled: {
      color: theme.darkGreen,
      fontFamily: fonts.fontRegular,
    },
    digitGuideline: {
      width: "100%",
      // height: moderateHeightScale(1),
      // backgroundColor: "transparent",
      // backgroundColor:theme.borderLight
    },
    digitGuidelineFilled: {
      backgroundColor: "transparent",
    },
    groupSpacer: {
      width: moderateWidthScale(2),
    },
    hiddenInput: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      color: "transparent",
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
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
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
    phoneIsValid,
  } = useAppSelector((state) => state.completeProfile);
  const [pickerVisible, setPickerVisible] = useState(false);
  const maxDigits = useMemo(
    () => phonePlaceholder.replace(/\s+/g, "").length,
    [phonePlaceholder]
  );
  const segmentNodes = useMemo(() => {
    let cursor = 0;
    const groups = phonePlaceholder.split(" ").filter(Boolean);

    return groups.map((group, groupIdx) => (
      <React.Fragment key={`group-${groupIdx}`}>
        {groupIdx > 0 && <View style={styles.groupSpacer} />}
        {group.split("").map((digit, digitIdx) => {
          const filledDigit = phoneNumber[cursor] ?? "";
          const isFilled = filledDigit !== "";
          const displayChar = isFilled ? filledDigit : digit;
          const key = `digit-${groupIdx}-${digitIdx}`;
          cursor += 1;

          return (
            <View key={key} style={styles.digitContainer}>
              <Text
                style={[
                  styles.digitChar,
                  isFilled
                    ? styles.digitCharFilled
                    : styles.digitCharPlaceholder,
                ]}
              >
                {displayChar}
              </Text>
              <View
                style={[
                  styles.digitGuideline,
                  isFilled && styles.digitGuidelineFilled,
                ]}
              />
            </View>
          );
        })}
      </React.Fragment>
    ));
  }, [phonePlaceholder, phoneNumber, styles]);

  const handleCountrySelect = useCallback(
    (country: CountryItem) => {
      dispatch(
        setCountryDetails({
          countryCode: country.dial_code,
          countryIso: country.code,
          phonePlaceholder: getPlaceholderForCountry(
            country.code,
            country.dial_code
          ),
        })
      );
      setPickerVisible(false);
    },
    [dispatch]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      const digitsOnly = value.replace(/[^0-9]/g, "");
      const limitedDigits = digitsOnly.slice(0, maxDigits);
      const dialDigits = countryCode.replace(/[^0-9]/g, "");
      let isValid = false;
      let parsedDigits = limitedDigits;

      if (limitedDigits.length > 0 && dialDigits.length > 0) {
        try {
          const parsed = parsePhoneNumberFromString(
            `+${dialDigits}${limitedDigits}`,
            countryIso as PhoneCountryCode
          );
          isValid = parsed?.isValid() ?? false;
          parsedDigits = parsed?.nationalNumber?.toString() ?? limitedDigits;
        } catch (error) {
          isValid = false;
        }
      }

      dispatch(
        setPhoneNumber({
          value: parsedDigits,
          isValid,
        })
      );
    },
    [countryCode, countryIso, dispatch, maxDigits]
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
  const isPhoneInvalid = phoneNumber.length > 0 && !phoneIsValid;

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

        <View style={[styles.field, styles.phoneField]}>
          <View style={styles.phoneFieldContainer}>
            <Text style={styles.inputLabel}>Phone number</Text>
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
              <View style={styles.segmentWrapper}>
                <View style={styles.segInputWrapper} pointerEvents="none">
                  {segmentNodes}
                </View>
                <TextInput
                  style={styles.hiddenInput}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  maxLength={maxDigits}
                />
              </View>
              {!!phoneNumber && (
              <Pressable
                onPress={() =>
                  dispatch(setPhoneNumber({ value: "", isValid: false }))
                }
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

          {isPhoneInvalid && (
            <Text style={styles.errorText}>Enter a valid phone number</Text>
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
            popularCountries={["US", "NG", "GB", "CA", "PK", "IN"]}
            // initialState={countryCode}
            enableModalAvoiding
            lang="en"
          />
        </View>
      </View>
    </View>
  );
}
