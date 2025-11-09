import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import Button from "@/src/components/button";
import RegisterHeader from "@/src/components/registerHeader";

interface RegisterStepTwoProps {
  onBack: () => void;
  onContinue: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: moderateHeightScale(4),
      gap: moderateHeightScale(24),
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(24),
      paddingBottom: moderateHeightScale(15),
    },
    content: {
      flexGrow: 1,
      gap: moderateHeightScale(20),
    },
    titleSection: {
      gap: moderateHeightScale(8),
    },
    title: {
      fontSize: fontSize.size26,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      lineHeight: fontSize.size32,
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
      gap: moderateWidthScale(12),
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
    toggleButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    saveRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    saveIconWrapper: {
      width: widthScale(46),
      height: widthScale(46),
      borderRadius: moderateWidthScale(46 / 2),
      backgroundColor: theme.lightBeige,
      alignItems: "center",
      justifyContent: "center",
    },
    checkbox: {
      width: moderateWidthScale(24),
      height: moderateWidthScale(24),
      borderRadius: moderateWidthScale(5),
      borderWidth: 1.5,
      borderColor: theme.black,
      alignItems: "center",
      justifyContent: "center",
    },
    saveText: {
      flex: 1,
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: fontSize.size18,
    },
    buttonWrapper: {
      marginTop: moderateHeightScale(16),
    },
  });

export default function RegisterStepTwo({
  onBack,
  onContinue,
}: RegisterStepTwoProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  const handleToggleVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleSavePassword = useCallback(() => {
    setSavePassword((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    setPassword("");
  }, []);

  const placeholderColor = (colors as Theme).lightGreen2;

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} />
      <View style={styles.mainContent}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create your password</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Type password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholder="Type your password"
                placeholderTextColor={placeholderColor}
                autoCapitalize="none"
              />
              {password.length > 0 && (
                <Pressable
                  onPress={handleClear}
                  style={styles.iconButton}
                  // hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name="x"
                    size={moderateWidthScale(15)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              )}
              <Pressable
                onPress={handleToggleVisibility}
                style={styles.toggleButton}
                hitSlop={moderateWidthScale(8)}
              >
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={moderateWidthScale(19)}
                  color={(colors as Theme).darkGreen}
                />
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={handleToggleSavePassword}
            style={styles.saveRow}
            hitSlop={moderateWidthScale(8)}
          >
            <View style={styles.saveIconWrapper}>
              <View style={styles.checkbox}>
                {savePassword && (
                  <FontAwesome5
                    name="check"
                    size={moderateWidthScale(14)}
                    color={(colors as Theme).orangeBrown}
                  />
                )}
              </View>
            </View>
            <Text style={styles.saveText}>Save password</Text>
          </Pressable>
        </View>
        <Button
            title="Continue"
            onPress={onContinue}
            containerStyle={styles.buttonWrapper}
          />
      </View>
    </View>
  );
}
