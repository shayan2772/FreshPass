import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
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
      alignItems: "center",
    },
    profileImageContainer: {
      width: widthScale(120),
      height: widthScale(120),
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
      marginBottom: moderateHeightScale(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
    },
    businessNameText: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(5),
      textAlign: "center",
    },
    sloganText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(24),
      textAlign: "center",
    },
    editButtonContainer: {
      width: "30%",
      marginBottom: moderateHeightScale(16),
    },
    editButton: {
      backgroundColor: theme.darkGreen,
      borderRadius: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: moderateWidthScale(8),
    },
    editButtonText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.buttonText,
    },
    privacyNote: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
  });

export default function BusinessProfileScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();

  const handleEditPress = () => {
    router.push("./editBusinessProfile");
  };

  return (
    <View style={styles.container}>
      <StackHeader title="Business profile" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.businessNameText}>Ra Benjamin Styles LLC</Text>
        <Text style={styles.sloganText}>Slogan will be here</Text>

        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditPress}
            style={styles.editButton}
          >
            <MaterialIcons
              name="edit"
              size={moderateWidthScale(18)}
              color={theme.buttonText}
            />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.privacyNote}>
          This photo is seen by others when they view your profile, messages and
          reviews.
        </Text>
      </ScrollView>
    </View>
  );
}

