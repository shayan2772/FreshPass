import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  heightScale,
} from "@/src/theme/dimensions";
import DashboardHeader from "@/src/components/DashboardHeader";
import { SubscriptionTicketIcon, PersonIcon } from "@/assets/icons";
import { useRouter } from "expo-router";

type TabType = "all" | "complete" | "cancelled";
type ListType = "subscriptions" | "individual";
type BookingStatus =
  | "ongoing"
  | "active"
  | "complete"
  | "cancelled";

interface BookingItem {
  id: string;
  serviceName: string;
  membershipType?: string;
  staffName: string;
  location?: string;
  dateTime: string;
  duration: string;
  price: string;
  status: BookingStatus;
}

const DUMMY_BOOKINGS: BookingItem[] = [
  {
    id: "1",
    serviceName: "Deluxe Cut + VIP Cut",
    membershipType: "Golder member",
    staffName: "Sanna",
    dateTime: "1/5/2025 - 12:30 pm",
    duration: "45 min",
    price: "$132.00 USD",
    status: "ongoing",
  },
  {
    id: "2",
    serviceName: "Haircut + Beard Trim",
    location: "The Diamond M...",
    staffName: "Sanna",
    dateTime: "1/5/2025 - 12:30 pm",
    duration: "45 min",
    price: "$25.98 USD",
    status: "active",
  },
  {
    id: "3",
    serviceName: "Retwist with 2 strand",
    location: "Nikki Babe",
    staffName: "Md Biplob",
    dateTime: "1/5/2025 - 12:30 pm",
    duration: "45 min",
    price: "$179.99 USD",
    status: "complete",
  },
  {
    id: "4",
    serviceName: "Retwist, basic style, starter...",
    location: "Styles by Chris...",
    staffName: "Safayet",
    dateTime: "1/5/2025 - 12:30 pm",
    duration: "45 min",
    price: "$179.99 USD",
    status: "cancelled",
  },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(16),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginTop: moderateHeightScale(16),
      marginBottom: moderateHeightScale(20),
    },
    tabsContainer: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(24),
      gap: moderateWidthScale(40),
    },
    tab: {
      paddingBottom: moderateHeightScale(8),
    },
    tabText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: theme.orangeBrown,
    },
    activeTabText: {
      fontFamily: fonts.fontBold,
      color: theme.text,
    },
    toggleContainer: {
      flexDirection: "row",
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.darkGreen,
      marginBottom: moderateHeightScale(24),
      padding: moderateWidthScale(3),
    },
    toggleOption: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: moderateWidthScale(999),
      paddingVertical: moderateHeightScale(6),
      paddingHorizontal: moderateWidthScale(16),
    },
    toggleOptionActive: {
      backgroundColor: theme.orangeBrown,
      borderWidth: moderateWidthScale(1),
      borderColor: theme.buttonBack,
    },
    toggleOptionInactive: {
      backgroundColor: "transparent",
    },
    toggleText: {
      fontSize: fontSize.size14,
    },
    toggleTextActive: {
      color: theme.darkGreen,
      fontFamily: fonts.fontMedium,
    },
    toggleTextInactive: {
      color: theme.segmentInactiveTabText,
      fontFamily: fonts.fontRegular,
    },
    bookingCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(20),
      padding: moderateWidthScale(20),
      marginBottom: moderateHeightScale(16),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: moderateHeightScale(2),
      },
      shadowOpacity: 0.06,
      shadowRadius: moderateWidthScale(10),
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(16),
    },
    serviceName: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.text,
      flex: 1,
      marginRight: moderateWidthScale(8),
    },
    price: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.text,
    },
    cardInfo: {
      gap: moderateHeightScale(6),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
      flex: 1,
    },
    infoRowWithStatus: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: moderateWidthScale(6),
    },
    infoLeftSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
      flex: 1,
    },
    statusSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    infoText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(4),
    },
    dateTimeText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    statusBadge: {
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(6),
    },
    statusOngoing: {
      backgroundColor: "#FFF4E6",
    },
    statusActive: {
      backgroundColor: "#E3F2FD",
    },
    statusComplete: {
      backgroundColor: "#E8F5E9",
    },
    statusCancelled: {
      backgroundColor: "#FFEBEE",
    },
    statusText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
    },
    statusTextOngoing: {
      color: "#F57C00",
    },
    statusTextActive: {
      color: "#1976D2",
    },
    statusTextComplete: {
      color: "#388E3C",
    },
    statusTextCancelled: {
      color: "#D32F2F",
    },
    arrowIcon: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
    },
    emptyText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function BookingScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [listType, setListType] = useState<ListType>("individual");

  const getStatusBadgeStyle = (status: BookingStatus) => {
    switch (status) {
      case "ongoing":
        return styles.statusOngoing;
      case "active":
        return styles.statusActive;
      case "complete":
        return styles.statusComplete;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusActive;
    }
  };

  const getStatusTextStyle = (status: BookingStatus) => {
    switch (status) {
      case "ongoing":
        return styles.statusTextOngoing;
      case "active":
        return styles.statusTextActive;
      case "complete":
        return styles.statusTextComplete;
      case "cancelled":
        return styles.statusTextCancelled;
      default:
        return styles.statusTextActive;
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case "ongoing":
        return "On-going apt.";
      case "active":
        return "Active";
      case "complete":
        return "Complete";
      case "cancelled":
        return "You canceled";
      default:
        return "Active";
    }
  };

  const renderBookingCard = ({ item }: { item: BookingItem }) => (
    <TouchableOpacity style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <View style={styles.cardInfo}>
        {item.membershipType && (
          <View style={styles.infoRow}>
            <SubscriptionTicketIcon
              width={16}
              height={16}
              color={theme.lightGreen}
            />
            <Text style={styles.infoText}>{item.membershipType}</Text>
          </View>
        )}
        {item.location && (
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>📍</Text>
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
        )}
        <View style={styles.infoRowWithStatus}>
          <View style={styles.infoLeftSection}>
            <PersonIcon width={16} height={16} color={theme.lightGreen} />
            <Text style={styles.infoText}>{item.staffName}</Text>
          </View>
          <View style={styles.statusSection}>
            <View
              style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}
            >
              <Text
                style={[styles.statusText, getStatusTextStyle(item.status)]}
              >
                {getStatusLabel(item.status)}
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
        </View>
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateTimeText}>🕐</Text>
          <Text style={styles.dateTimeText}>
            {item.dateTime} • {item.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Booking list</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "all" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "all" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "complete" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("complete")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "complete" && styles.activeTabText,
              ]}
            >
              Complete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "cancelled" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("cancelled")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "cancelled" && styles.activeTabText,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleOption,
              listType === "subscriptions"
                ? styles.toggleOptionActive
                : styles.toggleOptionInactive,
            ]}
            onPress={() => setListType("subscriptions")}
          >
            <Text
              style={[
                styles.toggleText,
                listType === "subscriptions"
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Subscriptions list
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleOption,
              listType === "individual"
                ? styles.toggleOptionActive
                : styles.toggleOptionInactive,
            ]}
            onPress={() => setListType("individual")}
          >
            <Text
              style={[
                styles.toggleText,
                listType === "individual"
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Individual services
            </Text>
          </Pressable>
        </View>

        {/* Booking List */}
        <FlatList
          data={DUMMY_BOOKINGS}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: moderateHeightScale(20),
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
