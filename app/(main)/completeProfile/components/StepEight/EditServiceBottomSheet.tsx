import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "@gorhom/portal";
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
import { updateService } from "@/src/state/slices/completeProfileSlice";
import Button from "@/src/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EditServiceBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string | null;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 15, 30, 45];

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
      gap: moderateHeightScale(16),
    },
    inputLabelTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.lightGreen,
    },
    inputWrapper: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(12),
      gap: moderateHeightScale(4),
      marginTop: moderateHeightScale(16),
    },
    inputLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    textInput: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      paddingVertical: 0,
      height: heightScale(24),
      flex: 1,
    },
    serviceNameWrapper: {
      gap: moderateHeightScale(2),
      marginTop: moderateHeightScale(16),
      backgroundColor: theme.lightGreen1,
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(10),
    },
    serviceNameText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen4,
      flex: 1,
    },
    profileIcon: {
      width: widthScale(40),
      height: widthScale(40),
      borderRadius: moderateWidthScale(40 / 2),
      backgroundColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
    },
    timeRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    timeInputWrapper: {
      flex: 1,
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      flexDirection: "row",
      justifyContent: "space-between",
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
      fontFamily: fonts.fontBold,
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
    buttonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(5),
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(4),
    },
  });

export default function EditServiceBottomSheet({
  visible,
  onClose,
  serviceId,
}: EditServiceBottomSheetProps) {
  const modalizeRef = useRef<Modalize>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const maxContentHeight = screenHeight * 0.75;
  const { services } = useAppSelector((state) => state.completeProfile);

  const service = serviceId ? services.find((s) => s.id === serviceId) : null;

  const [serviceName, setServiceName] = useState(service?.name || "");
  const [hours, setHours] = useState(service?.hours || 0);
  const [minutes, setMinutes] = useState(service?.minutes || 0);
  const [price, setPrice] = useState(service?.price.toString() || "0");
  const [currency] = useState(service?.currency || "USD");
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  useEffect(() => {
    if (visible && service) {
      setServiceName(service.name);
      setHours(service.hours);
      // Round minutes to nearest option
      let serviceMinutes = service.minutes;
      if (!MINUTE_OPTIONS.includes(serviceMinutes)) {
        const closest = MINUTE_OPTIONS.reduce((prev, curr) =>
          Math.abs(curr - serviceMinutes) < Math.abs(prev - serviceMinutes)
            ? curr
            : prev
        );
        serviceMinutes = closest;
      }
      setMinutes(serviceMinutes);
      setPrice(service.price.toString());
      setErrors({});
      setTimeout(() => {
        modalizeRef.current?.open();
      }, 100);
    } else if (!visible) {
      modalizeRef.current?.close();
    }
  }, [visible, service]);

  const handleHoursChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setHours(0);
    } else {
      const value = parseInt(cleaned, 10);
      if (!isNaN(value) && value >= 0 && value <= 23) {
        setHours(value);
      }
    }
  };

  const handleIncrementHours = () => {
    if (hours < 23) {
      setHours(hours + 1);
    }
  };

  const handleDecrementHours = () => {
    if (hours > 0) {
      setHours(hours - 1);
    }
  };

  const handleMinutesChange = (text: string) => {
    // Extract number from "35 mins" or just "35" format
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setMinutes(0);
    } else {
      const value = parseInt(cleaned, 10);
      if (!isNaN(value) && value >= 0 && value <= 59) {
        // Round to nearest option
        const closest = MINUTE_OPTIONS.reduce((prev, curr) =>
          Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        setMinutes(closest);
      }
    }
  };

  const handleIncrementMinutes = () => {
    let currentIndex = MINUTE_OPTIONS.indexOf(minutes);
    // If current minutes not in options, find closest
    if (currentIndex === -1) {
      currentIndex = MINUTE_OPTIONS.findIndex((m) => m > minutes);
      if (currentIndex === -1) currentIndex = MINUTE_OPTIONS.length - 1;
      else currentIndex = Math.max(0, currentIndex - 1);
    }

    if (currentIndex < MINUTE_OPTIONS.length - 1) {
      setMinutes(MINUTE_OPTIONS[currentIndex + 1]);
    } else {
      // If at max, go to next hour
      if (hours < 23) {
        setHours(hours + 1);
        setMinutes(0);
      }
    }
  };

  const handleDecrementMinutes = () => {
    let currentIndex = MINUTE_OPTIONS.indexOf(minutes);
    // If current minutes not in options, find closest
    if (currentIndex === -1) {
      currentIndex = MINUTE_OPTIONS.findIndex((m) => m > minutes);
      if (currentIndex === -1) currentIndex = MINUTE_OPTIONS.length - 1;
      else currentIndex = Math.max(0, currentIndex - 1);
    }

    if (currentIndex > 0) {
      setMinutes(MINUTE_OPTIONS[currentIndex - 1]);
    } else {
      // If at 0, go to previous hour
      if (hours > 0) {
        setHours(hours - 1);
        setMinutes(MINUTE_OPTIONS[MINUTE_OPTIONS.length - 1]);
      }
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

  const handleSave = () => {
    const newErrors: typeof errors = {};

    // Service name is disabled, so we don't validate it
    // It will remain the same as the original service name

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (serviceId && service) {
      dispatch(
        updateService({
          id: serviceId,
          name: service.name, // Keep original name since it's disabled
          hours,
          minutes,
          price: priceValue,
          currency,
        })
      );
    }

    onClose();
  };

  const formatMinutes = (mins: number): string => {
    return `${mins} min${mins !== 1 ? "s" : ""}`;
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
            <Text style={styles.headerTitle}>Edit service</Text>
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
            <Button title="Save" onPress={handleSave} />
          </View>
        }
      >
        <ScrollView
          nestedScrollEnabled
          style={[styles.scrollView, { maxHeight: maxContentHeight }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.serviceNameWrapper}>
            <Text style={styles.inputLabel}>Service name</Text>
            <Text style={styles.serviceNameText}>{serviceName}</Text>
          </View>

          <View style={{ gap: 15 }}>
            <Text style={styles.inputLabelTitle}>Service time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInputWrapper}>
                <View style={styles.mainTimeCon}>
                  <Text style={styles.inputLabel}>Hour</Text>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={hours.toString()}
                      onChangeText={handleHoursChange}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={theme.lightGreen2}
                    />
                  </View>
                </View>
                <View style={styles.arrowButtonsContainer}>
                  <TouchableOpacity
                    onPress={handleIncrementHours}
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
                    onPress={handleDecrementHours}
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
                  <Text style={styles.inputLabel}>Time</Text>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={formatMinutes(minutes)}
                      onChangeText={handleMinutesChange}
                      keyboardType="number-pad"
                      placeholder="0 mins"
                      placeholderTextColor={theme.lightGreen2}
                    />
                  </View>
                </View>
                <View style={styles.arrowButtonsContainer}>
                  <TouchableOpacity
                    onPress={handleIncrementMinutes}
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
                    onPress={handleDecrementMinutes}
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

            <View style={styles.timeInputWrapper}>
              <View style={styles.mainTimeCon}>
                <Text style={styles.inputLabel}>Price</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={`${currency} $${parseFloat(price || "0").toFixed(
                      2
                    )}`}
                    onChangeText={(text) => {
                      // Extract number from "USD $145.99" or just "145.99" format
                      const cleaned = text.replace(/[^0-9.]/g, "");
                      if (cleaned) {
                        setPrice(cleaned);
                      } else {
                        setPrice("0");
                      }
                    }}
                    keyboardType="decimal-pad"
                    placeholder={`${currency} $0.00`}
                    placeholderTextColor={theme.lightGreen2}
                  />
                </View>
              </View>
              <View style={[styles.arrowButtonsContainer, { width: "14%" }]}>
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
        </ScrollView>
      </Modalize>
    </Portal>
  );
}
