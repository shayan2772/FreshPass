import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import Button from "@/src/components/button";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import {
  fetchPaymentSheetParams,
  initializePaymentSheet,
  presentPaymentSheetHelper,
} from "@/src/services/stripeService";
import { useAppSelector } from "@/src/hooks/hooks";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  planType: string;
  active: boolean;
  visits: number | null;
  createdAt: string;
  services: any[];
}

interface BusinessPlansModalProps {
  visible: boolean;
  onClose: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.background,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(16),
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    headerTitle: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      flex: 1,
    },
    closeButton: {
      padding: moderateWidthScale(8),
      marginLeft: moderateWidthScale(12),
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
    errorText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
      marginBottom: moderateHeightScale(16),
    },
    plansContainer: {
      gap: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(30),
    },
    planCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(16),
      padding: moderateWidthScale(20),
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    planHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(12),
    },
    planName: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      flex: 1,
    },
    planPrice: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontExtraBold,
      color: theme.buttonBack,
    },
    planDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginBottom: moderateHeightScale(16),
      lineHeight: fontSize.size20,
    },
    planDetails: {
      marginBottom: moderateHeightScale(20),
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
    },
    detailIcon: {
      marginRight: moderateWidthScale(8),
    },
    detailText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      flex: 1,
    },
    subscribeButton: {
      marginTop: moderateHeightScale(8),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
    emptyText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
    },
  });

function BusinessPlansModalContent({
  visible,
  onClose,
}: BusinessPlansModalProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const insets = useSafeAreaInsets();
  const { showBanner } = useNotificationContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const user = useAppSelector((state: any) => state.user);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(
    null
  );
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          data: SubscriptionPlan[];
        };
      }>(businessEndpoints.subscriptionPlans());

      if (response.success && response.data?.data) {
        setPlans(response.data.data);
      } else {
        setError("Failed to load subscription plans");
      }
    } catch (err: any) {
      console.error("Failed to fetch subscription plans:", err);
      setError(err.message || "Failed to load subscription plans");
      showBanner(
        "Error",
        err.message || "Failed to load subscription plans",
        "error",
        2500
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchPlans();
    }
  }, [visible]);

  const handleSubscribe = async (planId: number) => {
    setSubscribingPlanId(planId);
    setPaymentSheetReady(false);

    try {
      // Step 1: Fetch payment sheet parameters from backend
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams(planId);

      // Step 2: Initialize payment sheet
      const { error: initError } = await initializePaymentSheet(
        initPaymentSheet,
        {
          paymentIntent,
          ephemeralKey,
          customer,
          merchantDisplayName: "Fresh Pass",
          defaultBillingDetails: {
            name: user.name || undefined,
            email: user.email || undefined,
          },
          allowsDelayedPaymentMethods: true,
        }
      );

      if (initError) {
        throw new Error(initError.message || "Failed to initialize payment");
      }

      setPaymentSheetReady(true);

      // Step 3: Present payment sheet to user
      const result = await presentPaymentSheetHelper(presentPaymentSheet);

      if (result.success) {
        // Step 4: Payment successful - confirm subscription with backend
        try {
          const response = await ApiService.post<{
            success: boolean;
            message: string;
            data?: any;
          }>(businessEndpoints.subscribe(planId), {
            plan_id: planId,
          });

          if (response.success) {
            showBanner(
              "Success",
              response.message || "Subscription successful!",
              "success",
              3000
            );
            // Close modal after successful subscription
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            showBanner(
              "Error",
              response.message || "Payment successful but subscription failed",
              "error",
              2500
            );
          }
        } catch (confirmErr: any) {
          console.error("Failed to confirm subscription:", confirmErr);
          showBanner(
            "Error",
            "Payment successful but failed to confirm subscription. Please contact support.",
            "error",
            3000
          );
        }
      } else {
        // Payment was cancelled or failed
        if (result.error && !result.error.includes("canceled")) {
          showBanner(
            "Payment Failed",
            result.error || "Payment could not be completed",
            "error",
            2500
          );
        }
        // If user canceled, don't show error (silent cancel)
      }
    } catch (err: any) {
      console.error("Failed to process payment:", err);
      showBanner(
        "Error",
        err.message || "Failed to process payment",
        "error",
        2500
      );
    } finally {
      setSubscribingPlanId(null);
      setPaymentSheetReady(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={[styles.modalOverlay, { paddingTop: insets.top }]}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Business Plans</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Feather
              name="x"
              size={moderateWidthScale(24)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchPlans} />
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No subscription plans available
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.plansContainer}
          >
            {plans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>${plan.price}</Text>
                </View>
                {plan.description && (
                  <Text style={styles.planDescription}>{plan.description}</Text>
                )}
                <View style={styles.planDetails}>
                  {plan.visits !== null && (
                    <View style={styles.detailRow}>
                      <Feather
                        name="calendar"
                        size={moderateWidthScale(16)}
                        color={theme.darkGreen}
                        style={styles.detailIcon}
                      />
                      <Text style={styles.detailText}>
                        {plan.visits} visits included
                      </Text>
                    </View>
                  )}
                  {plan.services && plan.services.length > 0 && (
                    <View style={styles.detailRow}>
                      <Feather
                        name="check-circle"
                        size={moderateWidthScale(16)}
                        color={theme.darkGreen}
                        style={styles.detailIcon}
                      />
                      <Text style={styles.detailText}>
                        {plan.services.length} services included
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Feather
                      name="check-circle"
                      size={moderateWidthScale(16)}
                      color={theme.darkGreen}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      Active plan - Ready to use
                    </Text>
                  </View>
                </View>
                <Button
                  title="Subscribe Now"
                  onPress={() => handleSubscribe(plan.id)}
                  loading={subscribingPlanId === plan.id}
                  containerStyle={styles.subscribeButton}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export default function BusinessPlansModal({
  visible,
  onClose,
}: BusinessPlansModalProps) {
  const STRIPE_PUBLISHABLE_KEY =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <BusinessPlansModalContent visible={visible} onClose={onClose} />
      </StripeProvider>
    </Modal>
  );
}
