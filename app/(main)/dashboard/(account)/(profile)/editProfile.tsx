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
import {
  validateEmail,
  validateName,
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
      gap:10
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
      width:155
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
    updateButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(24),
      paddingTop: moderateHeightScale(28),
    },
    errorText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(4),
    },
  });

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [email, setEmail] = useState("Daniel1123@gmail.com");
  const [firstName, setFirstName] = useState("Jack");
  const [lastName, setLastName] = useState("Daniel");
  const [profileImageUri, setProfileImageUri] = useState(
    "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg"
  );
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  // Validate email when it changes
  useEffect(() => {
    if (email.length > 0) {
      const validation = validateEmail(email);
      setEmailError(validation.error);
    } else {
      setEmailError(null);
    }
  }, [email]);

  // Validate first name when it changes
  useEffect(() => {
    if (firstName.length > 0) {
      const validation = validateName(firstName, "First name");
      setFirstNameError(validation.error);
    } else {
      setFirstNameError(null);
    }
  }, [firstName]);

  // Validate last name when it changes
  useEffect(() => {
    if (lastName.length > 0) {
      const validation = validateName(lastName, "Last name");
      setLastNameError(validation.error);
    } else {
      setLastNameError(null);
    }
  }, [lastName]);

  const handleClearEmail = useCallback(() => {
    setEmail("");
    setEmailError(null);
  }, []);

  const handleClearFirstName = useCallback(() => {
    setFirstName("");
    setFirstNameError(null);
  }, []);

  const handleClearLastName = useCallback(() => {
    setLastName("");
    setLastNameError(null);
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
        setProfileImageUri(result.assets[0].uri);
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
        setProfileImageUri(result.assets[0].uri);
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
    const emailValidation = validateEmail(email);
    const firstNameValidation = validateName(firstName, "First name");
    const lastNameValidation = validateName(lastName, "Last name");

    return (
      email.trim().length > 0 &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      emailValidation.isValid &&
      firstNameValidation.isValid &&
      lastNameValidation.isValid
    );
  }, [email, firstName, lastName]);

  const handleUpdateProfile = () => {
    // Validate all fields before submitting
    const emailValidation = validateEmail(email);
    const firstNameValidation = validateName(firstName, "First name");
    const lastNameValidation = validateName(lastName, "Last name");

    setEmailError(emailValidation.error);
    setFirstNameError(firstNameValidation.error);
    setLastNameError(lastNameValidation.error);

    if (
      emailValidation.isValid &&
      firstNameValidation.isValid &&
      lastNameValidation.isValid
    ) {
      // TODO: Implement update profile logic
      console.log("Update profile pressed", {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        profileImageUri,
      });
    }
  };

 
  return (
    <View style={styles.container}>
      <StackHeader title="Edit Profile" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: profileImageUri,
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.uploadSection}>
            <Text style={styles.uploadText}>Add your new image</Text>
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
              activeOpacity={0.7}
              onPress={handleImportFromGoogleDrive}
            >
              <Text style={styles.googleDriveLink}>
                Import from google drive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onClear={handleClearEmail}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            autoCapitalize="words"
            onClear={handleClearFirstName}
          />
          {firstNameError && (
            <Text style={styles.errorText}>{firstNameError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <FloatingInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            autoCapitalize="words"
            onClear={handleClearLastName}
          />
          {lastNameError && (
            <Text style={styles.errorText}>{lastNameError}</Text>
          )}
        </View>

        <View style={styles.updateButtonContainer}>
          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            disabled={!isFormValid}
          />
        </View>
      </ScrollView>

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
    </View>
  );
}
