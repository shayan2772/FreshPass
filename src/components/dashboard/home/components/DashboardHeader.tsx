import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
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
  });

export default function DashboardHeader() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [isOnline, setIsOnline] = useState(true);
 const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top+moderateHeightScale(12) }]}>
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
          <CustomToggleInside value={isOnline} onValueChange={setIsOnline} />
        </View>
      </View>
    </View>
  );
}

