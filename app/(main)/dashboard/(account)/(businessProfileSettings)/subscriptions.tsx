import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import Button from "@/src/components/button";
import { Skeleton } from "@/src/components/skeletons";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import {
  addSubscription,
  removeSubscription,
  setBusinessServices,
  setSubscriptions,
} from "@/src/state/slices/completeProfileSlice";
import EditSubscriptionBottomSheet from "@/src/components/EditSubscriptionBottomSheet";
import { useNotificationContext } from "@/src/contexts/NotificationContext";

interface ModuleSubscriptionService {
  id: number;
  name: string;
}

interface ModuleSubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  plan_type: string;
  active: boolean;
  visits: number;
  created_at: string;
  services: ModuleSubscriptionService[];
}

const formatPrice = (price: number, currency: string): string => {
  return `$${price.toFixed(2)} ${currency}`;
};

const getSuggestionIdForName = (name: string) => {
  const normalized = name.trim().toLowerCase();

  if (normalized === "vip glam package") {
    return "vip-glam-package";
  }
  if (normalized === "gold package") {
    return "gold-package";
  }
  if (normalized === "platinum package") {
    return "platinum-package";
  }
  if (normalized === "silver package") {
    return "silver-package";
  }

  return null;
};

// Popular starting points suggestions - will be populated with first 2 services
const getPopularSuggestions = (
  services: Array<{ id: string; name: string }>
) => {
  const firstTwoServiceIds = services.slice(0, 2).map((s) => s.id);

  return [
    {
      id: "vip-glam-package",
      packageName: "VIP Glam Package",
      servicesPerMonth: 2,
      price: 145.99,
      currency: "USD",
      serviceIds: firstTwoServiceIds,
    },
    {
      id: "gold-package",
      packageName: "Gold Package",
      servicesPerMonth: 3,
      price: 199.99,
      currency: "USD",
      serviceIds: firstTwoServiceIds,
    },
    {
      id: "platinum-package",
      packageName: "Platinum Package",
      servicesPerMonth: 4,
      price: 249.99,
      currency: "USD",
      serviceIds: firstTwoServiceIds,
    },
    {
      id: "silver-package",
      packageName: "Silver Package",
      servicesPerMonth: 2,
      price: 99.99,
      currency: "USD",
      serviceIds: firstTwoServiceIds,
    },
  ];
};

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
      gap: moderateHeightScale(20),
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
    subscriptionCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    subscriptionName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subscriptionCardContent: {
      marginTop: moderateHeightScale(12),
    },
    subscriptionDetailSection: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    popularSection: {},
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
    continueButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(24),
      paddingTop: moderateHeightScale(16),
    },
    // Styles for BusinessPlans skeleton
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
    },
    planHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(12),
    },
  });

export default function ManageSubscriptionsScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const { showBanner } = useNotificationContext();

  const { subscriptions, businessServices } = useAppSelector(
    (state) => state.completeProfile
  );

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editSubscriptionVisible, setEditSubscriptionVisible] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    string | null
  >(null);
  const [addSubscriptionVisible, setAddSubscriptionVisible] = useState(false);
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
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          subscription_plans: ModuleSubscriptionPlan[];
        };
      }>(businessEndpoints.moduleData("subscription-plans"));

      if (
        response.success &&
        response.data &&
        response.data.subscription_plans
      ) {
        const mapped = response.data.subscription_plans.map((plan) => {
          const suggestionId = getSuggestionIdForName(plan.name);

          return {
            // If this matches one of our default suggestions, use that id
            // so it is treated as "already selected" in the popular list
            id: suggestionId ?? plan.id.toString(),
            packageName: plan.name,
            servicesPerMonth: plan.visits,
            price: parseFloat(plan.price),
            currency: "USD",
            serviceIds: plan.services.map((service) => service.id.toString()),
          };
        });
        dispatch(setSubscriptions(mapped));
      } else {
        dispatch(setSubscriptions([]));
      }
    } catch (error: any) {
      console.error("Failed to fetch subscription plans module data:", error);
      showBanner(
        "Error",
        error?.message || "Failed to fetch subscription plans. Please try again.",
        "error",
        3000
      );
      dispatch(setSubscriptions([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessServices();
    fetchSubscriptions();
  }, []);

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

  const getServiceNames = (serviceIds: string[]): string[] => {
    return serviceIds
      .map((id) => {
        const service = businessServices.find(
          (s) => s.id.toString() === id
        );
        return service?.name;
      })
      .filter(Boolean) as string[];
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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = subscriptions.map((subscription) => ({
        name: subscription.packageName,
        description: subscription.packageName,
        price: subscription.price,
        visits: subscription.servicesPerMonth,
        plan_services: subscription.serviceIds.map((id) => Number(id)),
      }));

      const formData = new FormData();
      formData.append("subscription_plans", JSON.stringify(payload));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data?: any;
      }>(businessEndpoints.profile, formData, config);

      if (response.success) {
        showBanner(
          "Success",
          response.message || "Subscription plans updated successfully",
          "success",
          3000
        );
        router.back();
      } else {
        showBanner(
          "Error",
          response.message || "Failed to update subscription plans",
          "error",
          3000
        );
      }
    } catch (error: any) {
      console.error("Failed to update subscription plans:", error);
      showBanner(
        "Error",
        error?.message ||
          "Failed to update subscription plans. Please try again.",
        "error",
        3000
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter out selected subscriptions from popular suggestions
  const unselectedSuggestions = popularSuggestions.filter(
    (s) => !subscriptions.some((sub) => sub.id === s.id)
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Manage subscription list" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Skeleton screenType="BusinessPlans" styles={styles} />
        ) : (
          <>
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
                          onPress={() =>
                            handleEditSubscription(subscription.id)
                          }
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
                              {formatPrice(
                                subscription.price,
                                subscription.currency
                              )}
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
                          {serviceNames.map((serviceName, index) => (
                            <Text
                              key={index}
                              style={styles.subscriptionServiceItem}
                            >
                              {index + 1}. {serviceName}
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

              {unselectedSuggestions.length > 0 &&
                unselectedSuggestions.map((suggestion) => {
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
                          <Text style={styles.selectButtonText}>
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
      </ScrollView>

      {!loading && (
        <View style={styles.continueButtonContainer}>
          <Button
            title="Update"
            onPress={handleUpdate}
            disabled={isUpdating}
          />
        </View>
      )}

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
    </SafeAreaView>
  );
}


