import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme, useAppSelector, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateWidthScale,
  moderateHeightScale,
  widthScale,
} from "@/src/theme/dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Button from "@/src/components/button";
import StackHeader from "@/src/components/StackHeader";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { fetchPaymentSheetParams } from "@/src/services/stripeService";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { fetchUserStatus } from "@/src/state/thunks/businessThunks";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
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
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    backButton: {
      padding: moderateWidthScale(8),
    },
    headerTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
    },
    businessInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    businessLogo: {
      width: widthScale(50),
      height: widthScale(50),
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.emptyProfileImage,
      marginRight: moderateWidthScale(12),
    },
    businessName: {
      flex: 1,
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
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
      position: "relative",
      overflow: "hidden",
    },
    planCardWithBadge: {
      borderColor: theme.borderLine,
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
    decorativeCircle: {
      position: "absolute",
      top: moderateHeightScale(-30),
      right: moderateWidthScale(-30),
      width: widthScale(120),
      height: widthScale(120),
      borderRadius: widthScale(60),
      backgroundColor: theme.lightBeige,
      opacity: 0.3,
    },
    planHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(16),
      position: "relative",
    },
    planIcon: {
      width: widthScale(40),
      height: widthScale(40),
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
    },
    planTitleContainer: {
      flex: 1,
    },
    planTitle: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
      textTransform:"capitalize"
    },
    planSubtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      flexDirection: "row",
      alignItems: "center",
    },
    starIcon: {
      marginLeft: moderateWidthScale(4),
    },
    pricingBadge: {
      backgroundColor: theme.buttonBack,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(12),
      alignItems: "center",
      minWidth: widthScale(100),
    },
    pricingAmount: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontExtraBold,
      color: theme.white,
      marginBottom: moderateHeightScale(2),
    },
    pricingPeriod: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.white,
    },
    monthlyTag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(6),
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(12),
    },
    monthlyTagIcon: {
      marginRight: moderateWidthScale(6),
    },
    monthlyTagText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    planDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginBottom: moderateHeightScale(16),
      lineHeight: fontSize.size20,
    },
    featuresContainer: {
      gap: moderateHeightScale(12),
      marginBottom: moderateHeightScale(20),
    },
    featureBlock: {
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(12),
      flexDirection: "row",
      alignItems: "center",
    },
    featureIcon: {
      marginRight: moderateWidthScale(10),
    },
    featureText: {
      flex: 1,
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    featureCheck: {
      marginLeft: moderateWidthScale(8),
    },
    serviceTag: {
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(6),
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: moderateHeightScale(8),
    },
    serviceTagIcon: {
      marginRight: moderateWidthScale(6),
    },
    serviceTagText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    bottomContainer: {
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(16),
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    subscribeButton: {
      marginTop: moderateHeightScale(8),
    },
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
    successIcon: {
      width: widthScale(80),
      height: widthScale(80),
      borderRadius: widthScale(40),
      backgroundColor: theme.lightGreen015,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateHeightScale(24),
    },
    successTitle: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      textAlign: "center",
      marginBottom: moderateHeightScale(12),
    },
    successMessage: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
      lineHeight: fontSize.size24,
    },
    processingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    processingContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(16),
      padding: moderateWidthScale(24),
      alignItems: "center",
      justifyContent: "center",
      minWidth: widthScale(120),
      minHeight: heightScale(120),
    },
    processingText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.text,
      marginTop: moderateHeightScale(16),
      textAlign: "center",
    },
  });

