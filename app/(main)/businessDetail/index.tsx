import React, { useMemo, useState, useRef } from "react";
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
  Linking,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useTheme, useAppDispatch } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { setBusinessData } from "@/src/state/slices/bsnsSlice";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  PlatformVerifiedStarIcon,
  LeafLogo,
  OpenFullIcon,
  MapPinIcon,
  PhoneIconContact,
  ShareIcon,
  BookmarkIcon,
  GlobeIcon,
  StarIconBusinessDetail,
  LocationPinIconBusinessDetail,
  PhoneIconBusinessDetail,
  PhoneIconWhite,
  PeopleIcon,
  CloseIconBusinessDetail,
  BackArrowIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIconBusinessDetail,
} from "@/assets/icons";
import InclusionsModal from "@/src/components/inclusionsModal";
import FullImageModal from "@/src/components/fullImageModal";
import Button from "@/src/components/button";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
      height: heightScale(270),
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
    },
    sectionContent: {
      paddingHorizontal: moderateWidthScale(20),
    },
    sectionContentFullWidth: {
      paddingHorizontal: moderateWidthScale(20),
    },
    sectionTitle: {
      fontSize: fontSize.size15,
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
    divider: {
      borderTopWidth: moderateWidthScale(1),
      borderTopColor: theme.borderLight,
      marginVertical: moderateHeightScale(16),
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
      paddingBottom: moderateHeightScale(12),
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
      height: 35,
      borderRadius: 35 / 2,
      backgroundColor: theme.emptyProfileImage,
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
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
      textDecorationLine: "underline",
      textDecorationColor: theme.selectCard,
    },
    ratingsSectionContent: {
      // No padding here - let scroll be full width
    },
    ratingSummaryContainer: {
      marginBottom: moderateHeightScale(20),
    },
    ratingBadgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
      alignSelf: "flex-start",
      marginBottom: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(999),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    ratingBadgeText: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    averageRatingText: {
      fontSize: fontSize.size26,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    reviewsHorizontalScroll: {
      paddingHorizontal: moderateWidthScale(20),
      gap: moderateWidthScale(12),
    },
    reviewCard: {
      borderRadius: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(16),
      paddingHorizontal: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    reviewCardHorizontal: {
      width: widthScale(280),
      minHeight: heightScale(200),
    },
    reviewCardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(8),
    },
    reviewAvatar: {
      width: widthScale(42),
      height: widthScale(42),
      borderRadius: moderateWidthScale(4),
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
      backgroundColor: theme.lightGreen2,
    },
    reviewAvatarImage: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: moderateWidthScale(4),
    },
    reviewUserInfo: {
      flex: 1,
    },
    reviewNameText: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    reviewDateText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginTop: moderateHeightScale(4),
    },
    reviewStarsRow: {
      flexDirection: "row",
      marginBottom: moderateHeightScale(12),
    },
    reviewStarIcon: {
      marginRight: moderateWidthScale(4),
    },
    reviewCardTextContainer: {
      justifyContent: "flex-start",
    },
    reviewCardTextContainerHorizontal: {
      minHeight: heightScale(100),
    },
    reviewCardText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(20),
    },
    reviewSeeMoreText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.selectCard,
      textDecorationLine: "underline",
      textDecorationColor: theme.selectCard,
      marginTop: moderateHeightScale(12),
    },
    writeReviewButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      marginTop: moderateHeightScale(20),
      marginBottom: moderateHeightScale(12),
    },
    showAllReviewsButton: {
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
    },
    showAllReviewsText: {
      fontSize: fontSize.size13,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    policyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(16),
      borderBottomWidth: moderateWidthScale(1),
      borderColor: theme.borderLight,
    },
    policyItemText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    reviewModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    reviewModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(10),
      paddingHorizontal: moderateWidthScale(20),
    },
    reviewModalTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    reviewModalCloseButton: {
      width: widthScale(32),
      height: heightScale(32),
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.lightGreen015,
      alignItems: "center",
      justifyContent: "center",
    },
    fullReviewModalContainer: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(12),
      width: "85%",
      alignSelf: "center",
      maxHeight: heightScale(600),
      padding: moderateWidthScale(20),
    },
    fullReviewModalContent: {
      maxHeight: heightScale(500),
    },
    fullReviewCardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateHeightScale(16),
    },
    fullReviewText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
      lineHeight: moderateHeightScale(22),
      marginTop: moderateHeightScale(12),
    },
  });

