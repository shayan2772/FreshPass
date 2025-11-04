import Header from "@/src/components/header/header";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MAIN_ROUTES } from "@/src/constant/routes";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      gap: 40,
    },
    welcomeSection: {
      alignItems: "center",
      gap: 10,
    },
    welcomeTitle: {
      color: theme.text,
      fontSize: fontSize.size32,
      fontFamily: fonts.fontBold,
    },
    welcomeSubtitle: {
      color: theme.text,
      fontSize: fontSize.size18,
      fontFamily: fonts.fontRegular,
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
    },
    button: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      minWidth: 200,
    },
    buttonText: {
      color: theme.selectedDropDownText,
      fontSize: fontSize.size18,
      fontFamily: fonts.fontSemibold,
    },
  });


export default function Dashboard() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();

  const handleGoToHome = () => {
    router.push(`/${MAIN_ROUTES.HOME}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>{t("dashboard")}</Text>
          <Text style={styles.welcomeSubtitle}>
            {t("welcome")}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGoToHome}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={20} color={colors.selectedDropDownText} />
            <Text style={styles.buttonText}>
              {t("goToHome")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

