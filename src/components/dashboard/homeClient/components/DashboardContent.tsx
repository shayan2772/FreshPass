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
  Modal,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import Button from "@/src/components/button";
import { SvgXml } from "react-native-svg";
import {
  PersonIcon,
  MonitorIcon,
  PlatformVerifiedStarIcon,
} from "@/assets/icons";
import InclusionsModal from "@/src/components/inclusionsModal";

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

// Chevron Right Icon
const chevronRightSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L6 6L1 11" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

const ChevronRight = ({ width = 8, height = 12, color = "#FFFFFF" }) => {
  const svgXml = chevronRightSvg
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
    appCard: {
      height: heightScale(165),
    },
    appointmentsScroll: {
      paddingHorizontal: moderateWidthScale(20),
    },
    verifiedSalonCard: {
      backgroundColor: theme.darkGreen,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      height: heightScale(140),
      width: widthScale(310),
      alignItems: "center",
      justifyContent: "center",
    },
    verifiedCardTopRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
      gap: moderateWidthScale(4),
      width: "100%",
    },
    verifiedBadge: {
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      alignSelf: "flex-start",
    },
    verifiedBadgeText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    dateTimeBadge: {
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      alignSelf: "flex-start",
    },
    dateTimeBadgeText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    verifiedCardContent: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: moderateWidthScale(12),
    },
    verifiedCardImage: {
      width: widthScale(67),
      height: heightScale(67),
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.lightGreen2,
    },
    verifiedCardImageNew: {
      width: widthScale(105),
      height: heightScale(120),
      borderRadius: moderateWidthScale(999),
      backgroundColor: theme.lightGreen2,
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
    },
    verifiedCardTextContainer: {
      flex: 1,
      gap: moderateHeightScale(4),
    },
    salonName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    verifiedCardInfoRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    verifiedCardInfoRow2: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    verifiedCardInfoText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.white80,
      marginLeft: moderateWidthScale(6),
    },
    viewDetailLink: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-end",
      gap: moderateWidthScale(4),
    },
    viewDetailText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.orangeBrown,
    },
    verifiedSalonCardNew: {
      backgroundColor: theme.darkGreen,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      height: heightScale(140),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
      width: widthScale(310),
    },

    verifiedSalonImage: {
      width: widthScale(100),
      height: heightScale(110),
      borderRadius: moderateWidthScale(6),
      backgroundColor: theme.lightGreen2,
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
    },
    platformVerifiedBadge: {
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
      alignSelf: "flex-start",
    },
    platformVerifiedText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    verifiedSalonContent: {
      gap: moderateHeightScale(12),
      width: "60%",
    },
    verifiedSalonBusinessName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    verifiedSalonAddress: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.white80,
    },
    verifiedSalonBottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    verifiedSalonRatingButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(6),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      borderWidth: moderateWidthScale(1),
      borderColor: theme.white70,
      gap: moderateWidthScale(6),
    },
    verifiedSalonRatingText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontRegular,
      color: theme.white,
    },
    verifiedSalonViewDetail: {},
    verifiedSalonViewDetailText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.orangeBrown,
      textDecorationLine: "underline",
      textDecorationColor: theme.orangeBrown,
    },
    filtersContainer: {
      marginBottom: moderateHeightScale(16),
      marginTop: moderateHeightScale(8),
    },
    filterItem: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
      borderRadius: moderateWidthScale(999),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    filterItemPrimary: {
      backgroundColor: theme.darkGreen,
    },
    filterItemInactive: {
      backgroundColor: theme.background,
      borderWidth: 0.5,
      borderColor: theme.serviceBorder,
    },
    filterItemActive: {
      backgroundColor: theme.lightGreen015,
      borderWidth: 1,
      borderColor: theme.serviceBorder,
    },
    filterText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    filterTextPrimary: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontBold,
      color: theme.background,
    },
    filterTextInactive: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    filterTextActive: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    filterIcon: {
      marginLeft: moderateWidthScale(5),
      top: 1,
    },
    sectionTitle: {
      fontSize: fontSize.size19,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(5),
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(20),
    },
    sectionSubTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      maxWidth: "75%",
    },
    sectionViewMore: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.orangeBrown,
      textDecorationLine: "underline",
      textDecorationColor: theme.orangeBrown,
    },
    serviceCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      paddingVertical: moderateWidthScale(12),
      marginBottom: moderateHeightScale(12),
      width: widthScale(225),
      height: heightScale(120),
      justifyContent: "space-between",
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
    serviceTitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    servicePrice: {
      alignItems: "flex-end",
      gap: moderateWidthScale(4),
    },
    priceCurrent: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    priceOriginal: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen4,
      textDecorationLine: "line-through",
    },
    serviceDescription: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    line: {
      height: 0.5,
      width: "100%",
      backgroundColor: theme.borderLight,
    },
    serviceBottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(12),
    },
    serviceDuration: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      maxWidth: "65%",
    },
    serviceButtonContainer: {
      alignSelf: "flex-end",
    },
    servicesScroll: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(16),
    },
    subscriptionCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      width: widthScale(200),
      height: heightScale(330),
      overflow: "hidden",
    },
    subscriptionImage: {
      width: "100%",
      height: heightScale(140),
      borderTopLeftRadius: moderateWidthScale(8),
      borderTopRightRadius: moderateWidthScale(8),
      marginBottom: moderateHeightScale(12),
      backgroundColor: theme.lightGreen2,
      overflow: "hidden",
    },
    offerBadgesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(4),
    },
    offerBadge: {
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(999),
      alignSelf: "flex-start",
    },
    offerBadgeOrange: {
      backgroundColor: theme.selectCard,
    },
    offerBadgeGreen: {
      borderWidth: 1,
      borderColor: theme.lightGreen,
      borderRadius: moderateWidthScale(999),
    },
    offerText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    subscriptionTitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginVertical: moderateHeightScale(8),
    },
    inclusionItem: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(2),
    },
    moreText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.primary,
      textDecorationLine: "underline",
      textDecorationColor: theme.primary,
    },
    inclusionsModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    inclusionsModalContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(20),
      width: widthScale(300),
      maxHeight: heightScale(400),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: moderateHeightScale(2),
      },
      shadowOpacity: 0.25,
      shadowRadius: moderateWidthScale(3.84),
      elevation: 5,
    },
    inclusionsModalTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    inclusionsModalList: {
      gap: moderateHeightScale(8),
    },
    inclusionsModalItem: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    subscriptionPrice: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(8),
    },
    subscriptionPriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(4),
    },
    subscriptionButtonContainer: {
      alignSelf: "flex-end",
    },
    button: {
      backgroundColor: theme.bookNowButton,
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
      height: moderateHeightScale(28),
      borderRadius: moderateWidthScale(999),
    },
    buttonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    sectionContainer: {
      // marginBottom: moderateHeightScale(24),
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
  { id: "services", label: "Services", isPrimary: true },
  { id: "beard-trim", label: "Beard Trim", isPrimary: false },
  { id: "haircut", label: "Haircut", isPrimary: false },
  { id: "blow-dry", label: "Blow dry", isPrimary: false },
  { id: "pad", label: "Pad", isPrimary: false },
];

