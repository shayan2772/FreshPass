import React, { useMemo } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useTheme, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { useRouter } from "expo-router";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: moderateHeightScale(30),
    },
    headerCard: {
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
      marginBottom: moderateHeightScale(12),
    },
    headerGradient: {
      padding: moderateWidthScale(24),
      paddingTop: moderateHeightScale(28),
      paddingBottom: moderateHeightScale(28),
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(16),
    },
    statusBadge: {
      paddingHorizontal: moderateWidthScale(14),
      paddingVertical: moderateHeightScale(8),
      borderRadius: moderateWidthScale(20),
      backgroundColor: theme.white,
      opacity: 0.95,
    },
    statusText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontBold,
      color: theme.buttonBack,
      letterSpacing: 0.5,
    },
    planName: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.white,
      marginBottom: moderateHeightScale(8),
      textTransform: "capitalize",
    },
    planPriceContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: moderateHeightScale(4),
    },
    currencySymbol: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.white,
      marginRight: moderateWidthScale(4),
      opacity: 0.9,
    },
    planPrice: {
      fontSize: fontSize.size30,
      fontFamily: fonts.fontExtraBold,
      color: theme.white,
    },
    pricePeriod: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      opacity: 0.85,
      marginLeft: moderateWidthScale(4),
    },
    planDescription: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      opacity: 0.9,
      lineHeight: fontSize.size20,
      marginTop: moderateHeightScale(8),
    },
    infoSection: {
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(20),
    },
    sectionTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    infoCard: {
      paddingVertical: moderateHeightScale(12),
      flexDirection: "row",
      alignItems: "center",
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    infoRow: {
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
    },
    infoRowLast: {
      marginBottom: 0,
    },
    infoIconContainer: {
      width: moderateWidthScale(40),
      height: moderateWidthScale(40),
      borderRadius: moderateWidthScale(10),
      backgroundColor: theme.orangeBrown30,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateHeightScale(8),
    },
    infoIcon: {
      // Icon styling handled by Feather component
    },
    infoContent: {
      alignItems: "center",
    },
    infoLabel: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
      textAlign: "center",
    },
    infoValue: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      textAlign: "center",
    },
    divider: {
      width: 1,
      height: moderateHeightScale(60),
      backgroundColor: theme.borderLight,
      marginHorizontal: moderateWidthScale(12),
    },
    daysRemainingCard: {
      borderRadius: moderateWidthScale(16),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(20),
      overflow: "hidden",
    },
    cardGradient: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(24),
      paddingVertical: moderateHeightScale(12),
      justifyContent: "space-between",
    },
    cardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(20),
    },
    cardChip: {
      width: moderateWidthScale(50),
      height: moderateHeightScale(40),
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.white,
      opacity: 0.3,
    },
    cardNetwork: {
      width: moderateWidthScale(50),
      height: moderateWidthScale(30),
      borderRadius: moderateWidthScale(4),
      backgroundColor: theme.white,
      opacity: 0.2,
    },
    cardMiddle: {
      flex: 1,
      justifyContent: "center",
    },
    cardNumberContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
    },
    cardNumberText: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.white,
      letterSpacing: moderateWidthScale(2),
    },
    daysRemainingLeft: {
      flex: 1,
    },
    daysRemainingLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.white,
      opacity: 0.8,
      marginBottom: moderateHeightScale(4),
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    daysRemainingValue: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontExtraBold,
      color: theme.buttonBack,
    },
    daysRemainingIcon: {
      width: moderateWidthScale(56),
      height: moderateWidthScale(56),
      borderRadius: moderateWidthScale(28),
      backgroundColor: theme.lightBeige,
      alignItems: "center",
      justifyContent: "center",
    },
    cardBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    cardLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.white,
      opacity: 0.8,
      marginBottom: moderateHeightScale(4),
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    cardValue: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.white,
      letterSpacing: moderateWidthScale(1),
    },
    buttonContainer: {
      marginHorizontal: moderateWidthScale(20),
      marginVertical: moderateHeightScale(24),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
      paddingHorizontal: moderateWidthScale(20),
    },
    emptyIcon: {
      marginBottom: moderateHeightScale(20),
    },
    emptyText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
      marginBottom: moderateHeightScale(8),
    },
    emptySubtext: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
      paddingHorizontal: moderateWidthScale(20),
    },
    errorText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
      marginBottom: moderateHeightScale(16),
    },
  });

export default function subscriptionCustomer() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showBanner } = useNotificationContext();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Subscriptions" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        
      </ScrollView>
    </SafeAreaView>
  );
}
