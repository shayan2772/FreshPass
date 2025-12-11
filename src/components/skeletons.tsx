import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
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
    emptyStateSkeleton: {
      height: moderateHeightScale(20),
      width: "60%",
      borderRadius: moderateWidthScale(4),
      alignSelf: "center",
    },
    serviceCardSkeleton: {
      height: moderateHeightScale(60),
      borderRadius: moderateWidthScale(8),
      marginBottom: moderateHeightScale(12),
    },
    popularTitleSkeleton: {
      height: moderateHeightScale(20),
      width: "50%",
      borderRadius: moderateWidthScale(4),
      marginBottom: moderateHeightScale(12),
    },
    suggestionItemSkeleton: {
      height: moderateHeightScale(50),
      borderRadius: moderateWidthScale(4),
      marginBottom: moderateHeightScale(8),
    },
    viewMoreButtonSkeleton: {
      height: moderateHeightScale(44),
      borderRadius: moderateWidthScale(12),
      marginTop: moderateHeightScale(12),
    },
    planCardSkeleton: {
      height: moderateHeightScale(200),
      borderRadius: moderateWidthScale(16),
      marginBottom: moderateHeightScale(20),
    },
    planHeaderSkeleton: {
      height: moderateHeightScale(28),
      width: "60%",
      borderRadius: moderateWidthScale(4),
      flex: 1,
    },
    planPriceSkeleton: {
      height: moderateHeightScale(28),
      width: "30%",
      borderRadius: moderateWidthScale(4),
    },
    planDescriptionSkeleton: {
      height: moderateHeightScale(16),
      width: "100%",
      borderRadius: moderateWidthScale(4),
      marginBottom: moderateHeightScale(4),
    },
    planDetailSkeleton: {
      height: moderateHeightScale(16),
      width: "80%",
      borderRadius: moderateWidthScale(4),
      marginBottom: moderateHeightScale(8),
    },
    planButtonSkeleton: {
      height: moderateHeightScale(44),
      borderRadius: moderateWidthScale(12),
      marginTop: moderateHeightScale(8),
    },
    staffOnDutyHeaderTitle: {
      height: moderateHeightScale(18),
      width: "40%",
      borderRadius: moderateWidthScale(4),
    },
    staffOnDutyHeaderCount: {
      height: moderateHeightScale(16),
      width: moderateWidthScale(40),
      borderRadius: moderateWidthScale(4),
    },
    staffOnDutyAvatar: {
      width: widthScale(52),
      height: widthScale(52),
      borderRadius: widthScale(52 / 2),
    },
    staffOnDutyName: {
      height: moderateHeightScale(14),
      width: moderateWidthScale(60),
      borderRadius: moderateWidthScale(4),
      marginTop: moderateHeightScale(5),
    },
  });

export const Skeleton = ({
  screenType,
  styles,
}: {
  screenType:
    | ""
    | "StepOne"
    | "StepEight"
    | "BusinessPlans"
    | "SummaryStats"
    | "StaffOnDuty";
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

  const stepEightSkeleton = styles ? (
    <>
      <View style={styles.titleSec}>
        <View style={skeletonStyles.titleSkeleton} />
        <View style={skeletonStyles.subtitleSkeleton} />
      </View>

      <View style={styles.emptyState}>
        <View style={skeletonStyles.emptyStateSkeleton} />
      </View>

      <View style={styles.popularSection}>
        <View style={skeletonStyles.popularTitleSkeleton} />
        {[...Array(3)].map((_, index) => (
          <View key={index} style={skeletonStyles.suggestionItemSkeleton} />
        ))}
      </View>

      <View style={skeletonStyles.viewMoreButtonSkeleton} />
    </>
  ) : null;

  const businessPlansSkeleton = styles ? (
    <ScrollView
      style={styles.content}
      contentContainerStyle={[
        styles.plansContainer,
        { paddingBottom: moderateHeightScale(30) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
        <View style={{ gap: moderateHeightScale(20) }}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={skeletonStyles.planHeaderSkeleton} />
                <View style={skeletonStyles.planPriceSkeleton} />
              </View>
              <View style={skeletonStyles.planDescriptionSkeleton} />
              <View style={skeletonStyles.planDescriptionSkeleton} />
              <View style={styles.planDetails}>
                <View style={skeletonStyles.planDetailSkeleton} />
                <View style={skeletonStyles.planDetailSkeleton} />
                <View style={skeletonStyles.planDetailSkeleton} />
              </View>
              <View style={skeletonStyles.planButtonSkeleton} />
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  ) : null;

  const summaryStatsSkeleton = styles ? (
    <>
      <View style={styles.statsRow}>
        <View style={styles.revenueCardSkeleotn} />
        <View style={styles.revenueCardSkeleotn} />
      </View>

      <View style={styles.appointmentStatsRow}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.appointmentStatCardSkeleton} />
        ))}
      </View>
    </>
  ) : null;

  const staffOnDutySkeleton = styles ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.staffScrollView}
      contentContainerStyle={styles.staffScrollContent}
    >
      {[...Array(5)].map((_, index) => (
        <View
          key={index}
          style={[styles.staffItem, index === 0 && styles.staffItemFirst]}
        >
          <View style={skeletonStyles.staffOnDutyAvatar} />
          <View style={skeletonStyles.staffOnDutyName} />
        </View>
      ))}
    </ScrollView>
  ) : null;

  return (
    <>
      {screenType === "StepOne" && (
        <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
          {stepOneSkeleton}
        </SkeletonPlaceholder>
      )}
      {screenType === "StepEight" && (
        <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
          {stepEightSkeleton}
        </SkeletonPlaceholder>
      )}
      {screenType === "BusinessPlans" && businessPlansSkeleton}
      {screenType === "SummaryStats" && (
        <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
          {summaryStatsSkeleton}
        </SkeletonPlaceholder>
      )}
      {screenType === "StaffOnDuty" && (
        <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
          {staffOnDutySkeleton}
        </SkeletonPlaceholder>
      )}
    </>
  );
};
