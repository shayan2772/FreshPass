import React, { useMemo, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import Button from "@/src/components/button";
import { SvgXml } from "react-native-svg";

// Star Icon SVG
const starIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0L10.163 5.528L16 6.112L12 10.056L12.944 16L8 13.056L3.056 16L4 10.056L0 6.112L5.837 5.528L8 0Z" fill="{{COLOR}}"/>
</svg>
`;

// Chevron Down Icon
const chevronDownSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L6 6L11 1" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const StarIcon = ({ width = 16, height = 16, color = "#DDA15E" }) => {
  const svgXml = starIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const ChevronDown = ({ width = 12, height = 8, color = "#283618" }) => {
  const svgXml = chevronDownSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    segmentedControl: {
      flexDirection: "row",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(4),
      marginHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(16),
      marginBottom: moderateHeightScale(16),
    },
    segment: {
      flex: 1,
      paddingVertical: moderateHeightScale(10),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: moderateWidthScale(8),
    },
    segmentActive: {
      backgroundColor: theme.buttonBack,
    },
    segmentInactive: {
      backgroundColor: theme.orangeBrown,
    },
    segmentText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    categoriesContainer: {
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(16),
    },
    categoriesScroll: {
      paddingHorizontal: moderateWidthScale(20),
    },
    categoryItem: {
      alignItems: "center",
      marginRight: moderateWidthScale(16),
    },
    categoryImage: {
      width: widthScale(80),
      height: heightScale(80),
      borderRadius: moderateWidthScale(12),
      backgroundColor: theme.lightGreen2,
    },
    categoryText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginTop: moderateHeightScale(8),
      textAlign: "center",
    },
    categoryTextActive: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontBold,
      color: theme.orangeBrown,
      marginTop: moderateHeightScale(8),
      textAlign: "center",
    },
    categoryTabs: {
      flexDirection: "row",
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(8),
      marginBottom: moderateHeightScale(16),
    },
    categoryTab: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
      marginRight: moderateWidthScale(12),
      borderRadius: moderateWidthScale(20),
      backgroundColor: theme.white,
    },
    categoryTabActive: {
      backgroundColor: theme.orangeBrown,
    },
    categoryTabText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    categoryTabTextActive: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    resultsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(16),
      marginBottom: moderateHeightScale(12),
    },
    resultsText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    sortByContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortByText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginRight: moderateWidthScale(4),
    },
    sortByValue: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortByValueText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(4),
    },
    verifiedSalonCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(16),
    },
    verifiedBadge: {
      backgroundColor: theme.buttonBack,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(4),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(8),
    },
    verifiedBadgeText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    salonName: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    salonAddress: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    salonRating: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    ratingText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginLeft: moderateWidthScale(4),
    },
    viewDetailButton: {
      backgroundColor: theme.orangeBrown,
      paddingVertical: moderateHeightScale(10),
      paddingHorizontal: moderateWidthScale(16),
      borderRadius: moderateWidthScale(8),
      alignSelf: "flex-start",
    },
    viewDetailText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    filtersContainer: {
      flexDirection: "row",
      paddingHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(16),
    },
    filterItem: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
      marginRight: moderateWidthScale(12),
      borderRadius: moderateWidthScale(20),
      backgroundColor: theme.white,
    },
    filterText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    sectionTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(12),
      width: widthScale(280),
    },
    serviceTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    servicePrice: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(4),
    },
    priceCurrent: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(8),
    },
    priceOriginal: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textDecorationLine: "line-through",
    },
    serviceDescription: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    serviceDuration: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(12),
    },
    servicesScroll: {
      paddingBottom: moderateHeightScale(16),
    },
    subscriptionCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(12),
      width: widthScale(280),
    },
    subscriptionImage: {
      width: "100%",
      height: heightScale(180),
      borderRadius: moderateWidthScale(8),
      marginBottom: moderateHeightScale(12),
      backgroundColor: theme.lightGreen2,
    },
    offerBadge: {
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(4),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(8),
    },
    offerText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    subscriptionTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    inclusionItem: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      marginBottom: moderateHeightScale(4),
    },
    moreText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.primary,
    },
  });

// Static data
const categories = [
  { id: 1, name: "Hair Salon", image: null },
  { id: 2, name: "Barber Shop", image: null },
  { id: 3, name: "Nail Salon", image: null },
  { id: 4, name: "Brows & Lashes", image: null },
  { id: 5, name: "Massage", image: null },
];

const serviceFilters = ["List >", "Beard Trim", "Haircut", "Blow dry", "Packages"];

const membershipFilters = ["List >", "All", "Classic Care", "Gold Glam", "VIP Elite"];

const services = [
  {
    id: 1,
    title: "Wet Haircut",
    price: 45.99,
    originalPrice: 50.99,
    description: "This service includes we wash and cut",
    duration: "45 mins",
  },
  {
    id: 2,
    title: "Wet Haircut",
    price: 45.99,
    originalPrice: 50.99,
    description: "This service includes we wash and cut",
    duration: "45 mins",
  },
];

const subscriptions = [
  {
    id: 1,
    title: "The Full Luxury Experience",
    offer: "15% Off All Products",
    offer2: "Get 1 free facial per month",
    inclusions: [
      "1. 2 Premium Haircuts",
      "2. 1 Free Styling Service",
      "+3 more",
    ],
    image: null,
  },
  {
    id: 2,
    title: "The Full Luxury Experience",
    offer: "Save 20%",
    offer2: "LIMITED TIME OFFER",
    inclusions: [
      "1. 2 Premium Haircuts",
      "2. 1 Free Styling Service",
      "+2 more",
    ],
    image: null,
  },
];

export default function DashboardContent() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const [activeTab, setActiveTab] = useState<"subscriptions" | "individual">(
    "individual"
  );
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 100 && !showCategoryTabs) {
          setShowCategoryTabs(true);
        } else if (offsetY <= 100 && showCategoryTabs) {
          setShowCategoryTabs(false);
        }
      },
    }
  );

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segment,
            activeTab === "subscriptions"
              ? styles.segmentActive
              : styles.segmentInactive,
          ]}
          onPress={() => setActiveTab("subscriptions")}
        >
          <Text style={styles.segmentText}>Subscriptions list</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            activeTab === "individual"
              ? styles.segmentActive
              : styles.segmentInactive,
          ]}
          onPress={() => setActiveTab("individual")}
        >
          <Text style={styles.segmentText}>Individual services</Text>
        </TouchableOpacity>
      </View>

      {/* Categories - Show images by default, tabs on scroll */}
      {!showCategoryTabs ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View style={styles.categoryImage} />
              <Text
                style={
                  selectedCategory === category.id
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
        >
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>All Salons/Shops</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={
                  selectedCategory === category.id
                    ? styles.categoryTabTextActive
                    : styles.categoryTabText
                }
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Results Summary */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing: 870 results for Hair Salon
        </Text>
        <View style={styles.sortByContainer}>
          <Text style={styles.sortByText}>Sort by:</Text>
          <TouchableOpacity style={styles.sortByValue}>
            <Text style={styles.sortByValueText}>
              {activeTab === "individual" ? "Nearest to you" : "Recommended"}
            </Text>
            <ChevronDown
              width={widthScale(12)}
              height={heightScale(8)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Filters (for Individual Services) */}
      {activeTab === "individual" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {serviceFilters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterItem}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Membership Filters (for Subscriptions) */}
      {activeTab === "subscriptions" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {membershipFilters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterItem}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Platform Verified Salon (Individual Services only) */}
      {activeTab === "individual" && (
        <View style={styles.verifiedSalonCard}>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>Platform verified</Text>
          </View>
          <Text style={styles.salonName}>Ra Benjamin Styles LLC</Text>
          <Text style={styles.salonAddress}>
            9853 E Fern ST, Palmetto Bay, 33157
          </Text>
          <View style={styles.salonRating}>
            <StarIcon
              width={widthScale(16)}
              height={heightScale(16)}
              color={theme.orangeBrown}
            />
            <Text style={styles.ratingText}>4.9/64 reviews</Text>
          </View>
          <TouchableOpacity style={styles.viewDetailButton}>
            <Text style={styles.viewDetailText}>View detail</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nearest to you Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: moderateWidthScale(20),
          marginTop: moderateHeightScale(16),
          marginBottom: moderateHeightScale(12),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Nearest to you</Text>
          <Text
            style={{
              fontSize: fontSize.size18,
              fontFamily: fonts.fontBold,
              color: theme.darkGreen,
              marginLeft: moderateWidthScale(8),
            }}
          >
            Ra Benjamin Styles LLC
          </Text>
        </View>
        <TouchableOpacity>
          <Text
            style={{
              fontSize: fontSize.size14,
              fontFamily: fonts.fontBold,
              color: theme.primary,
            }}
          >
            View more
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "individual" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScroll}
        >
          {services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <View style={styles.servicePrice}>
                <Text style={styles.priceCurrent}>${service.price}</Text>
                <Text style={styles.priceOriginal}>${service.originalPrice}</Text>
              </View>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
              <Text style={styles.serviceDuration}>{service.duration}</Text>
              <Button
                title="Book Now"
                onPress={() => {}}
                containerStyle={{
                  backgroundColor: theme.orangeBrown,
                }}
                textColor={theme.white}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScroll}
        >
          {subscriptions.map((subscription) => (
            <View key={subscription.id} style={styles.subscriptionCard}>
              <View style={styles.subscriptionImage} />
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>{subscription.offer}</Text>
              </View>
              {subscription.offer2 && (
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{subscription.offer2}</Text>
                </View>
              )}
              <Text style={styles.subscriptionTitle}>
                {subscription.title}
              </Text>
              {subscription.inclusions.map((inclusion, index) => (
                <Text
                  key={index}
                  style={[
                    styles.inclusionItem,
                    inclusion.startsWith("+") && styles.moreText,
                  ]}
                >
                  {inclusion}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

