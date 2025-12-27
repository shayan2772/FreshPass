import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    tabsContainer: {
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1,
    },
    swipeableContent: {
      flexDirection: "row",
    },
    tabContent: {
      width: SCREEN_WIDTH,
      overflow: "hidden",
    },
    segmentedControl: {
      flexDirection: "row",
      backgroundColor: theme.darkGreen,
      borderRadius: moderateWidthScale(999),
      padding: moderateWidthScale(3),
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(12),
    },
    segment: {
      flex: 1,
      paddingVertical: moderateHeightScale(6),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: moderateWidthScale(999),
    },
    segmentActive: {
      backgroundColor: theme.orangeBrown,
      borderWidth: moderateWidthScale(1),
      borderColor: theme.buttonBack,
    },
    segmentInactive: {
      backgroundColor: "transparent",
    },
    segmentText: {
      fontSize: fontSize.size14,
    },
    segmentTextActive: {
      color: theme.darkGreen,
      fontFamily: fonts.fontMedium,
    },
    segmentTextInactive: {
      color: theme.segmentInactiveTabText,
      fontFamily: fonts.fontRegular,
    },
    categoriesContainer: {
      marginTop: moderateHeightScale(4),
    },
    categoriesScroll: {
      paddingHorizontal: moderateWidthScale(20),
    },
    categoryItem: {
      alignItems: "center",
      marginRight: moderateWidthScale(16),
      width: widthScale(60),
    },
    categoryImage: {
      width: widthScale(60),
      height: heightScale(60),
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.lightGreen2,
      borderColor: theme.borderLight,
    },
    categoryImageActive: {
      borderColor: theme.selectCard,
    },
    categoryText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      marginTop: moderateHeightScale(4),
      textAlign: "center",
      flexWrap: "wrap",
      width: widthScale(60),
    },
    categoryTextActive: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.selectCard,
      marginTop: moderateHeightScale(4),
      textAlign: "center",
      flexWrap: "wrap",
      width: widthScale(60),
    },
    categoryTabs: {
      flexDirection: "row",
      paddingHorizontal: moderateWidthScale(20),
      alignItems: "center",
      // backgroundColor: "red",
    },
    categoryTabsSticky: {
      position: "absolute",
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: theme.background,
      borderBottomWidth: moderateWidthScale(1),
      borderBottomColor: theme.lightGreen1,
    },
    categoryTab: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(8),
      // marginRight: moderateWidthScale(1),
      alignItems: "center",
      position: "relative",
    },
    categoryTabActive: {
      // No background change for active
    },
    categoryTabText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen,
    },
    categoryTabTextActive: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    categoryTabUnderline: {
      position: "absolute",
      bottom: moderateHeightScale(0),
      left: moderateWidthScale(12),
      right: moderateWidthScale(12),
      height: moderateHeightScale(2),
      backgroundColor: theme.selectCard,
      borderRadius: moderateWidthScale(1),
    },
    resultsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(12),
      marginVertical: moderateHeightScale(12),
      backgroundColor: theme.mapCircleFill,
      width: "100%",
      gap: moderateWidthScale(12),
    },
    resultsTextContainer: {
      flex: 1,
      flexShrink: 1,
    },
    resultsText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      flexWrap: "wrap",
    },
    resultsTextBold: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    sortByContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    sortByText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    sortByValue: {
      flexDirection: "row",
       alignItems: "center",
    },
    sortByValueText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginRight: moderateWidthScale(2),
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
  { id: 6, name: "Nail Salon", image: null },
  { id: 7, name: "Brows & Lashes", image: null },
  { id: 8, name: "Massage", image: null },
  { id: 9, name: "Spa", image: null },
  { id: 10, name: "Makeup Studio", image: null },
  { id: 11, name: "Skincare", image: null },
  { id: 12, name: "Wellness Center", image: null },
];

const serviceFilters = [
  "List >",
  "Beard Trim",
  "Haircut",
  "Blow dry",
  "Packages",
];

