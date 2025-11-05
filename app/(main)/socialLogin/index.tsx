import { useTheme } from "@/src/hooks/hooks";
import React, { useMemo } from "react";
import { View, Text, StatusBar } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "./styles";
import { Theme } from "@/src/theme/colors";
import { IMAGES } from "@/src/constant/images";
import { LeafLogo, GoogleIcon, AppleIcon, FacebookIcon } from "@/assets/icons";
import Button from "@/src/components/button";
import SocialLoginButton from "@/src/components/socialLoginButton";

export default function SocialLogin() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  const handleSignInOrRegister = () => {
    // Handle sign in or register
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
        <Image source={IMAGES.socialBackgroud} style={styles.backgroundImage} />
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
        <LinearGradient
          colors={["rgba(254, 250, 224, 0)", (colors as Theme).darkGreen]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shade}
        />
      </View>

      <View style={styles.bottomSection}>
        <Button title="Sign in or Register" onPress={handleSignInOrRegister} />

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <SocialLoginButton
            icon={<GoogleIcon />}
            title="Continue with Google"
            onPress={handleGoogleLogin}
          />
          <SocialLoginButton
            icon={<AppleIcon />}
            title="Continue with Apple"
            onPress={handleAppleLogin}
          />
          <SocialLoginButton
            icon={<FacebookIcon />}
            title="Continue with Facebook"
            onPress={handleFacebookLogin}
          />
        </View>

        <Text style={styles.legalText}>
          By continuing to use FreshPass, you agree to our{" "}
          <Text style={styles.legalLink}>Terms of Services</Text> &{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
