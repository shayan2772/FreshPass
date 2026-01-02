import React, { useMemo, useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Alert,
  Clipboard,
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
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import Button from "@/src/components/button";
import dayjs from "dayjs";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  label?: string | null;
}

interface StaffMember {
  id: number;
  name: string;
  experience: number | null;
  image: string | null;
}

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

// Scissors Icon SVG
const scissorsIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.5 6.5C10.3284 6.5 11 5.82843 11 5C11 4.17157 10.3284 3.5 9.5 3.5C8.67157 3.5 8 4.17157 8 5C8 5.82843 8.67157 6.5 9.5 6.5Z" fill="{{COLOR}}"/>
<path d="M9.5 20.5C10.3284 20.5 11 19.8284 11 19C11 18.1716 10.3284 17.5 9.5 17.5C8.67157 17.5 8 18.1716 8 19C8 19.8284 8.67157 20.5 9.5 20.5Z" fill="{{COLOR}}"/>
<path d="M20.5 4L9.5 12L20.5 20" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.5 4L14.5 12L3.5 20" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ScissorsIcon = ({ width = 24, height = 24, color = "#283618" }) => {
  const svgXml = scissorsIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

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
    },
    scrollContent: {
      paddingBottom: moderateHeightScale(20),
    },
    section: {
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
    },
    bookingInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    bookingInfoLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    bookingInfoValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
      textAlign: "right",
      marginRight: moderateWidthScale(8),
    },
    copyButton: {
      padding: moderateWidthScale(4),
    },
    confirmationCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    confirmationIcon: {
      width: widthScale(40),
      height: heightScale(40),
      borderRadius: moderateWidthScale(20),
      backgroundColor: theme.lightGreen015,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmationContent: {
      flex: 1,
    },
    confirmationTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    confirmationMessage: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    serviceCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
    },
    serviceName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(12),
    },
    servicePriceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: moderateHeightScale(16),
    },
    servicePriceColumn: {
      alignItems: "flex-end",
    },
    serviceCurrentPrice: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    serviceOriginalPrice: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen4,
      textDecorationLine: "line-through",
    },
    serviceIncludes: {
      marginTop: moderateHeightScale(12),
    },
    serviceIncludeItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(8),
    },
    bulletPoint: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(8),
      marginTop: moderateHeightScale(2),
    },
    serviceIncludeText: {
      flex: 1,
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(18),
    },
    summaryCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
    },
    summaryTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    summaryRowLast: {
      marginBottom: 0,
    },
    summaryLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    summaryValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    summaryTotalLabel: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    summaryTotalValue: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(16),
    },
    salonCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
    },
    salonName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    salonAddress: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      lineHeight: moderateHeightScale(20),
    },
    staffCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
    },
    staffName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    staffExperience: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    paymentCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    paymentMethod: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: moderateHeightScale(20),
      paddingHorizontal: moderateWidthScale(20),
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    actionText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    policyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(16),
    },
    policyText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    bottomButton: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(20),
      paddingTop: moderateHeightScale(12),
    },
  });

