import React, { useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { Entypo } from "@expo/vector-icons";
import { DollarCheckIcon, StarIcon } from "@/assets/icons";
import { useRouter } from "expo-router";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(12),
      width: "100%",
      alignSelf: "center",
      justifyContent: "space-between",
    },
    titleSec: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(4),
    },
    revenueCard: {
      width: "48.5%",
      backgroundColor: theme.darkGreen,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(16),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    revenueAmount: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.white,
      maxWidth: "87%",
    },
    revenueLabel: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.white,
      maxWidth: "87%",
    },
    reviewCard: {
      backgroundColor: theme.orangeBrown,
    },
    reviewRate: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      maxWidth: "87%",
    },
    reviewLabel: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      maxWidth: "87%",
    },
    appointmentStatsRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
      marginBottom: moderateHeightScale(18),
    },
    appointmentStatCard: {
      flex: 1,
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(16),
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    appointmentStatNumber: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    appointmentStatLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
  });

export default function SummaryStats() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();

  return (
    <>
      <View style={styles.statsRow}>
        <View style={styles.revenueCard}>
          <View style={styles.titleSec}>
            <Text numberOfLines={1} style={styles.revenueAmount}>
              USD $1,240
            </Text>
            <DollarCheckIcon
              width={moderateWidthScale(18)}
              height={moderateWidthScale(18)}
            />
          </View>
          <Text style={styles.revenueLabel}>Today's revenue</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.revenueCard, styles.reviewCard]}
          onPress={() =>
            router.push("/(main)/dashboard/(home)/userReviews")
          }
        >
          <View style={styles.titleSec}>
            <Text numberOfLines={1} style={styles.reviewRate}>
              4.0
            </Text>
            <StarIcon
              width={moderateWidthScale(18)}
              height={moderateWidthScale(18)}
            />
          </View>
          <View style={styles.titleSec}>
            <Text style={styles.reviewLabel}>User reviews rate</Text>
            <Entypo
              name="chevron-small-right"
              size={18}
              color={theme.darkGreen}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.appointmentStatsRow}>
        <View style={styles.appointmentStatCard}>
          <Text style={styles.appointmentStatNumber}>12</Text>
          <Text style={styles.appointmentStatLabel}>Upcoming</Text>
        </View>
        <View style={styles.appointmentStatCard}>
          <Text style={styles.appointmentStatNumber}>8</Text>
          <Text style={styles.appointmentStatLabel}>Complete</Text>
        </View>
        <View style={styles.appointmentStatCard}>
          <Text style={styles.appointmentStatNumber}>1</Text>
          <Text style={styles.appointmentStatLabel}>Canceled</Text>
        </View>
      </View>
    </>
  );
}
