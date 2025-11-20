import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import {
  addSubscription,
  removeSubscription,
} from "@/src/state/slices/completeProfileSlice";
import EditSubscriptionBottomSheet from "@/src/components/EditSubscriptionBottomSheet";

// Popular starting points suggestions
const POPULAR_SUGGESTIONS = [
  {
    id: "vip-glam-package",
    packageName: "VIP Glam Package",
    servicesPerMonth: 2,
    price: 145.99,
    currency: "USD",
    serviceIds: ["premium-haircut-1", "styling-service-1"],
  },
  {
    id: "gold-package",
    packageName: "Gold Package",
    servicesPerMonth: 3,
    price: 199.99,
    currency: "USD",
    serviceIds: ["premium-haircut-2", "styling-service-2"],
  },
  {
    id: "platinum-package",
    packageName: "Platinum Package",
    servicesPerMonth: 4,
    price: 249.99,
    currency: "USD",
    serviceIds: ["premium-haircut-3", "styling-service-3"],
  },
  {
    id: "silver-package",
    packageName: "Silver Package",
    servicesPerMonth: 2,
    price: 99.99,
    currency: "USD",
    serviceIds: ["premium-haircut-4", "styling-service-4"],
  },
];

// More suggestions for bottom sheet
const MORE_SUGGESTIONS = [
  {
    id: "premium-package",
    packageName: "Premium Package",
    servicesPerMonth: 5,
    price: 299.99,
    currency: "USD",
    serviceIds: ["premium-haircut-5", "styling-service-5"],
  },
  {
    id: "basic-package",
    packageName: "Basic Package",
    servicesPerMonth: 1,
    price: 49.99,
    currency: "USD",
    serviceIds: ["premium-haircut-6", "styling-service-6"],
  },
];

// Service suggestions (for displaying service names)
const SERVICE_SUGGESTIONS = [
  { id: "haircut-blowdry", name: "Haircut & blowdry" },
  { id: "classic-manicure", name: "Classic manicure" },
  { id: "60-min-massage", name: "60-minute massage" },
  { id: "all-over", name: "All over" },
  { id: "female-haircut", name: "Female haircut" },
  { id: "deep-conditioning", name: "Deep conditioning treatment" },
  { id: "hair-styling", name: "Hair styling" },
  { id: "silk-press", name: "Silk press" },
  { id: "full-highlights", name: "Full highlights" },
  { id: "balayage", name: "Balayage" },
];

