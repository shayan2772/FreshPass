/**
 * Stripe Payment Service
 * Handles Stripe payment integration using Payment Sheet
 */

import { initStripe, StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { ApiService } from "./api";
import { stripeEndpoints } from "./endpoints";

// Stripe Publishable Key from environment
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

/**
 * Initialize Stripe SDK
 * Call this once when app starts (e.g., in App.tsx or _layout.tsx)
 */
export const initializeStripe = async (): Promise<void> => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn("⚠️ Stripe publishable key is missing. Stripe functionality will not work.");
    return;
  }

  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: "merchant.com.freshpass", // iOS only - your merchant ID
    });
    console.log("✅ Stripe initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Stripe:", error);
    throw error;
  }
};

/**
 * Payment Sheet Parameters Response from Backend
 */
export interface PaymentSheetParams {
  paymentIntent: string; // Payment Intent client secret
  ephemeralKey: string; // Ephemeral key secret
  customer: string; // Customer ID
}

/**
 * Fetch Payment Sheet Parameters from Backend
 * This should call your backend API to get payment sheet parameters
 * @param planId - The subscription plan ID to create payment for
 */
export const fetchPaymentSheetParams = async (planId: number): Promise<PaymentSheetParams> => {
  try {
    const response = await ApiService.post<PaymentSheetParams>(
      stripeEndpoints.paymentSheet,
      {
        plan_id: planId,
      }
    );
    return response;
  } catch (error) {
    console.error("❌ Failed to fetch payment sheet params:", error);
    throw error;
  }
};

/**
 * Initialize Payment Sheet
 * Note: This function should be called from a component that has access to useStripe() hook
 * 
 * Example usage:
 * const { initPaymentSheet } = useStripe();
 * const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
 * const error = await initializePaymentSheet(initPaymentSheet, {
 *   paymentIntent,
 *   ephemeralKey,
 *   customer,
 *   merchantDisplayName: "Fresh Pass",
 * });
 */
export const initializePaymentSheet = async (
  stripeInitPaymentSheet: any,
  params: {
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
    merchantDisplayName?: string;
    defaultBillingDetails?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    };
    allowsDelayedPaymentMethods?: boolean;
  }
): Promise<{ error: any }> => {
  try {
    const { error } = await stripeInitPaymentSheet({
      merchantDisplayName: params.merchantDisplayName || "Fresh Pass",
      customerId: params.customer,
      customerEphemeralKeySecret: params.ephemeralKey,
      paymentIntentClientSecret: params.paymentIntent,
      allowsDelayedPaymentMethods: params.allowsDelayedPaymentMethods ?? true,
      defaultBillingDetails: params.defaultBillingDetails || {},
    });

    if (error) {
      console.error("❌ Payment sheet initialization error:", error);
      return { error };
    }

    return { error: null };
  } catch (error: any) {
    console.error("❌ Payment sheet initialization failed:", error);
    return { error };
  }
};

/**
 * Present Payment Sheet
 * Opens the payment sheet for user to complete payment
 * 
 * Example usage:
 * const { presentPaymentSheet } = useStripe();
 * const result = await presentPaymentSheetHelper(presentPaymentSheet);
 */
export const presentPaymentSheetHelper = async (
  stripePresentPaymentSheet: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await stripePresentPaymentSheet();

    if (error) {
      console.error("❌ Payment sheet presentation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Payment sheet presentation failed:", error);
    return {
      success: false,
      error: error.message || "Payment sheet presentation failed",
    };
  }
};

/**
 * Export Stripe Provider and Hook
 * Use StripeProvider to wrap your app or payment screens
 * 
 * Example usage in component:
 * 
 * import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
 * import { 
 *   fetchPaymentSheetParams, 
 *   initializePaymentSheet, 
 *   presentPaymentSheetHelper 
 * } from "@/src/services/stripeService";
 * import { useState, useEffect } from "react";
 * 
 * export default function CheckoutScreen() {
 *   const { initPaymentSheet, presentPaymentSheet } = useStripe();
 *   const [loading, setLoading] = useState(false);
 * 
 *   const initializePaymentSheetFlow = async () => {
 *     try {
 *       const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
 *       
 *       const { error } = await initializePaymentSheet(initPaymentSheet, {
 *         paymentIntent,
 *         ephemeralKey,
 *         customer,
 *         merchantDisplayName: "Fresh Pass",
 *         defaultBillingDetails: {
 *           name: "Jane Doe",
 *         },
 *         allowsDelayedPaymentMethods: true,
 *       });
 * 
 *       if (!error) {
 *         setLoading(true);
 *       }
 *     } catch (error) {
 *       console.error("Failed to initialize payment sheet:", error);
 *     }
 *   };
 * 
 *   const openPaymentSheet = async () => {
 *     const result = await presentPaymentSheetHelper(presentPaymentSheet);
 *     
 *     if (result.success) {
 *       console.log("Payment successful!");
 *       // Handle successful payment
 *     } else {
 *       console.error("Payment failed:", result.error);
 *       // Handle payment error
 *     }
 *   };
 * 
 *   useEffect(() => {
 *     initializePaymentSheetFlow();
 *   }, []);
 * 
 *   return (
 *     <View>
 *       <Button
 *         title="Checkout"
 *         disabled={!loading}
 *         onPress={openPaymentSheet}
 *       />
 *     </View>
 *   );
 * }
 */
export { StripeProvider, useStripe };
