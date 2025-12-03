import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";

const createSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    titleSkeleton: {
      height: moderateHeightScale(28),
      width: "60%",
      borderRadius: moderateWidthScale(4),
    },
    subtitleSkeleton: {
      height: moderateHeightScale(18),
      width: "90%",
      borderRadius: moderateWidthScale(4),
      marginTop: moderateHeightScale(5),
    },
    searchSkeleton: {
      height: heightScale(18),
      borderRadius: moderateWidthScale(999),
    },
    categoryImageSkeleton: {
      width: "100%",
      height: heightScale(90),
      borderRadius: moderateWidthScale(12),
    },
    categoryLabelSkeleton: {
      marginTop: moderateHeightScale(5),
      height: moderateHeightScale(16),
      width: "80%",
      alignSelf: "center",
      borderRadius: moderateWidthScale(4),
    },
    otherCategoriesTitleSkeleton: {
      height: moderateHeightScale(20),
      width: "40%",
      borderRadius: moderateWidthScale(4),
    },
    otherCategoryItem: {
      gap: moderateHeightScale(12),
    },
    otherCategoryLabelSkeleton: {
      height: moderateHeightScale(20),
      width: "70%",
      borderRadius: moderateWidthScale(4),
    },
    otherCategoryIconSkeleton: {
      height: moderateWidthScale(18),
      width: moderateWidthScale(18),
      borderRadius: moderateWidthScale(9),
    },
  });

export const Skeleton = ({
  screenType,
  styles,
}: {
  screenType: "" | "StepOne";
  styles?: Record<string, any>;
}) => {
  const { colors } = useTheme();
  const skeletonStyles = useMemo(
    () => createSkeletonStyles(colors as Theme),
    [colors]
  );

  const stepOneSkeleton = styles ? (
    <>
      <View style={styles.titleSec}>
        <View style={skeletonStyles.titleSkeleton} />
        <View style={skeletonStyles.subtitleSkeleton} />
      </View>

      <View style={styles.searchContainer}>
        <View style={skeletonStyles.searchSkeleton} />
      </View>

      <View style={styles.categoriesContainer}>
        <View style={[styles.lineSeparator, { top: 0 }]} />
        <View style={styles.categoriesGrid}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={skeletonStyles.categoryImageSkeleton} />
              <View style={skeletonStyles.categoryLabelSkeleton} />
            </View>
          ))}
        </View>
        <View style={[styles.lineSeparator, { bottom: 0 }]} />
      </View>

      <View style={styles.otherCategoriesContainer}>
        <View style={skeletonStyles.otherCategoriesTitleSkeleton} />
        {[...Array(8)].map((_, index) => (
          <View key={index} style={skeletonStyles.otherCategoryItem}>
            <View style={styles.otherCategoryRow}>
              <View style={skeletonStyles.otherCategoryLabelSkeleton} />
              <View style={skeletonStyles.otherCategoryIconSkeleton} />
            </View>
            {index < 7 && <View style={styles.catSeparator} />}
          </View>
        ))}
      </View>
    </>
  ) : null;

  return (
    <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
      {screenType === "StepOne" && stepOneSkeleton}
    </SkeletonPlaceholder>
  );
};
