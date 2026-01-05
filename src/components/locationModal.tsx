import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Circle, Region } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
  heightScale,
} from "@/src/theme/dimensions";
import * as Location from "expo-location";
import {
  handleLocationPermission,
  openLocationSettings,
} from "@/src/services/locationPermissionService";
import {
  resolveCurrentLocation,
  resolveAddressViaGoogle,
} from "@/src/constant/functions";
import { setLocation } from "@/src/state/slices/userSlice";
import NotificationBanner from "@/src/components/notificationBanner";
import { IMAGES } from "@/src/constant/images";
import Button from "@/src/components/button";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    modalHeader: {
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(16),
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.lightGreen2,
    },
    modalHeaderTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    modalHeaderTitle: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      flex: 1,
      textAlign: "center",
    },
    modalHeaderSubtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textAlign: "center",
    },
    modalCloseButton: {
      width: moderateWidthScale(32),
      height: moderateWidthScale(32),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.lightGreen2,
    },
    modalContent: {
      flex: 1,
      // paddingBottom: moderateHeightScale(100),
    },
    mapContainer: {
      flex: 1,
      overflow: "hidden",
      backgroundColor: theme.white,
      position: "relative",
    },
    mapView: {
      width: "100%",
      height: "100%",
    },
    centerPinContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      pointerEvents: "none",
    },
    centerPin: {
      width: moderateWidthScale(22),
      height: moderateHeightScale(32),
    },
    currentLocControls: {
      position: "absolute",
      right: moderateWidthScale(16),
      top: moderateHeightScale(16),
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(5),
      borderWidth: 1,
      borderColor: theme.darkGreen,
      width: moderateWidthScale(32),
      height: moderateWidthScale(32),
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.7,
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
      opacity: 0.7,
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
    locationInfoContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingVertical: moderateHeightScale(14),
      backgroundColor: theme.white,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.lightGreen2,
      height: moderateHeightScale(80),
      justifyContent: "center",
    },
    locationInfoTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(3),
      lineHeight: moderateHeightScale(20),
    },
    locationInfoSubtitle: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      lineHeight: moderateHeightScale(16),
    },
    confirmButtonContainer: {
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(24),
      paddingTop: moderateHeightScale(16),
      borderTopWidth: 1,
      borderTopColor: theme.lightGreen2,
      backgroundColor: theme.background,
    },
    locationServicesMessageContainer: {
      paddingBottom: moderateHeightScale(8),
      paddingTop: moderateHeightScale(8),
    },
    locationServicesMessageText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.link,
      textAlign: "center",
    },
    loadingContainer: {
      paddingVertical: moderateHeightScale(12),
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginTop: moderateHeightScale(8),
    },
  });