function CheckoutSubscriptionContent() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showBanner } = useNotificationContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const user = useAppSelector((state: any) => state.user);
  const params = useLocalSearchParams<{
    subscriptionId?: string;
    subscriptionName?: string;
    subscriptionPrice?: string;
    subscriptionOriginalPrice?: string;
    subscriptionVisits?: string;
    subscriptionInclusions?: string;
    businessId?: string;
    businessName?: string;
    businessLogo?: string;
  }>();

  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const subscriptionInclusions = useMemo(() => {
    if (!params.subscriptionInclusions) return [];
    try {
      return JSON.parse(params.subscriptionInclusions);
    } catch {
      return [];
    }
  }, [params.subscriptionInclusions]);

  const handleSubscribe = async () => {
    if (!params.subscriptionId) {
      showBanner(
        "Error",
        "Subscription ID is missing. Please try again.",
        "error",
        4000
      );
      return;
    }

    setIsSubscribing(true);

    try {
      const planId = parseInt(params.subscriptionId, 10);

      // Step 1: Fetch payment sheet parameters from backend
      const {
        paymentIntent,
        setupIntent,
        customerSessionClientSecret,
        ephemeralKey,
        customer,
      } = await fetchPaymentSheetParams(planId);

      // Step 2: Initialize payment sheet
      const paymentConfig: any = {
        merchantDisplayName: "Fresh Pass",
        customerId: customer,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user.name || undefined,
          email: user.email || undefined,
        },
        customFlow: false,
      };

      // Use CustomerSession (newer approach) if available, otherwise fall back to EphemeralKey
      if (customerSessionClientSecret) {
        paymentConfig.customerSessionClientSecret = customerSessionClientSecret;
      } else if (ephemeralKey) {
        paymentConfig.customerEphemeralKeySecret = ephemeralKey;
      } else {
        throw new Error(
          "Either customerSessionClientSecret or ephemeralKey must be provided"
        );
      }

      // Use paymentIntent for subscription payment, or setupIntent as fallback
      if (paymentIntent && paymentIntent.trim() !== "") {
        paymentConfig.paymentIntentClientSecret = paymentIntent;
      } else if (setupIntent && setupIntent.trim() !== "") {
        paymentConfig.setupIntentClientSecret = setupIntent;
      } else {
        throw new Error(
          "Either Payment Intent or Setup Intent must be provided"
        );
      }

      const { error: initError } = await initPaymentSheet(paymentConfig);

      if (initError) {
        throw new Error(initError.message || "Failed to initialize payment");
      }

      // Step 3: Present payment sheet to user
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // Payment was cancelled or failed
        if (!presentError.code?.includes("Canceled")) {
          showBanner(
            "Payment Failed",
            presentError.message || "Payment could not be completed",
            "error",
            4000
          );
        }
        // If user canceled, don't show error (silent cancel)
        return;
      }

      // Show processing loader
      setProcessingPayment(true);

      // Wait 2-3 seconds before showing success
      setTimeout(() => {
        setProcessingPayment(false);
        setPaymentSuccess(true);
        showBanner(
          "Success",
          "Payment successful! Your subscription will be activated.",
          "success",
          4000
        );

        dispatch(fetchUserStatus({ showError: true })).unwrap();
      }, 2500);
    } catch (err: any) {
      // Extract clean error message
      let errorMessage = "Failed to process payment";

      if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.error) {
        errorMessage = err.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showBanner("Payment Failed", errorMessage, "error", 4000);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleViewSubscriptions = () => {
    router.navigate("/(main)/dashboard/(account)/" as any);
    setTimeout(() => {
      const subscriptionPath =
        "/(main)/dashboard/(account)/subscriptionCustomer";
      router.push(subscriptionPath as any);
    }, 10);
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <StackHeader title="Subscription Plans" />

      {paymentSuccess ? (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather
              name="check-circle"
              size={moderateWidthScale(48)}
              color={theme.darkGreen}
            />
          </View>
          <Text style={styles.successTitle}>Congratulations!</Text>
          <Text style={styles.successMessage}>
            You have successfully subscribed to{" "}
            {params.subscriptionName || "this plan"}.{"\n\n"}
            Your subscription is now active and ready to use.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.plansContainer}
        >
          {/* Business Info */}
          {params.businessName && (
            <View style={styles.businessInfo}>
              {params.businessLogo ? (
                <Image
                  source={{ uri: params.businessLogo }}
                  style={styles.businessLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.businessLogo} />
              )}
              <Text style={styles.businessName}>{params.businessName}</Text>
            </View>
          )}

          {/* Subscription Plan Card */}
          <View
            style={[styles.planCard, styles.planCardWithBadge, styles.shadow]}
          >
            {/* Decorative Circle */}
            <View style={styles.decorativeCircle} />

            {/* Plan Header with Pricing Badge */}
            <View style={styles.planHeader}>
              <View style={styles.planIcon}>
                <Feather
                  name="star"
                  size={moderateWidthScale(20)}
                  color={theme.darkGreen}
                />
              </View>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planTitle}>
                  {params.subscriptionName || "Subscription Plan"}
                </Text>
                <View style={styles.planSubtitle}>
                  <Text style={styles.planSubtitle}>Premium Plan</Text>
                  <Feather
                    name="star"
                    size={moderateWidthScale(12)}
                    color={theme.orangeBrown}
                    style={styles.starIcon}
                  />
                </View>
              </View>
            </View>

            {/* Monthly Tag */}
            <View style={styles.monthlyTag}>
              <Feather
                name="calendar"
                size={moderateWidthScale(14)}
                color={theme.darkGreen}
                style={styles.monthlyTagIcon}
              />
              <Text style={styles.monthlyTagText}>
                Monthly Subscription Available
              </Text>
            </View>

            {/* Description */}
            {params.subscriptionName && (
              <Text style={styles.planDescription}>
                {params.subscriptionName} - Premium subscription plan with
                exclusive benefits
              </Text>
            )}

            {/* Features */}
            <View style={styles.featuresContainer}>
              {/* Visits Feature */}
              {params.subscriptionVisits && (
                <View style={styles.featureBlock}>
                  <Feather
                    name="calendar"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>
                    {params.subscriptionVisits}
                  </Text>
                  <Feather
                    name="check-circle"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                    style={styles.featureCheck}
                  />
                </View>
              )}

              {/* Included Services */}
              {subscriptionInclusions.length > 0 && (
                <View style={styles.featureBlock}>
                  <Feather
                    name="zap"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                    style={styles.featureIcon}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureText}>Included Services</Text>
                    {subscriptionInclusions
                      .slice(0, 1)
                      .map((inclusion: string, index: number) => (
                        <View key={index} style={styles.serviceTag}>
                          <Feather
                            name="check-circle"
                            size={moderateWidthScale(12)}
                            color={theme.darkGreen}
                            style={styles.serviceTagIcon}
                          />
                          <Text style={styles.serviceTagText}>
                            {inclusion.replace(/^\d+\.\s*/, "")}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {params.subscriptionPrice && (
                <View style={styles.pricingBadge}>
                  <Text style={styles.pricingAmount}>
                    ${parseFloat(params.subscriptionPrice).toFixed(2)} /mo
                  </Text>
                  <Text style={styles.pricingPeriod}>Monthly Subscription</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title={paymentSuccess ? "View Subscriptions" : "Subscribe"}
          onPress={paymentSuccess ? handleViewSubscriptions : handleSubscribe}
          loading={isSubscribing}
          disabled={isSubscribing}
          containerStyle={styles.subscribeButton}
        />
      </View>

      {/* Processing Payment Overlay */}
      {processingPayment && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.processingText}>Processing payment...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function CheckoutSubscription() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
    >
      <CheckoutSubscriptionContent />
    </StripeProvider>
  );
}