const membershipFilters = [
  "List >",
  "All",
  "Classic Care",
  "Gold Glam",
  "VIP Elite",
];

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
    "subscriptions"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    categories.length > 0 ? categories[0].id : 1
  );
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const isManualScrollRef = useRef(false);
  const categoryScrollRef = useRef<ScrollView>(null);
  const isCategoryScrollingRef = useRef(false);
  const categorySectionHeight = useRef(0);
  const categorySectionRef = useRef<View>(null);
  const tabsContainerHeight = useRef(0);
  const tabsContainerRef = useRef<View>(null);

  // Initialize scroll position to subscriptions (index 0)
  useEffect(() => {
    // Set initial position without animation
    horizontalScrollViewRef.current?.scrollTo({
      x: 0,
      animated: false,
    });
  }, []);

  // Set first category as selected by default when categories data is available
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, []);

  // Update horizontal scroll position when tab changes (only when clicking, not swiping)
  useEffect(() => {
    // Only scroll if this was a manual tab change (click), not from swipe
    if (isManualScrollRef.current) {
      const tabIndex = activeTab === "subscriptions" ? 0 : 1;
      const targetX = tabIndex * SCREEN_WIDTH;

      // Update ScrollView position
      horizontalScrollViewRef.current?.scrollTo({
        x: targetX,
        animated: true,
      });

      // Reset flag after animation completes
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 500);
    }
  }, [activeTab]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show category tabs when scrolled a bit (around 50-80px)
        const threshold = moderateHeightScale(50);

        if (offsetY > threshold && !showCategoryTabs) {
          setShowCategoryTabs(true);
        } else if (offsetY <= threshold && showCategoryTabs) {
          setShowCategoryTabs(false);
        }
      },
    }
  );

  const handleHorizontalScrollEnd = (event: any) => {
    // Only update tab when scroll ends (prevents flickering during animation)
    if (!isManualScrollRef.current) {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newTabIndex = Math.round(offsetX / SCREEN_WIDTH);
      // Index 0 = subscriptions, Index 1 = individual
      const newTab = newTabIndex === 0 ? "subscriptions" : "individual";

      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    }
  };

  const handleTabPress = (tab: "subscriptions" | "individual") => {
    isManualScrollRef.current = true;
    setActiveTab(tab);
  };

  const getCategoryName = () => {
    if (selectedCategory === "all") {
      return "All Salons/Shops";
    }
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "Hair Salon";
  };

  const renderTabContent = (tab: "subscriptions" | "individual") => (
    <ScrollView
      style={styles.tabContent}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Spacer for sticky tabs */}
      {showCategoryTabs && (
        <View style={{ height: moderateHeightScale(100) }} />
      )}

      {/* Categories - Show images only when not scrolled */}
      {!showCategoryTabs && (
        <View
          ref={categorySectionRef}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0) {
              categorySectionHeight.current = height;
            }
          }}
        >
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesScroll}
            nestedScrollEnabled={true}
            onTouchStart={() => {
              isCategoryScrollingRef.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                isCategoryScrollingRef.current = false;
              }, 100);
            }}
            onScrollBeginDrag={() => {
              isCategoryScrollingRef.current = true;
            }}
            onScrollEndDrag={() => {
              setTimeout(() => {
                isCategoryScrollingRef.current = false;
              }, 100);
            }}
            onMomentumScrollEnd={() => {
              setTimeout(() => {
                isCategoryScrollingRef.current = false;
              }, 100);
            }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri:
                      category?.image ||
                      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
                  }}
                  style={[
                    styles.categoryImage,
                    selectedCategory === category.id &&
                      styles.categoryImageActive,
                    {
                      borderWidth: moderateWidthScale(
                        selectedCategory === category.id ? 3 : 1
                      ),
                    },
                  ]}
                  resizeMode="cover"
                />
                <Text
                  style={
                    selectedCategory === category.id
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                  numberOfLines={2}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results Summary */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsTextContainer}>
          <Text style={styles.resultsText}>
            Showing: <Text style={styles.resultsTextBold}>870 results</Text> for {getCategoryName()}
          </Text>
        </View>

        <View style={styles.sortByContainer}>
          <Text style={styles.sortByText}>Sort by: </Text>
          <TouchableOpacity style={styles.sortByValue}>
            <Text style={styles.sortByValueText}>
              {tab === "individual" ? "Nearest to you" : "Recommended"}
            </Text>
            <ChevronDown
              width={widthScale(8)}
              height={heightScale(4)}
              color={theme.lightGreen}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Filters (for Individual Services) */}
      {tab === "individual" && (
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
      {tab === "subscriptions" && (
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
      {tab === "individual" && (
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
      {tab === "individual" ? (
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
                <Text style={styles.priceOriginal}>
                  ${service.originalPrice}
                </Text>
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
              <Text style={styles.subscriptionTitle}>{subscription.title}</Text>
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

  return (
    <View style={styles.container}>
      {/* Fixed Segmented Control */}
      <View
        ref={tabsContainerRef}
        style={styles.tabsContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0) {
            tabsContainerHeight.current = height;
          }
        }}
      >
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segment,
              activeTab === "subscriptions"
                ? styles.segmentActive
                : styles.segmentInactive,
            ]}
            onPress={() => handleTabPress("subscriptions")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "subscriptions"
                  ? styles.segmentTextActive
                  : styles.segmentTextInactive,
              ]}
            >
              Subscriptions list
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              activeTab === "individual"
                ? styles.segmentActive
                : styles.segmentInactive,
            ]}
            onPress={() => handleTabPress("individual")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "individual"
                  ? styles.segmentTextActive
                  : styles.segmentTextInactive,
              ]}
            >
              Individual services
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky Category Tabs - Fixed at top when scrolled (Image 2 design) */}
      {showCategoryTabs && (
        <View
          style={[
            styles.categoryTabsSticky,
            { top: tabsContainerHeight.current },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          >
            <TouchableOpacity
              style={styles.categoryTab}
              onPress={() => setSelectedCategory("all")}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === "all" && styles.categoryTabTextActive,
                ]}
              >
                All Salons/Shops
              </Text>
              {selectedCategory === "all" && (
                <View style={styles.categoryTabUnderline} />
              )}
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryTab}
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
                {selectedCategory === category.id && (
                  <View style={styles.categoryTabUnderline} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Swipeable Content */}
      <GestureHandlerRootView style={styles.contentContainer}>
        <ScrollView
          ref={horizontalScrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleHorizontalScrollEnd}
          scrollEnabled={!isCategoryScrollingRef.current}
          style={styles.contentContainer}
          contentContainerStyle={styles.swipeableContent}
        >
          {renderTabContent("subscriptions")}
          {renderTabContent("individual")}
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
}
