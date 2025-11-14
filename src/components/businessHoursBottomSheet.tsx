import React, { useMemo, useState, useEffect, useRef } from "react";
import {
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
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import {
  setDayHours,
  setDayAvailability,
} from "@/src/state/slices/completeProfileSlice";
import Button from "@/src/components/button";
import TimePickerModal from "@/src/components/timePickerModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BusinessHoursBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  day: string;
}

interface BreakTime {
  fromHours: number;
  fromMinutes: number;
  tillHours: number;
  tillMinutes: number;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
      maxHeight: "90%",
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
    content: {
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(7),
    },
    sectionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    sectionTitle2: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.lightGreen,
    },
    sectionDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    inputRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    inputWrapper: {
      flex: 1,
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(8),
      gap: moderateHeightScale(2),
    },
    inputLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(10),
    },
    textInput: {
      flex: 1,
      height: heightScale(22),
      paddingVertical: 0,
      textAlignVertical: "center",
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    dropdownButton: {
      flex: 1,
      height: heightScale(22),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dropdownText: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    dropdownPlaceholder: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen2,
    },
    breakTimeSection: {
      marginTop: moderateHeightScale(12),
    },
    breakTimeHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    addBreakButton: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(6),
    },
    addBreakButtonText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.orangeBrown,
    },
    breakTimeItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    breakTimeInputs: {
      flex: 1,
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    deleteButton: {
      width: moderateWidthScale(32),
      height: moderateWidthScale(32),
      alignItems: "center",
      justifyContent: "center",
    },
    copyHoursSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    checkboxRow: {},
    checkbox: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(4),
      borderWidth: 1.5,
      borderColor: theme.black,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.orangeBrown,
      borderColor: theme.orangeBrown,
    },
    checkboxLabel: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      flex: 1,
    },
    daysContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(10),
    },
    dayPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(5),
      borderRadius: moderateWidthScale(10),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    dayPillSelected: {
      backgroundColor: theme.orangeBrown,
      borderColor: theme.orangeBrown,
    },
    dayPillText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    dayPillTextSelected: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    buttonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(20),
    },
  });

