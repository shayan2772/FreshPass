import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "@gorhom/portal";
import { Feather } from "@expo/vector-icons";
import { useAppDispatch, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import {
  addService,
  removeService,
} from "@/src/state/slices/completeProfileSlice";
import Button from "@/src/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ServiceListBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  suggestions: Array<{
    id: string;
    name: string;
    hours: number;
    minutes: number;
    price: number;
    currency: string;
  }>;
  selectedServiceIds: string[];
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    bottomSheet: {
      backgroundColor: theme.white,
      borderTopLeftRadius: moderateWidthScale(24),
      borderTopRightRadius: moderateWidthScale(24),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: moderateHeightScale(22),
      paddingHorizontal: moderateWidthScale(20),
    },
    headerTitle: {
      fontSize: fontSize.size20,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      flex: 1,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    closeButton: {
      width: widthScale(18),
      height: widthScale(18),
      borderRadius: moderateWidthScale(18 / 2),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      width: "100%",
    },
    scrollContent: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(7),
      paddingBottom: moderateHeightScale(20),
    },
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
    buttonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(5),
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.borderLight,
      marginVertical: moderateHeightScale(12),
    },
  });

export default function ServiceListBottomSheet({
  visible,
  onClose,
  suggestions,
  selectedServiceIds,
}: ServiceListBottomSheetProps) {
  const modalizeRef = useRef<Modalize>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const maxContentHeight = screenHeight * 0.75;
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedServiceIds);

  useEffect(() => {
    if (visible) {
      setLocalSelectedIds(selectedServiceIds);
      setTimeout(() => {
        modalizeRef.current?.open();
      }, 100);
    } else {
      modalizeRef.current?.close();
    }
  }, [visible, selectedServiceIds]);

  const handleToggleService = (serviceId: string) => {
    // Get all service IDs except "all-over"
    const otherServiceIds = suggestions
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
        if (allOtherSelected && suggestions.find((s) => s.id === "all-over")) {
          newSelectedIds.push("all-over");
        }
      }

      setLocalSelectedIds(newSelectedIds);
    }
  };

  const handleSelect = () => {
    // Add newly selected services
    const newlySelected = suggestions.filter(
      (s) =>
        localSelectedIds.includes(s.id) && !selectedServiceIds.includes(s.id)
    );

    // Remove unselected services
    const toRemove = selectedServiceIds.filter(
      (id) => !localSelectedIds.includes(id)
    );

    newlySelected.forEach((service) => {
      dispatch(addService(service));
    });

    toRemove.forEach((id) => {
      dispatch(removeService(id));
    });

    onClose();
  };

  const renderServiceItem = (
    service: (typeof suggestions)[0],
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
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClosed={onClose}
        adjustToContentHeight
        handlePosition="inside"
        withOverlay
        closeOnOverlayTap
        panGestureEnabled
        avoidKeyboardLikeIOS
        overlayStyle={styles.modalOverlay}
        modalStyle={[styles.bottomSheet, { maxHeight: screenHeight * 0.9 }]}
        HeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select services</Text>
            <View style={styles.headerRight}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Feather
                  name="x"
                  size={moderateWidthScale(12)}
                  color={theme.darkGreen}
                />
              </Pressable>
            </View>
          </View>
        }
        FooterComponent={
          <View
            style={[
              styles.buttonContainer,
              { paddingBottom: insets.bottom + 15 },
            ]}
          >
            <Button title="Select" onPress={handleSelect} />
          </View>
        }
      >
        <ScrollView
          nestedScrollEnabled
          style={[styles.scrollView, { maxHeight: maxContentHeight }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* All over service at the top */}
          {(() => {
            const allOverService = suggestions.find((s) => s.id === "all-over");
            if (!allOverService) return null;
            return renderServiceItem(allOverService, false);
          })()}

          {/* Separator line */}
          <View style={styles.separator} />

          {/* Popular starting points section */}
          <Text style={styles.sectionTitle}>Popular starting points:</Text>
          {suggestions
            .filter((service) => service.id !== "all-over")
            .map((service) => renderServiceItem(service))}
        </ScrollView>
      </Modalize>
    </Portal>
  );
}
