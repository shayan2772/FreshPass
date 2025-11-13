import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";

interface StepFourConfirmSectionProps {
  streetAddress: string;
  area: string;
  zipCode: string;
  onChangeStreet: (value: string) => void;
  onChangeArea: (value: string) => void;
  onChangeZip: (value: string) => void;
  onEditAddress: () => void;
  isFetchingDetails: boolean;
  notice?: string | null;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: moderateWidthScale(20),
    },
    main: {
      flex: 1,
      gap: moderateHeightScale(20),
     
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom:4
    },
    label: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    changeButton: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    inputWrapper: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(15),
      paddingVertical: moderateHeightScale(10),
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
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    iconButton: {
      width: widthScale(18),
      height: widthScale(18),
      borderRadius: moderateWidthScale(18 / 2),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    infoText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
  });

export default function StepFourConfirmSection({
  streetAddress,
  area,
  zipCode,
  onChangeStreet,
  onChangeArea,
  onChangeZip,
  onEditAddress,
  isFetchingDetails,
  notice,
}: StepFourConfirmSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const placeholderColor = theme.lightGreen2;

  const handleClearStreet = () => {
    onChangeStreet("");
  };

  const handleClearArea = () => {
    onChangeArea("");
  };

  const handleClearZip = () => {
    onChangeZip("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}></Text>
        <Pressable onPress={onEditAddress}>
          <Text style={styles.changeButton}>Change</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Street address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="24 Adeola Odeku Street, Wuse 2"
              placeholderTextColor={placeholderColor}
              value={streetAddress}
              onChangeText={onChangeStreet}
            />
            {streetAddress.length > 0 && (
              <Pressable onPress={handleClearStreet} style={styles.iconButton}>
                <Feather
                  name="x"
                  size={moderateWidthScale(14)}
                  color={theme.darkGreen}
                />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Area / City</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Downtown"
              placeholderTextColor={placeholderColor}
              value={area}
              onChangeText={onChangeArea}
            />
            {area.length > 0 && (
              <Pressable onPress={handleClearArea} style={styles.iconButton}>
                <Feather
                  name="x"
                  size={moderateWidthScale(14)}
                  color={theme.darkGreen}
                />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Zip code (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="29209"
              placeholderTextColor={placeholderColor}
              value={zipCode}
              onChangeText={onChangeZip}
              keyboardType="number-pad"
            />
            {zipCode.length > 0 && (
              <Pressable onPress={handleClearZip} style={styles.iconButton}>
                <Feather
                  name="x"
                  size={moderateWidthScale(14)}
                  color={theme.darkGreen}
                />
              </Pressable>
            )}
          </View>
        </View>

        {(isFetchingDetails || notice) && (
          <Text style={styles.infoText}>
            {notice ?? "Loading selected address…"}
          </Text>
        )}
      </View>
    </View>
  );
}
