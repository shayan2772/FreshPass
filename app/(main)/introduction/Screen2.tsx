import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { IMAGES } from "@/src/constant/images";
import {
  LeafLogo,
  DashboardIcon,
  CRMIcon,
  RevenueReportingIcon,
} from "@/assets/icons";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/src/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Screen2Props {
  onNext: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.darkGreen,
    },
    backgroundImage: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(15),
      paddingTop: moderateHeightScale(45),
      paddingBottom: moderateHeightScale(35),
    },
    logoContainer: {
      marginBottom: moderateHeightScale(80),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
    },
    logoText: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    headline: {
      fontSize: fontSize.size23,
      fontFamily: fonts.fontBold,
      color: theme.white,
      lineHeight: moderateHeightScale(40),
      marginBottom: moderateHeightScale(25),
    },
    featureContainer: {
      marginBottom: moderateHeightScale(20),
      flexDirection: "row",
      gap: moderateWidthScale(18),
      alignItems: "center",
    },
    iconContainer: {},
    featureContent: {
      flex: 1,
      gap: moderateHeightScale(5),
    },
    featureTitle: {
      fontSize: fontSize.size17,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    featureDescription: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      lineHeight: moderateHeightScale(17),
    },
    footerText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.white70,
      maxWidth: "75%",
    },
    buttonContainer: {
      gap: moderateHeightScale(15),
    },
  });

export default function Screen2({ onNext }: Screen2Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const isButtonMode = Platform.OS === "android" && insets.bottom > 30;

  return (
    <View style={styles.container}>
       <StatusBar barStyle={"light-content"} />
      <ImageBackground
        source={IMAGES.introductionBack2}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View
          style={[
            styles.content,
            {
              paddingBottom: isButtonMode
                ? moderateHeightScale(30) + insets.bottom
                : moderateHeightScale(30),
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.logoContainer}>
              <LeafLogo
                width={moderateWidthScale(25)}
                height={moderateWidthScale(33)}
                color1={theme.white}
                color2={theme.white}
              />
              <Text style={styles.logoText}>FRESHPASS</Text>
            </View>

            <Text style={styles.headline}>Discover & book instantly.</Text>

            <View
              style={{
                gap: moderateHeightScale(10),
                width: "92%",
                alignSelf: "center",
              }}
            >
              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <DashboardIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>All-in-one dashboard</Text>
                  <Text style={styles.featureDescription}>
                    Get a real-time view of your daily appointments, staff
                    performance, and revenue—all from a single screen.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <CRMIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Smart customer CRM</Text>
                  <Text style={styles.featureDescription}>
                    Track client history, preferences, and membership status to
                    provide personalized service and boost retention.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <RevenueReportingIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>
                    Automated revenue & reporting
                  </Text>
                  <Text style={styles.featureDescription}>
                    Effortlessly track your income from subscriptions, single
                    services, and product sales with detailed, exportable
                    reports.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.footerText}>
              Stop notifications anytime if you change you mind.
            </Text>
            <Button
              title="Next"
              onPress={onNext}
              backgroundColor={theme.orangeBrown}
              textColor={theme.black}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