export default function BookingDetail() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    selectedServices?: string;
    selectedStaff?: string;
    selectedStaffMember?: string;
    selectedDate?: string;
    selectedTimeSlot?: string;
    paymentMethod?: string;
    totalPrice?: string;
    tax?: string;
    estimatedTotal?: string;
    businessId?: string;
  }>();

  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaffMember, setSelectedStaffMember] =
    useState<StaffMember | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("");

  useEffect(() => {
    if (params.selectedServices) {
      try {
        const services = JSON.parse(params.selectedServices);
        setSelectedServices(services);
      } catch (e) {
        console.error("Error parsing selectedServices:", e);
      }
    }

    if (params.selectedStaffMember) {
      try {
        const staff = JSON.parse(params.selectedStaffMember);
        setSelectedStaffMember(staff);
      } catch (e) {
        console.error("Error parsing selectedStaffMember:", e);
      }
    }

    if (params.selectedDate) {
      const date = dayjs(params.selectedDate);
      setBookingDate(date.format("MMM DD, YYYY"));
    }
  }, [params]);

  const handleCopyBookingId = () => {
    if (params.bookingId) {
      Clipboard.setString(params.bookingId);
      showBanner("Copied", "Booking ID copied to clipboard", "success", 2000);
    }
  };

  const handleShare = () => {
    // Handle share functionality
    showBanner("Share", "Share functionality coming soon", "info", 2000);
  };

  const handleDownloadReceipt = () => {
    // Handle download receipt functionality
    showBanner(
      "Download",
      "Download receipt functionality coming soon",
      "info",
      2000
    );
  };

  const handleViewBooking = () => {
    // Handle view booking functionality
    router.back();
  };

  // Dummy business data (in real app, fetch from businessId)
  const businessName = "Ra Benjamin Styles LLC";
  const businessAddress =
    "240 E Exchange Blvd, Columbia, SC 29209, United States.";

  // Get first service for display (or combine all services)
  const displayService =
    selectedServices.length > 0 ? selectedServices[0] : null;

  const totalPrice = params.totalPrice ? parseFloat(params.totalPrice) : 0;
  const tax = params.tax ? parseFloat(params.tax) : 0;
  const bookingTotal = params.estimatedTotal
    ? parseFloat(params.estimatedTotal)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        {/* Booking Info */}
        <View style={styles.section}>
          <View style={styles.bookingInfoRow}>
            <Text style={styles.bookingInfoLabel}>Booking ID:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.bookingInfoValue}>
                {params.bookingId || "N/A"}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyBookingId}
              >
                <MaterialIcons
                  name="content-copy"
                  size={moderateWidthScale(18)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bookingInfoRow}>
            <Text style={styles.bookingInfoLabel}>Date:</Text>
            <Text style={styles.bookingInfoValue}>
              {bookingDate || "N/A"}
            </Text>
          </View>
        </View>

        {/* Confirmation Card */}
        <View style={styles.section}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <ScissorsIcon
                width={widthScale(24)}
                height={heightScale(24)}
                color={theme.darkGreen}
              />
            </View>
            <View style={styles.confirmationContent}>
              <Text style={styles.confirmationTitle}>
                Your appointment is confirmed
              </Text>
              <Text style={styles.confirmationMessage}>
                Booking confirmed! Can't wait to give you the Freshpass
                experience.
              </Text>
            </View>
          </View>
        </View>

        {/* Service Details */}
        {displayService && (
          <View style={styles.section}>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>
                {displayService.name} - {displayService.description}
              </Text>
              <View style={styles.servicePriceRow}>
                <View style={styles.servicePriceColumn}>
                  <Text style={styles.serviceCurrentPrice}>
                    ${displayService.price.toFixed(2)} USD
                  </Text>
                  <Text style={styles.serviceOriginalPrice}>
                    ${displayService.originalPrice.toFixed(2)} USD
                  </Text>
                </View>
              </View>
              <View style={styles.serviceIncludes}>
                <View style={styles.serviceIncludeItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.serviceIncludeText}>
                    This service includes we wash and cut
                  </Text>
                </View>
                <View style={styles.serviceIncludeItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.serviceIncludeText}>
                    Monthly subscription membership package
                  </Text>
                </View>
                <View style={styles.serviceIncludeItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.serviceIncludeText}>
                    This service includes we wash and cut
                  </Text>
                </View>
                <View style={styles.serviceIncludeItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.serviceIncludeText}>
                    Monthly subscription membership package
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary (you'll pay)</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)} USD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Tax:</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)} USD</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryTotalLabel}>Booking Total:</Text>
              <Text style={styles.summaryTotalValue}>
                ${bookingTotal.toFixed(2)} USD
              </Text>
            </View>
          </View>
        </View>

        {/* Salon Address */}
        <View style={styles.section}>
          <View style={styles.salonCard}>
            <Text style={styles.salonName}>{businessName}</Text>
            <Text style={styles.salonAddress}>{businessAddress}</Text>
          </View>
        </View>

        {/* Staff Member */}
        {selectedStaffMember && (
          <View style={styles.section}>
            <View style={styles.staffCard}>
              <Text style={styles.staffName}>
                {selectedStaffMember.name}
              </Text>
              {selectedStaffMember.experience && (
                <Text style={styles.staffExperience}>
                  {selectedStaffMember.experience} Years Of Experience
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.paymentCard}>
            <Ionicons
              name="logo-apple"
              size={moderateWidthScale(24)}
              color={theme.darkGreen}
            />
            <Text style={styles.paymentMethod}>
              {params.paymentMethod === "payNow" ? "Apple Pay" : "Pay Later"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Feather
              name="upload"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
            />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadReceipt}
            activeOpacity={0.7}
          >
            <Feather
              name="download"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
            />
            <Text style={styles.actionText}>Download receipt</Text>
          </TouchableOpacity>
        </View>

        {/* Policies */}
        <View style={styles.policyRow}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            activeOpacity={0.7}
          >
            <Text style={styles.policyText}>Booking cancel policy</Text>
            <Feather
              name="chevron-right"
              size={moderateWidthScale(16)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.policyRow}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            activeOpacity={0.7}
          >
            <Text style={styles.policyText}>Payment return policy</Text>
            <Feather
              name="chevron-right"
              size={moderateWidthScale(16)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button title="View booking" onPress={handleViewBooking} />
      </View>
    </SafeAreaView>
  );
}
