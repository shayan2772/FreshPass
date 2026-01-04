import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme, useAppSelector, useAppDispatch } from "@/src/hooks/hooks";
import {
  setSelectedServices,
  setSelectedStaff,
  clearBusinessData,
} from "@/src/state/slices/bsnsSlice";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateWidthScale,
  moderateHeightScale,
  widthScale,
} from "@/src/theme/dimensions";
import { SvgXml } from "react-native-svg";
import { LeafLogo } from "@/assets/icons";
import Button from "@/src/components/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AddServiceBottomSheet from "@/src/components/AddServiceBottomSheet";

// Back Arrow Icon SVG
const backArrowIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="{{COLOR}}"/>
</svg>
`;

const BackArrowIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => {
  const svgXml = backArrowIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  label?: string | null;
}

interface StaffMember {
  id: number;
  name: string;
  experience: number | null;
  image: string | null;
}

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
      paddingHorizontal: moderateWidthScale(20),
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
      color: theme.darkGreen,
    },
    line: {
      width: "100%",
      height: 1.1,
      backgroundColor: theme.borderLight,
      marginTop: moderateHeightScale(12),
    },
    scrollContent: {},
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(24),
    },
    serviceCard: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      borderBottomWidth: 1,
      borderColor: theme.borderLight,
    },
    serviceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateHeightScale(12),
    },
    serviceName: {
      flex: 1,
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      maxWidth: "80%",
    },
    deleteButton: {},
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    originalPrice: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.lightGreen4,
      textDecorationLine: "line-through",
    },
    currentPrice: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    descriptionText: {
      flex: 1,
      fontSize: fontSize.size13,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    addServiceSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(20),
      paddingHorizontal: moderateWidthScale(20),
      backgroundColor: theme.orangeBrown30,
      paddingVertical: moderateHeightScale(12),
    },
    addServiceText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    addServiceButton: {
      width: widthScale(22),
      height: heightScale(22),
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: theme.selectCard,
    },
    staffTitle: {
      fontSize: fontSize.size15,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(12),
      paddingHorizontal: moderateWidthScale(20),
    },
    staffList: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(2),
    },
    staffCard: {
      width: widthScale(180),
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(12),
      flexDirection: "row",
      alignItems: "center",
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
    staffCardSelected: {},
    staffCardAnyone: {
      justifyContent: "space-between",
      width: widthScale(130),
      backgroundColor: theme.lightGreen015,
    },
    staffImage: {
      width: widthScale(35),
      height: widthScale(35),
      borderRadius: widthScale(35 / 2),
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
    radioButton: {
      width: moderateWidthScale(20),
      height: moderateWidthScale(20),
      borderRadius: moderateWidthScale(10),
      borderWidth: 2,
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonInner: {
      width: moderateWidthScale(10),
      height: moderateWidthScale(10),
      borderRadius: moderateWidthScale(5),
      backgroundColor: theme.orangeBrown,
    },
    priceBreakdown: {
      padding: moderateWidthScale(20),
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateHeightScale(12),
    },
    priceRowLast: {
      marginBottom: 0,
    },
    priceLabel: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    priceValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    bottom: {
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(20),
      gap: moderateHeightScale(16),
      paddingVertical: moderateHeightScale(12),
      borderColor: theme.borderLight,
      borderTopWidth: 1,
    },
    totalSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalLabel: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    totalValue: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
  });

export default function BookingNow() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const { showBanner } = useNotificationContext();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get data from Redux
  const businessData = useAppSelector((state) => state.bsns);
  const {
    selectedService,
    allServices,
    staffMembers,
    selectedServices: reduxSelectedServices,
    selectedStaff: reduxSelectedStaff,
  } = businessData || {
    selectedService: null,
    allServices: [],
    staffMembers: [],
    selectedServices: [],
    selectedStaff: "anyone",
  };

  const [selectedStaff, setSelectedStaffLocal] = useState<string>(
    reduxSelectedStaff || "anyone"
  );
  const [selectedServices, setSelectedServicesLocal] = useState<Service[]>(
    () => {
      // Initialize from Redux - prefer selectedServices, fallback to selectedService only on initial load
      if (reduxSelectedServices.length > 0) {
        return reduxSelectedServices;
      } else if (selectedService) {
        return [selectedService];
      }
      return [];
    }
  );
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const isUpdatingFromLocalRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Sync with Redux when it changes from external sources (like checkout screen)
  // Skip sync if we're updating Redux ourselves
  useEffect(() => {
    if (isUpdatingFromLocalRef.current) {
      isUpdatingFromLocalRef.current = false;
      return;
    }

    // On initial load, initialize from Redux
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      if (reduxSelectedServices.length > 0) {
        setSelectedServicesLocal(reduxSelectedServices);
      } else if (selectedService && reduxSelectedServices.length === 0) {
        // Only use selectedService on initial load if Redux is empty
        setSelectedServicesLocal([selectedService]);
      }
      return;
    }

    // After initial load, only sync if Redux has services
    // If Redux is empty, respect that (user deleted all services)
    if (reduxSelectedServices.length > 0) {
      setSelectedServicesLocal(reduxSelectedServices);
    } else {
      // Keep local state empty if Redux is empty (user intentionally deleted all)
      setSelectedServicesLocal([]);
    }
  }, [reduxSelectedServices, selectedService]);

  useEffect(() => {
    if (reduxSelectedStaff) {
      setSelectedStaffLocal(reduxSelectedStaff);
    }
  }, [reduxSelectedStaff]);

  useEffect(()=>{

    return()=>{
      dispatch(clearBusinessData());
    }
  },[])

  const staffList = [
    {
      id: "anyone",
      name: "Anyone who's available",
      experience: null,
      image: null,
    },
    ...staffMembers.map((staff) => ({
      id: staff.id.toString(),
      name: staff.name,
      experience: `${staff.experience ?? 0} years of exp.`,
      image: staff.image,
    })),
  ];
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  // Update Redux when local state changes (but mark that we're updating from local)
  useEffect(() => {
    isUpdatingFromLocalRef.current = true;
    dispatch(setSelectedServices(selectedServices));
  }, [selectedServices, dispatch]);

  useEffect(() => {
    dispatch(setSelectedStaff(selectedStaff));
  }, [selectedStaff, dispatch]);

  const handleDeleteService = (serviceId: number) => {
    const updatedServices = selectedServices.filter(
      (service) => service.id !== serviceId
    );
    // Mark that we're updating from local, so sync useEffect doesn't interfere
    isUpdatingFromLocalRef.current = true;
    setSelectedServicesLocal(updatedServices);
    dispatch(setSelectedServices(updatedServices));
  };

  const handleAddService = () => {
    setAddServiceModalVisible(true);
  };

  const handleCloseModal = useCallback(() => {
    setAddServiceModalVisible(false);
  }, []);

  const handleUpdateSelectedServices = useCallback(
    (services: Service[]) => {
      // Directly update with the service objects passed from bottom sheet
      isUpdatingFromLocalRef.current = true;
      setSelectedServicesLocal(services);
      dispatch(setSelectedServices(services));
    },
    [dispatch]
  );

  // Memoize selectedServiceIds to prevent infinite loops
  const selectedServiceIds = useMemo(
    () => selectedServices.map((s) => s.id),
    [selectedServices]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <BackArrowIcon
              width={widthScale(25)}
              height={heightScale(25)}
              color={theme.darkGreen}
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <LeafLogo
              width={widthScale(22)}
              height={heightScale(22)}
              color1={theme.darkGreen}
              color2={theme.darkGreen}
            />
            <Text style={styles.logoText}>FRESHPASS</Text>
          </View>
        </View>
      </View>

      <View style={styles.line} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Service Details */}
        {selectedServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteService(service.id)}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={moderateWidthScale(20)}
                  color={theme.red}
                />
              </TouchableOpacity>
            </View>

            <View style={{ gap: moderateHeightScale(4) }}>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>
                  - ${service.price.toFixed(2)} USD
                </Text>
                <Text style={styles.originalPrice}>
                  ${service.originalPrice.toFixed(2)} USD
                </Text>
              </View>

              <Text style={styles.descriptionText}>
                - {service.description}
              </Text>
            </View>
          </View>
        ))}

        {/* Add Another Service */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAddService}
          style={styles.addServiceSection}
        >
          <Text style={styles.addServiceText}>Add another service</Text>
          <View style={styles.addServiceButton}>
            <Octicons
              name="plus"
              size={moderateWidthScale(16)}
              color={theme.selectCard}
            />
          </View>
        </TouchableOpacity>

        {/* Staff Selection */}
        <View>
          <Text style={styles.staffTitle}>Choose staff members</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.staffList}
          >
            {staffList.map((staff) => {
              const isAnyone = staff.id === "anyone";
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={staff.id}
                  style={[
                    styles.staffCard,
                    selectedStaff === staff.id && styles.staffCardSelected,
                    isAnyone && styles.staffCardAnyone,
                    !isAnyone && styles.shadow,
                  ]}
                  onPress={() => {
                    setSelectedStaffLocal(staff.id);
                    dispatch(setSelectedStaff(staff.id));
                  }}
                >
                  <>
                    {!isAnyone && (
                      <Image
                        source={{ uri: staff.image || "" }}
                        style={styles.staffImage}
                      />
                    )}

                    <View style={styles.staffInfo}>
                      <Text
                        style={styles.staffName}
                        numberOfLines={isAnyone ? 2 : 1}
                      >
                        {staff.name}
                      </Text>
                      {staff.experience ? (
                        <Text style={styles.staffExperience} numberOfLines={1}>
                          {staff.experience}
                        </Text>
                      ) : null}
                    </View>
                    <View style={[styles.radioButton]}>
                      {selectedStaff === staff.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.line, { marginTop: moderateHeightScale(20) }]} />

        {/* Price Breakdown */}
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)} USD</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax:</Text>
            <Text style={styles.priceValue}>Calculated at the checkout</Text>
          </View>
          <View
            style={[
              styles.line,
              {
                backgroundColor: theme.lightGreen2,
                marginBottom: moderateHeightScale(12),
              },
            ]}
          />
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { fontFamily: fonts.fontBold }]}>
              Estimated Total:
            </Text>
            <Text style={[styles.priceValue, { fontFamily: fonts.fontBold }]}>
              ${totalPrice.toFixed(2)} USD
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        {/* Final Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Estimated total:</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)} USD</Text>
        </View>

        {/* Checkout Button */}
        <Button
          title="Checkout"
          onPress={() => {
            if (selectedServices.length === 0) {
              showBanner(
                "No Service Selected",
                "Please select at least one service to proceed with checkout.",
                "warning",
                4000
              );
              return;
            }
            // Data is already in Redux, just navigate
            router.push({
              pathname: "/(main)/bookingNow/checkout",
            });
          }}
        />
      </View>

      {/* Add Service Bottom Sheet */}
      <AddServiceBottomSheet
        visible={addServiceModalVisible}
        onClose={handleCloseModal}
        services={allServices}
        selectedServiceIds={selectedServiceIds}
        onUpdateServices={handleUpdateSelectedServices}
      />
    </SafeAreaView>
  );
}
