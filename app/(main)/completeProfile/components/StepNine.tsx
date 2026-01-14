import React, { useMemo, useState, useEffect } from "react";
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
  setBusinessServices,
} from "@/src/state/slices/completeProfileSlice";
import EditSubscriptionBottomSheet from "@/src/components/EditSubscriptionBottomSheet";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";

// Popular starting points suggestions - will be populated with first 2 services from Step 8
const getPopularSuggestions = (
  services: Array<{ id: string; name: string }>
) => {
  const firstTwoServiceIds = services.slice(0, 2).map((s) => s.id);

  return [
    {
      id: "basic_plan",
      packageName: "Basic Plan",
      servicesPerMonth: 2,
      price: 145.99,
      currency: "USD",
      serviceIds: firstTwoServiceIds,
    },
  ];
};

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
  const { subscriptions, businessServices } = useAppSelector(
    (state) => state.completeProfile
  );
  const [editSubscriptionVisible, setEditSubscriptionVisible] = useState(false);
  const [addSubscriptionVisible, setAddSubscriptionVisible] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    string | null
  >(null);
  // Store custom suggestions added via "+" button (not in Redux subscriptions)
  const [customSuggestions, setCustomSuggestions] = useState<
    Array<{
      id: string;
      packageName: string;
      servicesPerMonth: number;
      price: number;
      currency: string;
      serviceIds: string[];
    }>
  >([]);

  // Fetch business services on component mount
  useEffect(() => {
    fetchBusinessServices();
  }, []);

  const fetchBusinessServices = async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: Array<{
          id: number;
          template_id: number;
          price: string;
          description: string;
          duration_hours: number;
          duration_minutes: number;
          active: boolean;
          businessId: number;
          business: string;
          templateId: number;
          name: string;
          category: string;
          created_at: string;
          createdAt: string;
        }>;
      }>(businessEndpoints.services);

      if (response.success && response.data) {
        dispatch(setBusinessServices(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch business services:", error);
      // Silent fail - no loader/error shown as per requirement
    }
  };

  // Convert business services to service format for suggestions
  // Use id (business service id) for API calls
  const services = useMemo(() => {
    return businessServices.map((service) => ({
      id: service.id.toString(),
      name: service.name,
    }));
  }, [businessServices]);

  // Get popular suggestions with first 2 services from business services
  const predefinedSuggestions = useMemo(
    () => getPopularSuggestions(services),
    [services]
  );

  // Combine predefined and custom suggestions
  const popularSuggestions = useMemo(
    () => [...predefinedSuggestions, ...customSuggestions],
    [predefinedSuggestions, customSuggestions]
  );

  const handleSelectSuggestion = (
    suggestion: (typeof popularSuggestions)[0]
  ) => {
    const isSelected = subscriptions.some((s) => s.id === suggestion.id);
    if (isSelected) {
      dispatch(removeSubscription(suggestion.id));
    } else {
      dispatch(addSubscription(suggestion));
      // If it's a custom suggestion, remove it from customSuggestions
      setCustomSuggestions((prev) =>
        prev.filter((custom) => custom.id !== suggestion.id)
      );
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

  const handleOpenAddSubscription = () => {
    setAddSubscriptionVisible(true);
  };

  const handleCloseAddSubscription = () => {
    setAddSubscriptionVisible(false);
  };

  const handleAddCustomSuggestion = (subscription: {
    id: string;
    packageName: string;
    servicesPerMonth: number;
    price: number;
    currency: string;
    serviceIds: string[];
  }) => {
    setCustomSuggestions((prev) => [...prev, subscription]);
  };

  const getServiceNames = (serviceIds: string[]): string[] => {
    return serviceIds
      .map((id) => {
        // Find service in businessServices by id (business service id)
        const service = businessServices.find((s) => s.id.toString() === id);
        return service?.name;
      })
      .filter(Boolean) as string[];
  };

  // Filter out selected subscriptions from popular suggestions
  const unselectedSuggestions = popularSuggestions.filter(
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

      <View style={styles.popularSection}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.popularTitle}>Popular starting points:</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleOpenAddSubscription}
            style={{
              width: moderateWidthScale(20),
              height: moderateWidthScale(20),
              borderRadius: moderateWidthScale(20 / 2),
              backgroundColor: theme.orangeBrown,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Feather
              name="plus"
              size={moderateWidthScale(16)}
              color={theme.white}
            />
          </TouchableOpacity>
        </View>

        {unselectedSuggestions.length > 0 && (
          <>
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
          </>
        )}
      </View>

      <EditSubscriptionBottomSheet
        visible={editSubscriptionVisible}
        onClose={handleCloseEditSubscription}
        subscriptionId={editingSubscriptionId}
      />

      <EditSubscriptionBottomSheet
        visible={addSubscriptionVisible}
        onClose={handleCloseAddSubscription}
        subscriptionId={null}
        onAddCustomSuggestion={handleAddCustomSuggestion}
      />
    </View>
  );
}
