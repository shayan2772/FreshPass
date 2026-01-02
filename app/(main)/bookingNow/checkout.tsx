import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateWidthScale,
  moderateHeightScale,
  widthScale,
} from "@/src/theme/dimensions";
import { SvgXml } from "react-native-svg";
import Button from "@/src/components/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { MorningIcon, EveningIcon, NightIcon } from "@/assets/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

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

const getWeekDays = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week");
  return Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, "day"));
};

const formatWeekRange = (week: dayjs.Dayjs[]) => {
  if (week.length === 0) return "";
  const start = week[0];
  const end = week[6];
  return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Time slots in 24-hour format (HH:mm)
const allTimeSlots = [
  "11:00",
  "12:00",
  "12:30",
  "15:30",
  "16:00",
  "16:30",
  "20:00",
];

// Convert 24-hour format to 12-hour format for display (without AM/PM)
const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hour12}:${minutes.toString().padStart(2, "0")}`;
};

// Categorize time slots into Morning, Evening, and Night
const categorizeTimeSlots = (slots: string[]) => {
  const morning: string[] = [];
  const evening: string[] = [];
  const night: string[] = [];

  slots.forEach((slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    const hour24 = hours;

    if (hour24 >= 6 && hour24 < 12) {
      morning.push(slot);
    } else if (hour24 >= 12 && hour24 < 18) {
      evening.push(slot);
    } else {
      night.push(slot);
    }
  });

  return { morning, evening, night };
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
    logoContainer: {},
    logoText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    line: {
      width: "100%",
      height: 1.1,
      backgroundColor: theme.borderLight,
      marginTop: moderateHeightScale(12),
    },
    scrollContent: {
      paddingBottom: moderateHeightScale(20),
    },
    section: {
      
      marginTop: moderateHeightScale(12),
    },
    sectionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(20),
    },
    // Availability Section
    weekNavigation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(20),
    },
    weekNavigationButton: {
      width: moderateWidthScale(32),
      height: moderateWidthScale(40),
      borderRadius: moderateWidthScale(6),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    weekRangeText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    calendarGrid: {
      marginBottom: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(20),
    },
    daysHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    dayHeader: {
      flex: 1,
      alignItems: "center",
    },
    dayHeaderText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    daysRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayContainer: {
      flex: 1,
      alignItems: "center",
    },
    dayNumberContainer: {
      width: widthScale(35),
      height: widthScale(35),
      borderRadius: widthScale(35 / 2),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "transparent"
    },
    dayNumberSelected: {
      backgroundColor: theme.orangeBrown30,
      borderColor: theme.selectCard,
    },
    dayNumber: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    dayNumberSelectedText: {
      color: theme.darkGreen,
    },
    timezoneText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(5),
      paddingHorizontal: moderateWidthScale(20),
    },
    timeSlotSection: {
      marginTop: moderateHeightScale(16),
    },
    timeSlotCategory: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(20),
    },
    timeSlotCategoryIcon: {
      marginRight: moderateWidthScale(8),
    },
    timeSlotCategoryText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    timeSlotsContainer: {
      marginBottom: moderateHeightScale(5),
    },
    timeSlotsContentContainer: {
      marginBottom: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(20),
      gap: moderateWidthScale(12) 
    },
    timeSlotButton: {
      width: widthScale(90),
      paddingVertical: moderateHeightScale(10),
      borderRadius: moderateWidthScale(6),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
    },
    timeSlotButtonSelected: {
      backgroundColor: theme.darkGreenLight,
      borderColor: theme.darkGreen,
    },
    timeSlotText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    timeSlotTextSelected: {
      color: theme.white,
      fontFamily: fonts.fontRegular,
    },
    // Payment Method Section
    paymentOption: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: moderateWidthScale(16),
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      marginBottom: moderateHeightScale(12),
      borderWidth: 1.5,
      borderColor: theme.lightGreen2,
    },
    paymentOptionSelected: {
      borderColor: theme.orangeBrown,
    },
    paymentRadioButton: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(10),
      borderWidth: 2,
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
      marginTop: moderateHeightScale(2),
    },
    paymentRadioButtonSelected: {
      borderColor: theme.orangeBrown,
    },
    paymentRadioButtonInner: {
      width: moderateWidthScale(10),
      height: moderateWidthScale(10),
      borderRadius: moderateWidthScale(5),
      backgroundColor: theme.orangeBrown,
    },
    paymentOptionContent: {
      flex: 1,
    },
    paymentOptionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    paymentOptionDescription: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    // Service Details Section
    serviceDetailsCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
    },
    serviceDetailsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(12),
    },
    serviceDetailsName: {
      flex: 1,
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceDetailsPrice: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(8),
    },
    serviceDetailsOriginalPrice: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen4,
      textDecorationLine: "line-through",
    },
    serviceDetailsPriceContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    serviceDetailsStaff: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: moderateHeightScale(12),
    },
    serviceDetailsStaffImage: {
      width: widthScale(32),
      height: heightScale(32),
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.emptyProfileImage,
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginRight: moderateWidthScale(8),
    },
    serviceDetailsStaffName: {
      flex: 1,
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    serviceDetailsChangeButton: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    serviceDetailsChangeButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    // Price Breakdown Section
    priceBreakdown: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    priceRowLast: {
      marginBottom: 0,
    },
    priceLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    priceValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    priceDivider: {
      height: 1,
      backgroundColor: theme.lightGreen2,
      marginVertical: moderateHeightScale(12),
    },
    priceLabelTotal: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    priceValueTotal: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    // Privacy Policy Section
    privacyText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      lineHeight: moderateHeightScale(16),
    },
    privacyLink: {
      color: theme.darkGreen,
      fontFamily: fonts.fontMedium,
    },
    // Subscription Section
    subscriptionSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
    },
    subscriptionText: {
      flex: 1,
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(12),
    },
    subscriptionButton: {
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
    },
    subscriptionButtonText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    bottom: {
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(20),
      gap: moderateHeightScale(16),
      paddingVertical: moderateHeightScale(12),
      borderColor: theme.borderLight,
      borderTopWidth: 1,
    },
    totalSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalLabel: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    totalValue: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
  });

export default function Checkout() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedServices?: string;
    selectedStaff?: string;
    businessId?: string;
  }>();

  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("anyone");
  const [selectedStaffMember, setSelectedStaffMember] =
    useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [week, setWeek] = useState(getWeekDays(dayjs()));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"payNow" | "payLater">(
    "payNow"
  );

  // Categorize time slots
  const { morning, evening, night } = useMemo(
    () => categorizeTimeSlots(allTimeSlots),
    []
  );

  // Render time slot category component
  const renderTimeSlotCategory = (
    title: string,
    slots: string[],
    icon: React.ReactNode
  ) => {
    if (slots.length === 0) return null;

    return (
      <>
        <View style={styles.timeSlotCategory}>
          <View style={styles.timeSlotCategoryIcon}>{icon}</View>
          <Text style={styles.timeSlotCategoryText}>{title}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeSlotsContainer}
          contentContainerStyle={styles.timeSlotsContentContainer}
        >
          {slots.map((slot) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={slot}
              style={[
                styles.timeSlotButton,
                selectedTimeSlot === slot && styles.timeSlotButtonSelected,
              ]}
              onPress={() => setSelectedTimeSlot(slot)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTimeSlot === slot && styles.timeSlotTextSelected,
                ]}
              >
                {convertTo12Hour(slot)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  // Dummy staff member
  const dummyStaff: StaffMember = {
    id: 1,
    name: "Md Shariful Islam Khan",
    experience: 5,
    image: null,
  };

  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const tax = 0.1; // Dummy tax
  const estimatedTotal = totalPrice + tax;

  useEffect(() => {
    if (params.selectedServices) {
      try {
        const services = JSON.parse(params.selectedServices);
        setSelectedServices(services);
      } catch (e) {
        console.error("Error parsing selectedServices:", e);
      }
    }

    if (params.selectedStaff) {
      setSelectedStaffId(params.selectedStaff);
      if (params.selectedStaff !== "anyone") {
        // In real app, fetch staff member by ID
        setSelectedStaffMember(dummyStaff);
      }
    }
  }, []);

  const prevWeek = () => {
    const newWeek = week[0].subtract(1, "week");
    setWeek(getWeekDays(newWeek));
  };

  const nextWeek = () => {
    const newWeek = week[0].add(1, "week");
    setWeek(getWeekDays(newWeek));
  };

  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setWeek(getWeekDays(date));
  };

  const getTimezoneText = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offset / 60));
      const offsetMinutes = Math.abs(offset % 60);
      const sign = offset <= 0 ? "+" : "-";
      const gmtOffset = `GMT${sign}${offsetHours}${
        offsetMinutes > 0 ? `:${offsetMinutes.toString().padStart(2, "0")}` : ""
      }`;
      return `In your time zone, ${timezone} (${gmtOffset})`;
    } catch (error) {
      return "In your time zone, South Africa (GMT +1:00)";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackArrowIcon
              width={widthScale(25)}
              height={heightScale(25)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Checkout</Text>
          </View>
        </View>
      </View>

      <View style={styles.line} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>

          {/* Week Navigation */}
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              onPress={prevWeek}
              style={styles.weekNavigationButton}
              activeOpacity={0.7}
            >
              <Feather
                name="chevron-left"
                size={moderateWidthScale(17)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
            <Text style={styles.weekRangeText}>{formatWeekRange(week)}</Text>
            <TouchableOpacity
              onPress={nextWeek}
              style={styles.weekNavigationButton}
              activeOpacity={0.7}
            >
              <Feather
                name="chevron-right"
                size={moderateWidthScale(17)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {/* Days Header */}
            <View style={styles.daysHeader}>
              {dayNames.map((dayName) => (
                <View key={dayName} style={styles.dayHeader}>
                  <Text style={styles.dayHeaderText}>{dayName}</Text>
                </View>
              ))}
            </View>

            {/* Days Row */}
            <View style={styles.daysRow}>
              {week.map((day) => {
                const isSelected = day.isSame(selectedDate, "day");
                return (
                  <TouchableOpacity
                    key={day.format("YYYY-MM-DD")}
                    style={styles.dayContainer}
                    onPress={() => handleDateSelect(day)}
                  >
                    <View
                      style={[
                        styles.dayNumberContainer,
                        isSelected && styles.dayNumberSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberSelectedText,
                        ]}
                      >
                        {day.format("D")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Timezone Information */}
          <Text style={styles.timezoneText}>{getTimezoneText()}</Text>

          {/* Time Slots */}
          <View style={styles.timeSlotSection}>
            {renderTimeSlotCategory(
              "Morning",
              morning,
              <MorningIcon
                width={moderateWidthScale(18)}
                height={moderateHeightScale(13)}
              />
            )}
            {renderTimeSlotCategory(
              "Evening",
              evening,
              <EveningIcon
                width={moderateWidthScale(18)}
                height={moderateHeightScale(10)}
              />
            )}
            {renderTimeSlotCategory(
              "Night",
              night,
              <NightIcon
                width={moderateWidthScale(15)}
                height={moderateHeightScale(15)}
              />
            )}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose payment method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "payNow" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("payNow")}
          >
            <View
              style={[
                styles.paymentRadioButton,
                paymentMethod === "payNow" && styles.paymentRadioButtonSelected,
              ]}
            >
              {paymentMethod === "payNow" && (
                <View style={styles.paymentRadioButtonInner} />
              )}
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Pay now</Text>
              <Text style={styles.paymentOptionDescription}>
                Securely pay online to confirm your booking instantly.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "payLater" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("payLater")}
          >
            <View
              style={[
                styles.paymentRadioButton,
                paymentMethod === "payLater" &&
                  styles.paymentRadioButtonSelected,
              ]}
            >
              {paymentMethod === "payLater" && (
                <View style={styles.paymentRadioButtonInner} />
              )}
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Pay later</Text>
              <Text style={styles.paymentOptionDescription}>
                Pay in person at the salon.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Details Section */}
        {selectedServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            {selectedServices.map((service) => (
              <View key={service.id} style={styles.serviceDetailsCard}>
                <View style={styles.serviceDetailsHeader}>
                  <Text style={styles.serviceDetailsName}>
                    {service.name} - {service.description}
                  </Text>
                  <View style={styles.serviceDetailsPriceContainer}>
                    <Text style={styles.serviceDetailsPrice}>
                      ${service.price.toFixed(2)} USD
                    </Text>
                    <MaterialIcons
                      name="delete-outline"
                      size={moderateWidthScale(20)}
                      color={theme.red}
                    />
                  </View>
                </View>
                <Text style={styles.serviceDetailsOriginalPrice}>
                  ${service.originalPrice.toFixed(2)}
                </Text>
                {selectedStaffMember && (
                  <View style={styles.serviceDetailsStaff}>
                    {selectedStaffMember.image ? (
                      <Image
                        source={{ uri: selectedStaffMember.image }}
                        style={styles.serviceDetailsStaffImage}
                      />
                    ) : (
                      <View style={styles.serviceDetailsStaffImage} />
                    )}
                    <Text style={styles.serviceDetailsStaffName}>
                      {selectedStaffMember.name}
                    </Text>
                    <TouchableOpacity style={styles.serviceDetailsChangeButton}>
                      <Text style={styles.serviceDetailsChangeButtonText}>
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Price Breakdown Section */}
        <View style={styles.section}>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                ${totalPrice.toFixed(2)} USD
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)} USD</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelTotal}>Estimated Total</Text>
              <Text style={styles.priceValueTotal}>
                ${estimatedTotal.toFixed(2)} USD
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy Policy Section */}
        <View style={styles.section}>
          <Text style={styles.privacyText}>
            By placing this order, you agree to our{" "}
            <Text style={styles.privacyLink}>Privacy Policy</Text>. Your
            personal data will be processed by the partner with whom you're
            booking an appointment.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        {/* Final Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Order total:</Text>
          <Text style={styles.totalValue}>
            ${estimatedTotal.toFixed(2)} USD
          </Text>
        </View>

        {/* Checkout Button */}
        <Button
          title="Book now"
          onPress={() => {
            if (!selectedTimeSlot) {
              showBanner(
                "Time Slot Required",
                "Please select a time slot to proceed with booking.",
                "warning",
                4000
              );
              return;
            }
            // Handle booking logic here
            showBanner(
              "Booking Successful",
              "Your appointment has been confirmed.",
              "success",
              4000
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
