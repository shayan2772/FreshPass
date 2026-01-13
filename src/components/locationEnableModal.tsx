import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import * as Location from "expo-location";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import Button from "@/src/components/button";
import { MapPinIcon } from "@/assets/icons";

interface LocationEnableModalProps {
  visible: boolean;
  onClose: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
    modalBox: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(20),
      padding: moderateWidthScale(24),
      width: "100%",
      maxWidth: widthScale(380),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    closeButton: {
      position: "absolute",
      top: moderateHeightScale(16),
      right: moderateWidthScale(16),
      width: moderateWidthScale(32),
      height: moderateWidthScale(32),
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.lightGreen015,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    iconWrapper: {
      alignItems: "center",
      marginBottom: moderateHeightScale(24),
    },
    iconContainer: {
      width: moderateWidthScale(100),
      height: moderateWidthScale(100),
      borderRadius: moderateWidthScale(50),
      backgroundColor: theme.lightGreen015,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateHeightScale(16),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      textAlign: "center",
      marginBottom: moderateHeightScale(12),
    },
    subtitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.text,
      textAlign: "center",
      marginBottom: moderateHeightScale(20),
      lineHeight: moderateHeightScale(24),
    },
    descriptionContainer: {
      backgroundColor: theme.lightGreen015,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(24),
      gap: moderateHeightScale(12),
    },
    descriptionText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      lineHeight: moderateHeightScale(20),
    },
    bulletPoint: {
      flexDirection: "row",
      gap: moderateWidthScale(8),
    },
    bulletDot: {
      width: moderateWidthScale(6),
      height: moderateWidthScale(6),
      borderRadius: moderateWidthScale(3),
      backgroundColor: theme.darkGreen,
      marginTop: moderateHeightScale(7),
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      lineHeight: moderateHeightScale(20),
    },
    buttonContainer: {
      gap: moderateHeightScale(12),
    },
    errorText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.red,
      textAlign: "center",
      marginBottom: moderateHeightScale(8),
      paddingHorizontal: moderateWidthScale(12),
    },
    skipButton: {
      paddingVertical: moderateHeightScale(14),
      alignItems: "center",
      justifyContent: "center",
    },
    skipButtonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
    },
  });

export default function LocationEnableModal({
  visible,
  onClose,
}: LocationEnableModalProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = async () => {
    setErrorMessage(null);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        const errorMsg = "Please turn on your phone location";
        setErrorMessage(errorMsg);
        showBanner("Location Error", errorMsg, "error");
        return;
      }
      onClose();
    } catch (error) {
      console.error("Error getting location:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Unable to get your location. Please make sure location services are enabled and try again.";
      setErrorMessage(errorMsg);
      showBanner("Location Error", errorMsg, "error");
    }
  };

 

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconContainer}>
              <MapPinIcon
                width={moderateWidthScale(50)}
                height={moderateHeightScale(60)}
                color={theme.darkGreen}
              />
            </View>
            <Text style={styles.title}>Enable Location</Text>
            <Text style={styles.subtitle}>
              Turn on location to discover businesses near you
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Businesses are shown nearby based on your current location. You
              can also change your location in the header by selecting the
              location option.
            </Text>
            <View style={styles.bulletPoint}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Find salons and services closest to you
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Get accurate distance and directions
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Without location, businesses will appear randomly
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <Button
              title="Enable Location"
              onPress={handleContinue}
              backgroundColor={theme.darkGreen}
              textColor={theme.white}
            />

            <TouchableOpacity
              style={styles.skipButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
