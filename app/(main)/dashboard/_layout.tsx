import { Tabs } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Theme } from "@/src/theme/colors";
import {
  HomeIcon,
  CalendarIcon,
  ChatIcon,
  NotificationIcon,
  AccountIcon,
} from "@/assets/icons";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { fontSize, fonts } from "@/src/theme/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.white,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      paddingTop: moderateHeightScale(8),
    },
    tabBarLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      marginTop: moderateHeightScale(4),
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(20),
    },
    iconBackground: {
      backgroundColor: theme.lightGreen2,
    },
  });

export default function DashboardLayout() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const isButtonMode = Platform.OS === "android" && insets.bottom > 30;
 
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.buttonBack,
        tabBarInactiveTintColor: theme.lightGreen,
        tabBarStyle: [styles.tabBar, {height: isButtonMode ? moderateHeightScale(110)   : moderateHeightScale(80)}],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconBackground,
              ]}
            >
              <HomeIcon width={size} height={size} color={color} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Booking",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconBackground,
              ]}
            >
              <CalendarIcon width={size} height={size} color={color} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconBackground,
              ]}
            >
              <NotificationIcon width={size} height={size} color={color} focused={focused} />
            </View>
          ),
          // tabBarBadge: "9+",
          // tabBarBadgeStyle: {
          //   backgroundColor: theme.red,
          //   minWidth: moderateWidthScale(18),
          //   height: moderateHeightScale(18),
          //   borderRadius: moderateWidthScale(9),
          // },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconBackground,
              ]}
            >
              <ChatIcon width={size} height={size} color={color} focused={focused} />
            </View>
          ),
          // tabBarBadge: 1,
          // tabBarBadgeStyle: {
          //   backgroundColor: theme.red,
          //   minWidth: moderateWidthScale(18),
          //   height: moderateHeightScale(18),
          //   borderRadius: moderateWidthScale(9),
          // },
        }}
      />
      
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconBackground,
              ]}
            >
              <AccountIcon width={size} height={size} color={color} focused={focused} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
