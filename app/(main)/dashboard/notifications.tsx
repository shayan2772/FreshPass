import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import DashboardHeader from "@/src/components/DashboardHeader";
import {
  NotificationBellOutlineIcon,
  ProposalDocumentIcon,
  MessageBubbleOutlineIcon,
} from "@/assets/icons";
import { ApiService } from "@/src/services/api";
import { notificationsEndpoints } from "@/src/services/endpoints";
import { Skeleton } from "@/src/components/skeletons";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type NotificationIconType = "notification" | "proposal" | "message";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  icon: NotificationIconType;
  isRead: boolean;
  highlight?: string;
  createdAt: string; // full ISO datetime e.g. "2024-01-17T09:30:00Z"
  apiId: number; // API notification ID for marking as read
};

type NotificationSection = {
  title: string;
  data: NotificationItem[];
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
      paddingTop: moderateHeightScale(20),
    },
    listContent: {
      paddingBottom: moderateHeightScale(20),
    },
    sectionHeader: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(12),
    },
    sectionContainer: {
      marginBottom: moderateHeightScale(24),
    },
    notificationRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: moderateHeightScale(14),
      gap: moderateWidthScale(12),
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    leftTimelineDotContainer: {
      width: moderateWidthScale(10),
    },
    timelineOuterDot: {
      width: moderateWidthScale(8),
      height: moderateWidthScale(8),
      borderRadius: moderateWidthScale(8 / 2),
      borderWidth: 2.2,
      borderColor: theme.orangeBrown,
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      width: moderateWidthScale(40),
      height: moderateWidthScale(40),
      borderRadius: moderateWidthScale(40 / 2),
      alignItems: "center",
      justifyContent: "center",
    },
    unreadIconContainer: {
      backgroundColor: theme.orangeBrown30,
    },
    readIconContainer: {
      backgroundColor: theme.lightGreen13,
    },
    contentContainer: {
      flex: 1,
    },
    rowHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(4),
    },
    notificationTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      flexShrink: 1,
      marginRight: moderateWidthScale(8),
    },
    timeText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen5,
    },
    messageText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    messageHighlight: {
      fontFamily: fonts.fontMedium,
    },
    loadingFooter: {
      paddingVertical: moderateHeightScale(20),
      alignItems: "center",
      justifyContent: "center",
    },
  });

type ApiNotification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Determine icon type from title
  const getIconType = (title: string): NotificationIconType => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("proposal")) {
      return "proposal";
    }
    if (lowerTitle.includes("message")) {
      return "message";
    }
    return "notification";
  };

  // Format time label
  const formatTimeLabel = (createdAt: string): string => {
    const now = dayjs();
    const created = dayjs(createdAt);
    const diffInMinutes = now.diff(created, "minute");
    const diffInHours = now.diff(created, "hour");
    const diffInDays = now.diff(created, "day");

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      // Format as date: DD/MM/YYYY
      const day = `${created.date()}`.padStart(2, "0");
      const month = `${created.month() + 1}`.padStart(2, "0");
      const year = created.year();
      return `${day}/${month}/${year}`;
    }
  };

  // Map API notification to NotificationItem
  const mapApiNotification = (apiNotif: ApiNotification): NotificationItem => {
    return {
      id: apiNotif.id.toString(),
      apiId: apiNotif.id,
      title: apiNotif.title,
      description: apiNotif.message,
      timeLabel: formatTimeLabel(apiNotif.created_at),
      icon: getIconType(apiNotif.title),
      isRead: apiNotif.is_read,
      createdAt: apiNotif.created_at,
    };
  };

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await ApiService.get<{
          success: boolean;
          message: string;
          data: {
            data: ApiNotification[];
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
          };
        }>(notificationsEndpoints.list({ page, per_page: 8 }));

        if (response.success && response.data) {
          const mappedNotifications =
            response.data.data.map(mapApiNotification);
          if (append) {
            setNotifications((prev) => [...prev, ...mappedNotifications]);
          } else {
            setNotifications(mappedNotifications);
          }
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.last_page);
        }
      } catch (error: any) {
        showBanner(
          "API Failed",
          error?.message || "Failed to fetch notifications",
          "error",
          2500
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [showBanner]
  );

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: number, itemId: string) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        message: string;
      }>(notificationsEndpoints.markAsRead(notificationId));

      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === itemId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to mark notification as read",
        "error",
        2500
      );
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && currentPage < totalPages) {
      fetchNotifications(currentPage + 1, true);
    }
  }, [loadingMore, currentPage, totalPages, fetchNotifications]);

  const sections = useMemo<NotificationSection[]>(() => {
    if (notifications.length === 0) {
      return [];
    }

    const today = new Date();

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const formatDateTitle = (date: Date) => {
      const yesterday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1
      );

      if (isSameDay(date, today)) {
        return "Today";
      }

      if (isSameDay(date, yesterday)) {
        return "Yesterday";
      }

      const day = `${date.getDate()}`.padStart(2, "0");
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Group notifications by calendar date derived from createdAt
    const grouped = new Map<string, NotificationItem[]>();
    notifications.forEach((item) => {
      const dateObj = new Date(item.createdAt);
      const key = `${dateObj.getFullYear()}-${`${
        dateObj.getMonth() + 1
      }`.padStart(2, "0")}-${`${dateObj.getDate()}`.padStart(2, "0")}`;
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    });

    // Sort dates descending (latest first)
    const sortedDates = Array.from(grouped.keys()).sort((a, b) =>
      a < b ? 1 : a > b ? -1 : 0
    );

    return sortedDates.map((isoDate) => {
      const dateObj = new Date(isoDate);
      const items = [...(grouped.get(isoDate) ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        title: formatDateTitle(dateObj),
        data: items,
      };
    });
  }, [notifications]);

  const renderIcon = (icon: NotificationIconType) => {
    switch (icon) {
      case "proposal":
        return (
          <ProposalDocumentIcon
            width={24}
            height={24}
            color={theme.darkGreen}
          />
        );
      case "message":
        return (
          <MessageBubbleOutlineIcon
            width={24}
            height={24}
            color={theme.darkGreen}
          />
        );
      default:
        return (
          <NotificationBellOutlineIcon
            width={24}
            height={24}
            color={theme.darkGreen}
          />
        );
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      {loading ? (
        <View style={styles.content}>
          <Skeleton screenType="Notifications" styles={styles} />
        </View>
      ) : (
        <SectionList
          style={styles.content}
          contentContainerStyle={styles.listContent}
          sections={sections}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.notificationRow}
              onPress={() => {
                if (!item.isRead) {
                  handleMarkAsRead(item.apiId, item.id);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconRow}>
                <View style={styles.leftTimelineDotContainer}>
                  {!item.isRead && <View style={styles.timelineOuterDot} />}
                </View>
                <View
                  style={[
                    styles.iconContainer,
                    item.isRead
                      ? styles.readIconContainer
                      : styles.unreadIconContainer,
                  ]}
                >
                  {renderIcon(item.icon)}
                </View>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.rowHeader}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.timeLabel}</Text>
                </View>
                <Text style={styles.messageText}>
                  {item.description}
                  {item.highlight && (
                    <Text style={styles.messageHighlight}>
                      {item.highlight}
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
