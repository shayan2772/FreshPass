import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import DashboardHeaderClient from "../../DashboardHeaderClient";
import SearchBar from "./components/SearchBar";
import DashboardContent from "./components/DashboardContent";
import * as Location from "expo-location";
import LocationEnableModal from "@/src/components/locationEnableModal";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });

export default function HomeScreen() {
  const { colors } = useTheme();
  const theme = colors as Theme;
  const styles = useMemo(() => createStyles(theme), [colors]);
  const user = useAppSelector((state) => state.user);
  const userRole = user.userRole;
  const isGuest = user.isGuest;
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    if (userRole === "customer" || isGuest) {
      isLocationEnable();
    }
  }, []);

  const isLocationEnable = async () => {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      setShowLocationModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowLocationModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DashboardHeaderClient />
        <SearchBar />
        <DashboardContent />
      </View>

      <LocationEnableModal
        visible={showLocationModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
