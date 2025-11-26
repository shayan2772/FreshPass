import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import DashboardHeader from "@/src/components/DashboardHeader";
import { MaterialIcons } from "@expo/vector-icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
    },
    contentContainer: {
      paddingVertical: moderateHeightScale(20),
    },
    title: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    placeholderText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      marginTop: moderateHeightScale(40),
    },
    listContainer: {
      marginTop: moderateHeightScale(24),
    },
    row: {
      paddingVertical: moderateHeightScale(14),
    },
    rowHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    rowSubtitle: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    rowDivider: {
      height: 1.1,
      backgroundColor: theme.borderLight,
    },
  });

export default function AccountScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  const handleRowPress = (key: string) => {
    console.log("Account row pressed:", key);
  };

  type Row = {
    key:
      | "personal"
      | "business"
      | "phone"
      | "language"
      | "notifications"
      | "rules"
      | "logout"
      | "delete";
    title: string;
    subtitle?: string;
  };

  const rows: Row[] = [
    { key: "personal", title: "Personal information" },
    { key: "business", title: "Business profile settings" },
    {
      key: "phone",
      title: "Phone number",
      subtitle: "Add phone number",
    },
    {
      key: "language",
      title: "Language",
      subtitle: "Default language (English)",
    },
    {
      key: "notifications",
      title: "Notification settings",
      subtitle: "Turned ON",
    },
    { key: "rules", title: "Rules and terms" },
    { key: "logout", title: "Log out" },
    { key: "delete", title: "Delete account" },
  ];

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Account settings</Text>

        <View style={styles.listContainer}>
          {rows.map((row, index) => {
            const isDelete = row.key === "delete";
            const isLogout = row.key === "logout";
            return (
              <View key={row.key}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRowPress(row.key)}
                  style={styles.row}
                >
                  <View style={styles.rowHeader}>
                    <View>
                      <Text
                        style={[
                          styles.rowTitle,
                          isDelete && { color: theme.red },
                        ]}
                      >
                        {row.title}
                      </Text>
                      {row.subtitle ? (
                        <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
                      ) : null}
                    </View>
                    {!isDelete && !isLogout && (
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={moderateWidthScale(18)}
                        color={theme.darkGreen}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {index !== rows.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
