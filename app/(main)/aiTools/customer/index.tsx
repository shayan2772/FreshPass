import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { createStyles } from "./styles";
import StackHeader from "@/src/components/StackHeader";

export default function CustomerAiTools() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
 
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  return (
      <View style={styles.safeArea}>
        <StackHeader title="Ai Tools" />
        
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
          </ScrollView>
        
      </View>
   
  );
}
