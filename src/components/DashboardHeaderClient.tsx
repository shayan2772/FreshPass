import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useTheme, useAppSelector, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { LeafLogo, CalendarIcon, LocationPinIcon, ChevronDownIcon } from "@/assets/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationModal from "@/src/components/locationModal";
import DatePickerModal from "@/src/components/datePickerModal";
import dayjs from "dayjs";
import { setSelectedDate } from "@/src/state/slices/generalSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(20),
      backgroundColor: theme.background,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoContainer: {
      width: widthScale(40),
      height: heightScale(40),
      borderRadius: moderateWidthScale(6),
      justifyContent: "center",
      alignItems: "center",
      marginRight: moderateWidthScale(8),
      borderWidth: 0.5,
      borderColor: theme.lightGreen22,
    },
    locationLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: "60%",
    },
    locationContent: {
      flex: 1,
      gap: moderateHeightScale(4),
      maxWidth: "70%",
    },
    locationLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    locationValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(3),
    },
    locationText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    whenButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 0.5,
      borderColor: theme.lightGreen22,
      borderRadius: moderateWidthScale(6),
      paddingHorizontal: moderateWidthScale(5),
      paddingVertical: moderateHeightScale(5),
      gap: moderateWidthScale(5),
    },
    whenText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreenLight,
    },
  });

export default function DashboardHeaderClient() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.user.location);
  const selectedDateISO = useAppSelector((state) => state.general.selectedDate);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const selectedDate = selectedDateISO ? dayjs(selectedDateISO) : null;
  const locationName = location?.locationName || "Select Location";
  
  const formatDate = (date: dayjs.Dayjs) => {
    return date.format("MMM D");
  };

  return (
    <>
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top + moderateHeightScale(12) },
        ]}
      >
        <View style={styles.locationContainer}>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={widthScale(26)}
              height={heightScale(32)}
              color1={theme.orangeBrown}
              color2={theme.darkGreen}
            />
          </View>
          <Pressable
            style={styles.locationLeft}
            onPress={() => setLocationModalVisible(true)}
          >
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>Location</Text>
              <View style={styles.locationValue}>
                <LocationPinIcon
                  width={widthScale(18)}
                  height={heightScale(18)}
                  color={theme.darkGreen}
                />
                <Text numberOfLines={1} style={styles.locationText}>
                  {locationName}
                </Text>
                <ChevronDownIcon
                  width={widthScale(9)}
                  height={heightScale(5)}
                  color={theme.darkGreen}
                />
              </View>
            </View>
          </Pressable>
          <TouchableOpacity 
            style={styles.whenButton}
            onPress={() => setDateModalVisible(true)}
          >
            <CalendarIcon
              width={widthScale(13.33)}
              height={heightScale(14.67)}
              color={theme.darkGreenLight}
            />
            <Text style={styles.whenText}>{selectedDate ? formatDate(selectedDate) : "---"}</Text>
            <ChevronDownIcon
              width={widthScale(8)}
              height={heightScale(4)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>
      </View>
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
      <DatePickerModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          dispatch(setSelectedDate(date.toISOString()));
        }}
      />
    </>
  );
}