export default function BusinessDetailScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ business_id?: string }>();
  const [activeTab, setActiveTab] = useState<
    "Details" | "Service" | "Ratings" | "Staff"
  >("Details");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState<string>(
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80"
  );
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isMembershipExpanded, setIsMembershipExpanded] = useState(false);
  const [isIndividualExpanded, setIsIndividualExpanded] = useState(false);
  const [selectedMembershipFilter, setSelectedMembershipFilter] =
    useState("All");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("All");
  const [inclusionsModalVisible, setInclusionsModalVisible] = useState(false);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [fullReviewModalVisible, setFullReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<
    (typeof reviews)[0] | null
  >(null);

  // Refs for scroll positions
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const detailsSectionRef = useRef<View>(null);
  const serviceSectionRef = useRef<View>(null);
  const ratingsSectionRef = useRef<View>(null);
  const staffSectionRef = useRef<View>(null);
  const sectionPositions = useRef<{ [key: string]: number }>({});

  // Dummy business data
  const businessPhone = "(619) 315-5437";
  const businessName = "Ra Benjamin Styles LLC";
  const businessLatitude = 34.0522; // Dummy latitude (Los Angeles area)
  const businessLongitude = -118.2437; // Dummy longitude
  const businessAddress = "240 E Exchange Blvd, Columbia, SC 29209, United States";

  // Handle phone call
  const handleCallNow = async () => {
    const phoneNumber = businessPhone.replace(/[^\d+]/g, ""); // Remove non-digit characters except +
    const phoneUrl = `tel:${phoneNumber}`;
    
    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Unable to make phone call");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to make phone call");
    }
  };

  // Handle location navigation to Google Maps
  const handleLocationPress = async () => {
    const encodedName = encodeURIComponent(businessName);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${businessLatitude},${businessLongitude}&query_place_id=${encodedName}`;
    
    try {
      const canOpen = await Linking.canOpenURL(googleMapsUrl);
      if (canOpen) {
        await Linking.openURL(googleMapsUrl);
      } else {
        // Fallback to Apple Maps on iOS if Google Maps not available
        if (Platform.OS === "ios") {
          const appleMapsUrl = `http://maps.apple.com/?ll=${businessLatitude},${businessLongitude}&q=${encodedName}`;
          await Linking.openURL(appleMapsUrl);
        } else {
          Alert.alert("Error", "Unable to open maps");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open maps");
    }
  };

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

  // Dummy reviews data
  const reviews = [
    {
      id: 1,
      user: {
        name: "Ofir Kiran",
        profile_image_url: null,
      },
      overall_rating: "5",
      comment:
        "Super professional and right on time. Loved the attention to detail. From booking to the cut—it's a smooth experience every time.",
      created_at: "2023-09-28T10:00:00Z",
    },
    {
      id: 2,
      user: {
        name: "John Smith",
        profile_image_url: null,
      },
      overall_rating: "4.5",
      comment:
        "Great service and friendly staff. The haircut was exactly what I wanted. Will definitely come back again!",
      created_at: "2023-10-15T14:30:00Z",
    },
    {
      id: 3,
      user: {
        name: "Sarah Johnson",
        profile_image_url: null,
      },
      overall_rating: "5",
      comment:
        "Amazing experience! The stylist was very professional and took time to understand what I wanted. Highly recommend!",
      created_at: "2023-10-20T11:00:00Z",
    },
    {
      id: 4,
      user: {
        name: "Michael Brown",
        profile_image_url: null,
      },
      overall_rating: "4",
      comment:
        "Good service overall. The place is clean and well-maintained. Staff is courteous and professional.",
      created_at: "2023-10-25T16:00:00Z",
    },
    {
      id: 5,
      user: {
        name: "Emily Davis",
        profile_image_url: null,
      },
      overall_rating: "5",
      comment:
        "Best salon experience I've had! The attention to detail is incredible. Worth every penny!",
      created_at: "2023-11-01T09:00:00Z",
    },
    {
      id: 6,
      user: {
        name: "David Wilson",
        profile_image_url: null,
      },
      overall_rating: "4.5",
      comment:
        "Very satisfied with the service. The staff is knowledgeable and the atmosphere is relaxing.",
      created_at: "2023-11-05T13:00:00Z",
    },
    {
      id: 7,
      user: {
        name: "Lisa Anderson",
        profile_image_url: null,
      },
      overall_rating: "5",
      comment:
        "Excellent service! The stylist really listened to what I wanted and delivered perfectly. Will be back!",
      created_at: "2023-11-08T10:00:00Z",
    },
  ];

  // Dummy staff data
  const staffMembers = [
    {
      id: 1,
      name: "Umut Hasanoglu",
      experience: 1,
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

  const DEFAULT_AVATAR_URL =
    "https://imgcdn.stablediffusionweb.com/2024/3/24/3b153c48-649f-4ee2-b1cc-3d45333db028.jpg";
  const averageRating = 4.9;
  const totalReviews = reviews.length;
  const textWrapLength = 115;

  const handleTabPress = (tab: "Details" | "Service" | "Ratings" | "Staff") => {
    setActiveTab(tab);
    const sectionKey = tab.toLowerCase();
    const position = sectionPositions.current[sectionKey];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, position - moderateHeightScale(80)), // Offset for tabs and header
        animated: true,
      });
    }
  };

  const measureSectionPosition = (
    sectionRef: React.RefObject<View | null>,
    key: string
  ) => {
    if (sectionRef.current && scrollContentRef.current) {
      sectionRef.current.measureLayout(
        scrollContentRef.current,
        (x, y) => {
          sectionPositions.current[key] = y;
        },
        () => {
          // Fallback - use onLayout position if measureLayout fails
        }
      );
    }
  };


  const getStars = (rating: number) => {
    const stars: ("star" | "star-half" | "star-border")[] = [];
    const ratingNum = parseFloat(rating.toString());
    for (let i = 1; i <= 5; i += 1) {
      if (ratingNum >= i) {
        stars.push("star");
      } else if (ratingNum >= i - 0.5) {
        stars.push("star-half");
      } else {
        stars.push("star-border");
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  const getProfileImageUrl = (profileImageUrl: string | null) => {
    if (profileImageUrl) {
      return `${process.env.EXPO_PUBLIC_API_BASE_URL}${profileImageUrl}`;
    }
    return DEFAULT_AVATAR_URL;
  };

  const renderReviewCard = (
    review: (typeof reviews)[0],
    isHorizontal = false,
    index=0
  ) => {
    const reviewText = review.comment || "";
    const shouldShowSeeMore = reviewText.length > textWrapLength;

    return (
      <View
        style={[styles.reviewCard, isHorizontal && styles.reviewCardHorizontal]}
      >
        <View style={styles.reviewCardHeaderRow}>
          <View style={styles.reviewAvatar}>
            <Image
              source={{
                uri: getProfileImageUrl(review.user.profile_image_url),
              }}
              style={styles.reviewAvatarImage}
            />
          </View>
          <View style={styles.reviewUserInfo}>
            <Text style={styles.reviewNameText}>
              {review.user.name || "User"}
            </Text>
            <Text style={styles.reviewDateText}>
              {formatDate(review.created_at)}
            </Text>
          </View>
        </View>

        <View style={styles.reviewStarsRow}>
          {getStars(parseFloat(review.overall_rating)).map((icon, index) => (
            <MaterialIcons
              key={`${review.id}-star-${index}`}
              name={icon}
              size={moderateWidthScale(18)}
              color={theme.darkGreen}
              style={styles.reviewStarIcon}
            />
          ))}
        </View>

        {reviewText && (
          <View
            style={[
              styles.reviewCardTextContainer,
              isHorizontal && styles.reviewCardTextContainerHorizontal,
            ]}
          >
            <Text
              style={styles.reviewCardText}
              numberOfLines={isHorizontal ? 4 : undefined}
            >
              {shouldShowSeeMore
                ? `${reviewText.slice(0, textWrapLength).trim()}...`
                : reviewText}
            </Text>

            {shouldShowSeeMore && (
              <Text
                style={styles.reviewSeeMoreText}
                onPress={() => {
                  setSelectedReview(review);
                  setFullReviewModalVisible(true);
                }}
              >
                See more
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

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
      <View
        ref={detailsSectionRef}
        onLayout={() => {
          measureSectionPosition(detailsSectionRef, "details");
        }}
        style={styles.contentContainer}
      >
        {/* About me */}
        <View style={styles.sectionContentFullWidth}>
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
        <View style={styles.sectionContentFullWidth}>
          <Text
            style={[
              styles.sectionTitle,
              { marginTop: moderateHeightScale(24) },
            ]}
          >
            Shop location
          </Text>
          <View style={styles.shopLocationRow}>
            <Text style={styles.shopLocationText}>{businessAddress}</Text>
            <TouchableOpacity
              style={styles.mapIconContainer}
              onPress={handleLocationPress}
            >
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
        <View style={styles.sectionContentFullWidth}>
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
              <Text style={styles.phoneText}>{businessPhone}</Text>
              <TouchableOpacity
                style={styles.callNowButton}
                onPress={handleCallNow}
              >
                <Text style={styles.callNowButtonText}>Call now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Business hours */}
        <View style={styles.sectionDivider} />
        <View style={styles.sectionContentFullWidth}>
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
              <View key={index} style={[styles.hoursCard, styles.shadow]}>
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
      ref={serviceSectionRef}
      onLayout={() => {
        measureSectionPosition(serviceSectionRef, "service");
      }}
      style={[
        styles.contentContainer,
        { paddingHorizontal: moderateWidthScale(20) },
      ]}
    >
      {/* Membership Subscriptions Section */}
      <View style={[styles.serviceSection, styles.shadow]}>
        <TouchableOpacity
          style={[
            styles.serviceSectionHeader,
            isMembershipExpanded && { marginBottom: moderateHeightScale(16) },
          ]}
          onPress={() => setIsMembershipExpanded(!isMembershipExpanded)}
        >
          <Text style={styles.serviceSectionTitle}>
            Membership subscriptions list
          </Text>
          {isMembershipExpanded ? (
            <ChevronUpIcon
              width={widthScale(10)}
              height={heightScale(6)}
              color={theme.darkGreen}
            />
          ) : (
            <ChevronDownIcon
              width={widthScale(10)}
              height={heightScale(6)}
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
      <View style={[styles.serviceSection, styles.shadow]}>
        <TouchableOpacity
          style={[
            styles.serviceSectionHeader,
            isIndividualExpanded && { marginBottom: moderateHeightScale(16) },
            styles.shadow,
          ]}
          onPress={() => setIsIndividualExpanded(!isIndividualExpanded)}
        >
          <Text style={styles.serviceSectionTitle}>Individual services</Text>
          {isIndividualExpanded ? (
            <ChevronUpIcon
              width={widthScale(10)}
              height={heightScale(6)}
              color={theme.darkGreen}
            />
          ) : (
            <ChevronDownIcon
              width={widthScale(10)}
              height={heightScale(6)}
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
                    <TouchableOpacity 
                      style={styles.bookNowButton}
                      onPress={() => {
                        // Set business data in Redux
                        dispatch(
                          setBusinessData({
                            selectedService: service,
                            allServices: individualServices,
                            staffMembers: staffMembers,
                            businessId: params.business_id || "",
                          })
                        );
                        // Navigate to bookingNow without params
                        router.push({
                          pathname: "/(main)/bookingNow",
                        });
                      }}
                    >
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

  const renderStaffContent = () => {
    const displayedStaff = showAllStaff
      ? staffMembers
      : staffMembers.slice(0, 6);
    const hasMoreStaff = staffMembers.length > 6;

    return (
      <View
        ref={staffSectionRef}
        onLayout={() => {
          measureSectionPosition(staffSectionRef, "staff");
        }}
        style={styles.contentContainer}
      >
        <View style={styles.sectionContentFullWidth}>
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


  const renderRatingsContent = () => {
    const displayedReviews = reviews.slice(0, 5);
    const hasMoreReviews = reviews.length > 5;

    return (
      <View
        ref={ratingsSectionRef}
        onLayout={() => {
          measureSectionPosition(ratingsSectionRef, "ratings");
        }}
        style={styles.contentContainer}
      >
        <View style={styles.ratingsSectionContent}>
          <View style={styles.sectionContentFullWidth}>
            <Text style={styles.sectionTitle}>What other say</Text>
          </View>
          {/* Rating Summary */}
          <View
            style={[
              styles.ratingSummaryContainer,
              styles.sectionContentFullWidth,
            ]}
          >
            <View style={styles.ratingBadgeContainer}>
              <StarIconBusinessDetail
                width={widthScale(12)}
                height={heightScale(12)}
                color={theme.selectCard}
              />
              <Text style={styles.ratingBadgeText}>
                {averageRating}/ {totalReviews} reviews
              </Text>
            </View>
            <Text style={styles.averageRatingText}>
              {averageRating} Average
            </Text>
          </View>

          {/* Horizontal Scroll Reviews */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsHorizontalScroll}
          >
            {displayedReviews.map((review) => (
              <View key={review.id}>{renderReviewCard(review, true)}</View>
            ))}
          </ScrollView>

          {/* Write a Review Button */}
          <View style={styles.writeReviewButtonContainer}>
            <Button
              backgroundColor={theme.darkGreen}
              title="Write a review"
              onPress={() => {}}
            />
          </View>

          {/* Show All Reviews Button */}
          {hasMoreReviews && (
            <TouchableOpacity
              style={styles.showAllReviewsButton}
              onPress={() => {
                router.push({
                  pathname: "/(main)/userReviews",
                  params: { business_id: "1" }, // Dummy business ID
                } as any);
              }}
            >
              <Text style={styles.showAllReviewsText}>
                Show all {totalReviews} reviews
              </Text>
            </TouchableOpacity>
          )}

          {/* Payment & Cancelation Policy */}
          <TouchableOpacity
            style={[
              styles.policyItem,
              {
                borderTopWidth: moderateWidthScale(1),
                marginTop: moderateHeightScale(24),
              },
            ]}
          >
            <Text style={styles.policyItemText}>
              Payment & cancelation policy
            </Text>
            <ChevronRightIconBusinessDetail
              width={widthScale(6)}
              height={heightScale(10)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>

          {/* Report */}
          <TouchableOpacity style={styles.policyItem}>
            <Text style={styles.policyItemText}>Report</Text>
            <ChevronRightIconBusinessDetail
              width={widthScale(6)}
              height={heightScale(10)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

 
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: moderateHeightScale(40) }}
      >
        <View ref={scrollContentRef}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <BackArrowIcon
                  width={widthScale(16)}
                  height={heightScale(16)}
                />
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
              {/* <TouchableOpacity style={styles.iconButton}>
                <BookmarkIcon
                  width={widthScale(16)}
                  height={heightScale(16)}
                  color={theme.darkGreen}
                />
              </TouchableOpacity> */}
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
                <Text style={styles.platformVerifiedText}>
                  Platform verified
                </Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  15% Off All Products
                </Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <StarIconBusinessDetail
                width={widthScale(12)}
                height={heightScale(12)}
                color={theme.selectCard}
              />
              <Text style={styles.ratingText}>4.9/ 64 reviews</Text>
            </View>
            <Text style={styles.businessName}>Ra Benjamin Styles LLC</Text>
            <View style={styles.addressRow}>
              <LocationPinIconBusinessDetail
                width={widthScale(12)}
                height={heightScale(12)}
                color={theme.selectCard}
              />
              <Text style={styles.addressText}>
                240 E Exchange Blvd, Columbia, SC 29209, United States{" "}
                <Text style={{ fontFamily: fonts.fontBold }}>
                  • 10 min away
                </Text>
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
            {(["Details", "Service", "Staff", "Ratings"] as const).map(
              (tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab)}
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
              )
            )}
          </View>

          {/* Tab Content - All sections in one scroll */}
          {renderDetailsContent()}
          <View style={styles.divider} />
          {renderServiceContent()}
          <View style={styles.divider} />
          {renderStaffContent()}
          <View style={styles.divider} />
          {renderRatingsContent()}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <FullImageModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        imageUri={selectedImage}
      />

      {/* Inclusions Modal */}
      <InclusionsModal
        visible={inclusionsModalVisible}
        onClose={() => setInclusionsModalVisible(false)}
        inclusions={selectedInclusions}
      />

      {/* Full Review Modal */}
      <Modal
        visible={fullReviewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullReviewModalVisible(false)}
      >
        <Pressable
          style={styles.reviewModalOverlay}
          onPress={() => setFullReviewModalVisible(false)}
        >
          <Pressable
            style={styles.fullReviewModalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.reviewModalHeader,{paddingHorizontal:0}]}>
              <Text style={styles.reviewModalTitle}>Review asas</Text>
              <TouchableOpacity
                style={styles.reviewModalCloseButton}
                onPress={() => setFullReviewModalVisible(false)}
              >
                <CloseIconBusinessDetail width={widthScale(20)} height={heightScale(20)} />
              </TouchableOpacity>
            </View>
            {selectedReview && (
              <ScrollView
                style={styles.fullReviewModalContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.fullReviewCardHeaderRow}>
                  <View style={styles.reviewAvatar}>
                    <Image
                      source={{
                        uri: getProfileImageUrl(
                          selectedReview.user.profile_image_url
                        ),
                      }}
                      style={styles.reviewAvatarImage}
                    />
                  </View>
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewNameText}>
                      {selectedReview.user.name || "User"}
                    </Text>
                    <Text style={styles.reviewDateText}>
                      {formatDate(selectedReview.created_at)}
                    </Text>
                  </View>
                </View>

                <View style={styles.reviewStarsRow}>
                  {getStars(parseFloat(selectedReview.overall_rating)).map(
                    (icon, index) => (
                      <MaterialIcons
                        key={`${selectedReview.id}-star-${index}`}
                        name={icon}
                        size={moderateWidthScale(18)}
                        color={theme.darkGreen}
                        style={styles.reviewStarIcon}
                      />
                    )
                  )}
                </View>

                {selectedReview.comment && (
                  <Text style={styles.fullReviewText}>
                    {selectedReview.comment}
                  </Text>
                )}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
