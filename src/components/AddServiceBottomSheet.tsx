import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";

// Checkbox Icon SVG
const checkboxIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="{{COLOR}}"/>
</svg>
`;

const CheckboxIcon = ({ width = 24, height = 24, color = "#283618" }) => {
  const svgXml = checkboxIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  label?: string | null;
}

interface AddServiceBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  services: Service[];
  selectedServiceIds: number[];
  onUpdateServices: (services: Service[]) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    serviceListItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(12),
      borderBottomWidth: moderateWidthScale(1),
      borderBottomColor: theme.borderLight,
    },
    checkboxContainer: {
      width: widthScale(24),
      height: heightScale(24),
      borderRadius: moderateWidthScale(4),
      borderWidth: 2,
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
      marginTop: moderateHeightScale(2),
    },
    checkboxChecked: {
      backgroundColor: theme.darkGreen,
      borderColor: theme.darkGreen,
    },
    serviceListContent: {
      flex: 1,
    },
    serviceListLabel: {
      alignSelf: "flex-start",
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(999),
      marginBottom: moderateHeightScale(8),
    },
    serviceListLabelText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    serviceListName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    serviceListDescription: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    serviceListPriceContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: moderateWidthScale(8),
      marginBottom: moderateHeightScale(4),
    },
    serviceListOriginalPrice: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textDecorationLine: "line-through",
    },
    serviceListCurrentPrice: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceListDuration: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function AddServiceBottomSheet({
  visible,
  onClose,
  services,
  selectedServiceIds,
  onUpdateServices,
}: AddServiceBottomSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    // Only sync when sheet opens (visible changes from false to true)
    if (visible && !prevVisibleRef.current) {
      // Sheet just opened - initialize with current selected service IDs
      setLocalSelectedIds(selectedServiceIds);
    }
    prevVisibleRef.current = visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleToggleService = (serviceId: number) => {
    const newSelectedIds = localSelectedIds.includes(serviceId)
      ? localSelectedIds.filter((id) => id !== serviceId)
      : [...localSelectedIds, serviceId];
    
    setLocalSelectedIds(newSelectedIds);
    // Don't update parent immediately - only update when Done is pressed
  };

  const handleDone = () => {
    // Update parent with final selection when Done is pressed
    const selectedServices = services.filter((service) =>
      localSelectedIds.includes(service.id)
    );
    onUpdateServices(selectedServices);
    onClose();
  };

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title="Add another service"
      footerButtonTitle="Done"
      onFooterButtonPress={handleDone}
    >
      {services.map((service) => (
        <View key={service.id} style={styles.serviceListItem}>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              localSelectedIds.includes(service.id) && styles.checkboxChecked,
            ]}
            onPress={() => handleToggleService(service.id)}
          >
            {localSelectedIds.includes(service.id) && (
              <CheckboxIcon
                width={widthScale(16)}
                height={heightScale(16)}
                color={theme.white}
              />
            )}
          </TouchableOpacity>
          <View style={styles.serviceListContent}>
            {service.label && (
              <View style={styles.serviceListLabel}>
                <Text style={styles.serviceListLabelText}>
                  {service.label}
                </Text>
              </View>
            )}
            <Text style={styles.serviceListName}>{service.name}</Text>
            <Text style={styles.serviceListDescription}>
              {service.description}
            </Text>
            <View style={styles.serviceListPriceContainer}>
              <Text style={styles.serviceListOriginalPrice}>
                ${service.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.serviceListCurrentPrice}>
                ${service.price.toFixed(2)} USD
              </Text>
            </View>
            <Text style={styles.serviceListDuration}>
              {service.duration}
            </Text>
          </View>
        </View>
      ))}
    </ModalizeBottomSheet>
  );
}

