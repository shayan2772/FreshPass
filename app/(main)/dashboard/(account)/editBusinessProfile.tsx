import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import FloatingInput from "@/src/components/floatingInput";
import Button from "@/src/components/button";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  handleMediaLibraryPermission,
  handleCameraPermission,
} from "@/src/services/mediaPermissionService";
import { validateName } from "@/src/services/validationService";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { useRouter, useLocalSearchParams } from "expo-router";

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
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(40),
      gap: 15,
    },
    profileImageContainer: {
      width: widthScale(90),
      height: widthScale(90),
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
    },
    uploadSection: {
      flex: 1,
      justifyContent: "space-between",
      gap: 10,
    },
    uploadText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    uploadButton: {
      backgroundColor: theme.orangeBrown,
      borderWidth: 2,
      borderColor: theme.darkGreen,
      borderRadius: 9999,
      paddingVertical: moderateHeightScale(8),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: moderateWidthScale(8),
      width: 155,
    },
    uploadButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    googleDriveLink: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.selectCard,
      textDecorationLine: "underline",
      textDecorationColor: theme.selectCard,
    },
    inputContainer: {
      marginBottom: moderateHeightScale(20),
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: moderateHeightScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    optionIcon: {
      marginRight: moderateWidthScale(16),
    },
    optionText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      flex: 1,
    },
    continueButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(24),
      paddingTop: moderateHeightScale(16),
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(4),
    },
  });

export default function EditBusinessProfileScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const { showBanner } = useNotificationContext();
  const params = useLocalSearchParams<{
    title?: string;
    slogan?: string;
    logo_url?: string;
  }>();

  const getInitialLogoUri = () => {
    if (params.logo_url) {
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "";
      return `${baseUrl}${params.logo_url}`;
    }
    return null;
  };

  const originalLogoImageUri = getInitialLogoUri();
  
  const [businessName, setBusinessName] = useState(params.title || "");
  const [slogan, setSlogan] = useState(params.slogan || "");
  const [logoImageUri, setLogoImageUri] = useState<string | null>(originalLogoImageUri);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [businessNameError, setBusinessNameError] = useState<string | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Validate business name when it changes
  useEffect(() => {
    if (businessName.length > 0) {
      const validation = validateName(businessName, "Business name");
      setBusinessNameError(validation.error);
    } else {
      setBusinessNameError(null);
    }
  }, [businessName]);

  const handleClearBusinessName = useCallback(() => {
    setBusinessName("");
    setBusinessNameError(null);
  }, []);

  const handleSelectFromGallery = useCallback(async () => {
    setShowImagePickerModal(false);
    const hasPermission = await handleMediaLibraryPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setLogoImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
      Alert.alert(
        "Error",
        "Failed to select image from gallery. Please try again."
      );
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    setShowImagePickerModal(false);
    const hasPermission = await handleCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setLogoImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  }, []);

  const handleUploadPhoto = () => {
    setShowImagePickerModal(true);
  };

  const handleImportFromGoogleDrive = () => {
    // TODO: Implement Google Drive import
    console.log("Import from Google Drive pressed");
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const businessNameValidation = validateName(businessName, "Business name");

    return businessName.trim().length > 0 && businessNameValidation.isValid;
  }, [businessName]);

  const handleContinue = async () => {
    // Validate all fields before submitting
    const businessNameValidation = validateName(businessName, "Business name");

    setBusinessNameError(businessNameValidation.error);

    if (!businessNameValidation.isValid) {
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();

      // Add title (business name)
      formData.append("title", businessName.trim());

      // Add slogan if provided
      // if (slogan.trim()) {
        formData.append("slogan", slogan.trim());
      // }

      // Add image if it has changed and is a local file
      const hasImageChanged = logoImageUri !== originalLogoImageUri;
      if (hasImageChanged && logoImageUri) {
        // Check if it's a local file (starts with file://, content://, or ph://)
        if (
          logoImageUri.startsWith("file://") ||
          logoImageUri.startsWith("content://") ||
          logoImageUri.startsWith("ph://")
        ) {
          // It's a local file, append it
          const fileExtension = logoImageUri.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `business_logo.${fileExtension}`;
          const mimeType =
            fileExtension === "jpg" || fileExtension === "jpeg"
              ? "image/jpeg"
              : fileExtension === "png"
              ? "image/png"
              : fileExtension === "webp"
              ? "image/webp"
              : "image/jpeg";

          formData.append("image", {
            uri: logoImageUri,
            type: mimeType,
            name: fileName,
          } as any);
        }
        // If it's a remote URL and hasn't changed, we don't need to send it
      }

      // API call with FormData
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
          response.message || "Business profile updated successfully",
          "success",
          3000
        );

        router.back();
      } else {
        showBanner(
          "Error",
          response.message || "Failed to update business profile",
          "error",
          3000
        );
      }
    } catch (error: any) {
      console.error("Failed to update business profile:", error);
      showBanner(
        "Error",
        error.message || "Failed to update business profile. Please try again.",
        "error",
        3000
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Edit business profile" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          {logoImageUri && (
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: logoImageUri,
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          )}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadText}>Add your business logo</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleUploadPhoto}
              style={styles.uploadButton}
            >
              <MaterialIcons
                name="arrow-upward"
                size={moderateWidthScale(18)}
                color={theme.darkGreen}
              />
              <Text style={styles.uploadButtonText}>Upload photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
            disabled
              activeOpacity={0.7}
              onPress={handleImportFromGoogleDrive}
            >
              <Text style={styles.googleDriveLink}>
                {/* Import from google drive */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="Business name"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Business name *"
            autoCapitalize="words"
            onClear={handleClearBusinessName}
          />
          {businessNameError && (
            <Text style={styles.errorText}>{businessNameError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="Slogan (optional)"
            value={slogan}
            onChangeText={setSlogan}
            placeholder="Slogan (optional)"
            autoCapitalize="sentences"
            onClear={() => setSlogan("")}
          />
        </View>
      </ScrollView>

      <View style={styles.continueButtonContainer}>
        <Button
          title="Update"
          onPress={handleContinue}
          disabled={!isFormValid || isUpdating}
        />
      </View>

      <ModalizeBottomSheet
        visible={showImagePickerModal}
        onClose={() => setShowImagePickerModal(false)}
        title="Select Photo"
      >
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleSelectFromGallery}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="photo-library"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="camera-alt"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Camera</Text>
        </TouchableOpacity>
      </ModalizeBottomSheet>
    </SafeAreaView>
  );
}
