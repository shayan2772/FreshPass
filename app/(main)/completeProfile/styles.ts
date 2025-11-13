import { StyleSheet } from "react-native";
import { Theme } from "@/src/theme/colors";
import { moderateHeightScale, moderateWidthScale } from "@/src/theme/dimensions";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1,
      paddingBottom: moderateHeightScale(15),
    },
    scrollContent: {
      flexGrow: 1,
      // paddingBottom: moderateHeightScale(15),
    },
    buttonWrapper: {
      marginTop: moderateHeightScale(15),
      paddingHorizontal: moderateWidthScale(20),
    },
    
  });


