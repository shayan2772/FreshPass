import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import StackHeader from "@/src/components/StackHeader";
import FloatingInput from "@/src/components/floatingInput";
import { Skeleton } from "@/src/components/skeletons";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { useFocusEffect } from "expo-router";

interface LocationData {
  street_address: string;
  city: string;
  state: string;
  zip_code: string | null;
  latitude: string;
  longitude: string;
  complete_address: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(20),
    },
    contentContainer: {
      paddingVertical: moderateHeightScale(24),
      gap: moderateHeightScale(20),
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
    subtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    main: {
      flex: 1,
      gap: moderateHeightScale(20),
    },
  });

export default function LocationScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const placeholderColor = theme.lightGreen2;

  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: LocationData;
      }>(businessEndpoints.moduleData("business-location"));

      if (response.success && response.data) {
        setLocationData(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch location:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLocation();
    }, [fetchLocation])
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StackHeader title="Your business location" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Skeleton screenType="StepEight" styles={styles} />
        ) : (
          <>
            <View style={styles.titleSec}>
              <Text style={styles.title}>Your business location</Text>
              <Text style={styles.subtitle}>
                This is the location where your business operates from.
              </Text>
            </View>

            <View style={styles.main}>
              <FloatingInput
                label="Street address"
                value={locationData?.street_address || ""}
                placeholder="Street address"
                placeholderTextColor={placeholderColor}
                showClearButton={false}
              />

              <FloatingInput
                label="Area / City"
                value={locationData?.city || ""}
                placeholder="Area / City"
                placeholderTextColor={placeholderColor}
                showClearButton={false}
              />

              <FloatingInput
                label="State"
                value={locationData?.state || ""}
                placeholder="State"
                placeholderTextColor={placeholderColor}
                showClearButton={false}
              />

              <FloatingInput
                label="Zip code"
                value={locationData?.zip_code || ""}
               placeholder="Zip code (Optional)"
                placeholderTextColor={placeholderColor}
                keyboardType="number-pad"
                showClearButton={false}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
