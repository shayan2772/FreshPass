import React, { useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    workHistoryContainer: {
      marginBottom: moderateHeightScale(24),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    sectionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    sectionLink: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.selectCard,
      textDecorationLine: "underline",
      textDecorationColor: theme.selectCard,
    },
    workHistoryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    workHistoryService: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    workHistoryDate: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    workHistoryPrice: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(12),
    },
  });

// Static data
const workHistoryData = [
  {
    id: "1",
    service: "Haircut + Beard Trim",
    date: "08/16/2025 - 11:30 am - 01:30 pm",
    price: "$27.39",
  },
  {
    id: "2",
    service: "Clean shave + Massage",
    date: "08/15/2025 - 10:00 am - 11:00 am",
    price: "$15.99",
  },
];

export default function WorkHistory() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  return (
    <View style={styles.workHistoryContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Work history</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>View all</Text>
        </TouchableOpacity>
      </View>
      {workHistoryData.map((item, index) => (
        <View key={item.id}>
          <View style={styles.workHistoryItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.workHistoryService}>{item.service}</Text>
              <Text style={styles.workHistoryDate}>{item.date}</Text>
            </View>
            <Text style={styles.workHistoryPrice}>{item.price}</Text>
          </View>
          {index < workHistoryData.length - 1 && <View style={styles.line} />}
        </View>
      ))}
    </View>
  );
}