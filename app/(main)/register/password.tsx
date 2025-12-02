import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, useAppSelector, useAppDispatch } from "@/src/hooks/hooks";
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
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import RoleSelectionBottomSheet from "@/src/components/roleSelectionBottomSheet";
import {
  setRegisterEmail,
  setSavedPassword,
} from "@/src/state/slices/generalSlice";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { setUser } from "@/src/state/slices/userSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
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

export default function RegisterPassword() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";
  const isSubscribed = params.isSubscribed === "true";
  const savedPassword = useAppSelector((state) => state.general.savedPassword);

  const [password, setPassword] = useState(savedPassword || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [savePassword, setSavePassword] = useState(!!savedPassword);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLengthError, setPasswordLengthError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePassword(password);
      setPasswordLengthError(validation.error);
    } else {
      setPasswordLengthError(null);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0) {
      const validation = validatePasswordMatch(password, confirmPassword);
      setPasswordError(validation.error);
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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

  const handleContinue = () => {
    setShowRoleSheet(true);
  };

  const handleRoleSelect = useCallback(
    async (role: "business" | "client") => {
      console.log("Selected role in RegisterPassword:", role);
      setShowRoleSheet(false);
      // router.push(`/${MAIN_ROUTES.REGISTER_NEXT_STEPS}`);
      setIsLoading(true);
      try {
        const response = await ApiService.post(businessEndpoints.register, {
          email: email.trim(),
          password: password,
          password_confirmation: confirmPassword,
          role: role,
          isSubscribed: isSubscribed,
          name:"",
        });

        // Handle successful registration
        if (response.success && response.data) {
          const { user, token, refreshToken } = response.data;

          // Set user data in Redux (email from API response)
          if (user && token) {
            dispatch(
              setUser({
                id: user.id,
                name: user?.name || "",
                email: user.email || email.trim(), // Use email from API response
                accessToken: token,
                refreshToken: refreshToken || null,
                userRole: user?.role?.toLowerCase() || null, // Set userRole from response or use current role
              })
            );
            dispatch(setRegisterEmail(user.email || email.trim()));
            if (savePassword) {
              dispatch(setSavedPassword(password));
            } else {
              // Clear saved password if checkbox is unchecked
              dispatch(setSavedPassword(null));
            }
            // Navigate to next steps
            router.push(`/${MAIN_ROUTES.REGISTER_NEXT_STEPS}`);
          } else {
            Alert.alert("Error", "Invalid response from server");
          }
        } else {
          Alert.alert("Error", response.message || "Registration failed");
        }
      } catch (error: any) {
        // Error message is already formatted by ApiService
        Alert.alert(
          "Registration Failed",
          error.message || "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      router,
      email,
      password,
      confirmPassword,
      savePassword,
      isSubscribed,
      dispatch,
    ]
  );

  const handleRoleSheetClose = useCallback(() => {
    setShowRoleSheet(false);
  }, []);

  // Form is valid only if both password and confirm password are valid
  const passwordValidation = validatePassword(password);
  const matchValidation = validatePasswordMatch(password, confirmPassword);
  const isFormValid =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    passwordValidation.isValid &&
    matchValidation.isValid;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        animated
        translucent
        backgroundColor={(colors as Theme).background}
        barStyle={"dark-content"}
      />

      <View style={styles.container}>
        <RegisterHeader onBack={handleBack} />
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
            disabled={!isFormValid}
            loading={isLoading}
            containerStyle={styles.buttonWrapper}
          />
        </View>

        <RoleSelectionBottomSheet
          visible={showRoleSheet}
          onClose={handleRoleSheetClose}
          onRoleSelect={handleRoleSelect}
        />
      </View>
    </SafeAreaView>
  );
}
