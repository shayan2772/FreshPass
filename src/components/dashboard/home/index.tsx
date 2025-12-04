import React, { useMemo, useEffect, useCallback, useState } from "react";
import { StyleSheet, View, ScrollView, StatusBar, TouchableOpacity, Text } from "react-native";
import { useTheme, useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import SummaryStats from "./components/SummaryStats";
import StaffOnDuty from "./components/StaffOnDuty";
import AppointmentsSection from "./components/AppointmentsSection";
import WorkHistory from "./components/WorkHistory";
import DashboardHeader from "../../DashboardHeader";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { setBusinessStatus } from "@/src/state/slices/userSlice";
import WebViewModal from "@/src/components/webViewModal";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: theme.borderLight,
    },
    scrollContent: {
      paddingVertical: moderateHeightScale(15),
    },
    statsContainer: {
      paddingHorizontal: moderateWidthScale(20),
    },
    appointmentsContainer: {
      paddingHorizontal: moderateWidthScale(20),
    },
    workHistoryContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(15),
    },
    stripeBanner: {
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(12),
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(12),
      borderRadius: moderateWidthScale(8),
    },
    stripeBannerText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.white,
      textAlign: "center",
    },
  });

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const { showBanner } = useNotificationContext();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const businessStatus = useAppSelector((state) => state.user.businessStatus);
  const [webViewVisible, setWebViewVisible] = useState(false);

  const fetchBusinessStatus = useCallback(async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          onboarding_completed: boolean;
          current_step: number | null;
          next_step: number | null;
          stripe_onboarding_status: string;
          stripe_onboarding_link: string | null;
          has_subscription: boolean;
          subscription_status: string;
        };
      }>(businessEndpoints.status);

      if (response.success && response.data) {
        dispatch(setBusinessStatus(response.data));
      }
    } catch (error: any) {
      console.error("Failed to fetch business status:", error);
      showBanner(
        "API Failed",
        error.message || "Failed to fetch business status",
        "error",
        2500
      );
    }
  }, [dispatch, showBanner]);

  useEffect(() => {
    if (accessToken) {
      fetchBusinessStatus();
    }
  }, [accessToken, fetchBusinessStatus]);

  const handleStripeOnboardingPress = () => {
    if (businessStatus?.stripe_onboarding_link) {
      setWebViewVisible(true);
    }
  };

  const handleCloseWebView = () => {
    setWebViewVisible(false);
  };

  const showStripeBanner = businessStatus?.stripe_onboarding_status === "pending" && businessStatus?.stripe_onboarding_link;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader />
      {showStripeBanner && (
        <TouchableOpacity
          style={styles.stripeBanner}
          onPress={handleStripeOnboardingPress}
          activeOpacity={0.8}
        >
          <Text style={styles.stripeBannerText}>
            Please complete your Stripe onboarding
          </Text>
        </TouchableOpacity>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Statistics */}
        <View style={styles.statsContainer}>
          <SummaryStats />
        </View>

        {/* Staff on Duty - Full Width */}
        <StaffOnDuty />

        {/* Appointments */}
        <View style={styles.appointmentsContainer}>
          <AppointmentsSection />
        </View>

        <View style={styles.line} />

        {/* Work History */}
        <View style={styles.workHistoryContainer}>
          <WorkHistory />
        </View>
      </ScrollView>
      <WebViewModal
        visible={webViewVisible}
        url={businessStatus?.stripe_onboarding_link || ""}
        onClose={handleCloseWebView}
        title="Stripe Onboarding"
      />
    </View>
  );
}
