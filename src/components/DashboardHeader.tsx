import React, { useMemo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { LeafLogo } from "@/assets/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomToggleInside from "@/src/components/customToggleInside";
import { setOnlineStatus } from "@/src/state/slices/userSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(12),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginLeft: moderateWidthScale(5),
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    line: {
      width: "100%",
      height: 1.1,
      backgroundColor: theme.borderLight,
    },
  });

interface DashboardHeaderProps {
  canGoOnline?: boolean;
  onToggleAttempt?: () => void;
}

export default function DashboardHeader({
  canGoOnline = true,
  onToggleAttempt,
}: DashboardHeaderProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector((state) => state.user.isOnline);
  const insets = useSafeAreaInsets();

  const handleToggleChange = useCallback(
    (value: boolean) => {
      // Only dispatch if the value is actually different from current state
      // This prevents accidental toggles when component re-renders
      if (value !== isOnline) {
        // If trying to go online and canGoOnline is false, trigger animation
        if (value === true && !canGoOnline) {
          onToggleAttempt?.();
          return; // Don't allow toggle
        }
        // Allow going offline or going online when canGoOnline is true
        dispatch(setOnlineStatus(value));
      }
    },
    [dispatch, isOnline, canGoOnline, onToggleAttempt]
  );

  return (
    <View>
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top + moderateHeightScale(12) },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={widthScale(18)}
              height={heightScale(24)}
              color1={theme.darkGreen}
              color2={theme.darkGreen}
            />
            <Text style={styles.logoText}>FRESHPASS</Text>
          </View>
          <View style={styles.toggleContainer}>
            <CustomToggleInside value={isOnline} onValueChange={handleToggleChange} />
          </View>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
}
