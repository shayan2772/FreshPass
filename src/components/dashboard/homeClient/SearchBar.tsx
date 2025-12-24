import React, { useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateWidthScale,
  moderateHeightScale,
  widthScale,
  heightScale,
} from "@/src/theme/dimensions";
import { SearchIcon, FilterIcon } from "@/assets/icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {},
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(999),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
      gap: moderateWidthScale(12),
      marginHorizontal: moderateWidthScale(20),
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
    searchIconContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
    },
    placeholderText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    locationText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    filterButton: {
      width: widthScale(30),
      height: heightScale(30),
      borderRadius: widthScale(9999),
      borderWidth: 0.8,
      borderColor: theme.lightGreen22,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    separator: {
      height: 0.5,
      backgroundColor: theme.lightGreen22,
      marginTop: moderateHeightScale(12),
    },
  });

interface SearchBarProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  location?: string;
}

export default function SearchBar({
  onSearchPress,
  onFilterPress,
  location = "San Francisco",
}: SearchBarProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.searchBar, styles.shadow]}
        onPress={onSearchPress}
        activeOpacity={0.8}
      >
        <View style={styles.searchIconContainer}>
          <SearchIcon
            width={widthScale(20)}
            height={heightScale(20)}
            color={theme.buttonBack}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.placeholderText}>Find services to book in</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <FilterIcon
            width={widthScale(17)}
            height={heightScale(17)}
            color={theme.darkGreen}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}