const membershipFilters = [
  { id: "list", label: "List", isPrimary: true },
  { id: "all", label: "All", isPrimary: false },
  { id: "classic-care", label: "Classic Care", isPrimary: false },
  { id: "gold-glam", label: "Gold Glam", isPrimary: false },
  { id: "vip-elite", label: "VIP Elite", isPrimary: false },
];

// Section-based data structure
interface ServiceItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  duration: string;
}

interface SubscriptionItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  offer: string;
  offer2?: string;
  inclusions: string[];
  image: string | null;
}

interface ServiceSection {
  id: number;
  businessName: string;
  type: "individual" | "subscription";
  services?: ServiceItem[];
  subscriptions?: SubscriptionItem[];
}

const serviceSections: ServiceSection[] = [
  {
    id: 1,
    businessName: "Ra Benjamin Styles LLC",
    type: "individual",
    services: [
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
    ],
  },
  {
    id: 2,
    businessName: "Beach Club Salon & Spa",
    type: "individual",
    services: [
      {
        id: 113,
        title: "Wet Haircut",
        price: 45.99,
        originalPrice: 50.99,
        description: "This service includes we wash and cut",
        duration: "45 mins",
      },
      {
        id: 114,
        title: "Wet Haircut",
        price: 45.99,
        originalPrice: 50.99,
        description: "This service includes we wash and cut",
        duration: "45 mins",
      },
    ],
  },
];

