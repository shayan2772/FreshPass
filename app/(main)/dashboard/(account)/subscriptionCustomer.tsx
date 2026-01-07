import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { useRouter } from "expo-router";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { Feather } from "@expo/vector-icons";
import { Skeleton } from "@/src/components/skeletons";
import RetryButton from "@/src/components/retryButton";
import { Dropdown } from "react-native-element-dropdown";

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
  visits: {
    used: number;
    upcoming: number;
    total: number;
    remaining: number;
  };
  status: string;
  paymentDate: string | null;
  nextPaymentDate: string;
  remainingDays: number;
  stripePaymentIntentId: string | null;
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
    contentContainer: {
      paddingBottom: moderateHeightScale(30),
    },
    subscriptionCard: {
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(16),
      borderRadius: moderateWidthScale(12),
      backgroundColor: theme.orangeBrown015,
      padding: moderateWidthScale(18),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    planTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: moderateWidthScale(10),
    },
    starIcon: {
      marginRight: moderateWidthScale(8),
    },
    planTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      textTransform: "capitalize",
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(12),
      backgroundColor: "#FFD700",
    },
    statusText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      letterSpacing: 0.5,
    },
    topSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(10),
    },
    userInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    userIcon: {
      marginRight: moderateWidthScale(6),
    },
    userText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      opacity: 0.8,
    },
    priceBadge: {
      backgroundColor: theme.buttonBack,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(10),
      borderRadius: moderateWidthScale(10),
      alignItems: "center",
    },
    priceText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    planPriceLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      marginTop: moderateHeightScale(2),
      opacity: 0.9,
    },
    descriptionText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(14),
      opacity: 0.7,
    },
    usageSection: {
      marginTop: moderateHeightScale(14),
      marginBottom: moderateHeightScale(14),
      paddingTop: moderateHeightScale(14),
      borderTopWidth: 1,
      borderTopColor: theme.lightGreen05,
    },
    usageHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    usageTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginLeft: moderateWidthScale(8),
      flex: 1,
    },
    checkIcon: {
      marginLeft: moderateWidthScale(6),
    },
    usageStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: moderateHeightScale(8),
    },
    usageItem: {
      alignItems: "center",
      flex: 1,
      paddingVertical: moderateHeightScale(10),
      backgroundColor: theme.lightGreen05,
      borderRadius: moderateWidthScale(8),
      marginHorizontal: moderateWidthScale(3),
    },
    usageLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
      opacity: 0.7,
    },
    usageValue: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    nextRenewalSection: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: moderateHeightScale(14),
      marginBottom: moderateHeightScale(14),
      paddingTop: moderateHeightScale(14),
      borderTopWidth: 1,
      borderTopColor: theme.lightGreen05,
    },
    nextRenewalLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginLeft: moderateWidthScale(8),
      letterSpacing: 0.5,
    },
    nextRenewalDate: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginLeft: moderateWidthScale(10),
    },
    cancelButton: {
      backgroundColor: theme.red,
      paddingVertical: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(20),
      borderRadius: moderateWidthScale(8),
      alignSelf: "center",
      marginTop: moderateHeightScale(4),
      width: "100%",
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.white,
      letterSpacing: 0.5,
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
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      textAlign: "center",
      marginBottom: moderateHeightScale(8),
    },
    emptySubtext: {
      fontSize: fontSize.size15,
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
    footerLoader: {
      paddingVertical: moderateHeightScale(20),
      alignItems: "center",
    },
    headerDescription: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      marginBottom: moderateHeightScale(24),
      opacity: 0.75,
      lineHeight: fontSize.size22,
    },
    headerRow: {
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      marginBottom: moderateHeightScale(24),
    },
    headerDescriptionRow: {  
      
    },
    filterDropdown: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(8),
      width:140,
      alignSelf:"flex-end"
    },
    filterDropdownText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    filterDropdownContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.borderLine,
      marginTop: moderateHeightScale(4),
    },
    filterDropdownItem: {
      paddingVertical: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    filterDropdownItemText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    filterDropdownItemTextSelected: {
      fontFamily: fonts.fontBold,
      color: theme.orangeBrown,
    },
  });

