import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { moderateHeightScale } from "@/src/theme/dimensions";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import RadioOption from "@/src/components/radioOption";
import { UserRole } from "@/src/state/slices/generalSlice";

interface RoleSelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onRoleSelect: (role: "business" | "client") => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    mainSheet: {
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: moderateHeightScale(15),
      gap: moderateHeightScale(15),
    },
  });

export default function RoleSelectionBottomSheet({
  visible,
  onClose,
  onRoleSelect,
}: RoleSelectionBottomSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  // Local state for role selection in the sheet - no default selection
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // Reset selection when sheet opens
  useEffect(() => {
    if (visible) {
      setSelectedRole(null);
    }
  }, [visible]);

  const handleOptionSelect = useCallback(
    (option: Exclude<UserRole, null>) => {
      // Only handle business and client roles
      if (option === "business" || option === "client") {
        setSelectedRole(option);
        // Call onRoleSelect with selected role
        onRoleSelect(option);
        // Close the sheet
        onClose();
      }
    },
    [onRoleSelect, onClose]
  );

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select role"
      sheetContainerStyle={styles.mainSheet}
    >
      <View style={styles.content}>
        <RadioOption
          title="I manage a Business"
          subtitle="Login to your business dashboard"
          option="business"
          selectedOption={selectedRole}
          onPress={handleOptionSelect}
        />

        <RadioOption
          title="I'm a Client"
          subtitle="Book, subscribe, and manage your visits"
          option="client"
          selectedOption={selectedRole}
          onPress={handleOptionSelect}
        />
      </View>
    </ModalizeBottomSheet>
  );
}
