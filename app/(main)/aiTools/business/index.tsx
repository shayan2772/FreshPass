import React, { useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import { createStyles } from "./styles";
import StackHeader from "@/src/components/StackHeader";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

// Generate Post Icon (Landscape/Image)
const generatePostIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="{{COLOR}}"/>
<path d="M14.5 11L12 8.5L9.5 11L8 9.5V15H16V9.5L14.5 11Z" fill="{{COLOR}}"/>
<circle cx="15.5" cy="8.5" r="1.5" fill="{{COLOR}}"/>
</svg>
`;

// Generate Collage Icon (Grid)
const generateCollageIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 3H11V11H3V3Z" fill="{{COLOR}}"/>
<path d="M13 3H21V11H13V3Z" fill="{{COLOR}}"/>
<path d="M3 13H11V21H3V13Z" fill="{{COLOR}}"/>
<path d="M13 13H21V21H13V13Z" fill="{{COLOR}}"/>
</svg>
`;

// Generate Reel Icon (Video Camera)
const generateReelIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="{{COLOR}}"/>
</svg>
`;

const GeneratePostIcon = ({
  width = 24,
  height = 24,
  color = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  const svgXml = generatePostIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const GenerateCollageIcon = ({
  width = 24,
  height = 24,
  color = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  const svgXml = generateCollageIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

const GenerateReelIcon = ({
  width = 24,
  height = 24,
  color = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  const svgXml = generateReelIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR}}/g, color);
  return <SvgXml xml={svgXml} />;
};

export default function BusinessAiTools() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors as Theme), [colors]);

  const features = [
    {
      id: "generatePost",
      title: "Generate Post",
      icon: GeneratePostIcon,
    },
    {
      id: "generateCollage",
      title: "Generate Collage",
      icon: GenerateCollageIcon,
    },
    {
      id: "generateReel",
      title: "Generate Reel",
      icon: GenerateReelIcon,
    },
  ];

  const handleFeaturePress = (featureId: string) => {
    // Handle feature press
    console.log("Feature pressed:", featureId);
  };

  return (
    <View style={styles.safeArea}>
      <StackHeader title="Ai Tools" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.featuresContainer}>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureBox}
                onPress={() => handleFeaturePress(feature.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[
                    (colors as Theme).buttonBack,
                    (colors as Theme).darkGreen,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientContainer}
                >
                  <View style={styles.iconContainer}>
                    <IconComponent
                      width={moderateWidthScale(32)}
                      height={moderateWidthScale(32)}
                      color={(colors as Theme).white}
                    />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
