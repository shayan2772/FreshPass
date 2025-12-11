import React, { useMemo, useEffect } from "react";
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
import { Entypo } from "@expo/vector-icons";
import { Skeleton } from "@/src/components/skeletons";

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
    staffScrollView: { flex: 1 },
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
    emptyStateText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      textAlign: "center",
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(8),
    },
  });

interface StaffData {
  id: number;
  user_id: number;
  name: string;
  email: string;
  business_id: number;
  active: number;
  description: string | null;
  invitation_token: string;
  completed_appointments_count: number;
  business: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    email_notifications: boolean | null;
    profile_image_url: string | null;
    working_hours: any[];
  };
  created_at: string;
  createdAt: string;
}

interface StaffOnDutyProps {
  data: StaffData[] | null;
  callApi: () => Promise<void>;
}

export default function StaffOnDuty({ data, callApi }: StaffOnDutyProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);

  useEffect(() => {
    callApi();
  }, []);

  return (
    <View style={styles.staffContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Staff on duty</Text>
        {data && data.length > 0 && (
          <TouchableOpacity activeOpacity={0.7}>
            <View style={styles.sectionRight}>
              <Text style={styles.sectionLinkText}>
                {data.length > 8 ? `8/${data.length}` : `${data.length}`}
              </Text>
              <Entypo
                name="chevron-small-right"
                size={moderateWidthScale(20)}
                color={theme.darkGreen}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      {!data ? (
        <Skeleton screenType="StaffOnDuty" styles={styles} />
      ) : data.length === 0 ? (
        <Text style={styles.emptyStateText}>No staff</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.staffScrollView}
          contentContainerStyle={styles.staffScrollContent}
        >
          {data.slice(0, 8).map((staff, index) => (
            <View
              key={staff.id}
              style={[styles.staffItem, index === 0 && styles.staffItemFirst]}
            >
              <View style={styles.staffAvatar}>
                {staff.user?.profile_image_url ? (
                  <Image
                    source={{ uri: staff.user.profile_image_url }}
                    style={styles.staffAvatarImage}
                  />
                ) : (
                  <Image
                    source={{
                      uri: "https://www.w3schools.com/howto/img_avatar2.png",
                    }}
                    style={styles.staffAvatarImage}
                  />
                )}
              </View>
              <Text numberOfLines={1} style={styles.staffName}>
                {staff?.name ?? ""}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
