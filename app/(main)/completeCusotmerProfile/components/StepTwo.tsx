import React, { useMemo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import {
  CountryPicker,
  CountryItem,
} from "react-native-country-codes-picker";
import FloatingInput from "@/src/components/floatingInput";
import { setCountryName, setCountryZipCode } from "@/src/state/slices/completeProfileSlice";

// Popular countries list with their flag emojis
const POPULAR_COUNTRIES = [
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap: moderateHeightScale(5),
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
    countryList: {
      marginTop: moderateHeightScale(20),
      gap: 0,
    },
    countryItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: moderateHeightScale(14),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      gap: moderateWidthScale(12),
    },
    radioButton: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(10),
      borderWidth: 2,
      borderColor: theme.darkGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonSelected: {
      borderColor: theme.darkGreen,
    },
    radioButtonInner: {
      width: moderateWidthScale(10),
      height: moderateWidthScale(10),
      borderRadius: moderateWidthScale(5),
      backgroundColor: theme.orangeBrown,
    },
    countryFlag: {
      fontSize: fontSize.size24,
    },
    countryName: {
      flex: 1,
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    zipCodeContainer: {
      marginTop: moderateHeightScale(20),
    },
    zipCodeInput: {
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(14),
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    zipCodeLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(4),
    },
  });

export default function StepTwo() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const { countryName, countryZipCode } = useAppSelector(
    (state) => state.completeProfile
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCountrySelect = useCallback(
    (country: CountryItem) => {
      const countryData = POPULAR_COUNTRIES.find(
        (c) => c.code === country.code
      ) || {
        code: country.code,
        name: country.name?.en || country.name || "",
        flag: country.flag || "🏳️",
      };
      dispatch(setCountryName(countryData.name));
      setShowCountryPicker(false);
    },
    [dispatch]
  );

  const handleCountryPress = useCallback(
    (country: typeof POPULAR_COUNTRIES[0]) => {
      dispatch(setCountryName(country.name));
    },
    [dispatch]
  );

  const handleZipCodeChange = useCallback(
    (value: string) => {
      dispatch(setCountryZipCode(value));
    },
    [dispatch]
  );

  // Check if a country from the popular list is selected
  const selectedCountryData = useMemo(() => {
    if (!countryName) return null;
    return POPULAR_COUNTRIES.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
  }, [countryName]);

  // Show zip code input only for United States
  const showZipCode = selectedCountryData?.code === "US";

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>What&apos;s your country?</Text>
        <Text style={styles.subtitle}>
          Get the accurate information of services in your area.
        </Text>
      </View>

      <ScrollView
        style={styles.countryList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {POPULAR_COUNTRIES.map((country) => {
          const isSelected =
            countryName?.toLowerCase() === country.name.toLowerCase();
          return (
            <TouchableOpacity
              key={country.code}
              style={styles.countryItem}
              onPress={() => handleCountryPress(country)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioButton,
                  isSelected && styles.radioButtonSelected,
                ]}
              >
                {isSelected && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {showZipCode && (
        <View style={styles.zipCodeContainer}>
          <Text style={styles.zipCodeLabel}>Zip code</Text>
          <TextInput
            style={styles.zipCodeInput}
            value={countryZipCode}
            onChangeText={handleZipCodeChange}
            placeholder="Zip code"
            placeholderTextColor={(colors as Theme).lightGreen2}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>
      )}

      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => setShowCountryPicker(false)}
        onRequestClose={() => setShowCountryPicker(false)}
        inputPlaceholder="Search country"
        inputPlaceholderTextColor={(colors as Theme).lightGreen2}
        searchMessage="No country found"
        popularCountries={POPULAR_COUNTRIES.map((c) => c.code)}
        enableModalAvoiding
        lang="en"
      />
    </View>
  );
}
