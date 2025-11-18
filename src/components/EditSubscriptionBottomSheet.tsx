import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { updateSubscription } from "@/src/state/slices/completeProfileSlice";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import ServicePickerBottomSheet from "@/src/components/ServicePickerBottomSheet";

interface EditSubscriptionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  subscriptionId: string | null;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      gap: moderateHeightScale(16),
    },
    packageNameWrapper: {
      gap: moderateHeightScale(2),
      marginTop: moderateHeightScale(16),
      backgroundColor: theme.lightGreen5,
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(10),
    },
    inputLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    packageNameText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen4,
      flex: 1,
    },
    textInput: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      paddingVertical: 0,
      height: heightScale(24),
      flex: 1,
    },
    timeInputWrapper: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      flexDirection: "row",
      justifyContent: "space-between",
      flex: 1,
    },
    rowContainer: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    mainTimeCon: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(10),
      gap: moderateHeightScale(2),
    },
    timeInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    timeInput: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      paddingVertical: 0,
      height: heightScale(22),
      flex: 1,
      textAlign: "left",
    },
    arrowButtonsContainer: {
      width: "28%",
      backgroundColor: theme.grey30,
      borderLeftWidth: 1,
      borderLeftColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      borderTopRightRadius: moderateWidthScale(8),
      borderBottomRightRadius: moderateWidthScale(8),
    },
    timeButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    arrowButtonSeparator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.lightGreen2,
    },
    priceInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    priceInput: {
      flex: 1,
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      paddingVertical: 0,
      height: heightScale(24),
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(4),
    },
    serviceDropdown: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(15),
    },
    serviceDropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    serviceDropdownText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
      flex: 1,
    },
    selectedServicesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(10),
    },
    serviceTag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(10),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    serviceTagText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    removeServiceButton: {
      width: moderateWidthScale(16),
      height: moderateWidthScale(16),
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default function EditSubscriptionBottomSheet({
  visible,
  onClose,
  subscriptionId,
}: EditSubscriptionBottomSheetProps) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const { subscriptions, services } = useAppSelector(
    (state) => state.completeProfile
  );

  const subscription = subscriptionId
    ? subscriptions.find((s) => s.id === subscriptionId)
    : null;

  const [packageName, setPackageName] = useState(
    subscription?.packageName || ""
  );
  const [servicesPerMonth, setServicesPerMonth] = useState(
    subscription?.servicesPerMonth || 0
  );
  const [price, setPrice] = useState(subscription?.price.toString() || "0");
  const [currency] = useState(subscription?.currency || "USD");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    subscription?.serviceIds || []
  );
  const [servicePickerVisible, setServicePickerVisible] = useState(false);
  const [errors, setErrors] = useState<{
    packageName?: string;
    price?: string;
    services?: string;
  }>({});

  useEffect(() => {
    if (visible && subscription) {
      setPackageName(subscription.packageName);
      setServicesPerMonth(subscription.servicesPerMonth);
      setPrice(subscription.price.toString());
      setSelectedServiceIds(subscription.serviceIds);
      setErrors({});
    }
  }, [visible, subscription]);

  const handleServicesPerMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setServicesPerMonth(0);
    } else {
      const value = parseInt(cleaned, 10);
      if (!isNaN(value) && value >= 0) {
        setServicesPerMonth(value);
      }
    }
  };

  const handleIncrementServicesPerMonth = () => {
    setServicesPerMonth(servicesPerMonth + 1);
  };

  const handleDecrementServicesPerMonth = () => {
    if (servicesPerMonth > 0) {
      setServicesPerMonth(servicesPerMonth - 1);
    }
  };

  const handleIncrementPrice = () => {
    const currentPrice = parseFloat(price) || 0;
    setPrice((currentPrice + 0.01).toFixed(2));
  };

  const handleDecrementPrice = () => {
    const currentPrice = parseFloat(price) || 0;
    if (currentPrice > 0) {
      setPrice(Math.max(0, currentPrice - 0.01).toFixed(2));
    }
  };

  const handleSelectServices = (serviceIds: string[]) => {
    setSelectedServiceIds(serviceIds);
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServiceIds(selectedServiceIds.filter((id) => id !== serviceId));
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!packageName.trim()) {
      newErrors.packageName = "Package name is required";
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (selectedServiceIds.length === 0) {
      newErrors.services = "At least one service is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (subscriptionId && subscription) {
      dispatch(
        updateSubscription({
          id: subscriptionId,
          packageName: packageName.trim(),
          servicesPerMonth,
          price: priceValue,
          currency,
          serviceIds: selectedServiceIds,
        })
      );
    }

    onClose();
  };

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title="Edit Subscription"
      footerButtonTitle="Save"
      onFooterButtonPress={handleSave}
      contentStyle={styles.scrollContent}
    >
      <View style={styles.packageNameWrapper}>
        <Text style={styles.inputLabel}>Package Name</Text>
        <Text style={styles.packageNameText}>{packageName}</Text>
        {errors.packageName && (
          <Text style={styles.errorText}>{errors.packageName}</Text>
        )}
      </View>

      <View style={{ gap: moderateHeightScale(15) }}>
        <View style={styles.rowContainer}>
          <View style={styles.timeInputWrapper}>
            <View style={styles.mainTimeCon}>
              <Text style={styles.inputLabel}>Services/month</Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={servicesPerMonth.toString()}
                  onChangeText={handleServicesPerMonthChange}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={theme.lightGreen2}
                />
              </View>
            </View>
            <View style={styles.arrowButtonsContainer}>
              <TouchableOpacity
                onPress={handleIncrementServicesPerMonth}
                style={styles.timeButton}
              >
                <AntDesign
                  name="caret-up"
                  size={moderateWidthScale(15)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity>
              <View style={styles.arrowButtonSeparator} />
              <TouchableOpacity
                onPress={handleDecrementServicesPerMonth}
                style={styles.timeButton}
              >
                <AntDesign
                  name="caret-down"
                  size={moderateWidthScale(15)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeInputWrapper}>
            <View style={styles.mainTimeCon}>
              <Text style={styles.inputLabel}>Price</Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={`$${parseFloat(price || "0").toFixed(2)}`}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, "");
                    if (cleaned) {
                      setPrice(cleaned);
                    } else {
                      setPrice("0");
                    }
                  }}
                  keyboardType="decimal-pad"
                  placeholder="$0.00"
                  placeholderTextColor={theme.lightGreen2}
                />
              </View>
            </View>
            <View style={styles.arrowButtonsContainer}>
              <TouchableOpacity
                onPress={handleIncrementPrice}
                style={styles.timeButton}
              >
                <AntDesign
                  name="caret-up"
                  size={moderateWidthScale(15)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity>
              <View style={styles.arrowButtonSeparator} />
              <TouchableOpacity
                onPress={handleDecrementPrice}
                style={styles.timeButton}
              >
                <AntDesign
                  name="caret-down"
                  size={moderateWidthScale(15)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.serviceDropdown}>
        <TouchableOpacity
          style={styles.serviceDropdownButton}
          onPress={() => setServicePickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.serviceDropdownText}>Select to add service</Text>
          <Feather
            name="chevron-down"
            size={moderateWidthScale(19)}
            color={theme.darkGreen}
          />
        </TouchableOpacity>
      </View>

      {selectedServiceIds.length > 0 && (
        <View style={styles.selectedServicesContainer}>
          {selectedServiceIds.map((serviceId) => {
            // First try to find in Redux services
            let service = services.find((s) => s.id === serviceId);

            // If not found in Redux, check suggestions
            if (!service) {
              const allSuggestions = [
                { id: "haircut-blowdry", name: "Haircut & blowdry" },
                { id: "classic-manicure", name: "Classic manicure" },
                { id: "60-min-massage", name: "60-minute massage" },
                { id: "all-over", name: "All over" },
                { id: "female-haircut", name: "Female haircut" },
                {
                  id: "deep-conditioning",
                  name: "Deep conditioning treatment",
                },
                { id: "hair-styling", name: "Hair styling" },
                { id: "silk-press", name: "Silk press" },
                { id: "full-highlights", name: "Full highlights" },
                { id: "balayage", name: "Balayage" },
              ];
              const suggestion = allSuggestions.find((s) => s.id === serviceId);
              if (suggestion) {
                service = {
                  id: suggestion.id,
                  name: suggestion.name,
                  hours: 0,
                  minutes: 0,
                  price: 0,
                  currency: "USD",
                };
              }
            }

            if (!service) return null;
            return (
              <View key={serviceId} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveService(serviceId)}
                  style={styles.removeServiceButton}
                >
                  <Feather
                    name="x"
                    size={moderateWidthScale(13)}
                    style={{ marginLeft: moderateWidthScale(4) }}
                    color={theme.darkGreen}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      <ServicePickerBottomSheet
        visible={servicePickerVisible}
        onClose={() => setServicePickerVisible(false)}
        selectedServiceIds={selectedServiceIds}
        onSelectServices={handleSelectServices}
      />
    </ModalizeBottomSheet>
  );
}