export default function LocationModal({
  visible,
  onClose,
}: LocationModalProps) {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    long: number;
    locationName: string | null;
  } | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locationServicesMessage, setLocationServicesMessage] = useState<
    string | null
  >(null);
  const mapRef = useRef<MapView>(null);
  const currentRegionRef = useRef<Region | null>(null);

  const [modalBanner, setModalBanner] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  // Initialize map with user's current location from Redux
  useEffect(() => {
    if (visible && user.location?.lat && user.location?.long) {
      const lat = user.location.lat;
      const lng = user.location.long;
      const initialRegion: Region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(initialRegion);
      currentRegionRef.current = initialRegion;
      setTempLocation({
        lat,
        long: lng,
        locationName: user.location.locationName,
      });
    } else if (visible) {
      // Default to a US location if no location set
      const defaultRegion: Region = {
        latitude: 25.7617,
        longitude: -80.1918,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setMapRegion(defaultRegion);
      currentRegionRef.current = defaultRegion;
    }
  }, [visible, user.location]);

  const fetchAddressFromCoordinates = useCallback(
    async (latitude: number, longitude: number) => {
      setIsFetchingAddress(true);
      try {
        const addressData = await resolveAddressViaGoogle(
          { latitude, longitude },
          apiKey
        );

        if (addressData && addressData.formatted) {
          const locationName =
            addressData.formatted ||
            `${addressData.street || ""}, ${addressData.area || ""}, ${
              addressData.state || ""
            }`.trim() ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setTempLocation({
            lat: latitude,
            long: longitude,
            locationName,
          });
        } else {
          setTempLocation({
            lat: latitude,
            long: longitude,
            locationName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setTempLocation({
          lat: latitude,
          long: longitude,
          locationName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
      } finally {
        setIsFetchingAddress(false);
      }
    },
    []
  );

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      currentRegionRef.current = region;
      fetchAddressFromCoordinates(region.latitude, region.longitude);
    },
    [fetchAddressFromCoordinates]
  );

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!currentRegionRef.current || !mapRef.current) return;

    const factor = direction === "in" ? 0.7 : 1.3;
    const latitudeDelta = Math.max(
      currentRegionRef.current.latitudeDelta * factor,
      0.0005
    );
    const longitudeDelta = Math.max(
      currentRegionRef.current.longitudeDelta * factor,
      0.0005
    );

    const newRegion: Region = {
      ...currentRegionRef.current,
      latitudeDelta,
      longitudeDelta,
    };

    currentRegionRef.current = newRegion;
    setMapRegion(newRegion);
    if (mapRef.current && "animateToRegion" in mapRef.current) {
      (mapRef.current as any).animateToRegion(newRegion, 300);
    }
  }, []);

  const handleUseCurrentLocation = async () => {
    setLocationMessage(null);
    setLocationServicesMessage(null);

    // Step 1: Check if location services are enabled
    const servicesEnabled = await Location.hasServicesEnabledAsync();

    if (!servicesEnabled) {
      setLocationServicesMessage(
        "Please enable location services on your phone first"
      );
      return;
    }

    // Step 2: Check permission
    const permissionResult = await handleLocationPermission();

    if (!permissionResult.granted) {
      if (permissionResult.errorMessage) {
        setLocationMessage(permissionResult.errorMessage);
        if (permissionResult.shouldOpenSettings) {
          await openLocationSettings();
        }
      }
      return;
    }

    // Step 3: Get location
    setIsResolvingLocation(true);

    const result = await resolveCurrentLocation({
      apiKey,
    });

    setIsResolvingLocation(false);

    if (result.status === "error") {
      setLocationMessage(result.message);
      return;
    }

    const { details } = result;

    if (details.coordinates) {
      const lat = details.coordinates.latitude;
      const lng = details.coordinates.longitude;
      const locationName =
        details.formattedAddress ||
        `${details.street || ""}, ${details.area || ""}, ${
          details.state || ""
        }`.trim() ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      const newRegion: Region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // Batch updates to prevent screen blink
      currentRegionRef.current = newRegion;
      setMapRegion(newRegion);
      setTempLocation({
        lat,
        long: lng,
        locationName,
      });

      // Animate map after state updates
      requestAnimationFrame(() => {
        if (mapRef.current && "animateToRegion" in mapRef.current) {
          (mapRef.current as any).animateToRegion(newRegion, 300);
        }
      });
    }
  };

  const handleConfirm = useCallback(() => {
    if (tempLocation) {
      dispatch(
        setLocation({
          lat: tempLocation.lat,
          long: tempLocation.long,
          locationName: tempLocation.locationName,
        })
      );

      setModalBanner({
        visible: true,
        title: "Success",
        message: "Location updated successfully",
        type: "success",
      });

      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [tempLocation, dispatch, onClose]);

  const handleClose = useCallback(() => {
    setLocationMessage(null);
    setTempLocation(null);
    setModalBanner({
      visible: false,
      title: "",
      message: "",
      type: "info",
    });
    onClose();
  }, [onClose]);

  const circleRadius = useMemo(() => {
    if (!currentRegionRef.current) return 250;
    const baseRadius = 250;
    const zoomFactor = currentRegionRef.current.latitudeDelta / 0.01;
    return baseRadius * zoomFactor;
  }, [currentRegionRef.current?.latitudeDelta]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.modalContainer} edges={["top", "bottom"]}>
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderTop}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <Feather
                name="x"
                size={moderateWidthScale(18)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Select your location</Text>
          </View>
          <Text style={styles.modalHeaderSubtitle}>
            Drag the map to adjust your location.
          </Text>
        </View>
        <View style={styles.modalContent}>
          {tempLocation && (
            <View style={styles.locationInfoContainer}>
              {isFetchingAddress ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={theme.darkGreen} />
                  <Text style={styles.loadingText}>Fetching address...</Text>
                </View>
              ) : (
                <>
                  <Text
                    style={styles.locationInfoTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {tempLocation.locationName || "Location"}
                  </Text>
                  <Text style={styles.locationInfoSubtitle}>
                    {tempLocation.lat.toFixed(6)},{" "}
                    {tempLocation.long.toFixed(6)}
                  </Text>
                </>
              )}
            </View>
          )}

          {mapRegion ? (
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.mapView}
                initialRegion={mapRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
              >
                {tempLocation && (
                  <Circle
                    center={{
                      latitude: tempLocation.lat,
                      longitude: tempLocation.long,
                    }}
                    radius={circleRadius}
                    fillColor={theme.mapCircleFill}
                    strokeColor={theme.darkGreen}
                    strokeWidth={1}
                  />
                )}
              </MapView>
              <View style={styles.centerPinContainer}>
                <Image
                  source={IMAGES.mapPins}
                  style={styles.centerPin}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.mapControls}>
                <Pressable
                  style={styles.mapControlButton}
                  onPress={() => handleZoom("in")}
                >
                  <FontAwesome
                    name="search-plus"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                  />
                </Pressable>
                <View style={styles.mapControlDivider} />
                <Pressable
                  style={styles.mapControlButton}
                  onPress={() => handleZoom("out")}
                >
                  <FontAwesome
                    name="search-minus"
                    size={moderateWidthScale(16)}
                    color={theme.darkGreen}
                  />
                </Pressable>
              </View>
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                disabled={isResolvingLocation}
                activeOpacity={0.7}
                style={styles.currentLocControls}
              >
                <Feather
                  name="navigation"
                  size={moderateWidthScale(18)}
                  color={theme.selectCard}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.darkGreen} />
              <Text style={styles.loadingText}>Loading map...</Text>
            </View>
          )}
        </View>

        <View style={styles.confirmButtonContainer}>
          {locationServicesMessage && (
            <View style={styles.locationServicesMessageContainer}>
              <Text style={styles.locationServicesMessageText}>
                {locationServicesMessage}
              </Text>
            </View>
          )}
          <Button
            title="Confirm Location"
            onPress={handleConfirm}
            disabled={!tempLocation || isFetchingAddress}
          />
        </View>

        <NotificationBanner
          visible={modalBanner.visible}
          title={modalBanner.title}
          message={modalBanner.message}
          type={modalBanner.type}
          duration={3000}
          onDismiss={() =>
            setModalBanner((prev) => ({ ...prev, visible: false }))
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
