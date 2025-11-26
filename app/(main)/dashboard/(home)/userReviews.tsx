import React, { useCallback, useMemo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { Stack, useRouter, useNavigation } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(24),
      backgroundColor: theme.background,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(16),
      backgroundColor: theme.lightYellow,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    headerTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    backIconWrapper: {
      width: widthScale(24),
      height: widthScale(24),
      alignItems: "center",
      justifyContent: "center",
    },
    metricsCard: {
      backgroundColor: theme.lightYellow,
      borderRadius: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: moderateHeightScale(20),
    },
    metricRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    metricLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    metricRight: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: moderateWidthScale(12),
    },
    metricScore: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(4),
    },
    metricCount: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.textLight,
    },
    progressTrack: {
      flex: 1,
      height: heightScale(4),
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.borderLight,
      marginHorizontal: moderateWidthScale(12),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.darkGreen,
    },
    progressFillSecondary: {
      backgroundColor: theme.lightGreen,
    },
    averageWrapper: {
      marginTop: moderateHeightScale(12),
    },
    averageText: {
      fontSize: fontSize.size32,
      fontFamily: fonts.fontExtraBold,
      color: theme.darkGreen,
    },
    averageLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginTop: moderateHeightScale(4),
    },
    countLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.textLight,
      marginBottom: moderateHeightScale(12),
    },
    card: {
      backgroundColor: theme.lightYellow,
      borderRadius: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: moderateHeightScale(16),
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
    },
    avatar: {
      width: widthScale(48),
      height: widthScale(48),
      borderRadius: moderateWidthScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
      backgroundColor: theme.lightGreen2,
    },
    avatarIcon: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    nameText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    dateText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.textLight,
      marginTop: moderateHeightScale(4),
    },
    starsRow: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(12),
    },
    starText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(4),
    },
    reviewText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(20),
    },
    seeMoreText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.buttonBack,
      marginTop: moderateHeightScale(12),
    },
  });

export default function UserReviewsScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        parent?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.backIconWrapper}>
          <Entypo
            name="chevron-small-left"
            size={moderateWidthScale(22)}
            color={theme.darkGreen}
            onPress={() => router.back()}
          />
        </View>
        <Text style={styles.headerTitle}>User reviews rate</Text>
        <View style={styles.backIconWrapper} />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Service Quality</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricScore}>5.0</Text>
              <Text style={styles.metricCount}>/ 269</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Experience</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  styles.progressFillSecondary,
                  { width: "80%" },
                ]}
              />
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricScore}>4.6</Text>
              <Text style={styles.metricCount}>/ 4</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cleanliness & Hygiene</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricScore}>5.0</Text>
              <Text style={styles.metricCount}>/ 2</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Punctuality & Booking</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricScore}>5.0</Text>
              <Text style={styles.metricCount}>/ 1</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.averageWrapper}>
            <Text style={styles.averageText}>4.9 Average</Text>
          </View>
          <Text style={styles.countLabel}>276 ratings</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.nameText}>Ofir Kiran</Text>
              <Text style={styles.dateText}>September 28, 2023</Text>
            </View>
          </View>

          <View style={styles.starsRow}>
            <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
          </View>

          <Text style={styles.reviewText}>
            Super professional and right on time. Loved the attention to detail.
            From booking to the cut—it's a smooth experience every time.
          </Text>

          <Text style={styles.seeMoreText}>See more</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.nameText}>Ofir Kiran</Text>
              <Text style={styles.dateText}>September 28, 2023</Text>
            </View>
          </View>

          <View style={styles.starsRow}>
            <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
          </View>

          <Text style={styles.reviewText}>
            Super professional and right on time. Loved the attention to detail.
            From booking to the cut—it's a smooth experience every time.
          </Text>

          <Text style={styles.seeMoreText}>See more</Text>
        </View>
      </ScrollView>
    </View>
  );
}
