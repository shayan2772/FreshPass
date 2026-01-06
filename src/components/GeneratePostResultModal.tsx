import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
  heightScale,
} from "@/src/theme/dimensions";
import { StyleSheet } from "react-native";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import FullImageModal from "@/src/components/fullImageModal";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { OpenFullIcon } from "@/assets/icons";
// Note: expo-file-system and expo-sharing need to be installed for full download functionality
// For now, using Linking as fallback

interface GeneratePostResponse {
  status: string;
  business_id: number;
  images: {
    processed: string;
    original?: string; // For Generate Post (single image)
    originals?: string[]; // For Generate Collage (multiple images)
  };
  content: {
    caption: string;
    hashtags: string[];
    complete_post: string;
  };
  cost?: {
    total_tokens: number;
    api_calls: number;
    total_cost_usd: number;
  };
  processing_time?: number;
}

interface GeneratePostResultModalProps {
  visible: boolean;
  onClose: () => void;
  result: GeneratePostResponse | null;
  toolType: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContent: {
      paddingBottom: moderateHeightScale(20),
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(20),
      paddingBottom: moderateHeightScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    downloadButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: moderateWidthScale(16),
      paddingVertical: moderateHeightScale(10),
      borderRadius: moderateWidthScale(8),
      gap: moderateWidthScale(8),
    },
    downloadButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    imageContainer: {
      width: "100%",
      height: heightScale(300),
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
      backgroundColor: theme.lightGreen2,
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: moderateHeightScale(20),
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
    },
    openFullButton: {
      position: "absolute",
      bottom: moderateHeightScale(16),
      right: moderateWidthScale(16),
      backgroundColor: theme.selectCard,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(8),
      borderRadius: moderateWidthScale(8),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(6),
    },
    openFullButtonText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontMedium,
      color: theme.white,
    },
    section: {
      marginBottom: moderateHeightScale(24),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateHeightScale(12),
    },
    sectionTitle: {
      fontSize: fontSize.size16,
      fontFamily: fonts.fontBold,
      color: theme.text,
      textTransform: "uppercase",
    },
    copyButton: {
      width: moderateWidthScale(32),
      height: moderateWidthScale(32),
      borderRadius: moderateWidthScale(16),
      backgroundColor: theme.orangeBrown30,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionContent: {
      backgroundColor: theme.background,
      borderRadius: moderateWidthScale(8),
      padding: moderateWidthScale(16),
      borderWidth: 1,
      borderColor: theme.borderLine,
    },
    captionText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      lineHeight: moderateHeightScale(20),
    },
    hashtagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(8),
    },
    hashtagChip: {
      backgroundColor: theme.orangeBrown30,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(6),
      borderRadius: moderateWidthScale(16),
    },
    hashtagText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.darkGreen,
    },
    completePostText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.text,
      lineHeight: moderateHeightScale(20),
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateHeightScale(40),
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateHeightScale(40),
    },
    emptyStateText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.orangeBrown30,
      textAlign: "center",
    },
  });

export default function GeneratePostResultModal({
  visible,
  onClose,
  result,
  toolType,
}: GeneratePostResultModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const [downloading, setDownloading] = useState(false);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);

  const handleCopy = async (text: string, label: string) => {
    try {
      Clipboard.setString(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const handleDownloadImage = async () => {
    if (!result?.images?.processed) {
      Alert.alert("Error", "No image available to download");
      return;
    }

    setDownloading(true);
    try {
      const imageUri = result.images.processed;
      // Try to open the image URL in browser/device default handler
      // This allows users to save the image manually
      const canOpen = await Linking.canOpenURL(imageUri);
      if (canOpen) {
        await Linking.openURL(imageUri);
      }
    } catch (error) {
      console.error("Error opening image:", error);
    } finally {
      setDownloading(false);
    }
  };

  const getToolTitle = () => {
    if (toolType === "Generate Post") {
      return "Generated Post Preview";
    } else if (toolType === "Generate Collage") {
      return "Generated Collage Preview";
    } else if (toolType === "Generate Reel") {
      return "Generated Reel Preview";
    }
    return "Generated Content Preview";
  };

  return (
    <ModalizeBottomSheet
      visible={visible}
      onClose={onClose}
      title={getToolTitle()}
      sheetContainerStyle={{ maxHeight: "90%" }}
    >
      <View style={styles.modalContent}>
        {result ? (
          <>
            {/* Download Button */}
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadImage}
                disabled={downloading}
                activeOpacity={0.7}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={theme.white} />
                ) : (
                  <>
                    <Feather
                      name="download"
                      size={moderateWidthScale(16)}
                      color={theme.white}
                    />
                    <Text style={styles.downloadButtonText}>
                      Download Image
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Generated Image */}
            {result.images?.processed && (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => setFullImageModalVisible(true)}
                activeOpacity={1}
              >
                <Image
                  source={{ uri: result.images.processed }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.openFullButton}
                  onPress={() => setFullImageModalVisible(true)}
                >
                  <OpenFullIcon
                    width={widthScale(14)}
                    height={heightScale(14)}
                    color={theme.white}
                  />
                  <Text style={styles.openFullButtonText}>Open in full</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {/* Caption Section */}
            {result.content?.caption && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Caption</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() =>
                      handleCopy(result.content.caption, "Caption")
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="content-copy"
                      size={moderateWidthScale(18)}
                      color={theme.darkGreen}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.captionText}>
                    {result.content.caption}
                  </Text>
                </View>
              </View>
            )}

            {/* Hashtags Section */}
            {result.content?.hashtags && result.content.hashtags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Hashtags</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() =>
                      handleCopy(result.content.hashtags.join(" "), "Hashtags")
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="content-copy"
                      size={moderateWidthScale(18)}
                      color={theme.darkGreen}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                  <View style={styles.hashtagsContainer}>
                    {result.content.hashtags.map((hashtag, index) => (
                      <View key={index} style={styles.hashtagChip}>
                        <Text style={styles.hashtagText}>{hashtag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Complete Post Text Section */}
            {result.content?.complete_post && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Complete Post Text</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() =>
                      handleCopy(result.content.complete_post, "Complete post")
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="content-copy"
                      size={moderateWidthScale(18)}
                      color={theme.darkGreen}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.completePostText}>
                    {result.content.complete_post}
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No result available</Text>
          </View>
        )}
      </View>

      {/* Full Image Modal */}
      <FullImageModal
        visible={fullImageModalVisible}
        onClose={() => setFullImageModalVisible(false)}
        imageUri={result?.images?.processed || null}
      />
    </ModalizeBottomSheet>
  );
}
