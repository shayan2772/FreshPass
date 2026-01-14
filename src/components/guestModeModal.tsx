import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useTheme, useAppSelector, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateWidthScale,
  moderateHeightScale,
  widthScale,
  heightScale,
} from "@/src/theme/dimensions";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import { setGuestModeModalVisible } from "@/src/state/slices/generalSlice";
import Button from "@/src/components/button";
import { Feather } from "@expo/vector-icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(16),
      width: widthScale(320),
      maxWidth: "90%",
      padding: moderateWidthScale(24),
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: moderateHeightScale(4),
      },
      shadowOpacity: 0.3,
      shadowRadius: moderateWidthScale(8),
      elevation: 8,
    },
    closeButton: {
      position: "absolute",
      top: moderateHeightScale(16),
      right: moderateWidthScale(16),
      padding: moderateWidthScale(8),
      zIndex: 1,
    },
    iconContainer: {
      width: widthScale(64),
      height: heightScale(64),
      borderRadius: moderateWidthScale(32),
      backgroundColor: theme.lightGreen07,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: moderateHeightScale(16),
    },
    title: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.text,
      textAlign: "center",
      marginBottom: moderateHeightScale(12),
    },
    message: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      textAlign: "center",
      lineHeight: moderateHeightScale(22),
      marginBottom: moderateHeightScale(24),
    },
    buttonContainer: {
      width: "100%",
    },
  });

export default function GuestModeModal() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const guestModeModalVisible = useAppSelector(
    (state) => state.general.guestModeModalVisible
  );

  const handleClose = () => {
    dispatch(setGuestModeModalVisible(false));
  };

  const handleSignIn = () => {
    dispatch(setGuestModeModalVisible(false));
    router.push(`/(main)/${MAIN_ROUTES.LOGIN}` as any);
  };

  return (
    <Modal
      transparent
      visible={guestModeModalVisible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={moderateWidthScale(8)}
          >
            <Feather
              name="x"
              size={moderateWidthScale(20)}
              color={theme.text}
            />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Feather
              name="user"
              size={moderateWidthScale(32)}
              color={theme.darkGreen}
            />
          </View>

          <Text style={styles.title}>Guest Mode</Text>

          <Text style={styles.message}>
            You are currently browsing as a guest. To access all features and
            make bookings, please sign in to your account.
          </Text>

          <View style={styles.buttonContainer}>
            <Button title="Sign In" onPress={handleSignIn} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
