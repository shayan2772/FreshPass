import React, { useMemo } from "react";
import {
  Image,
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
import { IMAGES } from "@/src/constant/images";
import {
  setBusinessCategory,
  setSearchTerm,
} from "@/src/state/slices/completeProfileSlice";

const POPULAR_CATEGORIES = [
  { id: "hair_salon", label: "Hair salon" },
  { id: "barbershop", label: "Barbershop" },
  { id: "nail_salon", label: "Nail salon" },
  { id: "massage", label: "Massage" },
  { id: "skin_care", label: "Skin care" },
  { id: "hair_coloring", label: "Hair coloring" },
];

const OTHER_CATEGORIES = [
  "Aesthetic clinic",
  "Wellness center",
  "Brows & lashes",
  "Braids & locs",
  "Makeup artist",
  "Skin care",
  "Spa",
  "Hair removal",
  "Beauty salon",
  "Yoga studio",
  "Tanning salon",
  "Bridal services",
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap:5
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
    searchContainer: {
      marginTop: moderateHeightScale(5),
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.white,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(5),
      gap: moderateWidthScale(12),
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(12),
    },
    categoryCard: {
      width: widthScale(104),
      height: heightScale(128),
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.white,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      marginBottom: moderateHeightScale(12),
    },
    categoryCardSelected: {
      borderColor: theme.orangeBrown,
    },
    categoryImage: {
      width: "100%",
      height: heightScale(80),
    },
    categoryLabelContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateWidthScale(8),
      backgroundColor: theme.lightBeige,
    },
    categoryLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      textAlign: "center",
    },
    otherCategoriesContainer: {
      marginTop: moderateHeightScale(16),
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
    },
    otherCategoriesHeader: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
    },
    otherCategoriesTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    otherCategoryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
      borderTopWidth: 1,
      borderTopColor: theme.lightGreen2,
    },
    otherCategoryLabel: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      flex: 1,
    },
  });

export default function StepOne() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const { searchTerm, businessCategory } = useAppSelector(
    (state) => state.completeProfile
  );

  const filteredPopular = useMemo(() => {
    if (!searchTerm.trim()) {
      return POPULAR_CATEGORIES;
    }
    const term = searchTerm.toLowerCase();
    return POPULAR_CATEGORIES.filter((category) =>
      category.label.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredOther = useMemo(() => {
    if (!searchTerm.trim()) {
      return OTHER_CATEGORIES;
    }
    const term = searchTerm.toLowerCase();
    return OTHER_CATEGORIES.filter((category) =>
      category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleSelectCategory = (category: string) => {
    dispatch(setBusinessCategory(category));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>What&apos;s your business?</Text>
        <Text style={styles.subtitle}>
          Select the category that best represents your salon or service. This
          helps customers find you.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={moderateWidthScale(18)}
          color={(colors as Theme).darkGreen}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={(colors as Theme).lightGreen2}
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
      </View>

      <View style={styles.categoriesGrid}>
        {filteredPopular.map((item) => {
          const isSelected = businessCategory === item.label;
          return (
            <Pressable
              key={item.id}
              onPress={() => handleSelectCategory(item.label)}
              style={[
                styles.categoryCard,
                isSelected && styles.categoryCardSelected,
              ]}
            >
              <Image
                source={IMAGES.socialBackgroud}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryLabelContainer}>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.otherCategoriesContainer}>
        <View style={styles.otherCategoriesHeader}>
          <Text style={styles.otherCategoriesTitle}>Other categories</Text>
        </View>

        {filteredOther.map((category) => {
          const isSelected = businessCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => handleSelectCategory(category)}
              style={[
                styles.otherCategoryRow,
                isSelected && { backgroundColor: (colors as Theme).lightBeige },
              ]}
            >
              <Text style={styles.otherCategoryLabel}>{category}</Text>
              <Feather
                name="chevron-right"
                size={moderateWidthScale(18)}
                color={(colors as Theme).lightGreen}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
