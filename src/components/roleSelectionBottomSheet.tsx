import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { moderateHeightScale } from "@/src/theme/dimensions";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import RadioOption from "@/src/components/radioOption";
import { setRole, UserRole } from "@/src/state/slices/generalSlice";

interface RoleSelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    mainSheet: {
      backgroundColor: theme.background,
    },
    content: {
      paddingVertical: moderateHeightScale(5),
      gap: moderateHeightScale(14),
    },
  });

export default function RoleSelectionBottomSheet({
  visible,
  onClose,
  onContinue,
}: RoleSelectionBottomSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const dispatch = useAppDispatch();

  // Get selected role from Redux
  const selectedRoleFromRedux = useAppSelector((state) => state.general.role);

  // Local state for role selection in the sheet
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    selectedRoleFromRedux || "business" // Default to "business"
  );

  // Update local state when Redux role changes
  useEffect(() => {
    if (selectedRoleFromRedux) {
      setSelectedRole(selectedRoleFromRedux);
    }
  }, [selectedRoleFromRedux]);

  const handleOptionSelect = useCallback((option: Exclude<UserRole, null>) => {
    setSelectedRole(option);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedRole) {
      // Save selected role to Redux
      dispatch(setRole(selectedRole));
      // Call the onContinue callback
      onContinue();
      // Close the sheet
      onClose();
    }
  }, [selectedRole, dispatch, onContinue, onClose]);

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select role"
      footerButtonTitle="Continue"
      onFooterButtonPress={handleContinue}
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
