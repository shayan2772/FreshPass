import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Clipboard,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
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
  images?: {
    processed: string;
    original?: string; // For Generate Post (single image)
    originals?: string[]; // For Generate Collage (multiple images)
  };
  video?: {
    url: string;
    duration?: number;
    format?: string;
    resolution?: string;
    fps?: number;
    file_size_mb?: number;
  };
  content?: {
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
  transitions?: {
    style?: string;
    applied?: string[];
  };
  music?: {
    source?: string;
    has_music?: boolean;
    track?: string;
  };
  media_count?: number;
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
    videoContainer: {
      width: "100%",
      height: heightScale(400),
      borderRadius: moderateWidthScale(12),
      overflow: "hidden",
      backgroundColor: theme.lightGreen2,
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: moderateHeightScale(20),
      position: "relative",
    },
    video: {
      width: "100%",
      height: "100%",
    },
    playButton: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    playButtonInner: {
      width: moderateWidthScale(60),
      height: moderateWidthScale(60),
      borderRadius: moderateWidthScale(30),
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    videoInfoContainer: {
      position: "absolute",
      bottom: moderateHeightScale(16),
      left: moderateWidthScale(16),
      right: moderateWidthScale(16),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    videoInfoText: {
      fontSize: fontSize.size12,
      fontFamily: fonts.fontRegular,
      color: theme.white,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(4),
      borderRadius: moderateWidthScale(4),
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
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(
    null
  );

  useEffect(() => {
    if (!visible) {
      // Pause video when modal closes
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [visible]);

  const handleCopy = async (text: string, label: string) => {
    try {
      Clipboard.setString(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const handleDownload = async () => {
    const downloadUri =
      toolType === "Generate Reel"
        ? result?.video?.url
        : result?.images?.processed;

    if (!downloadUri) {
      Alert.alert(
        "Error",
        `No ${
          toolType === "Generate Reel" ? "video" : "image"
        } available to download`
      );
      return;
    }

    setDownloading(true);
    try {
      // Try to open the URL in browser/device default handler
      // This allows users to save the file manually
      const canOpen = await Linking.canOpenURL(downloadUri);
      if (canOpen) {
        await Linking.openURL(downloadUri);
      }
    } catch (error) {
      console.error("Error opening file:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
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
                onPress={handleDownload}
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
                      Download{" "}
                      {toolType === "Generate Reel" ? "Video" : "Image"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Generated Video (for Reel) */}
            {toolType === "Generate Reel" && result.video?.url && (
              <View style={styles.videoContainer}>
                <Video
                  ref={videoRef}
                  source={{ uri: result.video.url }}
                  style={styles.video}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping={false}
                  shouldPlay={false}
                  onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
                {!isPlaying && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlayPause}
                    activeOpacity={0.7}
                  >
                    <View style={styles.playButtonInner}>
                      <MaterialIcons
                        name="play-arrow"
                        size={moderateWidthScale(40)}
                        color={theme.white}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <View style={styles.videoInfoContainer}>
                  {result.video.duration && (
                    <Text style={styles.videoInfoText}>
                      {result.video.duration.toFixed(1)}s
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.openFullButton}
                    onPress={async () => {
                      try {
                        const canOpen = await Linking.canOpenURL(
                          result.video!.url
                        );
                        if (canOpen) {
                          await Linking.openURL(result.video!.url);
                        }
                      } catch (error) {
                        console.error("Error opening video URL:", error);
                      }
                    }}
                  >
                    <OpenFullIcon
                      width={widthScale(14)}
                      height={heightScale(14)}
                      color={theme.white}
                    />
                    <Text style={styles.openFullButtonText}>Open in full</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Reel Info Section */}
            {toolType === "Generate Reel" && result.video && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Details</Text>
                <View style={styles.sectionContent}>
                  {result.video.duration && (
                    <Text style={styles.captionText}>
                      Duration: {result.video.duration.toFixed(1)}s
                    </Text>
                  )}
                  {result.video.resolution && (
                    <Text style={styles.captionText}>
                      Resolution: {result.video.resolution}
                    </Text>
                  )}
                  {result.video.format && (
                    <Text style={styles.captionText}>
                      Format: {result.video.format}
                    </Text>
                  )}
                  {result.video.file_size_mb && (
                    <Text style={styles.captionText}>
                      File Size: {result.video.file_size_mb.toFixed(2)} MB
                    </Text>
                  )}
                  {result.media_count && (
                    <Text style={styles.captionText}>
                      Media Count: {result.media_count}
                    </Text>
                  )}
                  {result.music?.has_music && (
                    <Text style={styles.captionText}>
                      Music: {result.music.track || "Library Music"}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Generated Image (for Post and Collage) */}
            {toolType !== "Generate Reel" && result.images?.processed && (
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
      {toolType !== "Generate Reel" && (
        <FullImageModal
          visible={fullImageModalVisible}
          onClose={() => setFullImageModalVisible(false)}
          imageUri={result?.images?.processed || null}
        />
      )}
    </ModalizeBottomSheet>
  );
}
