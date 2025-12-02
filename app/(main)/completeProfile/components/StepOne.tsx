import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { IMAGES } from "@/src/constant/images";
import {
  setBusinessCategory,
  setSearchTerm,
} from "@/src/state/slices/completeProfileSlice";
import FloatingInput from "@/src/components/floatingInput";

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
      gap: 5,
      paddingHorizontal: moderateWidthScale(20),
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
      marginHorizontal: moderateWidthScale(20),
    },
    lineSeparator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.borderLight,
      position: "absolute",
    },
    categoriesContainer: {
      paddingVertical: moderateHeightScale(20),
    },
    categoriesGrid: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      rowGap: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(20),
      gap: "5%",
    },
    categoryCard: {
      width: "30%",
      height: heightScale(115),
    },
    categoryImage: {
      width: "100%",
      height: heightScale(90),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      borderRadius: moderateWidthScale(12),
    },
    categoryCardSelected: {
      borderColor: theme.selectCard,
      borderWidth: 3,
    },
    categoryLabelContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateWidthScale(8),
      backgroundColor: theme.background,
    },
    categoryLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlign: "center",
    },
    otherCategoriesContainer: {
      gap: moderateHeightScale(15),
      paddingHorizontal: moderateWidthScale(20),
    },
    otherCategoriesTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.lightGreen2,
    },
    otherCategoryContainer: {
      gap: moderateHeightScale(12),
    },
    otherCategoryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    catSeparator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.borderLight,
    },
    otherCategoryLabel: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      flex: 1,
    },
  });

export default function StepOne() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  // const accessToken = useAppSelector((state) => state.user.accessToken);
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
        <FloatingInput
          label="Search"
          value={searchTerm}
          onChangeText={handleSearchChange}
          placeholder="Search"
          placeholderTextColor={(colors as Theme).lightGreen2}
          onClear={() => dispatch(setSearchTerm(""))}
          containerStyle={{
            borderRadius: moderateWidthScale(999),
          }}
          inputStyle={{
            height: heightScale(18),
          }}
          renderLeftAccessory={() => (
            <Feather
              name="search"
              size={moderateWidthScale(18)}
              color={(colors as Theme).darkGreen}
            />
          )}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <View style={[styles.lineSeparator, { top: 0 }]} />
        <View style={styles.categoriesGrid}>
          {filteredPopular.map((item) => {
            const isSelected = businessCategory === item.label;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelectCategory(item.label)}
                style={styles.categoryCard}
              >
                <Image
                  source={IMAGES.socialBackgroud}
                  style={[
                    styles.categoryImage,
                    isSelected && styles.categoryCardSelected,
                  ]}
                  resizeMode="cover"
                />
                <View style={styles.categoryLabelContainer}>
                  <Text style={styles.categoryLabel}>{item.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.lineSeparator, { bottom: 0 }]} />
      </View>

      <View style={styles.otherCategoriesContainer}>
        <Text style={styles.otherCategoriesTitle}>Other categories</Text>

        {filteredOther.map((category, index) => {
          const isSelected = businessCategory === category;
          return (
            <View key={category} style={styles.otherCategoryContainer}>
              <Pressable
                onPress={() => handleSelectCategory(category)}
                style={[
                  styles.otherCategoryRow,
                  isSelected && {
                    backgroundColor: (colors as Theme).lightBeige,
                  },
                ]}
              >
                <Text style={styles.otherCategoryLabel}>{category}</Text>
                <Feather
                  name="chevron-right"
                  size={moderateWidthScale(18)}
                  color={(colors as Theme).darkGreen}
                />
              </Pressable>
              {index < filteredOther.length - 1 && (
                <View style={styles.catSeparator} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
