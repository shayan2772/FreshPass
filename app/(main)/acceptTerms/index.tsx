import React, { useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { IMAGES } from "@/src/constant/images";
import { MAIN_ROUTES } from "@/src/constant/routes";
import { LeafLogo } from "@/assets/icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.darkGreen,
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(15),
      paddingTop: moderateHeightScale(45),
      paddingBottom: moderateHeightScale(40),
    },
    logoContainer: {
      marginBottom: moderateHeightScale(70),
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    logoText: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    headline: {
      fontSize: fontSize.size32,
      fontFamily: fonts.fontBold,
      color: theme.white,
      lineHeight: moderateHeightScale(40),
    },
    bodyText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      lineHeight: moderateHeightScale(22),
    },
    boldText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.white,
      lineHeight: moderateHeightScale(22),
    },
    buttonContainer: {
      marginTop: "auto",
      paddingTop: moderateHeightScale(20),
    },
    button: {
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(14),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
  });

export default function AcceptTerms() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;

  // Disable back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent going back
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const handleGetStarted = useCallback(() => {
    // Navigate to dashboard
    router.replace(`/(main)/${MAIN_ROUTES.DASHBOARD}`);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        source={IMAGES.acceptTermBack}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={moderateWidthScale(30)}
              height={moderateWidthScale(30)}
              color1={(colors as Theme).white}
              color2={(colors as Theme).white}
            />
            <Text style={styles.logoText}>FRESHPASS</Text>
          </View>

          <View style={{ gap: moderateHeightScale(12) }}>
            <Text style={styles.headline}>
              Welcome to your new business command center
            </Text>

            <Text style={styles.boldText}>
              FreshPass is designed to simplify your operations and grow your
              revenue.
            </Text>

            <Text style={styles.bodyText}>
              Easily manage team schedules, process payments, track
              subscriptions, and monitor staff performance—all from one powerful
              dashboard.
            </Text>

            <Text style={styles.bodyText}>
              Stay connected on the go. Use the FreshPass mobile app to manage
              bookings, send reminders, and view real-time business insights
              from anywhere.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Get started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
