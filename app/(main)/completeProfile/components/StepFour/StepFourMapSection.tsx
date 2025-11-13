import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Circle, Marker, Region } from "react-native-maps";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { IMAGES } from "@/src/constant/images";

interface StepFourMapSectionProps {
  mapRegion: Region | null;
  streetAddress: string;
  selectedAddress: string | null;
  area: string;
  zipCode: string;
  firstName: string;
  onRegionChange: (region: Region) => void;
  onZoom: (direction: "in" | "out") => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: moderateHeightScale(16),
      // paddingHorizontal: moderateWidthScale(20),
    },
    mapContainer: {
      // borderRadius: moderateWidthScale(16),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.darkGreen,
      overflow: "hidden",
      backgroundColor: theme.white,
    },
    mapView: {
      width: "100%",
      height: heightScale(300),
    },
    mapControls: {
      position: "absolute",
      right: moderateWidthScale(16),
      bottom: moderateHeightScale(16),
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(5),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      width: moderateWidthScale(42),
      opacity: 0.8,
    },
    mapControlButton: {
      width: "100%",
      height: moderateWidthScale(40),
      alignItems: "center",
      justifyContent: "center",
    },
    mapControlDivider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.darkGreen,
    },
    summary: {
      paddingHorizontal: moderateWidthScale(18),
      paddingVertical: moderateHeightScale(16),
      borderRadius: moderateWidthScale(12),
      gap: moderateHeightScale(8),
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.green,
    },
    summaryIconWrapper: {
      width: moderateWidthScale(24),
      height: moderateWidthScale(24),
      alignItems: "center",
      justifyContent: "center",
      marginTop: moderateHeightScale(2),
    },
    summaryTextWrapper: {
      flex: 1,
      gap: moderateHeightScale(4),
    },
    summaryTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    summarySubtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    fallbackContainer: {
      paddingVertical: moderateHeightScale(12),
      alignItems: "center",
      justifyContent: "center",
    },
    fallbackText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
      paddingHorizontal: moderateWidthScale(16),
    },
  });

export default function StepFourMapSection({
  mapRegion,
  streetAddress,
  selectedAddress,
  area,
  zipCode,
  firstName,
  onRegionChange,
  onZoom,
}: StepFourMapSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  const circleRadius = useMemo(() => {
    if (!mapRegion) return 250;
    // Calculate radius based on map zoom level (latitudeDelta)
    // Larger delta = more zoomed out = larger circle radius
    const baseRadius = 250;
    const zoomFactor = mapRegion.latitudeDelta / 0.01;
    return baseRadius * zoomFactor;
  }, [mapRegion]);

  return (
    <View style={styles.container}>
      {mapRegion ? (
        <>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapView}
              region={mapRegion}
              initialRegion={mapRegion}
              onRegionChangeComplete={onRegionChange}
            >
              <Circle
                center={{
                  latitude: mapRegion.latitude,
                  longitude: mapRegion.longitude,
                }}
                radius={circleRadius}
                fillColor={(colors as Theme).mapCircleFill}
                strokeColor={(colors as Theme).borderLine}
                strokeWidth={1}
              />
              <Marker
                coordinate={{
                  latitude: mapRegion.latitude,
                  longitude: mapRegion.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Image
                  source={IMAGES.mapPins}
                  style={{
                    width: moderateWidthScale(22),
                    height: moderateHeightScale(32),
                  }}
                  resizeMode="contain"
                />
              </Marker>
            </MapView>
            <View style={styles.mapControls}>
              <Pressable
                style={styles.mapControlButton}
                onPress={() => onZoom("in")}
              >
                <FontAwesome
                  name="search-plus"
                  size={moderateWidthScale(16)}
                  color={(colors as Theme).darkGreen}
                />
              </Pressable>
              <View style={styles.mapControlDivider} />
              <Pressable
                style={styles.mapControlButton}
                onPress={() => onZoom("out")}
              >
                <FontAwesome
                 name="search-minus"
                  size={moderateWidthScale(16)}
                  color={(colors as Theme).darkGreen}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.summary}>
            <View style={styles.summaryIconWrapper}>
              <Feather
                name="map-pin"
                size={moderateWidthScale(18)}
                color={(colors as Theme).darkGreen}
              />
            </View>
            <View style={styles.summaryTextWrapper}>
              <Text style={styles.summaryTitle}>
                {streetAddress || selectedAddress || "Address"}
              </Text>
              <Text style={styles.summarySubtitle}>
                {area
                  ? `${area}${zipCode ? `, ${zipCode}` : ""}`
                  : zipCode || ""}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            We couldn&apos;t display the map. Adjust your address or try again.
          </Text>
        </View>
      )}
    </View>
  );
}
