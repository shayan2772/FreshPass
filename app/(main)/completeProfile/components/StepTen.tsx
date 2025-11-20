import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import FloatingInput from "@/src/components/floatingInput";
import {
  setTiktokUrl,
  setInstagramUrl,
  setFacebookUrl,
} from "@/src/state/slices/completeProfileSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap: moderateHeightScale(5),
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subTitle: {
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    formGroup: {
      gap: moderateHeightScale(16),
      marginTop: moderateHeightScale(10),
    },
    field: {},
  });

export default function StepTen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const { tiktokUrl, instagramUrl, facebookUrl } = useAppSelector(
    (state) => state.completeProfile
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>Link your social media account<Text style={styles.subTitle}> (if any)</Text> </Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.field}>
          <FloatingInput
            label="TikTok"
            value={tiktokUrl}
            onChangeText={(value) => dispatch(setTiktokUrl(value))}
            placeholder="TikTok"
            onClear={() => dispatch(setTiktokUrl(""))}
          />
        </View>

        <View style={styles.field}>
          <FloatingInput
            label="Instagram"
            value={instagramUrl}
            onChangeText={(value) => dispatch(setInstagramUrl(value))}
            placeholder="Instagram"
            onClear={() => dispatch(setInstagramUrl(""))}
          />
        </View>

        <View style={styles.field}>
          <FloatingInput
            label="Facebook"
            value={facebookUrl}
            onChangeText={(value) => dispatch(setFacebookUrl(value))}
            placeholder="Facebook"
            onClear={() => dispatch(setFacebookUrl(""))}
          />
        </View>
      </View>
    </View>
  );
}


