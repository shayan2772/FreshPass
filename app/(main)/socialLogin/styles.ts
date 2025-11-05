import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import { Dimensions, StyleSheet } from "react-native";
import {
  moderateWidthScale,
  moderateHeightScale,
} from "@/src/theme/dimensions";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backgroundImageContainer: {
      width: "100%",
      height: Dimensions.get("window").height / 1.55,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
    },
    backgroundImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
      position: "absolute",
      zIndex: -1,
    },
    topSection: {
      gap: moderateHeightScale(20),
      bottom:moderateHeightScale(80),
      alignItems:"center",
      justifyContent:"center",
      position:"absolute",
      zIndex: 1,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    logoText: {
      fontSize: fontSize.size22,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    taglineContainer: {
     alignItems:"center",
     justifyContent:"center",
     alignSelf:"center",
    },
    tagline1: {
      fontSize: fontSize.size48,
      fontFamily: fonts.fontMedium,
      color: theme.white, 
      textAlign:"center",
    },
    tagline2: {
      color: theme.orangeBrown,
    },
    paginationDots: {
      flexDirection: "row",
      gap: moderateWidthScale(5),
      alignItems: "center",
    },
    dotActive: {
      width: moderateWidthScale(22),
      height: moderateWidthScale(3),
      borderRadius: moderateWidthScale(2),
      backgroundColor: theme.white,
    },
    dotAdjacent: {
      width: moderateWidthScale(14),
      height: moderateWidthScale(3),
      borderRadius: moderateWidthScale(2),
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    dotOuter: {
      width: moderateWidthScale(8),
      height: moderateWidthScale(3),
      borderRadius: moderateWidthScale(2),
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    shade:{
      position:"absolute",
      bottom:0,
      left:0,
      right:0,
      height:moderateHeightScale(260),
      zIndex: 0,
    },
    bottomSection: {
      backgroundColor: theme.background,
      borderTopLeftRadius: moderateWidthScale(24),
      borderTopRightRadius: moderateWidthScale(24),
      padding:30,
      gap: moderateHeightScale(15),
      position:"absolute",
      bottom:0,
      paddingBottom:60,
    },
    separatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.lightGreen2,
    },
    separatorText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen2,
    },
    socialButtonsContainer: {
      gap: moderateHeightScale(12),
    },
    legalText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      lineHeight: fontSize.size16,
    },
    legalLink: {
      color: theme.link,
      textDecorationLine: "underline",
      fontFamily: fonts.fontMedium,
      textDecorationColor: theme.link,
    },
  });