export default function BusinessHoursBottomSheet({
  visible,
  onClose,
  day,
}: BusinessHoursBottomSheetProps) {
  const modalizeRef = useRef<Modalize>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const insets = useSafeAreaInsets();
  const { businessHours } = useAppSelector((state) => state.completeProfile);

  const dayData = businessHours[day] || {
    isOpen: false,
    fromHours: 0,
    fromMinutes: 0,
    tillHours: 0,
    tillMinutes: 0,
    breaks: [],
  };

  const [fromHours, setFromHours] = useState(dayData.fromHours || 10);
  const [fromMinutes, setFromMinutes] = useState(dayData.fromMinutes || 0);
  const [tillHours, setTillHours] = useState(dayData.tillHours || 19);
  const [tillMinutes, setTillMinutes] = useState(dayData.tillMinutes || 30);
  const [breaks, setBreaks] = useState<BreakTime[]>(dayData.breaks || []);
  const [copyHoursEnabled, setCopyHoursEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showTillDropdown, setShowTillDropdown] = useState(false);
  const [showBreakFromDropdown, setShowBreakFromDropdown] = useState<
    number | null
  >(null);
  const [showBreakTillDropdown, setShowBreakTillDropdown] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (visible && day) {
      setFromHours(dayData.fromHours || 0);
      setFromMinutes(dayData.fromMinutes || 0);
      setTillHours(dayData.tillHours || 0);
      setTillMinutes(dayData.tillMinutes || 0);
      // Auto-add at least 1 break time field if no breaks exist
      const existingBreaks = dayData.breaks || [];
      if (existingBreaks.length === 0) {
        setBreaks([
          {
            fromHours: 0,
            fromMinutes: 0,
            tillHours: 0,
            tillMinutes: 0,
          },
        ]);
      } else {
        setBreaks(existingBreaks);
      }
      setCopyHoursEnabled(false);
      setSelectedDays([]);
      // Use setTimeout to ensure Modalize ref is ready
      setTimeout(() => {
        modalizeRef.current?.open();
      }, 100);
    } else if (!visible) {
      modalizeRef.current?.close();
    }
  }, [visible, day, dayData]);

  const handleSave = () => {
    // Filter out empty break times (all zeros) before saving
    const validBreaks = breaks.filter(
      (breakTime) =>
        breakTime.fromHours > 0 ||
        breakTime.fromMinutes > 0 ||
        breakTime.tillHours > 0 ||
        breakTime.tillMinutes > 0
    );

    dispatch(
      setDayHours({
        day,
        fromHours,
        fromMinutes,
        tillHours,
        tillMinutes,
        breaks: validBreaks,
      })
    );

    if (copyHoursEnabled && selectedDays.length > 0) {
      selectedDays.forEach((selectedDay) => {
        dispatch(
          setDayHours({
            day: selectedDay,
            fromHours,
            fromMinutes,
            tillHours,
            tillMinutes,
            breaks: validBreaks,
          })
        );
        dispatch(setDayAvailability({ day: selectedDay, isOpen: true }));
      });
    }

    onClose();
  };

  const handleAddBreak = () => {
    setBreaks([
      ...breaks,
      {
        fromHours: 13,
        fromMinutes: 0,
        tillHours: 14,
        tillMinutes: 0,
      },
    ]);
  };

  const handleRemoveBreak = (index: number) => {
    // Keep at least 1 break time field
    if (breaks.length > 1) {
      setBreaks(breaks.filter((_, i) => i !== index));
    } else {
      // If only 1 break exists, reset it to empty instead of removing
      setBreaks([
        {
          fromHours: 0,
          fromMinutes: 0,
          tillHours: 0,
          tillMinutes: 0,
        },
      ]);
    }
  };

  const handleBreakTimeChange = (
    index: number,
    field: "fromHours" | "fromMinutes" | "tillHours" | "tillMinutes",
    value: number
  ) => {
    const updatedBreaks = [...breaks];
    updatedBreaks[index] = {
      ...updatedBreaks[index],
      [field]: value,
    };
    setBreaks(updatedBreaks);
  };

  const handleDayToggle = (dayName: string) => {
    if (selectedDays.includes(dayName)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayName));
    } else {
      setSelectedDays([...selectedDays, dayName]);
    }
  };

  const handleTimeSelect = (
    hours: number,
    minutes: number,
    type: "from" | "till" | "breakFrom" | "breakTill",
    breakIndex?: number
  ) => {
    if (type === "from") {
      setFromHours(hours);
      setFromMinutes(minutes);
      setShowFromDropdown(false);
    } else if (type === "till") {
      setTillHours(hours);
      setTillMinutes(minutes);
      setShowTillDropdown(false);
    } else if (type === "breakFrom" && breakIndex !== undefined) {
      handleBreakTimeChange(breakIndex, "fromHours", hours);
      handleBreakTimeChange(breakIndex, "fromMinutes", minutes);
      setShowBreakFromDropdown(null);
    } else if (type === "breakTill" && breakIndex !== undefined) {
      handleBreakTimeChange(breakIndex, "tillHours", hours);
      handleBreakTimeChange(breakIndex, "tillMinutes", minutes);
      setShowBreakTillDropdown(null);
    }
  };

  const formatTime = (hours: number, minutes: number): string => {
    if (hours === 0 && minutes === 0) {
      return "";
    }
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${period}`;
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
        modalStyle={[styles.bottomSheet]}
        HeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{day} availability</Text>
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 3 }}>
            <Text style={styles.sectionTitle}>Business hours</Text>
            <Text style={styles.sectionDescription}>
              Set your business hours for {day}s here. To edit hours for a
              specific date, use your calendar.
            </Text>
          </View>

          <View style={{ gap: 5, marginTop: moderateHeightScale(12) }}>
            <Text style={styles.sectionTitle2}>Opening hours</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>From</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowFromDropdown(true)}
                >
                  {fromHours > 0 || fromMinutes > 0 ? (
                    <Text style={styles.dropdownText}>
                      {formatTime(fromHours, fromMinutes)}
                    </Text>
                  ) : (
                    <Text style={styles.dropdownPlaceholder}>From</Text>
                  )}
                  <Feather
                    name="chevron-down"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Till</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowTillDropdown(true)}
                >
                  {tillHours > 0 || tillMinutes > 0 ? (
                    <Text style={styles.dropdownText}>
                      {formatTime(tillHours, tillMinutes)}
                    </Text>
                  ) : (
                    <Text style={styles.dropdownPlaceholder}>Till</Text>
                  )}
                  <Feather
                    name="chevron-down"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.breakTimeSection}>
            <View style={styles.breakTimeHeader}>
              <Text style={styles.sectionTitle2}>Break time</Text>
              <TouchableOpacity
                onPress={handleAddBreak}
                style={styles.addBreakButton}
              >
                <Text style={styles.addBreakButtonText}>Add new +</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* {breaks.map((breakTime, index) => (
              <View key={index} style={styles.breakTimeItem}>
                <View style={styles.breakTimeInputs}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>From</Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowBreakFromDropdown(index)}
                    >
                      {breakTime.fromHours > 0 || breakTime.fromMinutes > 0 ? (
                        <Text style={styles.dropdownText}>
                          {formatTime(
                            breakTime.fromHours,
                            breakTime.fromMinutes
                          )}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownPlaceholder}>From</Text>
                      )}
                      <Feather
                        name="chevron-down"
                        size={moderateWidthScale(16)}
                        color={theme.darkGreen}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Till</Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowBreakTillDropdown(index)}
                    >
                      {breakTime.tillHours > 0 || breakTime.tillMinutes > 0 ? (
                        <Text style={styles.dropdownText}>
                          {formatTime(
                            breakTime.tillHours,
                            breakTime.tillMinutes
                          )}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownPlaceholder}>Till</Text>
                      )}
                      <Feather
                        name="chevron-down"
                        size={moderateWidthScale(16)}
                        color={theme.darkGreen}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveBreak(index)}
                  style={styles.deleteButton}
                >
                  <Feather
                    name="trash-2"
                    size={moderateWidthScale(20)}
                    color={theme.link}
                  />
                </TouchableOpacity>
              </View>
            ))} */}

          <View style={{gap:15}}>
            <View style={styles.copyHoursSection}>
              <TouchableOpacity
                onPress={() => setCopyHoursEnabled(!copyHoursEnabled)}
              >
                <View
                  style={[
                    styles.checkbox,
                    copyHoursEnabled && styles.checkboxChecked,
                  ]}
                >
                  {copyHoursEnabled && (
                    <Feather
                      name="check"
                      size={moderateWidthScale(14)}
                      color={theme.white}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{ gap: 3, width: "90%" }}>
                <Text style={styles.checkboxLabel}>Copy business hours</Text>
                <Text style={styles.sectionDescription}>
                  Apply these hours to multiple days. Select the ones that match
                  your schedule.
                </Text>
              </View>
            </View>
            {copyHoursEnabled && (
              <View style={styles.daysContainer}>
                <TouchableOpacity
                  style={[
                    styles.dayPill,
                    selectedDays.length === DAYS.length - 1 &&
                      styles.dayPillSelected,
                  ]}
                  onPress={() => {
                    const otherDays = DAYS.filter((d) => d !== day);
                    if (selectedDays.length === otherDays.length) {
                      setSelectedDays([]);
                    } else {
                      setSelectedDays(otherDays);
                    }
                  }}
                >
                  {selectedDays.length === DAYS.length - 1 && (
                    <Feather
                      name="check"
                      size={moderateWidthScale(14)}
                      color={theme.white}
                      style={{ marginRight: moderateWidthScale(4) }}
                    />
                  )}
                  <Text
                    style={[
                      styles.dayPillText,
                      selectedDays.length === DAYS.length - 1 &&
                        styles.dayPillTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {DAYS.filter((d) => d !== day).map((dayName) => {
                  const isSelected = selectedDays.includes(dayName);
                  return (
                    <TouchableOpacity
                      key={dayName}
                      style={[
                        styles.dayPill,
                        isSelected && styles.dayPillSelected,
                      ]}
                      onPress={() => handleDayToggle(dayName)}
                    >
                      {isSelected && (
                        <Feather
                          name="check"
                          size={moderateWidthScale(14)}
                          color={theme.white}
                          style={{ marginRight: moderateWidthScale(4) }}
                        />
                      )}
                      <Text
                        style={[
                          styles.dayPillText,
                          isSelected && styles.dayPillTextSelected,
                        ]}
                      >
                        {dayName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </Modalize>

      <TimePickerModal
        visible={showFromDropdown}
        currentHours={fromHours}
        currentMinutes={fromMinutes}
        onSelect={(hours, minutes) => handleTimeSelect(hours, minutes, "from")}
        onClose={() => setShowFromDropdown(false)}
      />

      <TimePickerModal
        visible={showTillDropdown}
        currentHours={tillHours}
        currentMinutes={tillMinutes}
        onSelect={(hours, minutes) => handleTimeSelect(hours, minutes, "till")}
        onClose={() => setShowTillDropdown(false)}
      />

      {breaks.map((breakTime, index) => (
        <React.Fragment key={index}>
          <TimePickerModal
            visible={showBreakFromDropdown === index}
            currentHours={breakTime.fromHours}
            currentMinutes={breakTime.fromMinutes}
            onSelect={(hours, minutes) =>
              handleTimeSelect(hours, minutes, "breakFrom", index)
            }
            onClose={() => setShowBreakFromDropdown(null)}
          />
          <TimePickerModal
            visible={showBreakTillDropdown === index}
            currentHours={breakTime.tillHours}
            currentMinutes={breakTime.tillMinutes}
            onSelect={(hours, minutes) =>
              handleTimeSelect(hours, minutes, "breakTill", index)
            }
            onClose={() => setShowBreakTillDropdown(null)}
          />
        </React.Fragment>
      ))}
    </Portal>
  );
}
