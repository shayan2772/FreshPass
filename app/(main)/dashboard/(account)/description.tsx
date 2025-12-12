import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import Button from "@/src/components/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateDescription } from "@/src/services/validationService";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { useRouter } from "expo-router";

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
    titleSection: {
      marginBottom: moderateHeightScale(32),
    },
    title: {
      fontSize: fontSize.size28,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    subtitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    textInputContainer: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(16),
      minHeight: moderateHeightScale(200),
      marginBottom: moderateHeightScale(8),
    },
    textInput: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlignVertical: "top",
      minHeight: moderateHeightScale(200),
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(4),
      marginBottom: moderateHeightScale(4),
    },
    continueButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(24),
      paddingTop: moderateHeightScale(16),
    },
  });

export default function DescriptionScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const { showBanner } = useNotificationContext();

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Validate description when it changes
  useEffect(() => {
    if (description.length > 0) {
      const validation = validateDescription(description);
      setDescriptionError(validation.error);
    } else {
      setDescriptionError(null);
    }
  }, [description]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const validation = validateDescription(description);
    return validation.isValid;
  }, [description]);

  const handleContinue = async () => {
    // Validate before submitting
    const validation = validateDescription(description);
    setDescriptionError(validation.error);

    if (!validation.isValid) {
      return;
    }

    Keyboard.dismiss();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data?: any;
      }>(businessEndpoints.profile, formData, config);

      if (response.success) {
        showBanner(
          "Success",
          response.message || "Description updated successfully",
          "success",
          3000
        );

        router.back();
      } else {
        showBanner(
          "Error",
          response.message || "Failed to update description",
          "error",
          3000
        );
      }
    } catch (error: any) {
      console.error("Failed to update description:", error);
      showBanner(
        "Error",
        error.message || "Failed to update description. Please try again.",
        "error",
        3000
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Description" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Describe about yourself</Text>
          <Text style={styles.subtitle}>
            Introduce yourself in your own words.
          </Text>
        </View>

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="If you have a ready-to-go description, you can paste it here."
            placeholderTextColor={theme.lightGreen2}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            maxLength={1000}
          />
        </View>
        {descriptionError && (
          <Text style={styles.errorText}>{descriptionError}</Text>
        )}
      </ScrollView>

      <View style={styles.continueButtonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isFormValid || isUpdating}
        />
      </View>
    </SafeAreaView>
  );
}

