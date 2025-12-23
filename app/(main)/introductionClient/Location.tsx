import React, { useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
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
  EnvelopeIcon,
  MegaphoneIcon,
  PersonScissorsIcon,
} from "@/assets/icons";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/src/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Screen1Props {
  onNext: () => void;
  onSkip: () => void;
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
    skipButton: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: moderateWidthScale(4),
    },
    skipButtonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
  });

export default function Screen1({ onNext, onSkip }: Screen1Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const isButtonMode = Platform.OS === "android" && insets.bottom > 30;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        source={IMAGES.introductionBack1}
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

            <Text style={styles.headline}>Never miss a customer</Text>

            <View
              style={{
                gap: moderateHeightScale(10),
                width: "92%",
                alignSelf: "center",
              }}
            >
              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <EnvelopeIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>
                    Instant booking alerts
                  </Text>
                  <Text style={styles.featureDescription}>
                    Get notified immediately when a new appointment is booked,
                    so you're always prepared.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <MegaphoneIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>
                    Modification & cancellations
                  </Text>
                  <Text style={styles.featureDescription}>
                    Receive instant updates if a client reschedules or cancels,
                    allowing you to fill the slot.
                  </Text>
                </View>
              </View>

              <View style={styles.featureContainer}>
                <View style={styles.iconContainer}>
                  <PersonScissorsIcon
                    width={moderateWidthScale(37)}
                    height={moderateWidthScale(37)}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Customer reminders</Text>
                  <Text style={styles.featureDescription}>
                    See a summary of which customers need an automatic reminder
                    before their appointment tomorrow.
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
              title="Turn on notifications"
              onPress={onNext}
              backgroundColor={theme.orangeBrown}
              textColor={theme.black}
            />

            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Not now</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateWidthScale(16)}
                color={theme.white}
                style={{top:1.5}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
