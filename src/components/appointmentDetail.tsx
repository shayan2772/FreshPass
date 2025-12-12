import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionTicketIcon, PersonIcon } from "@/assets/icons";
import dayjs from "dayjs";

export interface Appointment {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "subscription" | "service";
  status: string;
  user: string;
  userEmail: string;
  subscription: string | null;
  subscriptionServices: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    duration: {
      hours: number;
      minutes: number;
    };
  }> | {};
  subscriptionVisits: {
    used: number;
    total: number;
  } | null;
  services: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    duration: {
      hours: number;
      minutes: number;
    };
  }> | {};
  totalPrice: number | {};
  paidAmount: string;
  staffName: string;
  staffEmail: string;
  notes: string | null;
  businessTitle: string;
  businessAddress: string;
  businessLogoUrl: string | null;
  createdAt: string;
}

interface AppointmentDetailProps {
  appointment: Appointment | null;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(24),
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(16),
      marginBottom: moderateHeightScale(16),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(12),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    infoIcon: {
      marginRight: moderateWidthScale(12),
    },
    infoLabel: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(4),
    },
    infoValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      flex: 1,
    },
    infoValueBold: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(12),
    },
    statusBadge: {
      backgroundColor: theme.orangeBrown30,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
      alignSelf: "flex-start",
    },
    statusText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontBold,
      color: theme.selectCard,
    },
    priceText: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: moderateHeightScale(8),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    serviceItemLast: {
      borderBottomWidth: 0,
    },
    serviceName: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    servicePrice: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginLeft: moderateWidthScale(12),
    },
    notesContainer: {
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(6),
      padding: moderateWidthScale(12),
      marginTop: moderateHeightScale(8),
    },
    notesText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(18),
    },
    emptyNotes: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      fontStyle: "italic",
    },
  });

export default function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  if (!appointment) {
    return (
      <View style={styles.container}>
        <StackHeader title="Appointment Detail" />
        <View style={styles.contentContainer}>
          <Text style={styles.emptyNotes}>No appointment data available</Text>
        </View>
      </View>
    );
  }

  const formatDateTime = (
    date: string,
    time: string,
    totalMinutes?: number
  ) => {
    const formattedDate = date;
    const timeObj = dayjs(`2025-01-01 ${time}`, "YYYY-MM-DD HH:mm");
    const formattedTime = timeObj.format("h:mm a");

    let durationText = "";
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours > 0 && minutes > 0) {
        durationText = ` • ${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
      } else if (hours > 0) {
        durationText = ` • ${hours} hour${hours > 1 ? "s" : ""}`;
      } else {
        durationText = ` • ${minutes} min`;
      }
    }

    return `${formattedDate} - ${formattedTime}${durationText}`;
  };

  const formatPrice = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)} USD`;
  };

  const calculateTotalDuration = (
    services: Array<{ duration: { hours: number; minutes: number } }>
  ) => {
    if (!services || services.length === 0) return 0;
    const totalMinutes = services.reduce((total, service) => {
      return total + service.duration.hours * 60 + service.duration.minutes;
    }, 0);
    return totalMinutes;
  };

  const getServices = () => {
    if (
      appointment.appointmentType === "subscription" &&
      Array.isArray(appointment.subscriptionServices) &&
      appointment.subscriptionServices.length > 0
    ) {
      return appointment.subscriptionServices;
    } else if (
      appointment.appointmentType === "service" &&
      Array.isArray(appointment.services) &&
      appointment.services.length > 0
    ) {
      return appointment.services;
    }
    return [];
  };

  const services = getServices();
  const totalDuration = appointment.appointmentType === "subscription"
    ? Array.isArray(appointment.subscriptionServices)
      ? calculateTotalDuration(appointment.subscriptionServices)
      : 0
    : Array.isArray(appointment.services)
    ? calculateTotalDuration(appointment.services)
    : 0;

  return (
    <View style={styles.container}>
      <StackHeader title="Appointment Detail" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Status and Price Card */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: moderateHeightScale(16),
            }}
          >
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {appointment.status === "scheduled"
                  ? "On-going apt."
                  : appointment.status}
              </Text>
            </View>
            <Text style={styles.priceText}>
              {formatPrice(appointment.paidAmount)}
            </Text>
          </View>
        </View>

        {/* Appointment Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appointment Information</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>
                {formatDateTime(
                  appointment.appointmentDate,
                  appointment.appointmentTime,
                  totalDuration
                )}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <SubscriptionTicketIcon
              width={moderateWidthScale(18)}
              height={moderateWidthScale(18)}
            />
            <View style={{ flex: 1, marginLeft: moderateWidthScale(12) }}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {appointment.appointmentType === "subscription"
                  ? appointment.subscription || "Subscription"
                  : "Service Base"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <PersonIcon
              width={moderateWidthScale(18)}
              height={moderateWidthScale(18)}
            />
            <View style={{ flex: 1, marginLeft: moderateWidthScale(12) }}>
              <Text style={styles.infoLabel}>Customer</Text>
              <Text style={styles.infoValueBold}>{appointment.user}</Text>
              <Text style={[styles.infoValue, { fontSize: fontSize.size12 }]}>
                {appointment.userEmail}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Staff</Text>
              <Text style={styles.infoValueBold}>{appointment.staffName}</Text>
              <Text style={[styles.infoValue, { fontSize: fontSize.size12 }]}>
                {appointment.staffEmail}
              </Text>
            </View>
          </View>
        </View>

        {/* Services Card */}
        {services.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {appointment.appointmentType === "subscription"
                ? "Subscription Services"
                : "Services"}
            </Text>
            {services.map((service, index) => {
              const durationText =
                service.duration.hours > 0 && service.duration.minutes > 0
                  ? `${service.duration.hours}h ${service.duration.minutes}m`
                  : service.duration.hours > 0
                  ? `${service.duration.hours}h`
                  : `${service.duration.minutes}m`;

              return (
                <View
                  key={service.id}
                  style={[
                    styles.serviceItem,
                    index === services.length - 1 && styles.serviceItemLast,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {service.description && (
                      <Text
                        style={[
                          styles.servicePrice,
                          { fontSize: fontSize.size12, marginTop: moderateHeightScale(4) },
                        ]}
                      >
                        {service.description}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.servicePrice,
                        { fontSize: fontSize.size12, marginTop: moderateHeightScale(4) },
                      ]}
                    >
                      Duration: {durationText}
                    </Text>
                  </View>
                  <Text style={styles.servicePrice}>
                    {formatPrice(service.price)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Subscription Visits (if subscription type) */}
        {appointment.appointmentType === "subscription" &&
          appointment.subscriptionVisits && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Subscription Visits</Text>
              <View style={styles.infoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Used</Text>
                  <Text style={styles.infoValueBold}>
                    {appointment.subscriptionVisits.used} /{" "}
                    {appointment.subscriptionVisits.total}
                  </Text>
                </View>
              </View>
            </View>
          )}

        {/* Business Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Business Information</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="business-outline"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Business Name</Text>
              <Text style={styles.infoValueBold}>
                {appointment.businessTitle}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.infoIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{appointment.businessAddress}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {appointment.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          ) : (
            <Text style={styles.emptyNotes}>No notes available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

