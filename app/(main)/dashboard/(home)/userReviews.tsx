import React, { useMemo, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
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
import { UserAvatarIcon } from "@/assets/icons";

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string | null;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
      // paddingHorizontal: moderateWidthScale(20),
      // paddingTop: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(24),
    },
    averageText: {
      fontSize: fontSize.size32,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    countLabel: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(12),
    },
    card: {
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      marginBottom: moderateHeightScale(16),
      marginHorizontal: moderateWidthScale(20),
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
    },
    avatar: {
      width: widthScale(42),
      height: widthScale(42),
      borderRadius: moderateWidthScale(4),
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
    },
    avatarImage: {
      width:"100%",
      height:"100%",
      overflow: "hidden",
      borderRadius: moderateWidthScale(4),
    },
    nameText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    dateText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginTop: moderateHeightScale(4),
    },
    starsRow: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(12),
    },
    starIcon: {
      marginRight: moderateWidthScale(4),
    },
    reviewText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(20),
    },
    seeMoreText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.selectCard,
      textDecorationLine: "underline",
      textDecorationColor: theme.selectCard,
      marginTop: moderateHeightScale(8),
    },
  });

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Ofir Kiran",
    date: "September 28, 2023",
    rating: 5,
    text: "Super professional and right on time. Loved the attention to detail. From booking to the cut—it’s a smooth experience every time Super professional and right on time. Loved the attention to detail. From booking to the cut—it’s a smooth.",
    image:
      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
  },
  {
    id: "2",
    name: "Ofir Kiran",
    date: "September 28, 2023",
    rating: 3.4,
    text: "Super professional and right on time. Loved the attention to detail. From booking to the cut—it’s a smooth experience every time.",
    image: null,
  },
];

export default function UserReviewsScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const getStars = (rating: number) => {
    const stars: ("star" | "star-half" | "star-border")[] = [];
    for (let i = 1; i <= 5; i += 1) {
      if (rating >= i) {
        stars.push("star");
      } else if (rating >= i - 0.5) {
        stars.push("star-half");
      } else {
        stars.push("star-border");
      }
    }
    return stars;
  };

  const textWrapLength = 145;

  return (
    <View style={styles.container}>
      <StackHeader title="User reviews rate" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: moderateWidthScale(20) }}>
          <Text style={styles.averageText}>4.9 Average</Text>
          <Text style={styles.countLabel}>276 ratings</Text>
        </View>

        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: review.image
                      ? theme.lightGreen07
                      : theme.green,
                  },
                ]}
              >
                {review.image ? (
                  <Image
                    source={{ uri: review.image }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <UserAvatarIcon
                    width={widthScale(22)}
                    height={widthScale(22)}
                  />
                )}
              </View>
              <View>
                <Text style={styles.nameText}>{review.name}</Text>
                <Text style={styles.dateText}>{review.date}</Text>
              </View>
            </View>

            <View style={styles.starsRow}>
              {getStars(review.rating).map((icon, index) => (
                <MaterialIcons
                  key={`${review.id}-star-${index}`}
                  name={icon}
                  size={moderateWidthScale(18)}
                  color={theme.darkGreen}
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.reviewText}>
              {expandedReviews[review.id] ||
              review.text.length <= textWrapLength
                ? review.text
                : `${review.text.slice(0, textWrapLength).trim()}...`}
            </Text>
            {review.text.length > textWrapLength &&
              !expandedReviews[review.id] && (
                <Text
                  style={styles.seeMoreText}
                  onPress={() =>
                    setExpandedReviews((prev) => ({
                      ...prev,
                      [review.id]: true,
                    }))
                  }
                >
                  See more
                </Text>
              )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
