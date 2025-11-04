import Header from "@/src/components/header/header";
import { getLangLabel, isRTL } from "@/src/constant/functions";
import { IMAGES } from "@/src/constant/images";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    logo: {
      width: 180,
      height: 180,
      position: "absolute",
      top: 10,
    },
    main: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    title: {
      color: theme.text,
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
    },
    backButton: {
      position: "absolute",
      top: 60,
      zIndex: 10,
      padding: 8,
    },
  });

export default function Home() {
  const { colors, theme, themeType } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const rotateYAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const isRTLMode = isRTL(i18n.language);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateYAnim, {
        toValue: 1,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== "web",
      })
    ).start();
  }, [rotateYAnim]);

  const rotateY = rotateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name={isRTLMode ? "arrow-forward" : "arrow-back"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      <Animated.Image
        source={IMAGES.x2Logo}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            transform: [{ perspective: 1000 }, { rotateY }],
          },
        ]}
      />
      <View style={styles.main}>
        <Text style={styles.title}>
          {t("current")} {t("theme")}: {theme}
        </Text>
        <Text style={styles.title}>
          {t("current")} {t("type")}: {themeType}
        </Text>
        <Text style={styles.title}>
          {t("current")} {t("language")}: {getLangLabel(i18n.language)}
        </Text>
      </View>
    </SafeAreaView>
  );
}


