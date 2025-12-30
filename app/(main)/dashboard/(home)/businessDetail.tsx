import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Dimensions,
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
import { useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";
import {
  PlatformVerifiedStarIcon,
  LeafLogo,
  OpenFullIcon,
  MapPinIcon,
  PhoneIconContact,
} from "@/assets/icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Share Icon SVG
const shareIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="{{COLOR}}"/>
</svg>
`;

// Bookmark Icon SVG
const bookmarkIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="{{COLOR}}"/>
</svg>
`;

// Globe Icon SVG
const globeIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17.93C13 17.97 12.99 18 12.96 18C11.29 18 9.9 17.36 8.97 16.24L10.59 14.62C11.07 15.31 11.7 15.79 12.4 16.03V17.93H13ZM15.95 15.96C15.67 15.25 15.1 14.71 14.28 14.36C13.46 14.01 12.43 13.84 11.2 13.84C9.97 13.84 8.94 14.01 8.12 14.36C7.3 14.71 6.73 15.25 6.45 15.96C5.68 15.36 5.06 14.57 4.64 13.64C5.2 13.28 5.75 12.9 6.29 12.5C6.83 12.1 7.31 11.68 7.73 11.24C8.15 10.8 8.5 10.35 8.78 9.89C9.06 9.43 9.2 8.98 9.2 8.54C9.2 8.1 9.06 7.65 8.78 7.19C8.5 6.73 8.15 6.28 7.73 5.84C7.31 5.4 6.83 4.98 6.29 4.58C5.75 4.18 5.2 3.8 4.64 3.44C5.06 2.51 5.68 1.72 6.45 1.12C7.3 1.77 8.12 2.22 8.94 2.57C9.76 2.92 10.79 3.09 12.02 3.09C13.25 3.09 14.28 2.92 15.1 2.57C15.92 2.22 16.7 1.77 17.55 1.12C18.32 1.72 18.94 2.51 19.36 3.44C18.8 3.8 18.25 4.18 17.71 4.58C17.17 4.98 16.69 5.4 16.27 5.84C15.85 6.28 15.5 6.73 15.22 7.19C14.94 7.65 14.8 8.1 14.8 8.54C14.8 8.98 14.94 9.43 15.22 9.89C15.5 10.35 15.85 10.8 16.27 11.24C16.69 11.68 17.17 12.1 17.71 12.5C18.25 12.9 18.8 13.28 19.36 13.64C18.94 14.57 18.32 15.36 17.55 15.96H15.95Z" fill="{{COLOR}}"/>
</svg>
`;

// Star Icon SVG
const starIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0L10.163 5.528L16 6.112L12 10.056L12.944 16L8 13.056L3.056 16L4 10.056L0 6.112L5.837 5.528L8 0Z" fill="{{COLOR}}"/>
</svg>
`;

// Location Pin Icon SVG
const locationPinIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="{{COLOR}}"/>
</svg>
`;

// Phone Icon SVG
const phoneIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="{{COLOR}}"/>
</svg>
`;

// People Icon SVG
const peopleIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="{{COLOR}}"/>
</svg>
`;

// Close Icon SVG
const closeIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="{{COLOR}}"/>
</svg>
`;

// Back Arrow Icon SVG
const backArrowIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="{{COLOR}}"/>
</svg>
`;

// Chevron Up Icon SVG
const chevronUpSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7L6 2L11 7" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Chevron Down Icon SVG
const chevronDownSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L6 6L11 1" stroke="{{COLOR}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ShareIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = shareIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const BookmarkIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = bookmarkIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const GlobeIcon = ({ width = 16, height = 16, color = "#FFFFFF" }) => {
  const svgXml = globeIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const StarIcon = ({ width = 16, height = 16, color = "#DDA15E" }) => {
  const svgXml = starIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const LocationPinIcon = ({ width = 16, height = 16, color = "#FFFFFF" }) => {
  const svgXml = locationPinIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const PhoneIcon = ({ width = 20, height = 20, color = "#283618" }) => {
  const svgXml = phoneIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const PeopleIcon = ({ width = 16, height = 16, color = "#FFFFFF" }) => {
  const svgXml = peopleIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const PhoneIconWhite = ({ width = 20, height = 20, color = "#FFFFFF" }) => {
  const svgXml = phoneIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const CloseIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = closeIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const BackArrowIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = backArrowIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const ChevronUpIcon = ({ width = 12, height = 8, color = "#283618" }) => {
  const svgXml = chevronUpSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const ChevronDownIcon = ({ width = 12, height = 8, color = "#283618" }) => {
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: moderateHeightScale(35),
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(12),
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    backButton: {
      width: widthScale(32),
      height: heightScale(32),
      borderRadius: moderateWidthScale(8),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(8),
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(4),
    },
    logoText: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    iconButton: {
      width: widthScale(32),
      height: heightScale(32),
      borderRadius: moderateWidthScale(8),
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    heroImageContainer: {
      width: SCREEN_WIDTH,
      height: heightScale(220),
      position: "relative",
      backgroundColor: theme.darkGreen,
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    openFullButton: {
      position: "absolute",
      bottom: moderateHeightScale(16),
      right: moderateWidthScale(16),
      backgroundColor: theme.selectCard,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(8),
      borderRadius: moderateWidthScale(12),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    openFullButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    thumbnailContainer: {
      paddingVertical: moderateHeightScale(4),
      backgroundColor: theme.darkGreen,
    },
    thumbnailScroll: {
      flexDirection: "row",
      gap: moderateWidthScale(7),
    },
    thumbnail: {
      width: widthScale(52),
      height: heightScale(52),
      backgroundColor: theme.lightGreen2,
      borderWidth: moderateWidthScale(1),
    },
    infoSection: {
      backgroundColor: theme.darkGreen,
      paddingHorizontal: moderateWidthScale(20),
      paddingTop: moderateHeightScale(16),
      paddingBottom: moderateHeightScale(20),
    },
    badgeRow: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
      marginBottom: moderateHeightScale(12),
    },
    platformVerifiedBadge: {
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
    },
    platformVerifiedText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    discountBadge: {
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
    },
    discountBadgeText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    ratingBadge: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(12),
      borderWidth: 1,
      borderColor: theme.white70,
    },
    ratingText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    businessName: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.white,
      marginBottom: moderateHeightScale(8),
    },
    addressRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
      gap: moderateWidthScale(6),
    },
    addressText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.white80,
      flex: 1,
    },
    staffRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
    },
    staffText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.white80,
    },
    tabsContainer: {
      backgroundColor: "rgba(221, 161, 94, 0.3)",
      flexDirection: "row",
      borderBottomWidth: moderateWidthScale(1),
      borderBottomColor: theme.borderLight,
    },
    tab: {
      flex: 1,
      paddingVertical: moderateHeightScale(12),
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    tabText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    tabTextActive: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    tabUnderline: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: moderateHeightScale(2.5),
      backgroundColor: theme.selectCard,
    },
    contentContainer: {
      backgroundColor: theme.background,
      paddingTop: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(40),
    },
    sectionContent: {
      paddingHorizontal: moderateWidthScale(20),
    },
    sectionTitle: {
      fontSize: fontSize.size17,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(12),
    },
    aboutText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      lineHeight: moderateHeightScale(20),
      marginBottom: moderateHeightScale(8),
    },
    readMoreLink: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.orangeBrown,
    },
    sectionDivider: {
      borderTopWidth: moderateWidthScale(1),
      borderTopColor: theme.borderLight,
      marginTop: moderateHeightScale(24),
    },
    shopLocationRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(20),
    },
    shopLocationText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      flex: 1,
      maxWidth: "75%",
    },
    mapIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderWidth: moderateWidthScale(1),
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
    },
    phoneIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderWidth: moderateWidthScale(1),
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(8),
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(20),
    },
    contactPhoneRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
      marginLeft: moderateWidthScale(8),
    },
    phoneText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    callNowButton: {
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(10),
      borderRadius: moderateWidthScale(999),
    },
    callNowButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    businessHoursHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    viewAllLink: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.orangeBrown,
    },
    hoursCardsContainer: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
      paddingHorizontal: moderateWidthScale(20),
    },
    hoursCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      minWidth: widthScale(120),
    },
    hoursDay: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    hoursTime: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    imageModal: {
      flex: 1,
      backgroundColor: theme.black || "#000000",
      justifyContent: "center",
      alignItems: "center",
    },
    modalCloseButton: {
      position: "absolute",
      top: moderateHeightScale(50),
      right: moderateWidthScale(20),
      zIndex: 10,
      width: widthScale(40),
      height: heightScale(40),
      borderRadius: moderateWidthScale(20),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      resizeMode: "contain",
    },
    serviceSection: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      marginBottom: moderateHeightScale(16),
      paddingVertical: moderateWidthScale(16),
    },
    serviceSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(12),
    },
    serviceSectionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    filterContainer: {
      flexDirection: "row",
      gap: moderateWidthScale(8),
      marginBottom: moderateHeightScale(16),
      backgroundColor: theme.lightGreen05,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(12),
    },
    filterButton: {
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
      borderRadius: moderateWidthScale(999),
      borderWidth: moderateWidthScale(1),
      borderColor: theme.borderLight,
    },
    filterButtonActive: {
      backgroundColor: theme.lightGreen015,
      borderColor: theme.darkGreen,
    },
    filterButtonText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    filterButtonTextActive: {
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    membershipCard: {
      backgroundColor: theme.white,
      marginBottom: moderateHeightScale(12),
      borderBottomWidth: moderateWidthScale(1),
      borderBottomColor: theme.borderLight,
    },
    membershipCardContent: {
      padding: moderateWidthScale(16),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    membershipCardLeft: {
      flex: 1,
    },
    membershipCardRight: {
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    membershipTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(8),
    },
    membershipVisits: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    membershipInclusions: {
      marginBottom: moderateHeightScale(12),
    },
    inclusionItem: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(4),
    },
    moreText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.primary,
      textDecorationLine: "underline",
    },
    membershipPriceLeft: {
      flexDirection: "column",
      alignItems: "flex-end",
      marginBottom: moderateHeightScale(12),
    },
    membershipPrice: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    membershipOriginalPrice: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textDecorationLine: "line-through",
    },
    serviceCard: {
      backgroundColor: theme.white,
      marginBottom: moderateHeightScale(12),
      borderBottomWidth: moderateWidthScale(1),
      borderBottomColor: theme.borderLight,
    },
    serviceCardContent: {
      padding: moderateWidthScale(16),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    serviceCardLeft: {
      flex: 1,
    },
    serviceLabel: {
      alignSelf: "flex-start",
      backgroundColor: theme.darkGreenLight,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(999),
      marginBottom: moderateHeightScale(8),
    },
    serviceLabelText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    serviceName: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    serviceDescription: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    servicePriceContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: moderateWidthScale(8),
      marginBottom: moderateHeightScale(4),
    },
    servicePrice: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceOriginalPrice: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textDecorationLine: "line-through",
    },
    serviceDuration: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(8),
    },
    serviceCardRight: {
      alignItems: "flex-end",
      justifyContent: "flex-start",
    },
    bookNowButton: {
      backgroundColor: theme.orangeBrown,
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(10),
      borderRadius: moderateWidthScale(999),
    },
    bookNowButtonText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
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
    },
    inclusionsModalTitle: {
      fontSize: fontSize.size17,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    inclusionsModalList: {
      gap: moderateHeightScale(8),
    },
    inclusionsModalItem: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.text,
    },
    staffSectionTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    staffGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(12),
    },
    staffCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(12),
      flexDirection: "row",
      alignItems: "center",
      width: (SCREEN_WIDTH - moderateWidthScale(52)) / 2,
      gap: moderateWidthScale(12),
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
    staffProfileImage: {
      width: 35,
      height:35,
      borderRadius:  35/2,
      backgroundColor: theme.emptyProfileImage,
      borderWidth:1,
      borderColor:theme.borderLight,
      overflow:"hidden",
    },
    staffInfo: {
      flex: 1,
    },
    staffName: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(2),
    },
    staffExperience: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    loadMoreButton: {
      alignItems: "center",
      marginTop: moderateHeightScale(20),
      paddingVertical: moderateHeightScale(8),
    },
    loadMoreText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.selectCard,
      textDecorationLine:"underline",
      textDecorationColor:theme.selectCard,
    },
  });

export default function BusinessDetailScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Details" | "Service" | "Ratings" | "Staff"
  >("Details");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState<string>(
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80"
  );
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isMembershipExpanded, setIsMembershipExpanded] = useState(true);
  const [isIndividualExpanded, setIsIndividualExpanded] = useState(true);
  const [selectedMembershipFilter, setSelectedMembershipFilter] =
    useState("All");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("All");
  const [inclusionsModalVisible, setInclusionsModalVisible] = useState(false);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [showAllStaff, setShowAllStaff] = useState(false);

  // Dummy data with different images
  const thumbnails = [
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  ];

  const handleOpenFullImage = () => {
    setSelectedImage(currentHeroImage);
    setImageModalVisible(true);
  };

  const handleThumbnailPress = (image: string) => {
    setCurrentHeroImage(image);
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const handleThumbnailSelect = (image: string) => {
    setCurrentHeroImage(image);
  };

  // Business hours data
  const businessHours = [
    { day: "Monday", time: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", time: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", time: "10:00 AM - 7:30 PM" },
    { day: "Thursday", time: "10:00 AM - 7:30 PM" },
    { day: "Friday", time: "10:00 AM - 8:00 PM" },
    { day: "Saturday", time: "10:00 AM - 7:30 PM" },
    { day: "Sunday", time: "Holiday/Closed" },
  ];

  // Get current day name
  const getCurrentDayName = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  // Service data
  const membershipSubscriptions = [
    {
      id: 1,
      title: "The Full Luxury Experience",
      visits: "8 visit per month",
      price: 300.99,
      originalPrice: 50.99,
      inclusions: [
        "1. 2 Premium Haircuts",
        "2. 1 Free Styling Service",
        "3. 1 Free Facial per month",
        "4. Free Hair Products",
        "5. Priority Booking",
      ],
    },
    {
      id: 2,
      title: "The Full Luxury Experience",
      visits: "5 visit per month",
      price: 145.99,
      originalPrice: 50.99,
      inclusions: [
        "1. 2 Premium Haircuts",
        "2. 1 Free Styling Service",
        "3. 1 Free Facial per month",
        "4. Free Hair Products",
      ],
    },
    {
      id: 3,
      title: "The Full Luxury Experience",
      visits: "3 visit per month",
      price: 45.99,
      originalPrice: 50.99,
      inclusions: [
        "1. 2 Premium Haircuts",
        "2. 1 Free Styling Service",
        "3. 1 Free Facial per month",
      ],
    },
  ];

  const individualServices = [
    {
      id: 1,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: "Save $20",
    },
    {
      id: 2,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: "NEW",
    },
    {
      id: 3,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: null,
    },
    {
      id: 4,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: null,
    },
    {
      id: 5,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: "Single sessions",
    },
    {
      id: 6,
      name: "Wet Haircut",
      description: "This service includes we wash and cut",
      price: 45.99,
      originalPrice: 50.89,
      duration: "45 Mins",
      label: "Best value",
    },
  ];

  const membershipFilters = [
    "All",
    "Classic Care",
    "Gold Glam",
    "VIP Elite",
    "Platinum",
  ];
  const serviceFilters = [
    "All",
    "Beard Trim",
    "Hair blow dry",
    "Haircut",
    "Manicure",
  ];

  const renderDetailsContent = () => {
    const aboutText =
      "I'm go-to destination for premium grooming services tailored exclusively for men. Whether you're here for a sharp haircut, a flawless fade, or a relaxing beard treatment, our expert barbers deliver style and precision in every service. Experience a modern blend of tradition, comfort, and class—";
    const shouldShowReadMore = aboutText.length > 220;
    const displayText = isAboutExpanded
      ? aboutText
      : shouldShowReadMore
      ? aboutText.substring(0, 220) + "..."
      : aboutText;

    // Sort business hours so current day appears first
    const currentDay = getCurrentDayName();
    const sortedBusinessHours = [...businessHours].sort((a, b) => {
      if (a.day === currentDay) return -1;
      if (b.day === currentDay) return 1;
      return 0;
    });

    return (
      <View style={styles.contentContainer}>
        {/* About me */}
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>About me</Text>
          <Text style={styles.aboutText}>
            {displayText}
            {shouldShowReadMore && !isAboutExpanded && (
              <Text
                style={styles.readMoreLink}
                onPress={() => setIsAboutExpanded(true)}
              >
                {" "}
                Read more salon
              </Text>
            )}
          </Text>
        </View>

        {/* Shop location */}
        <View style={styles.sectionDivider} />
        <View style={styles.sectionContent}>
          <Text
            style={[
              styles.sectionTitle,
              { marginTop: moderateHeightScale(24) },
            ]}
          >
            Shop location
          </Text>
          <View style={styles.shopLocationRow}>
            <Text style={styles.shopLocationText}>
              240 E Exchange Blvd, Columbia, SC 29209, United States
            </Text>
            <TouchableOpacity style={styles.mapIconContainer}>
              <MapPinIcon
                width={widthScale(15)}
                height={heightScale(15)}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.sectionDivider} />
        <View style={styles.sectionContent}>
          <Text
            style={[
              styles.sectionTitle,
              { marginTop: moderateHeightScale(24) },
            ]}
          >
            Contact
          </Text>
          <View style={styles.contactRow}>
            <View style={styles.phoneIconContainer}>
              <PhoneIconContact
                width={widthScale(18)}
                height={heightScale(18)}
                color={theme.darkGreen}
              />
            </View>
            <View style={styles.contactPhoneRow}>
              <Text style={styles.phoneText}>(619) 315-5437</Text>
              <TouchableOpacity style={styles.callNowButton}>
                <Text style={styles.callNowButtonText}>Call now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Business hours */}
        <View style={styles.sectionDivider} />
        <View style={styles.sectionContent}>
          <View
            style={[
              styles.businessHoursHeader,
              { marginTop: moderateHeightScale(24) },
            ]}
          >
            <Text style={styles.sectionTitle}>Business hours</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hoursCardsContainer}
        >
          {sortedBusinessHours.map((item, index) => {
            const displayDay = item.day === currentDay ? "Today" : item.day;
            return (
              <View key={index} style={styles.hoursCard}>
                <Text style={styles.hoursDay}>{displayDay}</Text>
                <Text style={styles.hoursTime}>{item.time}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderServiceContent = () => (
    <View
      style={[
        styles.contentContainer,
        { paddingHorizontal: moderateWidthScale(20) },
      ]}
    >
      {/* Membership Subscriptions Section */}
      <View style={styles.serviceSection}>
        <TouchableOpacity
          style={styles.serviceSectionHeader}
          onPress={() => setIsMembershipExpanded(!isMembershipExpanded)}
        >
          <Text style={styles.serviceSectionTitle}>
            Membership subscriptions list
          </Text>
          {isMembershipExpanded ? (
            <ChevronUpIcon
              width={widthScale(12)}
              height={heightScale(8)}
              color={theme.darkGreen}
            />
          ) : (
            <ChevronDownIcon
              width={widthScale(12)}
              height={heightScale(8)}
              color={theme.darkGreen}
            />
          )}
        </TouchableOpacity>

        {isMembershipExpanded && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {membershipFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedMembershipFilter === filter &&
                      styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedMembershipFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedMembershipFilter === filter &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {membershipSubscriptions.map((subscription, index) => (
              <View
                key={subscription.id}
                style={[
                  styles.membershipCard,
                  index === membershipSubscriptions.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <View style={styles.membershipCardContent}>
                  <View style={styles.membershipCardLeft}>
                    <Text style={styles.membershipTitle}>
                      {subscription.title}
                    </Text>
                    <Text style={styles.membershipVisits}>
                      {subscription.visits}
                    </Text>
                    <View style={styles.membershipInclusions}>
                      {subscription.inclusions.length > 2 ? (
                        <>
                          {subscription.inclusions
                            .slice(0, 2)
                            .map((inclusion, index) => (
                              <Text key={index} style={styles.inclusionItem}>
                                {inclusion}
                              </Text>
                            ))}
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedInclusions(subscription.inclusions);
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
                          <Text key={index} style={styles.inclusionItem}>
                            {inclusion}
                          </Text>
                        ))
                      )}
                    </View>
                  </View>
                  <View style={styles.membershipCardRight}>
                    <View style={styles.membershipPriceLeft}>
                      <Text style={styles.membershipPrice}>
                        ${subscription.price.toFixed(2)} USD
                      </Text>
                      <Text style={styles.membershipOriginalPrice}>
                        ${subscription.originalPrice.toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.bookNowButton}>
                      <Text style={styles.bookNowButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Individual Services Section */}
      <View style={styles.serviceSection}>
        <TouchableOpacity
          style={styles.serviceSectionHeader}
          onPress={() => setIsIndividualExpanded(!isIndividualExpanded)}
        >
          <Text style={styles.serviceSectionTitle}>Individual services</Text>
          {isIndividualExpanded ? (
            <ChevronUpIcon
              width={widthScale(12)}
              height={heightScale(8)}
              color={theme.darkGreen}
            />
          ) : (
            <ChevronDownIcon
              width={widthScale(12)}
              height={heightScale(8)}
              color={theme.darkGreen}
            />
          )}
        </TouchableOpacity>

        {isIndividualExpanded && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {serviceFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedServiceFilter === filter &&
                      styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedServiceFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedServiceFilter === filter &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {individualServices.map((service, index) => (
              <View
                key={service.id}
                style={[
                  styles.serviceCard,
                  index === individualServices.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <View style={styles.serviceCardContent}>
                  <View style={styles.serviceCardLeft}>
                    {service.label && (
                      <View style={styles.serviceLabel}>
                        <Text style={styles.serviceLabelText}>
                          {service.label}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  </View>
                  <View style={styles.serviceCardRight}>
                    <View style={styles.servicePriceContainer}>
                      <Text style={styles.serviceOriginalPrice}>
                        ${service.originalPrice.toFixed(2)}
                      </Text>
                      <Text style={styles.servicePrice}>
                        ${service.price.toFixed(2)} USD
                      </Text>
                    </View>
                    <Text style={styles.serviceDuration}>
                      {service.duration}
                    </Text>
                    <TouchableOpacity style={styles.bookNowButton}>
                      <Text style={styles.bookNowButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );

  const renderRatingsContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Ratings</Text>
      <Text style={styles.aboutText}>
        Ratings content will be displayed here.
      </Text>
    </View>
  );

  // Dummy staff data
  const staffMembers = [
    {
      id: 1,
      name: "Umut Hasanoglu",
      experience: null,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      id: 2,
      name: "Sanna Granqvist",
      experience: 6,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
    {
      id: 3,
      name: "Suman Pramanik",
      experience: 12,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      id: 4,
      name: "Md Biplob Um Hos...",
      experience: 11,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    {
      id: 5,
      name: "Safayet Hossain",
      experience: 4,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    },
    {
      id: 6,
      name: "Md Shariful Islam K...",
      experience: 19,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
    {
      id: 7,
      name: "John Smith",
      experience: 8,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    },
    {
      id: 8,
      name: "Sarah Johnson",
      experience: 5,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      id: 9,
      name: "Michael Brown",
      experience: 15,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      id: 10,
      name: "Emily Davis",
      experience: 3,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  ];

  const renderStaffContent = () => {
    const displayedStaff = showAllStaff
      ? staffMembers
      : staffMembers.slice(0, 6);
    const hasMoreStaff = staffMembers.length > 6;

    return (
      <View style={styles.contentContainer}>
        <View style={styles.sectionContent}>
          <Text style={styles.staffSectionTitle}>
            Staff members ({staffMembers.length})
          </Text>
          <View style={styles.staffGrid}>
            {displayedStaff.map((staff) => (
              <View key={staff.id} style={[styles.staffCard, styles.shadow]}>
                <Image
                  source={{ uri: staff.image }}
                  style={styles.staffProfileImage}
                />
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName} numberOfLines={1}>
                    {staff.name}
                  </Text>
                  {staff.experience !== null && (
                    <Text numberOfLines={1} style={styles.staffExperience}>
                      {staff.experience} years of exp.
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          {hasMoreStaff && !showAllStaff && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setShowAllStaff(true)}
            >
              <Text style={styles.loadMoreText}>Load more staff members</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <BackArrowIcon width={widthScale(16)} height={heightScale(16)} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <LeafLogo
                width={widthScale(22)}
                height={heightScale(22)}
                color1={theme.white}
                color2={theme.white}
              />
              <Text style={styles.logoText}>FRESHPASS</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <ShareIcon
                width={widthScale(16)}
                height={heightScale(16)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <BookmarkIcon
                width={widthScale(16)}
                height={heightScale(16)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Image */}
        <TouchableOpacity
          style={styles.heroImageContainer}
          onPress={handleOpenFullImage}
          activeOpacity={1}
        >
          <Image
            source={{ uri: currentHeroImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.openFullButton}
            onPress={handleOpenFullImage}
          >
            <OpenFullIcon
              width={widthScale(14)}
              height={heightScale(14)}
              color={theme.white}
            />
            <Text style={styles.openFullButtonText}>Open in full</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Thumbnail Carousel */}
        <View style={styles.thumbnailContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScroll}
          >
            {thumbnails.map((thumbnail, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleThumbnailSelect(thumbnail)}
                // onLongPress={() => handleThumbnailPress(thumbnail)}
              >
                <Image
                  source={{ uri: thumbnail }}
                  style={[
                    styles.thumbnail,
                    currentHeroImage !== thumbnail && {
                      borderColor: theme.borderLight,
                    },
                    currentHeroImage === thumbnail && {
                      borderColor: theme.selectCard,
                    },
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Business Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.badgeRow}>
            <View style={styles.platformVerifiedBadge}>
              <PlatformVerifiedStarIcon
                width={widthScale(12)}
                height={heightScale(12)}
              />
              <Text style={styles.platformVerifiedText}>Platform verified</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>15% Off All Products</Text>
            </View>
          </View>
          <View style={styles.ratingBadge}>
            <StarIcon
              width={widthScale(12)}
              height={heightScale(12)}
              color={theme.selectCard}
            />
            <Text style={styles.ratingText}>4.9/ 64 reviews</Text>
          </View>
          <Text style={styles.businessName}>Ra Benjamin Styles LLC</Text>
          <View style={styles.addressRow}>
            <LocationPinIcon
              width={widthScale(12)}
              height={heightScale(12)}
              color={theme.selectCard}
            />
            <Text style={styles.addressText}>
              240 E Exchange Blvd, Columbia, SC 29209, United States{" "}
              <Text style={{ fontFamily: fonts.fontBold }}>• 10 min away</Text>
            </Text>
          </View>
          <View style={styles.staffRow}>
            <PeopleIcon
              width={widthScale(12)}
              height={heightScale(12)}
              color={theme.selectCard}
            />
            <Text style={styles.staffText}>16 staff members</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(["Details", "Service", "Ratings", "Staff"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={
                  activeTab === tab ? styles.tabTextActive : styles.tabText
                }
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "Details" && renderDetailsContent()}
        {activeTab === "Service" && renderServiceContent()}
        {activeTab === "Ratings" && renderRatingsContent()}
        {activeTab === "Staff" && renderStaffContent()}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModal}>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <CloseIcon width={widthScale(24)} height={heightScale(24)} />
          </Pressable>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Inclusions Modal */}
      <Modal
        visible={inclusionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInclusionsModalVisible(false)}
      >
        <Pressable
          style={styles.inclusionsModalOverlay}
          onPress={() => setInclusionsModalVisible(false)}
        >
          <Pressable
            style={styles.inclusionsModalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.inclusionsModalTitle}>All Inclusions</Text>
            <ScrollView style={styles.inclusionsModalList}>
              {selectedInclusions.map((inclusion, index) => (
                <Text key={index} style={styles.inclusionsModalItem}>
                  {inclusion}
                </Text>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