const subscriptionSections: ServiceSection[] = [
  {
    id: 1,
    businessName: "Ra Benjamin Styles LLC",
    type: "subscription",
    subscriptions: [
      {
        id: 1,
        title: "The Full Luxury Experience",
        price: 45.99,
        originalPrice: 50.99,
        offer: "15% Off All Products",
        offer2: "Get 1 free facial per month",
        inclusions: [
          "1. 2 Premium Haircuts",
          "2. 1 Free Styling Service",
          "3. 1 Free Facial per month",
        ],
        image: null,
      },
      {
        id: 2,
        title: "Premium Care Package",
        price: 89.99,
        originalPrice: 99.99,
        offer: "20% Off First Month",
        offer2: "Free Consultation",
        inclusions: [
          "1. 4 Premium Haircuts",
          "2. 2 Free Styling Services",
          "3. 2 Free Facials per month",
          "4. Free Hair Products",
        ],
        image: null,
      },
    ],
  },
  {
    id: 2,
    businessName: "Beach Club Salon & Spa",
    type: "subscription",
    subscriptions: [
      {
        id: 3,
        title: "Elite Spa Membership",
        price: 129.99,
        originalPrice: 149.99,
        offer: "25% Off All Services",
        inclusions: [
          "1. Unlimited Haircuts",
          "2. Monthly Spa Treatment",
          "3. Free Hair Products",
          "4. Priority Booking",
        ],
        image: null,
      },
    ],
  },
];

const appointments = [
  {
    id: 1,
    badgeText: "Upcoming appointment",
    dateTime: "Tue, Oct 15 at 3:00 PM",
    image:
      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
    salonName: "Premium Haircut & Styling",
    membershipInfo: "Golder member • 2 visit left",
    stylistName: "Sanna Granqvist",
  },
  {
    id: 2,
    badgeText: "Upcoming appointment",
    dateTime: "Wed, Oct 16 at 2:30 PM",
    image:
      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
    salonName: "Elite Hair Studio",
    membershipInfo: "Silver member • 5 visit left",
    stylistName: "John Anderson",
  },
];

const verifiedSalons = [
  {
    id: 1,
    businessName: "Ra Benjamin Styles LLC",
    address: "9853 E Fern ST, Palmetto Bay, 33157",
    rating: 4.9,
    reviewCount: 64,
    image:
      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
  },
  {
    id: 2,
    businessName: "Elite Hair Studio",
    address: "123 Main St, Miami, 33101",
    rating: 4.8,
    reviewCount: 120,
    image:
      "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
  },
];

