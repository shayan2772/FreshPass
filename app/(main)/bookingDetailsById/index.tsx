import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { Theme } from "@/src/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { fontSize, fonts } from "@/src/theme/fonts";
import { SvgXml } from "react-native-svg";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Button from "@/src/components/button";
import { PersonIcon, MapPinIcon } from "@/assets/icons";

// Back Arrow Icon SVG
const backArrowIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="{{COLOR}}"/>
</svg>
`;

const BackArrowIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = backArrowIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

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
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(12),
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    backButton: {
      width: widthScale(32),
      height: heightScale(32),
      borderRadius: moderateWidthScale(8),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(8),
    },
    logoText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    line: {
      width: "100%",
      height: 1.1,
      backgroundColor: theme.borderLight,
      alignSelf: "center",
    },
    scrollContent: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(30),
    },
    bottomButton: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(20),
      paddingTop: moderateHeightScale(2),
    },
    bookingSection: {
      marginBottom: moderateHeightScale(24),
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
      marginBottom: moderateHeightScale(12),
    },
    statusOngoing: {
      backgroundColor: theme.orangeBrown30,
    },
    statusCancelled: {
      backgroundColor: "#D32F2F",
    },
    statusText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceName: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(20),
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: moderateHeightScale(16),
    },
    detailColumn: {
      flex: 1,
      alignItems: "center",
      position: "relative",
    },
    detailColumnSeparator: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: theme.borderLight,
    },
    detailIcon: {
      marginBottom: moderateHeightScale(8),
    },
    detailLabel: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    detailValue: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlign: "center",
    },
    businessCard: {
      marginBottom: moderateHeightScale(24),
      flexDirection: "row",
      alignItems: "center",
    },
    businessImageContainer: {
      position: "relative",
      marginRight: moderateWidthScale(12),
    },
    businessImage: {
      width: widthScale(60),
      height: heightScale(60),
      borderRadius: moderateWidthScale(30),
    },
    ratingBadge: {
      position: "absolute",
      bottom: 0,
      left: 0,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(4),
      paddingHorizontal: moderateWidthScale(4),
      paddingVertical: moderateHeightScale(2),
    },
    ratingStar: {
      marginRight: moderateWidthScale(2),
    },
    ratingText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    businessInfo: {
      flex: 1,
    },
    businessName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    businessAddress: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    mapPinContainer: {
      width: widthScale(40),
      height: heightScale(40),
      borderRadius: moderateWidthScale(20),
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: moderateWidthScale(8),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(0),
    },
    actionButton: {
      alignItems: "center",
      width: widthScale(70),
    },
    actionButtonCircle: {
      width: widthScale(60),
      height: heightScale(60),
      borderRadius: moderateWidthScale(30),
      backgroundColor: theme.orangeBrown30,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateHeightScale(8),
    },
    actionButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    paymentSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(16),
      paddingBottom: moderateHeightScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    paymentIcon: {
      marginRight: moderateWidthScale(12),
    },
    paymentTextContainer: {
      flex: 1,
    },
    paymentLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(2),
    },
    paymentAmount: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    policyLink: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(0),
      marginBottom: moderateHeightScale(16),
      paddingBottom: moderateHeightScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    policyText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    cancelButton: {
      backgroundColor: theme.background,
      borderWidth: moderateWidthScale(1),
      borderColor: "#D32F2F",
    },
    cancelButtonText: {
      color: "#D32F2F",
    },
    removeButton: {
      backgroundColor: theme.darkGreen,
    },
  });

export default function bookingDetailsById() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse booking data from params
  const booking: BookingItem | null = params.booking
    ? JSON.parse(params.booking as string)
    : null;
  const bookingId = params.bookingId as string;

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                router.back();
              }}
            >
              <BackArrowIcon
                width={widthScale(25)}
                height={heightScale(25)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
            <Text style={styles.logoText}>Booking Detail</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.lightGreen }}>No booking data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCancelled = booking.status === "cancelled";
  const statusBadgeStyle =
    booking.status === "ongoing"
      ? styles.statusOngoing
      : booking.status === "cancelled"
      ? styles.statusCancelled
      : styles.statusOngoing;

  const statusLabel =
    booking.status === "ongoing"
      ? "On going"
      : booking.status === "cancelled"
      ? "You canceled"
      : booking.status;

  // Parse date and time from dateTime string
  const dateTimeParts = booking.dateTime.split(" - ");
  const date = dateTimeParts[0] || booking.dateTime;
  const time = dateTimeParts[1] || "";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <BackArrowIcon
              width={widthScale(25)}
              height={heightScale(25)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
          <Text style={styles.logoText}>Booking Detail</Text>
        </View>
      </View>

      <View style={styles.line} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Booking Section */}
        <View style={styles.bookingSection}>
          {/* Status Badge */}
          <View style={[styles.statusBadge, statusBadgeStyle]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>

          {/* Service Name */}
          <Text style={styles.serviceName}>{booking.serviceName}</Text>

          {/* Details Row */}
          <View style={styles.detailsRow}>
            <View style={styles.detailColumn}>
              <Ionicons
                name="time-outline"
                size={moderateWidthScale(24)}
                color={theme.darkGreen}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{booking.duration}</Text>
              <View style={styles.detailColumnSeparator} />
            </View>
            <View style={styles.detailColumn}>
              <Ionicons
                name="calendar-outline"
                size={moderateWidthScale(24)}
                color={theme.darkGreen}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{booking.dateTime}</Text>
              <View style={styles.detailColumnSeparator} />
            </View>
            <View style={[styles.detailColumn, { borderRightWidth: 0 }]}>
              <PersonIcon
                width={moderateWidthScale(24)}
                height={moderateWidthScale(24)}
                color={theme.darkGreen}
              />
              <Text style={styles.detailLabel}>My barber</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {booking.staffName}
              </Text>
            </View>
          </View>
        </View>

        {/* Business Information Card */}
        <View style={styles.businessCard}>
          <View style={styles.businessImageContainer}>
            <Image
              source={{
                uri: "https://via.placeholder.com/60",
              }}
              style={styles.businessImage}
            />
            <View style={styles.ratingBadge}>
              <Ionicons
                name="star"
                size={moderateWidthScale(10)}
                color={theme.darkGreen}
                style={styles.ratingStar}
              />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>
              {booking.location || "Business Name"}
            </Text>
            <Text style={styles.businessAddress}>
              {booking.location
                ? `${booking.location} Address, City, State`
                : "Business Address"}
            </Text>
          </View>
          <View style={styles.mapPinContainer}>
            <MapPinIcon
              width={moderateWidthScale(20)}
              height={moderateWidthScale(20)}
              color={theme.darkGreen}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Ionicons
                name="chatbubble-outline"
                size={moderateWidthScale(24)}
                color={theme.darkGreen}
              />
            </View>
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>
          {isCancelled && (
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonCircle}>
                <Entypo
                  name="cycle"
                  size={moderateWidthScale(24)}
                  color={theme.darkGreen}
                />
              </View>
              <Text style={styles.actionButtonText}>Book again</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Ionicons
                name="help-circle-outline"
                size={moderateWidthScale(24)}
                color={theme.darkGreen}
              />
            </View>
            <Text style={styles.actionButtonText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentSection}>
          <Ionicons
            name="wallet-outline"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.paymentIcon}
          />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentLabel}>
              {isCancelled ? "I paid" : "will pay"}
            </Text>
            <Text style={styles.paymentAmount}>Total: {booking.price}</Text>
          </View>
        </View>

        {/* Policy Link (only for ongoing bookings) */}
        {!isCancelled && (
          <TouchableOpacity style={styles.policyLink}>
            <Text style={styles.policyText}>Booking cancel policy</Text>
            <Entypo
              name="chevron-small-right"
              size={moderateWidthScale(24)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          title={isCancelled ? "Remove from history" : "Cancel this booking"}
          onPress={() => {
            // Handle button press
          }}
          containerStyle={
            isCancelled ? styles.removeButton : styles.cancelButton
          }
          textColor={isCancelled ? undefined : "#D32F2F"}
        />
      </View>
    </SafeAreaView>
  );
}