const formatPrice = (price: number, currency: string): string => {
  return `$${price.toFixed(2)} ${currency}`;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(20),
      paddingHorizontal: moderateWidthScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap: moderateHeightScale(5),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateHeightScale(20),
    },
    emptyStateText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen4,
    },
    popularSection: {
      // gap: moderateHeightScale(12),
    },
    popularTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.lightGreen4,
    },
    suggestionSeparator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.borderLight,
    },
    suggestionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: moderateHeightScale(15),
    },
    suggestionText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    selectButton: {
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(4),
    },
    selectButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    selectedButton: {
      backgroundColor: theme.orangeBrown,
      borderColor: theme.orangeBrown,
    },
    viewMoreButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(16),
      width: "100%",
      backgroundColor: theme.grey15,
      borderRadius: moderateWidthScale(12),
    },
    viewMoreButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subscriptionsContainer: {
      gap: moderateHeightScale(16),
    },
    subscriptionCard: {
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.white,
      borderWidth: 0.5,
      borderColor: theme.borderLight,
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      paddingVertical: moderateHeightScale(14),
      paddingHorizontal: moderateWidthScale(16),
    },
    subscriptionSeparator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.borderLight,
    },
   
    subscriptionInfo: {
      flex: 1,
      gap: moderateHeightScale(3),
    },
    subscriptionName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subscriptionDetails: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    subscriptionPrice: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    editButton: {
      marginLeft: moderateWidthScale(8),
    },
    subscriptionCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    subscriptionCardContent: {
      marginTop: moderateHeightScale(12),
     
    },
    subscriptionDetailSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      // marginBottom: moderateHeightScale(12),
    },
    subscriptionDetailTitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    subscriptionDetailPrice: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    subscriptionPriceText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subscriptionServicesList: {
      marginTop: moderateHeightScale(6),
      gap: moderateHeightScale(2),
    },
    subscriptionServiceItem: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function StepNine() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const { subscriptions, services } = useAppSelector(
    (state) => state.completeProfile
  );
  const [editSubscriptionVisible, setEditSubscriptionVisible] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    string | null
  >(null);

  const handleSelectSuggestion = (
    suggestion: (typeof POPULAR_SUGGESTIONS)[0]
  ) => {
    const isSelected = subscriptions.some((s) => s.id === suggestion.id);
    if (isSelected) {
      dispatch(removeSubscription(suggestion.id));
    } else {
      dispatch(addSubscription(suggestion));
    }
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    dispatch(removeSubscription(subscriptionId));
  };

  const handleEditSubscription = (subscriptionId: string) => {
    setEditingSubscriptionId(subscriptionId);
    setEditSubscriptionVisible(true);
  };

  const handleCloseEditSubscription = () => {
    setEditSubscriptionVisible(false);
    setEditingSubscriptionId(null);
  };

  const getServiceNames = (serviceIds: string[]): string[] => {
    return serviceIds
      .map((id) => {
        // First try to find in Redux services
        const service = services.find((s) => s.id === id);
        if (service) return service.name;

        // If not found, check service suggestions
        const suggestion = SERVICE_SUGGESTIONS.find((s) => s.id === id);
        return suggestion?.name;
      })
      .filter(Boolean) as string[];
  };

  // Filter out selected subscriptions from popular suggestions
  const unselectedSuggestions = POPULAR_SUGGESTIONS.filter(
    (s) => !subscriptions.some((sub) => sub.id === s.id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>Create subscription plans</Text>
        <Text style={styles.subtitle}>
          Offer monthly memberships to attract loyal customers and secure
          recurring revenue.
        </Text>
      </View>

      {subscriptions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You haven't added any subscription yet
          </Text>
        </View>
      ) : (
        <View style={styles.subscriptionsContainer}>
          {subscriptions.map((subscription) => {
            const serviceNames = getServiceNames(subscription.serviceIds);
            return (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionCardHeader}>
                  <Text style={styles.subscriptionName}>
                    {subscription.packageName}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: moderateWidthScale(50),
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                    onPress={() => handleEditSubscription(subscription.id)}
                  >
                    <Feather
                      name="chevron-right"
                      size={moderateWidthScale(20)}
                      color={theme.darkGreen}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.subscriptionSeparator} />
                <View style={styles.subscriptionCardContent}>
                  <View style={styles.subscriptionDetailSection}>
                    <Text style={styles.subscriptionDetailTitle}>
                      Subscription detail
                    </Text>
                    <View style={styles.subscriptionDetailPrice}>
                      <Text style={styles.subscriptionPriceText}>
                        {formatPrice(subscription.price, subscription.currency)}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteSubscription(subscription.id)
                        }
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={moderateWidthScale(19)}
                          color={theme.red}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.subscriptionServicesList}>
                    {serviceNames.map((serviceName, serviceIndex) => (
                      <Text
                        key={serviceIndex}
                        style={styles.subscriptionServiceItem}
                      >
                        {serviceIndex + 1}. {serviceName}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {unselectedSuggestions.length > 0 && (
        <>
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>Popular starting points:</Text>
            {unselectedSuggestions.map((suggestion) => {
              const isSelected = subscriptions.some(
                (s) => s.id === suggestion.id
              );
              return (
                <View key={suggestion.id}>
                  <TouchableOpacity
                    onPress={() => handleSelectSuggestion(suggestion)}
                    activeOpacity={0.7}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>
                      {suggestion.packageName}
                    </Text>
                    <View
                      style={[
                        styles.selectButton,
                        isSelected && styles.selectedButton,
                      ]}
                    >
                      {isSelected && (
                        <Feather
                          name="check"
                          size={moderateWidthScale(12)}
                          color={theme.darkGreen}
                        />
                      )}
                      <Text style={[styles.selectButtonText]}>
                        {isSelected ? "Selected" : "Select"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.suggestionSeparator} />
                </View>
              );
            })}
          </View>
        </>
      )}

      <EditSubscriptionBottomSheet
        visible={editSubscriptionVisible}
        onClose={handleCloseEditSubscription}
        subscriptionId={editingSubscriptionId}
      />
    </View>
  );
}