export default function DashboardContent() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"subscriptions" | "individual">(
    "subscriptions"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    categories.length > 0 ? categories[0].id : 1
  );
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  const [selectedServiceFilter, setSelectedServiceFilter] =
    useState<string>("haircut");
  const [selectedMembershipFilter, setSelectedMembershipFilter] =
    useState<string>("all");
  const [inclusionsModalVisible, setInclusionsModalVisible] = useState(false);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyTabsOpacity = useRef(new Animated.Value(0)).current;
  const stickyTabsTranslateY = useRef(new Animated.Value(-20)).current;
  const categorySectionOpacity = useRef(new Animated.Value(1)).current;
  const categorySectionTranslateY = useRef(new Animated.Value(0)).current;
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

  // Animate sticky tabs and category section when showCategoryTabs changes
  useEffect(() => {
    if (showCategoryTabs) {
      Animated.parallel([
        // Sticky tabs animation
        Animated.timing(stickyTabsOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(stickyTabsTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        // Category section hide animation
        Animated.parallel([
          Animated.timing(categorySectionOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(categorySectionTranslateY, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        // Sticky tabs hide animation
        Animated.timing(stickyTabsOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(stickyTabsTranslateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
        // Category section show animation
        Animated.parallel([
          Animated.timing(categorySectionOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(categorySectionTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [showCategoryTabs]);

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

  const renderFilters = (
    filters: Array<{ id: string; label: string; isPrimary: boolean }>,
    selectedFilter: string,
    onFilterSelect: (id: string) => void
  ) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={{
        paddingHorizontal: moderateWidthScale(20),
        flexDirection: "row",
      }}
      nestedScrollEnabled={true}
    >
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterItem,
            filter.isPrimary
              ? styles.filterItemPrimary
              : selectedFilter === filter.id
              ? styles.filterItemActive
              : styles.filterItemInactive,
            index < filters.length - 1 && {
              marginRight: moderateWidthScale(12),
            },
          ]}
          onPress={() => !filter.isPrimary && onFilterSelect(filter.id)}
        >
          <Text
            style={[
              filter.isPrimary
                ? styles.filterTextPrimary
                : selectedFilter === filter.id
                ? styles.filterTextActive
                : styles.filterTextInactive,
            ]}
          >
            {filter.label}
          </Text>
          {filter.isPrimary && (
            <View style={styles.filterIcon}>
              <ChevronRight
                width={widthScale(6)}
                height={heightScale(9)}
                color={theme.background}
              />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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

      {/* Categories - Show images with smooth animation */}
      <Animated.View
        ref={categorySectionRef}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0) {
            categorySectionHeight.current = height;
          }
        }}
        style={[
          {
            opacity: categorySectionOpacity,
            transform: [{ translateY: categorySectionTranslateY }],
          },
          showCategoryTabs && {
            position: "absolute",
            width: "100%",
            height: 0,
            overflow: "hidden",
          },
        ]}
        pointerEvents={!showCategoryTabs ? "auto" : "none"}
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
      </Animated.View>

      {/* Results Summary */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsTextContainer}>
          <Text style={styles.resultsText}>
            Showing: <Text style={styles.resultsTextBold}>870 results</Text> for{" "}
            {getCategoryName()}
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

      {/*Booking appointment card or Platform Verified Salon*/}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.appCard}
        contentContainerStyle={styles.appointmentsScroll}
        nestedScrollEnabled={true}
      >
        {appointments.length > 9
          ? appointments.map((appointment, index) => (
              <View
                key={appointment.id}
                style={[
                  styles.verifiedSalonCard,
                  index < appointments.length - 1 && {
                    marginRight: moderateWidthScale(15),
                  },
                ]}
              >
                <View style={styles.verifiedCardTopRow}>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>
                      {appointment.badgeText}
                    </Text>
                  </View>
                  <View style={styles.dateTimeBadge}>
                    <Text style={styles.dateTimeBadgeText}>
                      {appointment.dateTime}
                    </Text>
                  </View>
                </View>
                <View style={styles.verifiedCardContent}>
                  <Image
                    source={{
                      uri: appointment.image,
                    }}
                    style={styles.verifiedCardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.verifiedCardTextContainer}>
                    <Text numberOfLines={1} style={styles.salonName}>
                      {appointment.salonName}
                    </Text>
                    <View style={styles.verifiedCardInfoRow}>
                      <MonitorIcon
                        width={widthScale(16)}
                        height={heightScale(16)}
                        color={theme.white}
                      />
                      <Text style={styles.verifiedCardInfoText}>
                        {appointment.membershipInfo}
                      </Text>
                    </View>
                    <View style={styles.verifiedCardInfoRow2}>
                      <View
                        style={[styles.verifiedCardInfoRow, { width: "58%" }]}
                      >
                        <PersonIcon
                          width={widthScale(16)}
                          height={heightScale(16)}
                          color={theme.white}
                        />
                        <Text
                          numberOfLines={1}
                          style={styles.verifiedCardInfoText}
                        >
                          {appointment.stylistName}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewDetailLink}
                        onPress={() => {
                          // Map appointment to BookingItem format
                          const bookingItem = {
                            id: appointment.id.toString(),
                            serviceName: appointment.salonName,
                            membershipType: appointment.membershipInfo?.split("•")[0]?.trim() || "",
                            staffName: appointment.stylistName,
                            location: appointment.salonName,
                            dateTime: appointment.dateTime,
                            duration: "30 min", // Default duration
                            price: "$0", // Default price
                            status: appointment.badgeText?.toLowerCase().includes("upcoming") 
                              ? "active" as const 
                              : "ongoing" as const,
                          };
                          
                          router.push({
                            pathname: "/(main)/bookingDetailsById",
                            params: {
                              bookingId: appointment.id.toString(),
                              booking: JSON.stringify(bookingItem),
                            },
                          });
                        }}
                      >
                        <Text style={styles.viewDetailText}>View detail</Text>
                        <ChevronRight
                          width={widthScale(4)}
                          height={heightScale(8)}
                          color={theme.orangeBrown}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          : verifiedSalons.map((salon, index) => (
              <View
                key={salon.id}
                style={[
                  styles.verifiedSalonCardNew,
                  index < verifiedSalons.length - 1 && {
                    marginRight: moderateWidthScale(15),
                  },
                ]}
              >
                <Image
                  source={{
                    uri: salon.image,
                  }}
                  style={styles.verifiedSalonImage}
                  resizeMode="cover"
                />

                <View style={styles.verifiedSalonContent}>
                  <View style={styles.platformVerifiedBadge}>
                    <PlatformVerifiedStarIcon
                      width={widthScale(10)}
                      height={heightScale(10)}
                    />
                    <Text style={styles.platformVerifiedText}>
                      Platform verified
                    </Text>
                  </View>
                  <View style={{ gap: moderateHeightScale(6) }}>
                    <Text
                      numberOfLines={1}
                      style={styles.verifiedSalonBusinessName}
                    >
                      {salon.businessName}
                    </Text>
                    <Text numberOfLines={1} style={styles.verifiedSalonAddress}>
                      {salon.address}
                    </Text>
                  </View>
                  <View style={styles.verifiedSalonBottomRow}>
                    <View style={styles.verifiedSalonRatingButton}>
                      <StarIcon
                        width={widthScale(12)}
                        height={heightScale(12)}
                        color={theme.orangeBrown}
                      />
                      <Text style={styles.verifiedSalonRatingText}>
                        {salon.rating}/ {salon.reviewCount} reviews
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.verifiedSalonViewDetail}
                      onPress={() => {
                        router.push({
                          pathname: "/(main)/businessDetail",
                          params: { business_id: "1" }, // Dummy business ID
                        } as any);
                      }}
                    >
                      <Text style={styles.verifiedSalonViewDetailText}>
                        View detail
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>

      {/* Service Filters (for Individual Services) */}
      {tab === "individual" &&
        renderFilters(
          serviceFilters,
          selectedServiceFilter,
          setSelectedServiceFilter
        )}

      {/* Membership Filters (for Subscriptions) */}
      {tab === "subscriptions" &&
        renderFilters(
          membershipFilters,
          selectedMembershipFilter,
          setSelectedMembershipFilter
        )}

      {/* Sections */}
      <Text style={styles.sectionTitle}>Nearest to you</Text>
      {(tab === "individual" ? serviceSections : subscriptionSections).map(
        (section, sectionIndex) => (
          <View key={section.id} style={styles.sectionContainer}>
            {/* Section Header */}
            <View
              style={[
                styles.sectionHeader,
                {
                  marginTop:
                    sectionIndex === 0
                      ? moderateHeightScale(16)
                      : moderateHeightScale(24),
                  marginBottom: moderateHeightScale(10),
                },
              ]}
            >
              <Text style={styles.sectionSubTitle}>{section.businessName}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: "/(main)/dashboard/(home)/businessList",
                    params: {
                      data: JSON.stringify({
                        businessName: section.businessName,
                        type: section.type,
                        services: section.services,
                        subscriptions: section.subscriptions,
                      }),
                    },
                  });
                }}
              >
                <Text style={styles.sectionViewMore}>View more</Text>
              </TouchableOpacity>
            </View>

            {/* Services or Subscriptions */}
            {tab === "individual" && section.services ? (
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesScroll}
              >
                {section.services.map((service, index) => (
                  <View
                    key={service.id}
                    style={[
                      styles.serviceCard,
                      styles.shadow,
                      index < (section?.services?.length ?? 0) - 1 && {
                        marginRight: moderateWidthScale(15),
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: moderateWidthScale(12),
                      }}
                    >
                      <View
                        style={{
                          gap: moderateHeightScale(8),
                          width: "70%",
                        }}
                      >
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text
                          numberOfLines={2}
                          style={styles.serviceDescription}
                        >
                          {service.description}
                        </Text>
                      </View>
                      <View style={styles.servicePrice}>
                        <Text style={styles.priceCurrent}>
                          ${service.price}
                        </Text>
                        <Text style={styles.priceOriginal}>
                          ${service.originalPrice}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.line} />
                    <View style={styles.serviceBottomRow}>
                      <Text numberOfLines={1} style={styles.serviceDuration}>
                        {service.duration}
                      </Text>
                      <View style={styles.serviceButtonContainer}>
                        <Button
                          title="Book Now"
                          onPress={() => {}}
                          containerStyle={styles.button}
                          textStyle={styles.buttonText}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              section.subscriptions && (
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.servicesScroll}
                >
                  {section.subscriptions.map((subscription, index) => (
                    <View
                      key={subscription.id}
                      style={[
                        styles.subscriptionCard,
                        styles.shadow,
                        index < (section?.subscriptions?.length ?? 0) - 1 && {
                          marginRight: moderateWidthScale(15),
                        },
                      ]}
                    >
                      <Image
                        source={{
                          uri:
                            subscription.image ||
                            "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg",
                        }}
                        style={styles.subscriptionImage}
                        resizeMode="cover"
                      />
                      <View
                        style={{
                          paddingHorizontal: moderateWidthScale(8),
                          flex: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.offerBadgesContainer}>
                          {subscription.offer && (
                            <View
                              style={[
                                styles.offerBadge,
                                styles.offerBadgeOrange,
                              ]}
                            >
                              <Text style={styles.offerText}>
                                {subscription.offer}
                              </Text>
                            </View>
                          )}
                          {subscription.offer2 && (
                            <View
                              style={[
                                styles.offerBadge,
                                styles.offerBadgeGreen,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.offerText,
                                  { color: theme.darkGreen },
                                ]}
                              >
                                {subscription.offer2}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={styles.subscriptionTitle}
                          >
                            {subscription.title}
                          </Text>
                          {subscription.inclusions.length > 2 ? (
                            <>
                              {subscription.inclusions
                                .slice(0, 2)
                                .map((inclusion, index) => (
                                  <Text
                                    numberOfLines={1}
                                    key={index}
                                    style={styles.inclusionItem}
                                  >
                                    {inclusion}
                                  </Text>
                                ))}
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedInclusions(
                                    subscription.inclusions
                                  );
                                  setInclusionsModalVisible(true);
                                }}
                              >
                                <Text style={styles.moreText}>
                                  and +{subscription.inclusions.length - 2} more
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            subscription.inclusions.map((inclusion, index) => (
                              <Text
                                numberOfLines={1}
                                key={index}
                                style={styles.inclusionItem}
                              >
                                {inclusion}
                              </Text>
                            ))
                          )}
                        </View>
                        <View style={styles.line} />
                        <View style={styles.subscriptionPrice}>
                          <View style={styles.subscriptionPriceContainer}>
                            <Text style={styles.priceCurrent}>
                              ${subscription.price}
                            </Text>
                            {subscription.originalPrice && (
                              <Text style={styles.priceOriginal}>
                                ${subscription.originalPrice}
                              </Text>
                            )}
                          </View>
                          <View style={styles.subscriptionButtonContainer}>
                            <Button
                              title="Book Now"
                              onPress={() => {}}
                              containerStyle={styles.button}
                              textStyle={styles.buttonText}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )
            )}
          </View>
        )
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
      <Animated.View
        style={[
          styles.categoryTabsSticky,
          {
            top: tabsContainerHeight.current,
            opacity: stickyTabsOpacity,
            transform: [{ translateY: stickyTabsTranslateY }],
          },
        ]}
        pointerEvents={showCategoryTabs ? "auto" : "none"}
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
      </Animated.View>

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

      {/* Inclusions Modal */}
      <InclusionsModal
        visible={inclusionsModalVisible}
        onClose={() => setInclusionsModalVisible(false)}
        inclusions={selectedInclusions}
      />
    </View>
  );
}
