import { useTheme } from "@/src/hooks/hooks";
import React, { useMemo } from "react";
import { View, Text, StatusBar, Platform, PixelRatio } from "react-native";
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
import { moderateHeightScale } from "@/src/theme/dimensions";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import SocialAuthOptions from "@/src/components/socialAuthOptions";
import SectionSeparator from "@/src/components/sectionSeparator";
import { fontSize, fonts } from "@/src/theme/fonts";

export default function SocialLogin() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const insets = useSafeAreaInsets();
  const isButtonMode = Platform.OS === "android" && insets.bottom > 30;
  const NAVIGATION_BAR_HEIGHT = 48; // dp
  const pxHeight = PixelRatio.getPixelSizeForLayoutSize(NAVIGATION_BAR_HEIGHT);
  const router = useRouter();

  const handleSignInOrRegister = () => {
    router.push(`/${MAIN_ROUTES.REGISTER}`);
  };

  const handleGoogleLogin = () => {
    // Handle Google login
  };

  const handleAppleLogin = () => {
    // Handle Apple login
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
  };

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
              bottom: !isButtonMode ? 70 : 50,
            },
          ]}
        />
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={24}
              height={33}
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

          <View style={styles.paginationDots}>
            <View style={styles.dotOuter} />
            <View style={styles.dotActive} />
            <View style={styles.dotOuter} />
            <View style={styles.dotOuter} />
          </View>
        </View>

        {/* <LinearGradient
          colors={["rgba(254, 250, 224, 0)", (colors as Theme).darkGreen]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shade}
        /> */}
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
          containerStyle={styles.socialButtonsContainer}
        />

        <Text style={styles.legalText}>
          By continuing to use FreshPass, you agree to our{" "}
          <Text style={styles.legalLink}>Terms of Services</Text> &{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
