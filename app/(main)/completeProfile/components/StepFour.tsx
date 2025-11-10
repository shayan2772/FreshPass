import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import {
  setAddressSearch,
  setArea,
  setSelectedAddress,
  setStreetAddress,
  setUseCurrentLocation,
  setZipCode,
} from "@/src/state/slices/completeProfileSlice";

const ADDRESS_SUGGESTIONS = [
  "26 Opebi Road, Ikeja",
  "24 Adeola Odeku Street, Wuse 2",
  "18 Sanusi Fafunwa Street",
  "12b Admiralty Way, Lekki",
];

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
    searchSection: {
      gap: moderateHeightScale(12),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(10),
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    suggestionsContainer: {
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
    },
    suggestionItem: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
      borderBottomWidth: 1,
      borderBottomColor: theme.lightGreen2,
    },
    suggestionText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    locationButton: {
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      paddingVertical: moderateHeightScale(12),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    locationButtonText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    formSection: {
      gap: moderateHeightScale(16),
    },
    formField: {
      gap: moderateHeightScale(8),
    },
    label: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    inputWrapper: {
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
    mapContainer: {
      borderRadius: moderateWidthScale(16),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.lightBeige,
    },
    mapPreview: {
      height: heightScale(180),
      alignItems: "center",
      justifyContent: "center",
      gap: moderateHeightScale(8),
    },
    mapPreviewText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    selectedAddressCard: {
      borderTopWidth: 1,
      borderTopColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
      gap: moderateHeightScale(4),
      backgroundColor: theme.white,
    },
    selectedAddressTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    selectedAddressSubtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    areaZipRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    areaField: {
      flex: 1,
    },
    zipField: {
      width: widthScale(120),
    },
  });

export default function StepFour() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const {
    addressSearch,
    selectedAddress,
    streetAddress,
    area,
    zipCode,
  } = useAppSelector((state) => state.completeProfile);

  const filteredSuggestions = useMemo(() => {
    if (!addressSearch.trim()) {
      return [];
    }
    const term = addressSearch.toLowerCase();
    return ADDRESS_SUGGESTIONS.filter((suggestion) =>
      suggestion.toLowerCase().includes(term)
    );
  }, [addressSearch]);

  const handleSearchChange = (value: string) => {
    dispatch(setAddressSearch(value));
    if (!value.trim()) {
      dispatch(setSelectedAddress(null));
      dispatch(setUseCurrentLocation(false));
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    dispatch(setSelectedAddress(suggestion));
    dispatch(setStreetAddress(suggestion));
    dispatch(setUseCurrentLocation(false));
  };

  const handleUseCurrentLocation = () => {
    dispatch(setUseCurrentLocation(true));
    dispatch(setSelectedAddress("Using current location"));
    dispatch(setAddressSearch(""));
  };

  const handleStreetAddressChange = (value: string) => {
    dispatch(setStreetAddress(value));
    dispatch(setUseCurrentLocation(false));
  };

  const handleAreaChange = (value: string) => {
    dispatch(setArea(value));
  };

  const handleZipChange = (value: string) => {
    dispatch(setZipCode(value));
  };

  const showMapPreview =
    Boolean(selectedAddress) || Boolean(streetAddress.trim());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your business address</Text>
        <Text style={styles.subtitle}>
          Let us know the address clients will visit you.
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={moderateWidthScale(18)}
            color={(colors as Theme).lightGreen}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your address"
            placeholderTextColor={(colors as Theme).lightGreen}
            value={addressSearch}
            onChangeText={handleSearchChange}
          />
        </View>

        {filteredSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {filteredSuggestions.map((suggestion, index) => {
              const isLast = index === filteredSuggestions.length - 1;
              return (
                <Pressable
                  key={suggestion}
                  style={[
                    styles.suggestionItem,
                    isLast && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => handleSelectSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={styles.locationButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.locationButtonText}>Use current location</Text>
        </Pressable>
      </View>

      <View style={styles.formSection}>
        <View style={styles.formField}>
          <Text style={styles.label}>Street address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="24 Adeola Odeku Street, Wuse 2"
              placeholderTextColor={(colors as Theme).lightGreen}
              value={streetAddress}
              onChangeText={handleStreetAddressChange}
            />
          </View>
        </View>

        <View style={[styles.areaZipRow]}>
          <View style={[styles.formField, styles.areaField]}>
            <Text style={styles.label}>Area / City</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Downtown"
                placeholderTextColor={(colors as Theme).lightGreen}
                value={area}
                onChangeText={handleAreaChange}
              />
            </View>
          </View>
          <View style={[styles.formField, styles.zipField]}>
            <Text style={styles.label}>Zip code</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="29209"
                placeholderTextColor={(colors as Theme).lightGreen}
                value={zipCode}
                onChangeText={handleZipChange}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
      </View>

      {showMapPreview && (
        <View style={styles.mapContainer}>
          <View style={styles.mapPreview}>
            <Feather
              name="map-pin"
              size={moderateWidthScale(32)}
              color={(colors as Theme).darkGreen}
            />
            <Text style={styles.mapPreviewText}>
              Is the pin placed correctly?
            </Text>
            <Text style={styles.subtitle}>
              Confirm the location customers will visit.
            </Text>
          </View>
          <View style={styles.selectedAddressCard}>
            <Text style={styles.selectedAddressTitle}>
              {streetAddress || selectedAddress}
            </Text>
            <Text style={styles.selectedAddressSubtitle}>
              {area ? `${area}${zipCode ? `, ${zipCode}` : ""}` : zipCode}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}



