import React, { useMemo } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { moderateWidthScale } from "@/src/theme/dimensions";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    loaderContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(24),
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default function ActionLoader() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const actionLoader = useAppSelector((state) => state.general.actionLoader);

  return (
    <Modal
      transparent
      visible={actionLoader}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    </Modal>
  );
}

