import React, { useMemo, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import { fetchBusinessStatus } from "@/src/state/thunks/businessThunks";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import RetryButton from "@/src/components/retryButton";

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

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const { showBanner } = useNotificationContext();
  const businessStatus = useAppSelector((state) => state.user.businessStatus);
  const isLoading = useAppSelector((state) => state.user.businessStatusLoading);
  const apiError = useAppSelector((state) => state.user.businessStatusError);

  const handleFetchBusinessStatus = useCallback(async () => {
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
  }, [dispatch, showBanner]);

  useFocusEffect(
    useCallback(() => {
      handleFetchBusinessStatus();
    }, [handleFetchBusinessStatus])
  );

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
      >
        {/* Summary Statistics */}
        <View style={styles.statsContainer}>
          <SummaryStats />
        </View>

        {/* Staff on Duty - Full Width */}
        <StaffOnDuty />

        {/* Appointments */}
        <View style={styles.appointmentsContainer}>
          <AppointmentsSection />
        </View>

        <View style={styles.line} />

        {/* Work History */}
        <View style={styles.workHistoryContainer}>
          <WorkHistory />
        </View>
      </ScrollView>
    </View>
  );
}
