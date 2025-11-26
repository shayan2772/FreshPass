import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import FloatingInput from "@/src/components/floatingInput";
import Button from "@/src/components/button";
import { Feather } from "@expo/vector-icons";
import {
  validatePassword,
  validatePasswordMatch,
} from "@/src/services/validationService";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
    },
    contentContainer: {
      paddingVertical: moderateHeightScale(24),
    },
    inputContainer: {
      marginBottom: moderateHeightScale(20),
    },
    toggleButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(4),
    },
    changePasswordButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(34),
      paddingTop: moderateHeightScale(16),
    },
  });

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retryPassword, setRetryPassword] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isRetryPasswordVisible, setIsRetryPasswordVisible] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [retryPasswordError, setRetryPasswordError] = useState<string | null>(
    null
  );

  // Validate new password length (min 8 characters)
  useEffect(() => {
    if (newPassword.length > 0) {
      const validation = validatePassword(newPassword);
      setNewPasswordError(validation.error);
    } else {
      setNewPasswordError(null);
    }
  }, [newPassword]);

  // Validate retry password matches new password
  useEffect(() => {
    if (retryPassword.length > 0) {
      const validation = validatePasswordMatch(newPassword, retryPassword);
      setRetryPasswordError(validation.error);
    } else {
      setRetryPasswordError(null);
    }
  }, [newPassword, retryPassword]);

  const handleToggleOldPasswordVisibility = useCallback(() => {
    setIsOldPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleNewPasswordVisibility = useCallback(() => {
    setIsNewPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleRetryPasswordVisibility = useCallback(() => {
    setIsRetryPasswordVisible((prev) => !prev);
  }, []);

  const handleClearOldPassword = useCallback(() => {
    setOldPassword("");
    setOldPasswordError(null);
  }, []);

  const handleClearNewPassword = useCallback(() => {
    setNewPassword("");
    setNewPasswordError(null);
  }, []);

  const handleClearRetryPassword = useCallback(() => {
    setRetryPassword("");
    setRetryPasswordError(null);
  }, []);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const newPasswordValidation = validatePassword(newPassword);
    const retryPasswordValidation = validatePasswordMatch(
      newPassword,
      retryPassword
    );

    return (
      oldPassword.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      retryPassword.trim().length > 0 &&
      newPasswordValidation.isValid &&
      retryPasswordValidation.isValid
    );
  }, [oldPassword, newPassword, retryPassword]);

  const handleChangePassword = () => {
    // Validate all fields before submitting
    const newPasswordValidation = validatePassword(newPassword);
    const retryPasswordValidation = validatePasswordMatch(
      newPassword,
      retryPassword
    );

    // Check old password is not empty
    if (oldPassword.trim().length === 0) {
      setOldPasswordError("Old password is required");
    } else {
      setOldPasswordError(null);
    }

    setNewPasswordError(newPasswordValidation.error);
    setRetryPasswordError(retryPasswordValidation.error);

    if (
      oldPassword.trim().length > 0 &&
      newPasswordValidation.isValid &&
      retryPasswordValidation.isValid
    ) {
      // TODO: Implement change password logic
      console.log("Change password pressed", {
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
        retryPassword: retryPassword.trim(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <StackHeader title="Change Password" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <FloatingInput
            label="Old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Old password"
            secureTextEntry={!isOldPasswordVisible}
            autoCapitalize="none"
            onClear={handleClearOldPassword}
            renderRightAccessory={() =>
              oldPassword.length > 0 ? (
                <Pressable
                  onPress={handleToggleOldPasswordVisibility}
                  style={styles.toggleButton}
                  hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name={isOldPasswordVisible ? "eye-off" : "eye"}
                    size={moderateWidthScale(20)}
                    color={theme.darkGreen}
                  />
                </Pressable>
              ) : null
            }
          />
          {oldPasswordError && (
            <Text style={styles.errorText}>{oldPasswordError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            secureTextEntry={!isNewPasswordVisible}
            autoCapitalize="none"
            onClear={handleClearNewPassword}
            renderRightAccessory={() =>
              newPassword.length > 0 ? (
                <Pressable
                  onPress={handleToggleNewPasswordVisibility}
                  style={styles.toggleButton}
                  hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name={isNewPasswordVisible ? "eye-off" : "eye"}
                    size={moderateWidthScale(20)}
                    color={theme.darkGreen}
                  />
                </Pressable>
              ) : null
            }
          />
          {newPasswordError && (
            <Text style={styles.errorText}>{newPasswordError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="Retry password"
            value={retryPassword}
            onChangeText={setRetryPassword}
            placeholder="Retry password"
            secureTextEntry={!isRetryPasswordVisible}
            autoCapitalize="none"
            onClear={handleClearRetryPassword}
            renderRightAccessory={() =>
              retryPassword.length > 0 ? (
                <Pressable
                  onPress={handleToggleRetryPasswordVisibility}
                  style={styles.toggleButton}
                  hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name={isRetryPasswordVisible ? "eye-off" : "eye"}
                    size={moderateWidthScale(20)}
                    color={theme.darkGreen}
                  />
                </Pressable>
              ) : null
            }
          />
          {retryPasswordError && (
            <Text style={styles.errorText}>{retryPasswordError}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.changePasswordButtonContainer}>
        <Button
          title="Change Password"
          onPress={handleChangePassword}
          disabled={!isFormValid}
        />
      </View>
    </View>
  );
}

