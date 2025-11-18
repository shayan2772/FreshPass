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

// Popular starting points suggestions (same as Step 8)
const POPULAR_SUGGESTIONS = [
  {
    id: "haircut-blowdry",
    name: "Haircut & blowdry",
    hours: 1,
    minutes: 0,
    price: 50,
    currency: "USD",
  },
  {
    id: "classic-manicure",
    name: "Classic manicure",
    hours: 0,
    minutes: 45,
    price: 35,
    currency: "USD",
  },
  {
    id: "60-min-massage",
    name: "60-minute massage",
    hours: 1,
    minutes: 0,
    price: 80,
    currency: "USD",
  },
];

// More suggestions for bottom sheet (same as Step 8)
const MORE_SUGGESTIONS = [
  {
    id: "all-over",
    name: "All over",
    hours: 2,
    minutes: 0,
    price: 100,
    currency: "USD",
  },
  {
    id: "female-haircut",
    name: "Female haircut",
    hours: 1,
    minutes: 5,
    price: 60,
    currency: "USD",
  },
  {
    id: "deep-conditioning",
    name: "Deep conditioning treatment",
    hours: 0,
    minutes: 45,
    price: 75,
    currency: "USD",
  },
  {
    id: "hair-styling",
    name: "Hair styling",
    hours: 1,
    minutes: 30,
    price: 90,
    currency: "USD",
  },
  {
    id: "silk-press",
    name: "Silk press",
    hours: 2,
    minutes: 0,
    price: 120,
    currency: "USD",
  },
  {
    id: "full-highlights",
    name: "Full highlights",
    hours: 3,
    minutes: 0,
    price: 200,
    currency: "USD",
  },
  {
    id: "balayage",
    name: "Balayage",
    hours: 3,
    minutes: 30,
    price: 250,
    currency: "USD",
  },
];

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

  // Combine Redux services with suggestions (same as Step 8)
  const allSuggestions = [...POPULAR_SUGGESTIONS, ...MORE_SUGGESTIONS];
  
  // Merge with actual services from Redux, prioritizing Redux services
  const availableServices = services.length > 0 
    ? services.map(s => ({
        id: s.id,
        name: s.name,
        hours: s.hours,
        minutes: s.minutes,
        price: s.price,
        currency: s.currency,
      }))
    : allSuggestions;

  React.useEffect(() => {
    if (visible) {
      setLocalSelectedIds(selectedServiceIds);
    }
  }, [visible, selectedServiceIds]);

  const handleToggleService = (serviceId: string) => {
    // Get all service IDs except "all-over"
    const otherServiceIds = availableServices
      .filter((s) => s.id !== "all-over")
      .map((s) => s.id);

    // Handle "all-over" service - select/deselect all
    if (serviceId === "all-over") {
      const isAllOverSelected = localSelectedIds.includes("all-over");
      if (isAllOverSelected) {
        // Unselect "all-over" and all other services
        setLocalSelectedIds([]);
      } else {
        // Select "all-over" and all other services
        setLocalSelectedIds(["all-over", ...otherServiceIds]);
      }
    } else {
      // Handle regular service toggle
      const isSelected = localSelectedIds.includes(serviceId);
      let newSelectedIds: string[];

      if (isSelected) {
        // Remove this service and "all-over" if it was selected
        newSelectedIds = localSelectedIds.filter(
          (id) => id !== serviceId && id !== "all-over"
        );
      } else {
        // Add this service
        newSelectedIds = [...localSelectedIds, serviceId];
        // Check if all other services are now selected, then also select "all-over"
        const allOtherSelected = otherServiceIds.every((id) =>
          newSelectedIds.includes(id)
        );
        if (allOtherSelected && availableServices.find((s) => s.id === "all-over")) {
          newSelectedIds.push("all-over");
        }
      }

      setLocalSelectedIds(newSelectedIds);
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
      {/* All over service at the top */}
      {(() => {
        const allOverService = availableServices.find((s) => s.id === "all-over");
        if (!allOverService) return null;
        return renderServiceItem(allOverService, false);
      })()}

      {/* Separator line */}
      <View style={styles.separator} />

      {/* Popular starting points section */}
      <Text style={styles.sectionTitle}>Popular starting points:</Text>
      {availableServices
        .filter((service) => service.id !== "all-over")
        .map((service) => renderServiceItem(service))}
    </ModalizeBottomSheet>
  );
}

