import React, { useMemo } from "react";
import {
  ScrollView,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import StackHeader from "@/src/components/StackHeader";
 
export default function Tools() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ toolType?: string }>();

  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

   
  const headerTitle = params.toolType || "Ai Tools";

  return (
    <View style={styles.safeArea}>
      <StackHeader title={headerTitle} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      ></ScrollView>
    </View>
  );
}
