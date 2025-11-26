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
import { Entypo, Ionicons } from "@expo/vector-icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    staffContainer: {
      marginBottom: moderateHeightScale(18),
      backgroundColor: theme.lightGreen1,
      paddingVertical: moderateHeightScale(12),
      gap: moderateHeightScale(12),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(15),
    },
    sectionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    sectionRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
    },
    sectionLinkText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    staffScrollView: {},
    staffScrollContent: {
      paddingHorizontal: moderateWidthScale(20),
    },
    staffItemFirst: {
      marginLeft: 0,
    },
    staffItem: {
      alignItems: "center",
      marginRight: moderateWidthScale(20),
      gap: moderateHeightScale(5),
    },
    staffAvatar: {
      width: widthScale(52),
      height: widthScale(52),
      borderRadius: widthScale(52 / 2),
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
    },
    staffAvatarImage: {
      flex: 1,
      borderRadius: widthScale(52 / 2),
      overflow: "hidden",
    },
    staffName: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlign: "center",
    
    },
  });

// Static data
const staffData = [
  {
    id: "1",
    name: "Md Shariful Isl...",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
  },
  {
    id: "2",
    name: "Md Shariful Isl...",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
  },
  {
    id: "3",
    name: "Md Shariful Isl...",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
  },
  {
    id: "4",
    name: "Md Shariful Isl...",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
  },
  {
    id: "5",
    name: "Md Shari",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
  },
];

export default function StaffOnDuty() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  return (
    <View style={styles.staffContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Staff on duty</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionLinkText}>12/14</Text>
            <Entypo
              name="chevron-small-right"
              size={moderateWidthScale(20)}
              color={theme.darkGreen}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.staffScrollView}
        contentContainerStyle={styles.staffScrollContent}
      >
        {staffData.map((staff, index) => (
          <View
            key={staff.id}
            style={[styles.staffItem, index === 0 && styles.staffItemFirst]}
          >
            <View style={styles.staffAvatar}>
              <Image
                source={{ uri: staff.avatar }}
                style={styles.staffAvatarImage}
              />
            </View>
            <Text numberOfLines={1} style={styles.staffName}>{staff?.name ?? ""}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
