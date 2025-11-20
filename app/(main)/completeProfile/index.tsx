import React, { useCallback, useMemo } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { MAIN_ROUTES } from "@/src/constant/routes";
import Button from "@/src/components/button";
import CompleteProfileHeader from "@/src/components/CompleteProfileHeader";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import StepSix from "./components/StepSix";
import StepSeven from "./components/StepSeven";
import StepEight from "./components/StepEight";
import StepNine from "./components/StepNine";
import StepTen from "./components/StepTen";
import StepEleven from "./components/StepEleven";
import { createStyles } from "./styles";
import {
  goToNextStep,
  goToPreviousStep,
  setAddressStage,
  setSelectedLocation,
} from "@/src/state/slices/completeProfileSlice";
import PrivacyBanner from "@/src/components/privacyBanner";

export default function CompleteProfile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const {
    currentStep,
    totalSteps,
    businessCategory,
    businessName,
    fullName,
    phoneNumber,
    phoneIsValid,
    appointmentVolume,
    streetAddress,
    area,
    zipCode,
    addressStage,
    selectedLocation,
    teamSize,
    businessHours,
    services,
  } = useAppSelector((state) => state.completeProfile);

  const handleBack = useCallback(() => {
    if (currentStep === 4) {
      if (addressStage === "map") {
        // Clear map stage fields (selectedLocation) when going back to confirm
        // Keep confirm stage fields (streetAddress, area, zipCode, selectedAddress)
        dispatch(setSelectedLocation(null));
        dispatch(setAddressStage("confirm"));
        return;
      }
      if (addressStage === "confirm") {
        // Keep confirm stage fields when going back to search
        dispatch(setAddressStage("search"));
        return;
      }
    }
    if (currentStep > 1) {
      dispatch(goToPreviousStep());
      return;
    }

    router.back();
  }, [addressStage, currentStep, dispatch, router]);

  const handleContinue = useCallback(() => {
    if (currentStep === 4) {
      if (addressStage === "search") {
        return;
      }
      if (addressStage === "confirm") {
        dispatch(setAddressStage("map"));
        return;
      }
    }
    if (currentStep < totalSteps) {
      dispatch(goToNextStep());
      return;
    }

    // Navigate to acceptTerms screen when step 11 is completed
    if (currentStep === totalSteps) {
      router.replace(`/(main)/${MAIN_ROUTES.ACCEPT_TERMS}`);
      return;
    }

    router.back();
  }, [addressStage, currentStep, dispatch, router, totalSteps]);

  useFocusEffect(
    useCallback(() => {
      const onHardwareBackPress = () => {
        if (currentStep > 1) {
          if (currentStep === 4) {
            if (addressStage === "map") {
              // Clear map stage fields (selectedLocation) when going back to confirm
              // Keep confirm stage fields (streetAddress, area, zipCode, selectedAddress)
              dispatch(setSelectedLocation(null));
              dispatch(setAddressStage("confirm"));
              return true;
            }
            if (addressStage === "confirm") {
              // Keep confirm stage fields when going back to search
              dispatch(setAddressStage("search"));
              return true;
            }
          }
          dispatch(goToPreviousStep());
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onHardwareBackPress
      );

      return () => subscription.remove();
    }, [addressStage, currentStep, dispatch])
  );

  const isContinueDisabled = useMemo(() => {
    if (currentStep === 1) {
      return !businessCategory;
    }
    if (currentStep === 2) {
      return (
        !businessName.trim() ||
        !fullName.trim() ||
        !phoneNumber.trim() ||
        !phoneIsValid
      );
    }
    if (currentStep === 3) {
      return !appointmentVolume;
    }
    if (currentStep === 4) {
      if (addressStage === "search") {
        return true;
      }
      if (addressStage === "confirm") {
        return !streetAddress.trim() || !area.trim();
      }
      return !selectedLocation;
    }
    if (currentStep === 5) {
      return !teamSize;
    }
    if (currentStep === 6) {
      // Step 6 is optional - can continue without invitations
      return false;
    }
    if (currentStep === 7) {
      // Step 7 is optional - can continue without setting business hours
      // User can set business hours later from settings
      return false;
    }
    if (currentStep === 8) {
      // Step 8 is optional - can continue without adding services
      // User can add services later
      return false;
    }
    if (currentStep === 9) {
      // Step 9 is optional - can continue without adding subscriptions
      return false;
    }
    if (currentStep === 10) {
      // Step 10 is optional - can continue without linking social media
      return false;
    }
    if (currentStep === 11) {
      // Step 11 is optional - can continue without adding photos
      return false;
    }
    return false;
  }, [
    appointmentVolume,
    area,
    businessCategory,
    businessName,
    currentStep,
    fullName,
    phoneNumber,
    phoneIsValid,
    streetAddress,
    zipCode,
    addressStage,
    selectedLocation,
    teamSize,
    businessHours,
    services,
  ]);

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      case 6:
        return <StepSix />;
      case 7:
        return <StepSeven />;
      case 8:
        return <StepEight />;
      case 9:
        return <StepNine />;
      case 10:
        return <StepTen />;
      case 11:
        return <StepEleven />;
      default:
        return null;
    }
  }, [currentStep]);

  const continueLabel = useMemo(() => {
    if (currentStep === totalSteps) {
      return "You're almost there";
    }
    if (currentStep === 4 && addressStage === "map") {
      return "Next";
    }
    return "Continue";
  }, [addressStage, currentStep, totalSteps]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CompleteProfileHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
      />
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          {(currentStep === 10 || currentStep === 11) && (
            <>
              {currentStep == 11 && (
                <PrivacyBanner message="Our App will only have access to the photos that you select" />
              )}

              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleContinue}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </>
          )}
          <Button
            title={continueLabel}
            onPress={handleContinue}
            disabled={isContinueDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
