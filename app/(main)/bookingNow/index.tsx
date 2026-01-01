import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/hooks/hooks";
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

// Trash Icon SVG
const trashIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="{{COLOR}}"/>
</svg>
`;

const TrashIcon = ({ width = 24, height = 24, color = "#FF0000" }) => {
  const svgXml = trashIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

// Plus Icon SVG
const plusIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="{{COLOR}}"/>
</svg>
`;

const PlusIcon = ({ width = 24, height = 24, color = "#283618" }) => {
  const svgXml = plusIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

// Checkbox Icon SVG
const checkboxIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="{{COLOR}}"/>
</svg>
`;

const CheckboxIcon = ({ width = 24, height = 24, color = "#283618" }) => {
  const svgXml = checkboxIconSvg
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
      marginBottom: moderateHeightScale(24),
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
    staffSection: {
      marginBottom: moderateHeightScale(24),
    },
    staffTitle: {
      fontSize: fontSize.size18,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(16),
    },
    staffList: {
      gap: moderateHeightScale(12),
    },
    staffCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      gap: moderateWidthScale(12),
    },
    staffCardSelected: {
      backgroundColor: theme.lightBeige,
    },
    staffImage: {
      width: widthScale(50),
      height: heightScale(50),
      borderRadius: moderateWidthScale(25),
      backgroundColor: theme.borderLight,
    },
    staffInfo: {
      flex: 1,
    },
    staffName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    staffExperience: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    priceBreakdown: {
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(16),
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
      color: theme.lightGreen,
    },
    priceValue: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    priceLabelTotal: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    priceValueTotal: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subscriptionSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.lightBeige,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(24),
    },
    subscriptionText: {
      flex: 1,
      fontSize: fontSize.size14,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginRight: moderateWidthScale(12),
    },
    subscriptionButton: {
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(8),
    },
    subscriptionButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.black,
    },
    bottom: {
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(20),
      gap: moderateHeightScale(16),
      paddingVertical: moderateHeightScale(12),
      borderColor:theme.borderLight,
      borderTopWidth:1,
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
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: moderateHeightScale(50),
      paddingHorizontal: moderateWidthScale(20),
      paddingBottom: moderateHeightScale(16),
    },
    modalTitle: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
      marginTop: moderateHeightScale(20),
      marginBottom: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(20),
    },
    serviceListItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.white,
      borderRadius: moderateWidthScale(12),
      padding: moderateWidthScale(16),
      marginBottom: moderateHeightScale(12),
      marginHorizontal: moderateWidthScale(20),
    },
    checkboxContainer: {
      width: widthScale(24),
      height: heightScale(24),
      borderRadius: moderateWidthScale(4),
      borderWidth: 2,
      borderColor: theme.lightGreen2,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateWidthScale(12),
    },
    checkboxChecked: {
      backgroundColor: theme.darkGreen,
      borderColor: theme.darkGreen,
    },
    serviceListContent: {
      flex: 1,
    },
    serviceListLabel: {
      position: "absolute",
      top: moderateHeightScale(-8),
      left: moderateWidthScale(0),
      backgroundColor: theme.lightGreen,
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(2),
      borderRadius: moderateWidthScale(4),
    },
    serviceListLabelText: {
      fontSize: fontSize.size10,
      fontFamily: fonts.fontBold,
      color: theme.white,
    },
    serviceListName: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      marginBottom: moderateHeightScale(4),
    },
    serviceListDescription: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      marginBottom: moderateHeightScale(4),
    },
    serviceListDuration: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    serviceListPriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
      marginTop: moderateHeightScale(8),
    },
    serviceListOriginalPrice: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
      textDecorationLine: "line-through",
    },
    serviceListCurrentPrice: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    serviceListButton: {
      marginTop: moderateHeightScale(8),
    },
    modalAddButton: {
      marginHorizontal: moderateWidthScale(20),
      marginBottom: moderateHeightScale(20),
    },
  });

export default function BookingNow() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedService?: string;
    allServices?: string;
    staffMembers?: string;
    businessId?: string;
  }>();

  const [selectedStaff, setSelectedStaff] = useState<string>("anyone");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [selectedServicesInModal, setSelectedServicesInModal] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (params.selectedService) {
      try {
        const service = JSON.parse(params.selectedService);
        setSelectedService(service);
        setSelectedServices([service]);
      } catch (e) {
        console.error("Error parsing selectedService:", e);
      }
    }

    if (params.allServices) {
      try {
        const services = JSON.parse(params.allServices);
        setAllServices(services);
      } catch (e) {
        console.error("Error parsing allServices:", e);
      }
    }

    if (params.staffMembers) {
      try {
        const staff = JSON.parse(params.staffMembers);
        setStaffMembers(staff);
      } catch (e) {
        console.error("Error parsing staffMembers:", e);
      }
    }
  }, [params]);

  const otherServices = allServices.filter(
    (service) => service.id !== selectedService?.id
  );

  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const handleDeleteService = (serviceId: number) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceId)
    );
    if (selectedServices.length === 1) {
      router.back();
    }
  };

  const handleAddService = () => {
    setAddServiceModalVisible(true);
    setSelectedServicesInModal([]);
  };

  const handleToggleServiceInModal = (serviceId: number) => {
    setSelectedServicesInModal((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddSelectedServices = () => {
    const servicesToAdd = otherServices.filter((service) =>
      selectedServicesInModal.includes(service.id)
    );
    setSelectedServices([...selectedServices, ...servicesToAdd]);
    setAddServiceModalVisible(false);
    setSelectedServicesInModal([]);
  };

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
      experience: staff.experience ? `${staff.experience} years of exp.` : null,
      image: staff.image,
    })),
  ];

  if (!selectedService) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
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
        <View style={styles.staffSection}>
          <Text style={styles.staffTitle}>Choose staff members</Text>
          <View style={styles.staffList}>
            {staffList.map((staff) => (
              <TouchableOpacity
                key={staff.id}
                style={[
                  styles.staffCard,
                  selectedStaff === staff.id && styles.staffCardSelected,
                ]}
                onPress={() => setSelectedStaff(staff.id)}
              >
                {staff.image ? (
                  <Image
                    source={{ uri: staff.image }}
                    style={styles.staffImage}
                  />
                ) : (
                  <View style={styles.staffImage} />
                )}
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  {staff.experience ? (
                    <Text style={styles.staffExperience}>
                      {staff.experience}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    width: moderateWidthScale(20),
                    height: moderateWidthScale(20),
                    borderRadius: moderateWidthScale(10),
                    borderWidth: 2,
                    borderColor:
                      selectedStaff === staff.id
                        ? theme.darkGreen
                        : theme.lightGreen2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedStaff === staff.id && (
                    <View
                      style={{
                        width: moderateWidthScale(10),
                        height: moderateWidthScale(10),
                        borderRadius: moderateWidthScale(5),
                        backgroundColor: theme.darkGreen,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
          <View style={[styles.priceRow, styles.priceRowLast]}>
            <Text style={styles.priceLabelTotal}>Estimated Total:</Text>
            <Text style={styles.priceValueTotal}>
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
            router.push({
              pathname: "/(main)/bookingNow/checkout",
              params: {
                selectedServices: JSON.stringify(selectedServices),
                selectedStaff: selectedStaff,
                businessId: params.businessId || "",
              },
            });
          }}
        />
      </View>

      {/* Add Service Modal */}
      <Modal
        visible={addServiceModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setAddServiceModalVisible(false)}
              >
                <BackArrowIcon
                  width={widthScale(16)}
                  height={heightScale(16)}
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

          <Text style={styles.modalTitle}>Add another service</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {otherServices.map((service) => (
              <View key={service.id} style={styles.serviceListItem}>
                <TouchableOpacity
                  style={[
                    styles.checkboxContainer,
                    selectedServicesInModal.includes(service.id) &&
                      styles.checkboxChecked,
                  ]}
                  onPress={() => handleToggleServiceInModal(service.id)}
                >
                  {selectedServicesInModal.includes(service.id) && (
                    <CheckboxIcon
                      width={widthScale(16)}
                      height={heightScale(16)}
                      color={theme.white}
                    />
                  )}
                </TouchableOpacity>
                <View style={styles.serviceListContent}>
                  {service.label && (
                    <View style={styles.serviceListLabel}>
                      <Text style={styles.serviceListLabelText}>
                        {service.label}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.serviceListName}>{service.name}</Text>
                  <Text style={styles.serviceListDescription}>
                    {service.description}
                  </Text>
                  <Text style={styles.serviceListDuration}>
                    {service.duration}
                  </Text>
                  <View style={styles.serviceListPriceContainer}>
                    <Text style={styles.serviceListOriginalPrice}>
                      ${service.originalPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.serviceListCurrentPrice}>
                      ${service.price.toFixed(2)} USD
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalAddButton}>
            <Button
              title="Add service"
              onPress={handleAddSelectedServices}
              disabled={selectedServicesInModal.length === 0}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
