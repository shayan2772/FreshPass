import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import Button from "@/src/components/button";
import FloatingInput from "@/src/components/floatingInput";
import RegisterHeader from "@/src/components/registerHeader";
import {
  validatePassword,
  validatePasswordMatch,
} from "@/src/services/validationService";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { setUser } from "@/src/state/slices/userSlice";
import {
  setRegisterEmail,
  setRole,
  setSavedPassword,
} from "@/src/state/slices/generalSlice";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";

interface RegisterStepTwoProps {
  onBack: () => void;
  onContinue: () => void;
  email: string;
  isSubscribed: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      gap: moderateHeightScale(24),
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(24),
      paddingBottom: moderateHeightScale(30),
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
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(-16),
      marginBottom: moderateHeightScale(4),
    },
  });

export default function RegisterStepTwo({
  onBack,
  onContinue,
  email,
  isSubscribed,
}: RegisterStepTwoProps) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const savedPassword = useAppSelector((state) => state.general.savedPassword);
  const role = useAppSelector((state) => state.general.role);
  const trimmedEmail = email.trim();

  const [password, setPassword] = useState(savedPassword || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [savePassword, setSavePassword] = useState(!!savedPassword); // Set to true if savedPassword exists
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLengthError, setPasswordLengthError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Validate password length (min 8 characters)
  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePassword(password);
      setPasswordLengthError(validation.error);
    } else {
      setPasswordLengthError(null);
    }
  }, [password]);

  // Validate passwords match
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const validation = validatePasswordMatch(password, confirmPassword);
      setPasswordError(validation.error);
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleToggleVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setIsConfirmPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleSavePassword = useCallback(() => {
    setSavePassword((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    setPassword("");
    setPasswordError(null);
    setPasswordLengthError(null);
  }, []);

  const handleClearConfirmPassword = useCallback(() => {
    setConfirmPassword("");
    setPasswordError(null);
  }, []);

  const handleContinue = useCallback(async () => {
    const passwordValidation = validatePassword(password);
    const matchValidation = validatePasswordMatch(password, confirmPassword);

    if (!passwordValidation.isValid || !matchValidation.isValid) {
      if (!passwordValidation.isValid) {
        setPasswordLengthError(passwordValidation.error);
      }
      if (!matchValidation.isValid) {
        setPasswordError(matchValidation.error);
      }
      return;
    }

    // If role is "business", call registration API
    if (role === "business") {
      onContinue();

      // setIsLoading(true);
      // try {
      //   const response = await ApiService.post(businessEndpoints.register, {
      //     email: trimmedEmail,
      //     password: password,
      //     password_confirmation: confirmPassword,
      //     role: role,
      //     isSubscribed: isSubscribed,
      //   });

      //   // Handle successful registration
      //   if (response.success && response.data) {
      //     const { user, token, refreshToken } = response.data;

      //     // Set user data in Redux (email from API response)
      //     if (user && token) {
      //       dispatch(
      //         setUser({
      //           id: user.id,
      //           name: user.name || trimmedEmail,
      //           email: user.email || trimmedEmail, // Use email from API response
      //           accessToken: token,
      //           refreshToken: refreshToken || null,
      //           userRole: user?.role?.toLowerCase() ||  null, // Set userRole from response or use current role
      //         })
      //       );

      //       dispatch(setRegisterEmail(user.email || trimmedEmail));
      //       if (savePassword) {
      //         dispatch(setSavedPassword(password));
      //       } else {
      //         // Clear saved password if checkbox is unchecked
      //         dispatch(setSavedPassword(null));
      //       }

      //       // Navigate to next steps
      //       router.push(`/${MAIN_ROUTES.REGISTER_NEXT_STEPS}`);
      //     } else {
      //       Alert.alert("Error", "Invalid response from server");
      //     }
      //   } else {
      //     Alert.alert("Error", response.message || "Registration failed");
      //   }
      // } catch (error: any) {
      //   // Error message is already formatted by ApiService
      //   Alert.alert(
      //     "Registration Failed",
      //     error.message || "An error occurred"
      //   );
      // } finally {
      //   setIsLoading(false);
      // }
    } else {
      // For other roles, just continue to next step
      onContinue();
    }
  }, [
    password,
    confirmPassword,
    onContinue,
    role,
    email,
    savePassword,
    dispatch,
    router,
  ]);

  // Form is valid only if both password and confirm password are valid
  const passwordValidation = validatePassword(password);
  const matchValidation = validatePasswordMatch(password, confirmPassword);
  const isFormValid =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    passwordValidation.isValid &&
    matchValidation.isValid;

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} />
      <View style={styles.mainContent}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create your password</Text>
          </View>

          <FloatingInput
            label="Type password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholder="Type your password"
            autoCapitalize="none"
            onClear={handleClear}
            renderRightAccessory={() =>
              password.length > 0 ? (
                <Pressable
                  onPress={handleToggleVisibility}
                  style={styles.toggleButton}
                  hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={moderateWidthScale(20)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              ) : null
            }
          />

          {passwordLengthError && (
            <Text style={styles.errorText}>{passwordLengthError}</Text>
          )}

          <FloatingInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholder="Confirm your password"
            autoCapitalize="none"
            onClear={handleClearConfirmPassword}
            renderRightAccessory={() =>
              confirmPassword.length > 0 ? (
                <Pressable
                  onPress={handleToggleConfirmPasswordVisibility}
                  style={styles.toggleButton}
                  hitSlop={moderateWidthScale(8)}
                >
                  <Feather
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={moderateWidthScale(20)}
                    color={(colors as Theme).darkGreen}
                  />
                </Pressable>
              ) : null
            }
          />

          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

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
          onPress={handleContinue}
          disabled={!isFormValid || isLoading}
          containerStyle={styles.buttonWrapper}
        />
      </View>
    </View>
  );
}
