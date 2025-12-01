import React, { useMemo } from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
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
      gap:2
    },
    leftTimelineDotContainer: {
      width: moderateWidthScale(10),
    },
    timelineOuterDot: {
      width: moderateWidthScale(8),
      height: moderateWidthScale(8),
      borderRadius: moderateWidthScale(8/2),
      borderWidth: 2.2,
      borderColor: theme.orangeBrown,
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      width: moderateWidthScale(40),
      height: moderateWidthScale(40),
      borderRadius: moderateWidthScale(40/2),
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
  });

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const sections = useMemo<NotificationSection[]>(() => {
    // TODO: Replace this static array with API data
    const notifications: NotificationItem[] = [
      {
        id: "1",
        title: "Notification",
        description:
          "Booking confirmed! Can’t wait to give you the Freshpass experience.",
        timeLabel: "15 min ago",
        icon: "notification",
        isRead: false,
        createdAt: "2025-12-01T09:30:00Z",
      },
      {
        id: "2",
        title: "Proposal Alert",
        description:
          "Thank you for reaching out and securing your booking with ",
        highlight: "Brentley Robinson.",
        timeLabel: "4 hr ago",
        icon: "proposal",
        isRead: false,
        createdAt: "2025-12-01T08:30:00Z",
      },
      {
        id: "3",
        title: "Message",
        description: "You’ve received a new from ",
        highlight: "Henry Benyamin.",
        timeLabel: "16/01/2024",
        icon: "message",
        isRead: true,
        createdAt: "2025-11-30T09:30:00Z",
      },
      {
        id: "4",
        title: "Message",
        description: "You’ve received a new from ",
        highlight: "Brentley Robinson.",
        timeLabel: "13/01/2024",
        icon: "message",
        isRead: true,
        createdAt: "2025-11-30T08:30:00Z",
      },
    ];

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
  }, []);

  const renderIcon = (icon: NotificationIconType) => {
    switch (icon) {
      case "proposal":
        return (
          <ProposalDocumentIcon width={24} height={24} color={theme.darkGreen} />
        );
      case "message":
        return (
          <MessageBubbleOutlineIcon width={24} height={24} color={theme.darkGreen} />
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

  return (
    <View style={styles.container}>
      <DashboardHeader />
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
          <View style={styles.notificationRow}>
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
                  <Text style={styles.messageHighlight}>{item.highlight}</Text>
                )}
              </Text>
            </View>
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}
