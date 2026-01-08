import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
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
import {
  SubscriptionTicketIcon,
  PersonIcon,
  LocationPinIcon,
} from "@/assets/icons";
import { useRouter } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ApiService } from "@/src/services/api";
import { appointmentsEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import dayjs from "dayjs";

type TabType = "all" | "complete" | "cancelled";
type ListType = "subscriptions" | "individual";
type BookingStatus = "ongoing" | "active" | "complete" | "cancelled";

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
  appointmentType: "subscription" | "service";
}

interface ApiAppointment {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "subscription" | "service";
  status: string;
  staffName: string | null;
  subscriptionPlanType: string | null;
  subscriptionPlanDescription: string | null;
  businessTitle: string;
  businessAddress: string;
  services: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    duration: {
      hours: number;
      minutes: number;
    };
  }>;
  subscriptionServices:
    | Array<{
        id: number;
        name: string;
        description: string;
        price: string;
        duration: {
          hours: number;
          minutes: number;
        };
      }>
    | {};
  totalPrice: number;
  paidAmount: string | null;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginTop: moderateHeightScale(16),
      marginBottom: moderateHeightScale(20),
      paddingHorizontal: moderateWidthScale(16),
    },
    tabsContainer: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(16),
      width: "100%",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      paddingHorizontal: moderateWidthScale(16),
    },
    tab: {
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: moderateHeightScale(8),
      width: "33%",
    },
    tabText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      textAlign: "center",
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: theme.orangeBrown,
    },
    activeTabText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    toggleContainer: {
      flexDirection: "row",
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.darkGreen,
      marginBottom: moderateHeightScale(24),
      padding: moderateWidthScale(3),
      marginHorizontal: moderateWidthScale(16),
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
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(12),
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
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
    cardLeftSection: {
      gap: moderateHeightScale(7),
      width: "56%",
    },
    cardRightSection: {
      gap: moderateHeightScale(10),
      alignItems: "flex-end",
      width: "40%",
    },
    serviceName: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.black,
    },
    price: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    appointmentInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "45%",
    },
    statusSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    infoText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      marginLeft: moderateWidthScale(3),
    },
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "90%",
      gap: moderateWidthScale(4),
    },
    dateTimeText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
    },
    statusBadge: {
      backgroundColor: theme.orangeBrown30,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(4),
      flexDirection: "row",
      alignItems: "center",
    },
    statusOngoing: {
      backgroundColor: theme.orangeBrown015,
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
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
    },
    statusTextOngoing: {
      color: theme.appointmentStatusText,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateHeightScale(60),
    },
    footerLoader: {
      paddingVertical: moderateHeightScale(20),
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default function BookingScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const { showBanner } = useNotificationContext();
  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [listType, setListType] = useState<ListType>("individual");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  console.log("bookings : ", bookings);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    console.log("statsu : ", status);
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

  const mapApiStatusToBookingStatus = (apiStatus: string): BookingStatus => {
    switch (apiStatus) {
      case "scheduled":
        return "ongoing";
      case "pending":
        return "active";
      case "completed":
        return "complete";
      case "cancelled":
        return "cancelled";
      default:
        return "active";
    }
  };

  const formatDuration = (hours: number, minutes: number): string => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }
    if (minutes === 0) {
      return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
    }
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ${minutes} min`;
  };

  const formatDateTime = (date: string, time: string): string => {
    try {
      const dateObj = dayjs(date, "MM/DD/YYYY");
      const formattedDate = dateObj.format("M/D/YYYY");
      const timeObj = dayjs(time, "HH:mm");
      const formattedTime = timeObj.format("h:mm A").toLowerCase();
      return `${formattedDate} - ${formattedTime}`;
    } catch (error) {
      return `${date} - ${time}`;
    }
  };

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)} USD`;
  };

  const mapApiAppointmentToBookingItem = (
    apiAppointment: ApiAppointment
  ): BookingItem => {
    const services = Array.isArray(apiAppointment.services)
      ? apiAppointment.services
      : [];

    let subscriptionServices: Array<any> = [];
    if (apiAppointment.subscriptionServices) {
      if (Array.isArray(apiAppointment.subscriptionServices)) {
        subscriptionServices = apiAppointment.subscriptionServices;
      } else if (typeof apiAppointment.subscriptionServices === "object") {
        // Handle empty object case
        subscriptionServices = [];
      }
    }

    const allServices =
      apiAppointment.appointmentType === "subscription"
        ? subscriptionServices
        : services;

    const serviceName =
      allServices.length > 0
        ? allServices.map((s: any) => s.name).join(" + ")
        : "Service";

    const firstService = allServices[0];
    // const duration = firstService?.duration
    //   ? formatDuration(
    //       firstService.duration.hours,
    //       firstService.duration.minutes
    //     )
    //   : "N/A";

    const location = apiAppointment.businessAddress
      ? apiAppointment.businessAddress.length > 20
        ? `${apiAppointment.businessAddress.substring(0, 20)}...`
        : apiAppointment.businessAddress
      : undefined;

    const staffName = apiAppointment.staffName || "Anyone";

    const membershipType = apiAppointment.subscriptionPlanType || "----";

    return {
      id: apiAppointment.id.toString(),
      serviceName:
        serviceName.length > 30
          ? `${serviceName.substring(0, 30)}...`
          : serviceName,
      membershipType,
      staffName,
      location,
      dateTime: formatDateTime(
        apiAppointment.appointmentDate,
        apiAppointment.appointmentTime
      ),
       duration:"",
      price: formatPrice(apiAppointment.totalPrice),
      status: mapApiStatusToBookingStatus(apiAppointment.status),
      appointmentType: apiAppointment.appointmentType,
    };
  };

  const fetchAppointments = async (
    page: number = 1,
    append: boolean = false
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params: {
        status?: string;
        appointment_type?: string;
        page?: number;
        per_page?: number;
      } = {
        page,
        per_page: 10,
      };

      if (selectedTab === "complete") {
        params.status = "completed";
      } else if (selectedTab === "cancelled") {
        params.status = "cancelled";
      }

      if (listType === "subscriptions") {
        params.appointment_type = "subscription";
      } else if (listType === "individual") {
        params.appointment_type = "service";
      }

      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: {
          data: ApiAppointment[];
          meta: {
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
          };
        };
      }>(appointmentsEndpoints.list(params));

      if (response.success && response.data?.data) {
        const mappedBookings = response.data.data.map(
          mapApiAppointmentToBookingItem
        );
        if (append) {
          setBookings((prev) => [...prev, ...mappedBookings]);
        } else {
          setBookings(mappedBookings);
        }
        setCurrentPage(response.data.meta.current_page);
        setTotalPages(response.data.meta.last_page);
      } else {
        if (!append) {
          setBookings([]);
        }
      }
    } catch (error: any) {
      showBanner(
        "API Failed",
        error?.message || "Failed to fetch appointments",
        "error",
        2500
      );
      if (!append) {
        setBookings([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setBookings([]);
    fetchAppointments(1, false);
  }, [selectedTab, listType]);

  const handleLoadMore = () => {
    if (!loadingMore && currentPage < totalPages) {
      fetchAppointments(currentPage + 1, true);
    }
  };

  const renderBookingCard = ({ item }: { item: BookingItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.bookingCard, styles.shadow]}
      onPress={() => {
        router.push({
          pathname: "/(main)/bookingDetailsById",
          params: {
            bookingId: item.id,
            booking: JSON.stringify(item),
          },
        });
      }}
    >
      <View style={styles.cardLeftSection}>
        <Text numberOfLines={1} style={styles.serviceName}>
          {item.serviceName}
        </Text>
        <View style={styles.appointmentInfoContainer}>
          <View style={styles.infoRow}>
            {item.appointmentType === "subscription" ? (
              <SubscriptionTicketIcon
                width={moderateWidthScale(15)}
                height={moderateWidthScale(15)}
                color={theme.lightGreen}
              />
            ) : (
              <LocationPinIcon
                width={moderateWidthScale(15)}
                height={moderateWidthScale(15)}
                color={theme.lightGreen}
              />
            )}

            <Text numberOfLines={1} style={styles.infoText}>
              {item.appointmentType === "subscription"
                ? item.membershipType
                : item.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <PersonIcon
              width={moderateWidthScale(15)}
              height={moderateWidthScale(15)}
              color={theme.lightGreen}
            />
            <Text numberOfLines={1} style={styles.infoText}>
              {item.staffName}
            </Text>
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <Ionicons
            name="time-outline"
            size={moderateWidthScale(15)}
            color={theme.lightGreen}
          />
          <Text style={styles.dateTimeText}>
            {item.dateTime} 
            {/* • {item.duration} */}
          </Text>
        </View>
      </View>

      <View style={styles.cardRightSection}>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={moderateWidthScale(22)}
            color={theme.darkGreen}
          />
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
            style={[styles.tab, selectedTab === "all" && styles.activeTab]}
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
            style={[styles.tab, selectedTab === "complete" && styles.activeTab]}
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.darkGreen} />
          </View>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: moderateHeightScale(20),
              paddingHorizontal: moderateWidthScale(16),
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No bookings found</Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={theme.darkGreen} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}
