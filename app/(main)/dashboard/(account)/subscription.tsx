import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
  heightScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import Button from "@/src/components/button";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Skeleton } from "@/src/components/skeletons";
import RetryButton from "@/src/components/retryButton";
import { LinearGradient } from "expo-linear-gradient";

interface SubscriptionData {
  id: number;
  subscriptionPlanId: number;
  subscriptionPlan: string;
  subscriptionPlanPrice: string;
  subscriptionPlanType: string;
  subscriptionPlanDescription: string;
  userId: number;
  user: string;
  businessId: number;
  business: string;
  subscriber: string;
  visits: any;
  status: string;
  paymentDate: string | null;
  nextPaymentDate: string;
  remainingDays: number;
  stripePaymentIntentId: string;
  stripePaymentUrl: string;
  cardLastFour: string | null;
  createdAt: string;
  deleted_at: string | null;
  appointments: any[];
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    data: SubscriptionData[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

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
      borderRadius: moderateWidthScale(20),
      overflow: "hidden",
      marginBottom: moderateHeightScale(24),
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
      fontSize: fontSize.size28,
      fontFamily: fonts.fontExtraBold,
      color: theme.white,
      marginBottom: moderateHeightScale(8),
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
      fontSize: fontSize.size36,
      fontFamily: fonts.fontExtraBold,
      color: theme.white,
    },
    pricePeriod: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      opacity: 0.85,
      marginLeft: moderateWidthScale(4),
    },
    planDescription: {
      fontSize: fontSize.size14,
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
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(16),
      padding: moderateWidthScale(20),
      marginBottom: moderateHeightScale(12),
      borderWidth: 1,
      borderColor: theme.borderLight,
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
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(16),
    },
    infoRowLast: {
      marginBottom: 0,
    },
    infoIconContainer: {
      width: moderateWidthScale(40),
      height: moderateWidthScale(40),
      borderRadius: moderateWidthScale(10),
      backgroundColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(14),
    },
    infoIcon: {
      // Icon styling handled by Feather component
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(4),
    },
    infoValue: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(16),
    },
    daysRemainingCard: {
      backgroundColor: theme.lightGreen2,
      borderRadius: moderateWidthScale(16),
      padding: moderateWidthScale(20),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    daysRemainingLeft: {
      flex: 1,
    },
    daysRemainingLabel: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
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
      backgroundColor: theme.white,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonContainer: {
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(20),
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

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showBanner } = useNotificationContext();

  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isTrial = subscription?.cardLastFour === null;

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    setApiError(false);
    try {
      const response = await ApiService.get<SubscriptionResponse>(
        businessEndpoints.subscriptions("active")
      );

      if (
        response.success &&
        response.data?.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const firstSubscription = response.data.data[0];
        setSubscription(firstSubscription);
      } else {
        setError("No active subscription found");
        setApiError(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load subscription");
      setApiError(true);
      showBanner(
        "Error",
        err.message || "Failed to load subscription",
        "error",
        2500
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancelTrial = () => {
    if (!subscription) return;

    Alert.alert(
      "Cancel Trial",
      "Are you sure you want to cancel your free trial? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel Trial",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              const response = await ApiService.post<{
                success: boolean;
                message: string;
              }>(businessEndpoints.cancelTrial(subscription.id), {});

              if (response.success) {
                showBanner(
                  "Success",
                  "Trial cancelled successfully",
                  "success",
                  2500
                );
                await fetchSubscription();
              }
            } catch (err: any) {
              showBanner(
                "Error",
                err.message || "Failed to cancel trial",
                "error",
                2500
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatCardNumber = (lastFour: string | null) => {
    if (!lastFour) {
      return "Not added";
    }
    return `**** ${lastFour}`;
  };

  if (loading && !subscription) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <StackHeader title="Subscription" />
        <View style={styles.content}>
          <Skeleton screenType="BusinessPlans" styles={styles} />
        </View>
      </SafeAreaView>
    );
  }

  if (apiError) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <StackHeader title="Subscription" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <RetryButton onPress={fetchSubscription} loading={loading} />
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <StackHeader title="Subscription" />
        <View style={styles.emptyContainer}>
          <Feather
            name="credit-card"
            size={moderateWidthScale(64)}
            color={theme.lightGreen}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>No active subscription</Text>
          <Text style={styles.emptySubtext}>
            Subscribe to a plan to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Subscription" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card with Gradient */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={[theme.buttonBack, theme.darkGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>
                  {subscription.subscriptionPlan}
                </Text>
                <View style={styles.planPriceContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <Text style={styles.planPrice}>
                    {subscription.subscriptionPlanPrice}
                  </Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {subscription.status.toUpperCase()}
                </Text>
              </View>
            </View>
            {subscription.subscriptionPlanDescription && (
              <Text style={styles.planDescription}>
                {subscription.subscriptionPlanDescription}
              </Text>
            )}
          </LinearGradient>
        </View>

        {/* Days Remaining Card */}
        <View style={styles.daysRemainingCard}>
          <View style={styles.daysRemainingLeft}>
            <Text style={styles.daysRemainingLabel}>Days Remaining</Text>
            <Text style={styles.daysRemainingValue}>
              {subscription.remainingDays}
            </Text>
          </View>
          <View style={styles.daysRemainingIcon}>
            <Feather
              name="calendar"
              size={moderateWidthScale(28)}
              color={theme.buttonBack}
            />
          </View>
        </View>

        {/* Subscription Details */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Subscription Details</Text>
          <View style={[styles.infoCard, styles.shadow]}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Feather
                  name="calendar"
                  size={moderateWidthScale(20)}
                  color={theme.buttonBack}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Next Payment Date</Text>
                <Text style={styles.infoValue}>
                  {subscription.nextPaymentDate || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Feather
                  name="credit-card"
                  size={moderateWidthScale(20)}
                  color={theme.buttonBack}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Payment Method</Text>
                <Text style={styles.infoValue}>
                  {formatCardNumber(subscription.cardLastFour)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Feather
                  name="clock"
                  size={moderateWidthScale(20)}
                  color={theme.buttonBack}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Subscription Started</Text>
                <Text style={styles.infoValue}>
                  {subscription.createdAt || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cancel Trial Button */}
        {isTrial && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel Trial"
              onPress={handleCancelTrial}
              loading={cancelling}
              disabled={cancelling}
              backgroundColor={theme.red}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
