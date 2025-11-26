import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
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
import { MaterialIcons } from "@expo/vector-icons";

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
      marginBottom: moderateHeightScale(32),
    },
    profileImageContainer: {
      width: widthScale(80),
      height: widthScale(80),
      borderRadius: moderateWidthScale(8),
      overflow: "hidden",
      marginRight: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    uploadSection: {
      flex: 1,
    },
    uploadText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(12),
    },
    uploadButton: {
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: moderateWidthScale(8),
      marginBottom: moderateHeightScale(8),
    },
    uploadButtonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    googleDriveLink: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.orangeBrown,
      textDecorationLine: "underline",
      textDecorationColor: theme.orangeBrown,
    },
    inputContainer: {
      marginBottom: moderateHeightScale(24),
    },
    inputLabel: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    input: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(14),
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    inputWithClear: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      paddingHorizontal: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    inputText: {
      flex: 1,
      paddingVertical: moderateHeightScale(14),
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    clearButton: {
      padding: moderateWidthScale(4),
    },
  });

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [email, setEmail] = useState("Daniel1123@gmail.com");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("Daniel");

  const handleUploadPhoto = () => {
    // TODO: Implement photo upload
    console.log("Upload photo pressed");
  };

  const handleImportFromGoogleDrive = () => {
    // TODO: Implement Google Drive import
    console.log("Import from Google Drive pressed");
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
                uri: "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
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
                name="cloud-upload"
                size={moderateWidthScale(18)}
                color={theme.white}
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
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWithClear}>
            <TextInput
              style={styles.inputText}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={theme.lightGreen}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setEmail("")}
                style={styles.clearButton}
              >
                <MaterialIcons
                  name="cancel"
                  size={moderateWidthScale(20)}
                  color={theme.lightGreen}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={theme.lightGreen}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last name</Text>
          <View style={styles.inputWithClear}>
            <TextInput
              style={styles.inputText}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={theme.lightGreen}
              autoCapitalize="words"
            />
            {lastName.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setLastName("")}
                style={styles.clearButton}
              >
                <MaterialIcons
                  name="cancel"
                  size={moderateWidthScale(20)}
                  color={theme.lightGreen}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

