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
      paddingHorizontal: moderateWidthScale(20),
    },
    contentContainer: {
      paddingVertical: moderateHeightScale(24),
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(16),
      padding: moderateWidthScale(20),
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: moderateHeightScale(20),
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    planName: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    planPrice: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontExtraBold,
      color: theme.buttonBack,
      marginBottom: moderateHeightScale(16),
    },
    planDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginBottom: moderateHeightScale(20),
      lineHeight: fontSize.size20,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    infoIcon: {
      marginRight: moderateWidthScale(12),
    },
    infoLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      width: widthScale(140),
    },
    infoValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(8),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(16),
    },
    statusActive: {
      backgroundColor: theme.lightGreen,
    },
    statusText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(16),
    },
    buttonContainer: {
      marginTop: moderateHeightScale(8),
    },
    cancelButton: {
      backgroundColor: theme.red,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
    },
    emptyText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
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

      if (response.success && response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Get the first item (last response)
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
                // Refresh subscription data
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
      return "****";
    }
    return `****${lastFour}`;
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
          <Text style={styles.emptyText}>No active subscription found</Text>
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
        <View style={[styles.card, styles.shadow]}>
          <View style={[styles.statusBadge, styles.statusActive]}>
            <Text style={styles.statusText}>
              {subscription.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.planName}>{subscription.subscriptionPlan}</Text>
          <Text style={styles.planPrice}>${subscription.subscriptionPlanPrice}</Text>

          {subscription.subscriptionPlanDescription && (
            <Text style={styles.planDescription}>
              {subscription.subscriptionPlanDescription}
            </Text>
          )}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Feather
              name="calendar"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Next Payment:</Text>
            <Text style={styles.infoValue}>
              {subscription.nextPaymentDate || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather
              name="clock"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Remaining Days:</Text>
            <Text style={styles.infoValue}>
              {subscription.remainingDays} days
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather
              name="credit-card"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Card:</Text>
            <Text style={styles.infoValue}>
              {formatCardNumber(subscription.cardLastFour)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather
              name="calendar"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {subscription.createdAt || "N/A"}
            </Text>
          </View>

          {isTrial && (
            <>
              <View style={styles.divider} />
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel Trial"
                  onPress={handleCancelTrial}
                  loading={cancelling}
                  disabled={cancelling}
                  backgroundColor={theme.red}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
