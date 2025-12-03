import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";

interface ServicePickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedServiceIds: string[];
  onSelectServices: (serviceIds: string[]) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.lightGreen4,
      marginBottom: moderateHeightScale(12),
    },
    serviceItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: moderateHeightScale(14),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    serviceName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    selectButton: {
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(4),
    },
    selectButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    selectedButton: {
      backgroundColor: theme.orangeBrown,
      borderColor: theme.orangeBrown,
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(12),
    },
  });

export default function ServicePickerBottomSheet({
  visible,
  onClose,
  selectedServiceIds,
  onSelectServices,
}: ServicePickerBottomSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const { services } = useAppSelector((state) => state.completeProfile);
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedServiceIds);

  // Only use services selected in Step 8
  const availableServices = useMemo(() => {
    return services;
  }, [services]);

  React.useEffect(() => {
    if (visible) {
      setLocalSelectedIds(selectedServiceIds);
    }
  }, [visible, selectedServiceIds]);

  const handleToggleService = (serviceId: string) => {
    // Handle service toggle
    const isSelected = localSelectedIds.includes(serviceId);
    if (isSelected) {
      // Remove this service
      setLocalSelectedIds(localSelectedIds.filter((id) => id !== serviceId));
    } else {
      // Add this service
      setLocalSelectedIds([...localSelectedIds, serviceId]);
    }
  };

  const handleSelect = () => {
    onSelectServices(localSelectedIds);
    onClose();
  };

  const renderServiceItem = (
    service: (typeof availableServices)[0],
    showBorder: boolean = true
  ) => {
    const isSelected = localSelectedIds.includes(service.id);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        key={service.id}
        style={[styles.serviceItem, !showBorder && { borderBottomWidth: 0 }]}
        onPress={() => handleToggleService(service.id)}
      >
        <Text style={styles.serviceName}>{service.name}</Text>
        <View
          style={[styles.selectButton, isSelected && styles.selectedButton]}
        >
          {isSelected && (
            <Feather
              name="check"
              size={moderateWidthScale(14)}
              color={theme.darkGreen}
            />
          )}
          <Text style={[styles.selectButtonText]}>
            {isSelected ? "Selected" : "+  Select"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select services"
      footerButtonTitle="Select"
      onFooterButtonPress={handleSelect}
    >
      {/* Services selected in Step 8 */}
      <Text style={styles.sectionTitle}>Select services:</Text>
      {availableServices.map((service) => renderServiceItem(service))}
    </ModalizeBottomSheet>
  );
}

