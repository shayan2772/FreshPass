import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  AppState,
} from "react-native";
import { useTheme, useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import SummaryStats from "./components/SummaryStats";
import StaffOnDuty from "./components/StaffOnDuty";
import AppointmentsSection from "./components/AppointmentsSection";
import WorkHistory from "./components/WorkHistory";
import DashboardHeader from "../../DashboardHeader";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import RetryButton from "@/src/components/retryButton";
import { setUserDetails } from "@/src/state/slices/userSlice";
import { ApiService, checkInternetConnection } from "@/src/services/api";
import {
  userEndpoints,
  dashboardEndpoints,
  staffEndpoints,
  appointmentsEndpoints,
  notificationsEndpoints,
} from "@/src/services/endpoints";
import { fetchBusinessStatus } from "@/src/state/thunks/businessThunks";
import { Appointment } from "@/src/components/appointmentDetail";
import { setUnreadCount } from "@/src/state/slices/userSlice";

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
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
  });

interface DashboardStatsData {
  monthly_revenue: number;
  appointments: {
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  rating: {
    overall_rating: number;
  };
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const { showBanner } = useNotificationContext();
  const businessStatus = useAppSelector((state) => state.user.businessStatus);
  const isLoading = useAppSelector((state) => state.user.businessStatusLoading);
  const apiError = useAppSelector((state) => state.user.businessStatusError);

  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsData | null>(null);
  const [staffData, setStaffData] = useState<any[] | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[] | null>(null);
  const [appointmentsTotalCount, setAppointmentsTotalCount] = useState(0);
  const [workHistoryData, setWorkHistoryData] = useState<Appointment[] | null>(null);
  const [workHistoryTotalCount, setWorkHistoryTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleFetchBusinessStatus = async () => {
    try {
      await dispatch(fetchBusinessStatus({ showError: true })).unwrap();
    } catch (error: any) {
      showBanner(
        "API Failed",
        error || "Failed to fetch business status",
        "error",
        2500
      );
    }
  };

  const handleFetchUserDetails = async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          id: number;
          name: string;
          email: string;
          phone: string | null;
          country_code: string | null;
          email_notifications: boolean | null;
          profile_image_url: string | null;
        };
      }>(userEndpoints.details);

      if (response.success && response.data) {
        dispatch(
          setUserDetails({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            country_code: response.data.country_code,
            email_notifications: response.data.email_notifications,
            profile_image_url: response.data.profile_image_url,
          })
        );
      }
    } catch (error: any) {}
  };

  const handleFetchUnreadCount = async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          unread_count: number;
        };
      }>(notificationsEndpoints.unreadCount);

      if (response.success && response.data) {
        dispatch(setUnreadCount(response.data.unread_count));
      }
    } catch (error: any) {
      // Silent fail - no banner or console
    }
  };

  const handleFetchDashboardStats = async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: DashboardStatsData;
      }>(dashboardEndpoints.stats());

      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to fetch dashboard stats",
        "error",
        2500
      );
    }
  };

  const handleFetchStaff = async (active?: string) => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: Array<{
          id: number;
          user_id: number;
          name: string;
          email: string;
          business_id: number;
          active: number;
          description: string | null;
          invitation_token: string;
          completed_appointments_count: number;
          business: {
            id: number;
            title: string;
          };
          user: {
            id: number;
            name: string;
            email: string;
            email_notifications: boolean | null;
            profile_image_url: string | null;
            working_hours: any[];
          };
          created_at: string;
          createdAt: string;
        }>;
      }>(staffEndpoints.list(active));

      if (response.success && response.data) {
        setStaffData(response.data);
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to fetch staff details",
        "error",
        2500
      );
    }
  };

  const handleFetchAppointments = async () => {
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          data: Appointment[];
          meta: {
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
          };
        };
      }>(
        appointmentsEndpoints.list({
          status: "scheduled",
          per_page: 10,
          direction: "desc",
        })
      );

      if (response.success && response.data) {
        setAppointmentsData(response.data.data);
        setAppointmentsTotalCount(response.data.meta.total);
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to fetch appointments",
        "error",
        2500
      );
    }
  };

  const handleFetchWorkHistory = async () => {
    
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          data: Appointment[];
          meta: {
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
          };
        };
      }>(
        appointmentsEndpoints.list({
          status: "without_scheduled",
          per_page: 10,
          direction: "desc",
        })
      );

      if (response.success && response.data) {
        setWorkHistoryData(response.data.data);
        setWorkHistoryTotalCount(response.data.meta.total);
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to fetch work history",
        "error",
        2500
      );
    }  
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Check internet connection first
      const hasInternet = await checkInternetConnection();

      if (!hasInternet) {
        showBanner(
          "No Internet Connection",
          "Please check your internet connection and try again.",
          "error",
          2500
        );
        setRefreshing(false);
        return;
      }

      // Call all APIs in parallel
      await Promise.all([
        handleFetchBusinessStatus(),
        handleFetchUserDetails(),
        handleFetchDashboardStats(),
        handleFetchStaff("active"),
        handleFetchAppointments(),
        handleFetchWorkHistory(),
      ]);
    } catch (error: any) {
      // Error handling is done in individual functions
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    handleFetchBusinessStatus();
    handleFetchUserDetails();
    handleFetchUnreadCount();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        handleFetchBusinessStatus();
        handleFetchUnreadCount();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Show loader only if businessStatus doesn't exist and is loading
  if (isLoading && !businessStatus && !apiError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeader />
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
        <DashboardHeader />
        <View style={styles.loaderContainer}>
          <RetryButton
            onPress={handleFetchBusinessStatus}
            loading={isLoading}
          />
        </View>
      </View>
    );
  }

  // Show loader only if businessStatus doesn't exist
  if (!businessStatus && !apiError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeader />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Summary Statistics */}
        <View style={styles.statsContainer}>
          <SummaryStats
            callApi={handleFetchDashboardStats}
            data={dashboardStats}
          />
        </View>

        {/* Staff on Duty - Full Width */}
        <StaffOnDuty
          data={staffData}
          // callApi={() => handleFetchStaff()}
          callApi={() => handleFetchStaff("active")}
        />

        {/* Appointments */}
        <View style={styles.appointmentsContainer}>
          <AppointmentsSection
            data={appointmentsData}
            totalCount={appointmentsTotalCount}
            callApi={handleFetchAppointments}
          />
        </View>

        <View style={styles.line} />

        {/* Work History */}
        <View style={styles.workHistoryContainer}>
          <WorkHistory
            data={workHistoryData}
            totalCount={workHistoryTotalCount}
            callApi={handleFetchWorkHistory}
          />
        </View>
      </ScrollView>
    </View>
  );
}