export default function subscriptionCustomer() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showBanner } = useNotificationContext();

  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const fetchSubscriptions = useCallback(
    async (page: number = 1, append: boolean = false, status?: string) => {
      const filterStatus = status !== undefined ? status : statusFilter;
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      setApiError(false);

      try {
        const statusParam = filterStatus === "all" ? undefined : filterStatus;
        const baseUrl = businessEndpoints.subscriptions(statusParam);
        // Use ? if no query params exist, otherwise use &
        const separator = baseUrl.includes("?") ? "&" : "?";
        const response = await ApiService.get<SubscriptionResponse>(
          `${baseUrl}${separator}page=${page}&per_page=10`
        );

        if (response.success && response.data?.data) {
          if (append) {
            setSubscriptions((prev) => [...prev, ...response.data.data]);
          } else {
            setSubscriptions(response.data.data);
          }
          setCurrentPage(response.data.meta.current_page);
          setTotalPages(response.data.meta.last_page);
        } else {
          if (!append) {
            setError("No subscriptions found");
            setApiError(true);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load subscriptions");
        setApiError(true);
        if (!append) {
          showBanner(
            "Error",
            err.message || "Failed to load subscriptions",
            "error",
            2500
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [showBanner, statusFilter]
  );

  useEffect(() => {
    fetchSubscriptions(1, false);
  }, [statusFilter]);

  const handleStatusFilterChange = useCallback(
    (status: string) => {
      // Reset data when filter changes
      setSubscriptions([]);
      setCurrentPage(1);
      setTotalPages(1);
      setStatusFilter(status);
      // useEffect will handle the API call when statusFilter changes
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && currentPage < totalPages) {
      fetchSubscriptions(currentPage + 1, true);
    }
  }, [loadingMore, currentPage, totalPages, fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    (subscription: SubscriptionData) => {
      Alert.alert(
        "Cancel Subscription",
        `Are you sure you want to cancel your "${subscription.subscriptionPlan}" subscription?`,
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes, Cancel",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await ApiService.patch<{
                  success: boolean;
                  message: string;
                  data: {};
                }>(businessEndpoints.cancelSubscription(subscription.id), {});

                if (response.success) {
                  showBanner(
                    "Success",
                    "Subscription cancelled successfully",
                    "success",
                    2500
                  );
                  // Clear data and fetch page 1
                  setSubscriptions([]);
                  setCurrentPage(1);
                  setTotalPages(1);
                  await fetchSubscriptions(1, false);
                } else {
                  showBanner(
                    "Error",
                    response.message || "Failed to cancel subscription",
                    "error",
                    2500
                  );
                }
              } catch (err: any) {
                showBanner(
                  "Error",
                  err.message || "Failed to cancel subscription",
                  "error",
                  2500
                );
              }
            },
          },
        ],
        { cancelable: true }
      );
    },
    [showBanner, fetchSubscriptions]
  );

  const renderItem = useCallback(
    ({ item }: { item: SubscriptionData }) => {
      return (
        <View style={styles.subscriptionCard}>
          {/* Header: Plan Name and Status */}
          <View style={styles.cardHeader}>
            <View style={styles.planTitleRow}>
              <Feather
                name="star"
                size={moderateWidthScale(18)}
                color={theme.orangeBrown}
                style={styles.starIcon}
              />
              <Text style={styles.planTitle}>{item.subscriptionPlan}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>

          {/* User Info and Price Badge */}
          <View style={styles.topSection}>
            <View style={styles.userInfoRow}>
              <Feather
                name="user"
                size={moderateWidthScale(16)}
                color={theme.darkGreen}
                style={styles.userIcon}
              />
              <Text style={styles.userText}>{item.business}</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                ${item.subscriptionPlanPrice}/mo
              </Text>
              <Text style={styles.planPriceLabel}>Plan Price</Text>
            </View>
          </View>

          {/* Description */}
          {item.subscriptionPlanDescription && (
            <Text style={styles.descriptionText}>
              {item.subscriptionPlanDescription}
            </Text>
          )}

          {/* Usage Section */}
          <View style={styles.usageSection}>
            <View style={styles.usageHeader}>
              <Feather
                name="zap"
                size={moderateWidthScale(16)}
                color={theme.orangeBrown}
              />
              <Text style={styles.usageTitle}>
                {item.visits.total} Visits Per Month
              </Text>
              <Feather
                name="check"
                size={moderateWidthScale(16)}
                color={theme.buttonBack}
                style={styles.checkIcon}
              />
            </View>
            <View style={styles.usageStats}>
              <View style={styles.usageItem}>
                <Text style={styles.usageLabel}>Used</Text>
                <Text style={styles.usageValue}>{item.visits.used}</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={styles.usageLabel}>Upcoming</Text>
                <Text style={styles.usageValue}>{item.visits.upcoming}</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={styles.usageLabel}>Left</Text>
                <Text style={styles.usageValue}>{item.visits.remaining}</Text>
              </View>
            </View>
          </View>

          {/* Next Renewal */}
          <View style={styles.nextRenewalSection}>
            <Feather
              name="calendar"
              size={moderateWidthScale(16)}
              color={theme.darkGreen}
            />
            <Text style={styles.nextRenewalLabel}>NEXT RENEWAL</Text>
            <Text style={styles.nextRenewalDate}>{item.nextPaymentDate}</Text>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelSubscription(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [styles, theme, handleCancelSubscription]
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.buttonBack} />
      </View>
    );
  }, [loadingMore, styles.footerLoader, theme.buttonBack]);

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const renderFilterItem = useCallback(
    (item: { label: string; value: string }) => {
      const isSelected = item.value === statusFilter;
      return (
        <View style={styles.filterDropdownItem}>
          <Text
            style={[
              styles.filterDropdownItemText,
              isSelected && styles.filterDropdownItemTextSelected,
            ]}
          >
            {item.label}
          </Text>
        </View>
      );
    },
    [statusFilter, styles]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerRow}>
        <View style={styles.headerDescriptionRow}>
          <Text style={styles.headerDescription}>
            Manage your active subscriptions and billing information here.
          </Text>
        </View>
        <Dropdown
          style={styles.filterDropdown}
          containerStyle={styles.filterDropdownContainer}
          activeColor={theme.orangeBrown015}
          showsVerticalScrollIndicator={false}
          dropdownPosition="auto"
          placeholderStyle={styles.filterDropdownText}
          selectedTextStyle={styles.filterDropdownText}
          data={statusOptions}
          maxHeight={moderateHeightScale(200)}
          labelField="label"
          valueField="value"
          placeholder="Status"
          value={statusFilter}
          onChange={(item) => handleStatusFilterChange(item.value)}
          renderItem={renderFilterItem}
          renderRightIcon={() => (
            <Feather
              name="chevron-down"
              size={moderateWidthScale(16)}
              color={theme.darkGreen}
            />
          )}
        />
      </View>
    );
  }, [
    styles,
    statusFilter,
    statusOptions,
    handleStatusFilterChange,
    renderFilterItem,
    theme,
  ]);

  const getEmptyText = useCallback((filter: string) => {
    const filterLabels: { [key: string]: string } = {
      all: "No subscriptions",
      active: "No active subscriptions",
      pending: "No pending subscriptions",
      paused: "No paused subscriptions",
      expired: "No expired subscriptions",
      cancelled: "No cancelled subscriptions",
    };
    return filterLabels[filter] || "No subscriptions";
  }, []);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <Skeleton screenType="BusinessPlans" styles={styles} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="credit-card"
          size={moderateWidthScale(64)}
          color={theme.lightGreen}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>{getEmptyText(statusFilter)}</Text>
        <Text style={styles.emptySubtext}>
          Manage your active subscriptions and billing information here.
        </Text>
      </View>
    );
  }, [loading, styles, theme, statusFilter, getEmptyText]);

  if (apiError && !loading) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <StackHeader title="Subscriptions" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <RetryButton
            onPress={() => fetchSubscriptions(1, false)}
            loading={loading}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Subscriptions" />
      <FlatList
        data={subscriptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
