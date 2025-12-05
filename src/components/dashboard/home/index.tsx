import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Linking,
  AppState,
} from "react-native";
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
import { ApiService, checkInternetConnection } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { setBusinessStatus } from "@/src/state/slices/userSlice";
import WebViewModal from "@/src/components/webViewModal";
import RetryButton from "@/src/components/retryButton";
import BusinessPlansModal from "@/src/components/businessPlansModal";

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
      backgroundColor: theme.darkGreen,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(8),
    },
    stripeBannerText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.white,
      textAlign: "center",
      textDecorationLine: "underline",
      textDecorationColor: theme.white,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
  });

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const { showBanner } = useNotificationContext();
  const businessStatus = useAppSelector((state) => state.user.businessStatus);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [businessPlansModalVisible, setBusinessPlansModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isFetchingStripeLink, setIsFetchingStripeLink] = useState(false);
  const bannerAnimation = useRef(new Animated.Value(0)).current;

  const fetchBusinessStatusAPI = useCallback(
    async (options?: {
      showLoader?: boolean;
      showError?: boolean;
      onSuccess?: (data: any) => void;
    }) => {
      const { showLoader = true, showError = true, onSuccess } = options || {};

      if (showLoader) {
        setIsLoading(true);
      }
      setApiError(false);
      try {
        const response = await ApiService.get<{
          success: boolean;
          message: string;
          data: {
            onboarding_completed: boolean;
            current_step: number | null;
            next_step: number | null;
            business_category: {
              id: number;
              name: string;
            } | null;
            stripe_onboarding_status: string;
            stripe_onboarding_link: string | null;
            has_subscription: boolean;
            subscription_status: string;
          };
        }>(businessEndpoints.status);

        if (response.success && response.data) {
          dispatch(setBusinessStatus(response.data));
          setApiError(false);
          onSuccess?.(response.data);
          return response.data;
        }
        return null;
      } catch (error: any) {
        console.error("Failed to fetch business status:", error);
        setApiError(true);
        if (showError) {
          showBanner(
            "API Failed",
            error.message || "Failed to fetch business status",
            "error",
            2500
          );
        }
        throw error;
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [dispatch, showBanner]
  );

  const fetchBusinessStatus = useCallback(async () => {
    await fetchBusinessStatusAPI({
      showLoader: true,
      showError: true,
    });
  }, [fetchBusinessStatusAPI]);

  useFocusEffect(
    useCallback(() => {
      fetchBusinessStatus();
    }, [fetchBusinessStatus])
  );

  // Listen for app state changes to refresh when returning from browser
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground, refresh business status
        fetchBusinessStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchBusinessStatus]);

  const handleStripeOnboardingPress = async () => {
    // First check internet connection
    const hasInternet = await checkInternetConnection();
    if (!hasInternet) {
      showBanner(
        "No Internet Connection",
        "Please check your internet connection and try again",
        "error",
        2500
      );
      return;
    }

    // Fetch latest Stripe onboarding link
    setIsFetchingStripeLink(true);
    try {
      const businessData = await fetchBusinessStatusAPI({
        showLoader: false,
        showError: false,
        onSuccess: (data) => {
          // Open the link in browser after successful fetch
          if (data?.stripe_onboarding_link) {
            Linking.canOpenURL(data.stripe_onboarding_link)
              .then((canOpen) => {
                if (canOpen) {
                  Linking.openURL(data.stripe_onboarding_link || "");
                } else {
                  showBanner("Error", "Cannot open the link", "error", 2500);
                }
              })
              .catch((error: any) => {
                showBanner(
                  "Error",
                  error.message || "Failed to open link",
                  "error",
                  2500
                );
              });
          } else {
            showBanner(
              "Stripe Connect",
              "Stripe onboarding link is not available",
              "error",
              2500
            );
          }
        },
      });

      // If onSuccess didn't handle it (shouldn't happen, but just in case)
      if (businessData?.stripe_onboarding_link) {
        try {
          const canOpen = await Linking.canOpenURL(
            businessData.stripe_onboarding_link
          );
          if (canOpen) {
            await Linking.openURL(businessData.stripe_onboarding_link);
          } else {
            showBanner("Error", "Cannot open the link", "error", 2500);
          }
        } catch (error: any) {
          showBanner(
            "Error",
            error.message || "Failed to open link",
            "error",
            2500
          );
        }
      } else if (businessData && !businessData.stripe_onboarding_link) {
        showBanner(
          "Stripe Connect",
          "Stripe onboarding link is not available",
          "error",
          2500
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch Stripe onboarding link:", error);
      showBanner(
        "Error",
        error.message || "Failed to fetch Stripe onboarding link",
        "error",
        2500
      );
    } finally {
      setIsFetchingStripeLink(false);
    }
  };

  const handleBusinessSubscriptionPress = () => {
    setBusinessPlansModalVisible(true);
  };

  const handleCloseWebView = () => {
    setWebViewVisible(false);
  };

  const showStripeBanner =
    businessStatus?.onboarding_completed === true &&
    businessStatus?.stripe_onboarding_status === "pending";
  const showBusinessSubscriptipn =
    businessStatus?.onboarding_completed === true &&
    businessStatus?.stripe_onboarding_status === "completed" &&
    businessStatus?.has_subscription === false;
  const canGoOnline = !showStripeBanner && !showBusinessSubscriptipn;

  const animateBanner = useCallback(() => {
    Animated.sequence([
      Animated.timing(bannerAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(bannerAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(bannerAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(bannerAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bannerAnimation]);

  const handleToggleAttempt = useCallback(() => {
    if (!canGoOnline && (showStripeBanner || showBusinessSubscriptipn)) {
      animateBanner();
    }
  }, [canGoOnline, showStripeBanner, showBusinessSubscriptipn, animateBanner]);

  // Show loader only if businessStatus doesn't exist and is loading
  if (isLoading && !businessStatus && !apiError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeader canGoOnline={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  // Show retry button and empty state if API fails
  if (apiError && !isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeader canGoOnline={true} />
        <View style={styles.loaderContainer}>
          <RetryButton onPress={fetchBusinessStatus} loading={isLoading} />
        </View>
      </View>
    );
  }

  // Show loader only if businessStatus doesn't exist
  if (!businessStatus && !apiError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeader canGoOnline={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader
        canGoOnline={canGoOnline}
        onToggleAttempt={handleToggleAttempt}
      />
      {(showStripeBanner || showBusinessSubscriptipn) && (
        <Animated.View
          style={[
            styles.stripeBanner,
            {
              transform: [{ translateX: bannerAnimation }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={
              showStripeBanner
                ? handleStripeOnboardingPress
                : handleBusinessSubscriptionPress
            }
            activeOpacity={0.8}
            disabled={isFetchingStripeLink}
          >
            {isFetchingStripeLink ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: moderateWidthScale(8),
                }}
              >
                <ActivityIndicator size="small" color={theme.white} />
                <Text style={styles.stripeBannerText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.stripeBannerText}>
                {showStripeBanner
                  ? "Please complete your business stripe connect onboarding"
                  : "Please buy business plan"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
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
      <BusinessPlansModal
        visible={businessPlansModalVisible}
        onClose={() => setBusinessPlansModalVisible(false)}
      />
    </View>
  );
}
