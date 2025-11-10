import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import Button from "@/src/components/button";
import RegisterHeader from "@/src/components/registerHeader";
import SocialAuthOptions from "@/src/components/socialAuthOptions";
import SectionSeparator from "@/src/components/sectionSeparator";

type SocialProvider = "google" | "apple" | "facebook";

interface RegisterStepOneProps {
  onBack: () => void;
  onContinue: () => void;
  onSocialLogin: (provider: SocialProvider) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      gap: moderateHeightScale(20),
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(24),
      paddingBottom: moderateHeightScale(15),
    },
    content: {
      flexGrow: 1,
      gap: moderateHeightScale(20),
    },
    titleSection: {
      gap: moderateHeightScale(8),
    },
    title: {
      fontSize: fontSize.size26,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      lineHeight: fontSize.size32,
    },
    description: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: fontSize.size18,
    },
    inputWrapper: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(10),
      gap: moderateHeightScale(2),
    },
    inputLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      flex: 1,
      height: heightScale(22),
      paddingVertical: 0,
      textAlignVertical: "center",
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    iconButton: {
      width: widthScale(18),
      height: widthScale(18),
      borderRadius: moderateWidthScale(18 / 2),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    newsletterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    newsletterIconWrapper: {
      width: widthScale(46),
      height: widthScale(46),
      borderRadius: moderateWidthScale(46 / 2),
      backgroundColor: theme.lightBeige,
      alignItems: "center",
      justifyContent: "center",
    },
    checkbox: {
      width: moderateWidthScale(24),
      height: moderateWidthScale(24),
      borderRadius: moderateWidthScale(5),
      borderWidth: 1.5,
      borderColor: theme.black,
      alignItems: "center",
      justifyContent: "center",
    },
    newsletterText: {
      flex: 1,
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: fontSize.size18,
    },
    primaryButtonWrapper: {
      marginTop: moderateHeightScale(4),
    },
    socialList: {},
    footer: {},
    legalText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      lineHeight: fontSize.size16,
    },
    legalHighlight: {
      fontFamily: fonts.fontMedium,
      color: theme.link,
      textDecorationLine: "underline",
      textDecorationColor: theme.link,
    },
  });

const DEFAULT_EMAIL = "";

export default function RegisterStepOne({
  onBack,
  onContinue,
  onSocialLogin,
}: RegisterStepOneProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const handleClear = useCallback(() => {
    setEmail("");
  }, []);

  const handleToggleNewsletter = useCallback(() => {
    setIsSubscribed((prev) => !prev);
  }, []);

  const placeholderColor = (colors as Theme).lightGreen2;

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} />

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create your business profile</Text>
            <Text style={styles.description}>
              Upload your photo and enter your details to get started with
              FreshPass.
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {email.length > 0 && (
                <Pressable
                  onPress={handleClear}
                  style={styles.iconButton}
                  // hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name="x"
                    size={moderateWidthScale(14)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              )}
            </View>
          </View>

          <Pressable
            onPress={handleToggleNewsletter}
            style={styles.newsletterRow}
            hitSlop={moderateWidthScale(8)}
          >
            <View style={styles.newsletterIconWrapper}>
              <View style={styles.checkbox}>
                {isSubscribed && (
                  <FontAwesome5
                    name="check"
                    size={moderateWidthScale(14)}
                    color={(colors as Theme).orangeBrown}
                  />
                )}
              </View>
            </View>
            <Text style={styles.newsletterText}>
              I would like to receive newsletter and promotion on email by
              FreshPass
            </Text>
          </Pressable>

          <Button
            title="Continue"
            onPress={onContinue}
            containerStyle={styles.primaryButtonWrapper}
          />

          <SectionSeparator />

          <SocialAuthOptions
            onGoogle={() => onSocialLogin("google")}
            onApple={() => onSocialLogin("apple")}
            onFacebook={() => onSocialLogin("facebook")}
            containerStyle={styles.socialList}
          />

          <View style={styles.footer}>
            <Text style={styles.legalText}>
              By continuing to use FreshPass, you agree to our
              <Text> </Text>
              <Text style={styles.legalHighlight}>Terms of Services</Text>
              <Text> &amp; </Text>
              <Text style={styles.legalHighlight}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
