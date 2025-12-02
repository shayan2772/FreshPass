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
import SocialAuthOptions from "@/src/components/socialAuthOptions";
import SectionSeparator from "@/src/components/sectionSeparator";
import { validateEmail } from "@/src/services/validationService";
import { useRouter } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { setUser } from "@/src/state/slices/userSlice";
import {
  setRegisterEmail,
  setSavedPassword,
} from "@/src/state/slices/generalSlice";
import RoleSelectionBottomSheet from "@/src/components/roleSelectionBottomSheet";

type SocialProvider = "google" | "apple" | "facebook";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      gap: moderateHeightScale(20),
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
    toggleButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    savePasswordRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    savePasswordLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
      flex: 1,
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
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: fontSize.size18,
    },
    forgetPasswordLink: {
      textDecorationLine: "underline",
      textDecorationColor: theme.lightGreen,
      color: theme.lightGreen,
    },
    primaryButtonWrapper: {
      marginTop: moderateHeightScale(4),
    },
    socialList: {},
    footer: {
      marginTop: moderateHeightScale(20),
      alignItems: "center",
    },
    footerText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlign: "center",
    },
    signupLink: {
      fontFamily: fonts.fontMedium,
      color: theme.link,
      textDecorationLine: "underline",
      textDecorationColor: theme.link,
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(-16),
      marginBottom: moderateHeightScale(4),
    },
  });

const DEFAULT_EMAIL = "";

export default function Login() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get saved email from general state (if exists)
  const savedEmail = useAppSelector((state) => state.general.registerEmail);
  const savedPassword = useAppSelector((state) => state.general.savedPassword);

  const [email, setEmail] = useState(savedEmail || DEFAULT_EMAIL);
  const [password, setPassword] = useState(savedPassword || "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [savePassword, setSavePassword] = useState(!!savedPassword);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [pendingSocialLogin, setPendingSocialLogin] =
    useState<SocialProvider | null>(null);

  // Validate email when it changes
  useEffect(() => {
    if (email.length > 0) {
      const validation = validateEmail(email);
      setEmailError(validation.error);
    } else {
      setEmailError(null);
    }
  }, [email]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEmailClear = useCallback(() => {
    setEmail("");
    setEmailError(null);
  }, []);

  const handlePasswordClear = useCallback(() => {
    setPassword("");
  }, []);

  const handleToggleVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleSavePassword = useCallback(() => {
    setSavePassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.post(businessEndpoints.login, {
        email: email.trim(),
        password: password,
      });

      // Handle successful login
      if (response.success && response.data) {
        const { user, token } = response.data;

        // Set user data in Redux
        if (user && token) {
          dispatch(
            setUser({
              id: user.id,
              name: user?.name || "",
              email: user.email || email.trim(),
              accessToken: token,
              userRole: user?.role?.toLowerCase() || null,
            })
          );
          dispatch(setRegisterEmail(user.email || email.trim()));
          if (savePassword) {
            dispatch(setSavedPassword(password));
          } else {
            // Clear saved password if checkbox is unchecked
            dispatch(setSavedPassword(null));
          }
          // Navigate to dashboard
          router.push(`/${MAIN_ROUTES.DASHBOARD}`);
        } else {
          Alert.alert("Error", "Invalid response from server");
        }
      } else {
        Alert.alert("Error", response.message || "Login failed");
      }
    } catch (error: any) {
      // Error message is already formatted by ApiService
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, savePassword, dispatch, router]);

  const handleSocialLogin = useCallback((provider: SocialProvider) => {
    // Show role selection sheet first
    setPendingSocialLogin(provider);
    setShowRoleSheet(true);
  }, []);

  const handleRoleSelect = useCallback(
    (role: "business" | "client") => {
      if (pendingSocialLogin) {
        console.log("Social login:", pendingSocialLogin, "Role:", role);
        setPendingSocialLogin(null);
      }
    },
    [pendingSocialLogin]
  );

  const handleRoleSheetClose = useCallback(() => {
    setShowRoleSheet(false);
    setPendingSocialLogin(null);
  }, []);

  const handleForgetPassword = useCallback(() => {
    // TODO: Navigate to forget password screen
    console.log("Forget password");
  }, []);

  const handleSignup = useCallback(() => {
    router.push(`/${MAIN_ROUTES.REGISTER}`);
  }, [router]);

  const isFormValid =
    email.length > 0 && password.length > 0 && validateEmail(email).isValid;

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
              <Text style={styles.title}>Login to your business account</Text>
            </View>

            <FloatingInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onClear={handleEmailClear}
            />

            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            <FloatingInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholder="Enter your password"
              autoCapitalize="none"
              onClear={handlePasswordClear}
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

            <View style={styles.savePasswordRow}>
              <Pressable
                onPress={handleToggleSavePassword}
                style={styles.savePasswordLeft}
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
              <Pressable
                onPress={handleForgetPassword}
                hitSlop={moderateWidthScale(8)}
              >
                <Text style={[styles.saveText, styles.forgetPasswordLink]}>
                  Forget password?
                </Text>
              </Pressable>
            </View>

            <Button
              title="Continue"
              onPress={handleLogin}
              disabled={!isFormValid}
              loading={isLoading}
              containerStyle={styles.primaryButtonWrapper}
            />

            <SectionSeparator />

            <SocialAuthOptions
              onGoogle={() => handleSocialLogin("google")}
              onApple={() => handleSocialLogin("apple")}
              onFacebook={() => handleSocialLogin("facebook")}
              containerStyle={styles.socialList}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Doesn't have an account?{" "}
                <Text style={styles.signupLink} onPress={handleSignup}>
                  Signup
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      <RoleSelectionBottomSheet
        visible={showRoleSheet}
        onClose={handleRoleSheetClose}
        onRoleSelect={handleRoleSelect}
      />
    </SafeAreaView>
  );
}
