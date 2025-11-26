import React, { useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { s } from "react-native-size-matters";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    appointmentsContainer: {
      marginBottom: moderateHeightScale(18),
    },
    sectionHeader: {
      marginBottom: moderateHeightScale(12),
    },
    sectionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    upcomingCard: {
      backgroundColor: theme.upcomingCard,
      borderRadius: moderateWidthScale(6),
      padding: moderateWidthScale(12),
      marginBottom: moderateHeightScale(12),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.upcomingBorder,
    },
    upcomingText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    sectionLink: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.selectCard,
      flexDirection: "row",
      alignItems: "center",
    },
    currentAppointmentCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(12),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      flexDirection: "row",
      // alignItems: "center",
      justifyContent: "space-between",
    },
    appointmentService: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    appointmentPrice: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    appointmentServiceRow: {
      // flexDirection: "row",
      // alignItems: "center",
      // justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    appointmentInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    appointmentInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: moderateWidthScale(16),
      marginBottom: moderateHeightScale(8),
    },
    appointmentInfoText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      marginLeft: 2,
    },
    appointmentStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    appointmentStatus: {
      backgroundColor: theme.appointmentStatus,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(4),
      flexDirection: "row",
      alignItems: "center",
    },
    appointmentStatusText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.selectCard,
    },
  });

export default function AppointmentsSection() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  return (
    <View style={styles.appointmentsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Appointments</Text>
      </View>
      <View style={styles.upcomingCard}>
        <Text style={styles.upcomingText}>3 upcoming appointments</Text>
        <TouchableOpacity>
          <View style={styles.sectionLink}>
            <Text style={styles.sectionLink}>View calendar</Text>
            <Entypo
              name="chevron-small-right"
              size={moderateWidthScale(18)}
              color={theme.selectCard}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.currentAppointmentCard}>
        <View style={{ gap: 7, flex: 1 }}>
          <Text numberOfLines={1} style={styles.appointmentService}>
            Haircut & beard trim - Hot tow
          </Text>
          <View style={styles.appointmentInfoContainer}>
            <View style={styles.appointmentInfoRow}>
              <Ionicons
                name="bookmark-outline"
                size={moderateWidthScale(15)}
                color={theme.darkGreen}
              />
              <Text style={styles.appointmentInfoText}>Golder member</Text>
            </View>
            <View style={styles.appointmentInfoRow}>
              <Ionicons
                name="person-outline"
                size={moderateWidthScale(15)}
                color={theme.darkGreen}
              />
              <Text style={styles.appointmentInfoText}>Sanna</Text>
            </View>
            <View style={styles.appointmentInfoRow}>
              <Ionicons
                name="time-outline"
                size={moderateWidthScale(15)}
                color={theme.darkGreen}
              />
              <Text style={styles.appointmentInfoText}>
                1/5/2025 - 12:30 pm • 45 min
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 10, alignItems: "flex-end" }}>
          <Text style={styles.appointmentPrice}>$132.00 USD</Text>
          <View style={styles.appointmentStatusRow}>
            <View style={styles.appointmentStatus}>
              <Text style={styles.appointmentStatusText}>On-going apt.</Text>
            </View>
            <Entypo
              name="chevron-small-right"
              size={moderateWidthScale(22)}
              color={theme.darkGreen}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
