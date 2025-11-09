import React, { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Theme } from "@/src/theme/colors";
import { useTheme } from "@/src/hooks/hooks";
import {
  moderateHeightScale,
} from "@/src/theme/dimensions";
import SocialLoginButton from "@/src/components/socialLoginButton";
import { GoogleIcon, AppleIcon, FacebookIcon } from "@/assets/icons";

interface SocialAuthOptionsProps {
  onGoogle: () => void;
  onApple: () => void;
  onFacebook: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  spacingVariant?: "default" | "compact";
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: moderateHeightScale(15),
    },
    buttonWrapper: {
      width: "100%",
    },
  });

export default function SocialAuthOptions({
  onGoogle,
  onApple,
  onFacebook,
  containerStyle,
}: SocialAuthOptionsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.buttonWrapper}>
        <SocialLoginButton
          icon={<GoogleIcon />}
          title="Continue with Google"
          onPress={onGoogle}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <SocialLoginButton
          icon={<AppleIcon />}
          title="Continue with Apple"
          onPress={onApple}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <SocialLoginButton
          icon={<FacebookIcon />}
          title="Continue with Facebook"
          onPress={onFacebook}
        />
      </View>
    </View>
  );
}
