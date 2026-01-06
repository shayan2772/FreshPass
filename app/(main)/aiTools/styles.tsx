import { Theme } from "@/src/theme/colors";;
import { StyleSheet } from "react-native";
import {  moderateHeightScale } from "@/src/theme/dimensions";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
     paddingBottom: moderateHeightScale(15),
    },
  });
