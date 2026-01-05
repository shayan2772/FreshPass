import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
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
import Button from "@/src/components/button";

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
      paddingBottom: moderateHeightScale(30),
    },
    bottomButton: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(20),
      paddingTop: moderateHeightScale(2),
    },
  });

export default function bookingDetailsById() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const router = useRouter();

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
      ></ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button title={"Cancel this booking"} onPress={() => {}} s/>
      </View>
    </SafeAreaView>
  );
}
