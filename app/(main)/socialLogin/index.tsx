import { useTheme } from "@/src/hooks/hooks";
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StatusBar, Platform, Linking, Alert } from "react-native";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { createStyles } from "./styles";
import { Theme } from "@/src/theme/colors";
import { IMAGES } from "@/src/constant/images";
import { LeafLogo } from "@/assets/icons";
import Button from "@/src/components/button";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import SocialAuthOptions from "@/src/components/socialAuthOptions";
import SectionSeparator from "@/src/components/sectionSeparator";
import RoleSelectionBottomSheet from "@/src/components/roleSelectionBottomSheet";

type SocialProvider = "google" | "apple" | "facebook";

// Links from environment
const TERMS_AND_CONDITIONS_URL = process.env.EXPO_PUBLIC_TERMS_URL || "";
const PRIVACY_POLICY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL || "";

export default function SocialLogin() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const insets = useSafeAreaInsets();
  const isButtonMode = Platform.OS === "android" && insets.bottom > 30;
  const router = useRouter();

  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [pendingSocialLogin, setPendingSocialLogin] =
    useState<SocialProvider | null>(null);
 

  const handleSignInOrRegister = () => {
    // router.push(`/${MAIN_ROUTES.REGISTER}`);
    router.push(`/${MAIN_ROUTES.LOGIN}`);
  };

  const handleGoogleLogin = useCallback(() => {
    setPendingSocialLogin("google");
    setShowRoleSheet(true);
  }, []);

  const handleAppleLogin = useCallback(() => {
    setPendingSocialLogin("apple");
    setShowRoleSheet(true);
  }, []);

  const handleFacebookLogin = useCallback(() => {
    setPendingSocialLogin("facebook");
    setShowRoleSheet(true);
  }, []);

  const handleGuestLogin = () => {
    // Handle guest login
  };

  const handleRoleSelect = useCallback(
    (role: "business" | "client") => {
      if (pendingSocialLogin) {
        console.log("Social login:", pendingSocialLogin, "Role:", role);
        setPendingSocialLogin(null);
      }
    },
    [pendingSocialLogin]
  );

  const handleRoleSheetClose = useCallback(() => {
    setShowRoleSheet(false);
    setPendingSocialLogin(null);
  }, []);

  const handleOpenLink = useCallback(async (url: string, title: string) => {
    if (!url) {
      Alert.alert("Error", `${title} URL is not configured`);
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${title}`);
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("Error", `Failed to open ${title}`);
    }
  }, []);

  const handleTermsPress = useCallback(() => {
    handleOpenLink(TERMS_AND_CONDITIONS_URL, "Terms of Services");
  }, [handleOpenLink]);

  const handlePrivacyPress = useCallback(() => {
    handleOpenLink(PRIVACY_POLICY_URL, "Privacy Policy");
  }, [handleOpenLink]);

  const isGuest = true; // Set to true to show guest login button

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated
        translucent
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />
      <View style={styles.backgroundImageContainer}>
        <Image
          source={IMAGES.socialBackgroud}
          style={[
            styles.backgroundImage,
            {
              bottom: !isButtonMode ? 90 : 70,
            },
          ]}
        />
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={moderateWidthScale(25)}
              height={moderateWidthScale(33)}
              color1={(colors as Theme).white}
              color2={(colors as Theme).white}
            />
            <Text style={styles.logoText}>FRESHPASS</Text>
          </View>

          <View style={styles.taglineContainer}>
            <Text style={styles.tagline1}>
              Always Ready <Text style={styles.tagline2}>Always You</Text>
            </Text>
          </View>

          {/* <View style={styles.paginationDots}>
            <View style={styles.dotOuter} />
            <View style={styles.dotActive} />
            <View style={styles.dotOuter} />
            <View style={styles.dotOuter} />
          </View> */}
        </View>
      </View>

      <View
        style={[
          styles.bottomSection,
          {
            paddingBottom: isButtonMode
              ? insets.bottom + 12
              : moderateHeightScale(25),
          },
        ]}
      >
        <Button title="Sign in or Register" onPress={handleSignInOrRegister} />

        <SectionSeparator />

        <SocialAuthOptions
          onGoogle={handleGoogleLogin}
          onApple={handleAppleLogin}
          onFacebook={handleFacebookLogin}
          onGuest={handleGuestLogin}
          isGuest={isGuest}
          containerStyle={styles.socialButtonsContainer}
        />

        <Text style={styles.legalText}>
          By continuing to use FreshPass, you agree to our{" "}
          <Text style={styles.legalLink} onPress={handleTermsPress}>
            Terms of Services
          </Text>{" "}
          &{" "}
          <Text style={styles.legalLink} onPress={handlePrivacyPress}>
            Privacy Policy
          </Text>
        </Text>
      </View>

      <RoleSelectionBottomSheet
        visible={showRoleSheet}
        onClose={handleRoleSheetClose}
        onRoleSelect={handleRoleSelect}
      />
    </SafeAreaView>
  );
}
