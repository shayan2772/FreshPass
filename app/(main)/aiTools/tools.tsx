import React, { useMemo, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  moderateWidthScale,
  moderateHeightScale,
} from "@/src/theme/dimensions";
import { fontSize, fonts } from "@/src/theme/fonts";
import { createStyles } from "./styles";
import StackHeader from "@/src/components/StackHeader";
import Button from "@/src/components/button";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  handleMediaLibraryPermission,
  handleCameraPermission,
} from "@/src/services/mediaPermissionService";
import ModalizeBottomSheet from "@/src/components/modalizeBottomSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { socialMediaEndpoints } from "@/src/services/endpoints";
import GeneratePostResultModal from "@/src/components/GeneratePostResultModal";
import { setActionLoader } from "@/src/state/slices/generalSlice";
import { useNotificationContext } from "@/src/contexts/NotificationContext";
import axios from "axios";

interface MediaFile {
  id: string;
  uri: string;
  type: "image" | "video";
  thumbnailUri?: string; // For video thumbnails
}

interface AudioFile {
  id: string;
  uri: string;
  name: string;
}

export default function Tools() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { showBanner } = useNotificationContext();
  const params = useLocalSearchParams<{ toolType?: string }>();

  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;

  const toolType = params.toolType || "";
  const headerTitle = toolType || "Ai Tools";

  // State for Post (single image)
  const [postImage, setPostImage] = useState<string | null>(null);

  // State for Collage (2-6 images)
  const [collageImages, setCollageImages] = useState<MediaFile[]>([]);

  // State for Reel (3-15 media files + optional audio)
  const [reelMedia, setReelMedia] = useState<MediaFile[]>([]);
  const [backgroundMusic, setBackgroundMusic] = useState<AudioFile | null>(
    null
  );

  // Modal states
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [mediaPickerVisible, setMediaPickerVisible] = useState(false);
  const [audioPickerVisible, setAudioPickerVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  // API state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>({"business_id": 1, "media_count": 3, "music": {"has_music": true, "source": "uploaded", "track": "user_uploaded"}, "processing_time": 97.95, "status": "success", "transitions": {"applied": ["zoom_in", "zoom_in"], "style": "dynamic"}, "video": {"duration": 13.58, "file_size_mb": 4.97, "format": "instagram_reel", "fps": 30, "resolution": "1080x1920", "url": "http://159.89.190.185:8001/outputs/social_media/business_1/reels/76b9bc5f_reel.mp4"}});
  console.log("--->generatedResult", generatedResult);
  // Get business_id from Redux store
  const user = useAppSelector((state) => state.user);
  // const businessId = user?.business_id ??
  const businessId = "1";

  const generateId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSelectFromGallery = useCallback(async () => {
    setImagePickerVisible(false);
    setMediaPickerVisible(false);
    const hasPermission = await handleMediaLibraryPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const isReel = toolType === "Generate Reel";
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: isReel
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection:
          toolType === "Generate Collage" || toolType === "Generate Reel",
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        if (toolType === "Generate Post") {
          if (result.assets[0]) {
            setPostImage(result.assets[0].uri);
          }
        } else if (toolType === "Generate Collage") {
          const newImages: MediaFile[] = result.assets
            .filter((asset) => asset.uri)
            .map((asset) => ({
              id: generateId(),
              uri: asset.uri,
              type: "image" as const,
            }));

          const totalImages = collageImages.length + newImages.length;
          if (totalImages > 6) {
            showBanner(
              "Limit Exceeded",
              "You can select maximum 6 images. Only first 6 will be added.",
              "warning",
              3000
            );
            const remaining = 6 - collageImages.length;
            setCollageImages([
              ...collageImages,
              ...newImages.slice(0, remaining),
            ]);
          } else {
            setCollageImages([...collageImages, ...newImages]);
          }
        } else if (toolType === "Generate Reel") {
          const newMedia: MediaFile[] = result.assets
            .filter((asset) => asset.uri)
            .map((asset) => {
              const isVideo = asset.type === "video";
              return {
                id: generateId(),
                uri: asset.uri,
                type: isVideo ? "video" : "image",
                thumbnailUri: isVideo
                  ? (asset as any).thumbnailUri || asset.uri
                  : undefined,
              };
            });

          const totalMedia = reelMedia.length + newMedia.length;
          if (totalMedia > 15) {
            showBanner(
              "Limit Exceeded",
              "You can select maximum 15 media files. Only first 15 will be added.",
              "warning",
              3000
            );
            const remaining = 15 - reelMedia.length;
            setReelMedia([...reelMedia, ...newMedia.slice(0, remaining)]);
          } else {
            setReelMedia([...reelMedia, ...newMedia]);
          }
        }
      }
    } catch (error) {
      console.error("Error selecting media:", error);
      showBanner(
        "Error",
        "Failed to select media. Please try again.",
        "error",
        3000
      );
    }
  }, [toolType, collageImages, reelMedia]);

  const handleTakePhoto = useCallback(async () => {
    setImagePickerVisible(false);
    setMediaPickerVisible(false);
    const hasPermission = await handleCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const isReel = toolType === "Generate Reel";
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: isReel
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (toolType === "Generate Post") {
          setPostImage(asset.uri);
        } else if (toolType === "Generate Collage") {
          if (collageImages.length >= 6) {
            showBanner(
              "Limit Exceeded",
              "You can select maximum 6 images.",
              "warning",
              3000
            );
            return;
          }
          setCollageImages([
            ...collageImages,
            {
              id: generateId(),
              uri: asset.uri,
              type: "image",
            },
          ]);
        } else if (toolType === "Generate Reel") {
          if (reelMedia.length >= 15) {
            showBanner(
              "Limit Exceeded",
              "You can select maximum 15 media files.",
              "warning",
              3000
            );
            return;
          }
          const isVideo = asset.type === "video";
          setReelMedia([
            ...reelMedia,
            {
              id: generateId(),
              uri: asset.uri,
              type: isVideo ? "video" : "image",
              thumbnailUri: isVideo
                ? (asset as any).thumbnailUri || asset.uri
                : undefined,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showBanner(
        "Error",
        "Failed to take photo. Please try again.",
        "error",
        3000
      );
    }
  }, [toolType, collageImages, reelMedia]);

  const handleDeleteImage = useCallback(
    (id: string) => {
      if (toolType === "Generate Collage") {
        setCollageImages(collageImages.filter((img) => img.id !== id));
      } else if (toolType === "Generate Reel") {
        setReelMedia(reelMedia.filter((media) => media.id !== id));
      }
    },
    [toolType, collageImages, reelMedia]
  );

  const handleDeletePostImage = useCallback(() => {
    setPostImage(null);
  }, []);

  const handleDeleteAudio = useCallback(() => {
    setBackgroundMusic(null);
  }, []);

  const handleSelectAudio = useCallback(async () => {
    setAudioPickerVisible(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const audioFile = result.assets[0];
        const fileName = audioFile.name || "audio_file";
        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Validate file extension
        const allowedExtensions = ["mp3", "wav", "m4a"];
        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
          showBanner(
            "Invalid File Type",
            "Please select an audio file in MP3, WAV, or M4A format.",
            "warning",
            3000
          );
          return;
        }

        setBackgroundMusic({
          id: generateId(),
          uri: audioFile.uri,
          name: fileName,
        });
      }
    } catch (error) {
      console.error("Error selecting audio file:", error);
      showBanner(
        "Error",
        "Failed to select audio file. Please try again.",
        "error",
        3000
      );
    }
  }, []);

  const handleGenerate = async () => {
    // Validation
    if (toolType === "Generate Post") {
      if (!postImage) {
        showBanner(
          "Validation Error",
          "Please select an image.",
          "warning",
          3000
        );
        return;
      }
    } else if (toolType === "Generate Collage") {
      if (collageImages.length < 2) {
        showBanner(
          "Validation Error",
          "Please select at least 2 images (maximum 6).",
          "warning",
          3000
        );
        return;
      }
      // Validate file types for collage images
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const invalidImages = collageImages.filter((img) => {
        const fileExtension = img.uri.split(".").pop()?.toLowerCase() || "";
        return !allowedExtensions.includes(fileExtension);
      });
      if (invalidImages.length > 0) {
        showBanner(
          "Invalid File Type",
          "All images must be in JPEG, PNG, or JPG format.",
          "warning",
          3000
        );
        return;
      }
    } else if (toolType === "Generate Reel") {
      if (reelMedia.length < 3 || reelMedia.length > 15) {
        showBanner(
          "Validation Error",
          "Please select 3-15 media files (images or videos).",
          "warning",
          3000
        );
        return;
      }
    }

    // Check if business_id is available
    if (!businessId) {
      showBanner(
        "Error",
        "Business ID not found. Please complete your business profile.",
        "error",
        3000
      );
      return;
    }

    setIsGenerating(true);
    dispatch(setActionLoader(true));

    try {
      const formData = new FormData();

      // Add business_id
      formData.append("business_id", businessId.toString());

      // API call with FormData
      // Use axios directly since we need a different baseURL than the default ApiService
      const aiToolBaseUrl = process.env.EXPO_PUBLIC_AITOOL_API_BASE_URL || "";
      const aiApiBearerToken =
        process.env.EXPO_PUBLIC_AI_API_BEARER_TOKEN || "";

      let endpoint = "";
      let response;

      if (toolType === "Generate Post") {
        // Add image for Generate Post
        if (postImage) {
          const fileExtension =
            postImage.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `post_image.${fileExtension}`;
          const mimeType =
            fileExtension === "jpg" || fileExtension === "jpeg"
              ? "image/jpeg"
              : fileExtension === "png"
              ? "image/png"
              : "image/jpeg";

          formData.append("image", {
            uri: postImage,
            type: mimeType,
            name: fileName,
          } as any);
        }
        endpoint = socialMediaEndpoints.generatePost;
      } else if (toolType === "Generate Collage") {
        // Add images for Generate Collage
        // Backend expects 'images' as array, so we append each image with the same key
        collageImages.forEach((image, index) => {
          const fileExtension =
            image.uri.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `collage_image_${index}.${fileExtension}`;
          const mimeType =
            fileExtension === "jpg" || fileExtension === "jpeg"
              ? "image/jpeg"
              : fileExtension === "png"
              ? "image/png"
              : "image/jpeg";

          formData.append("images", {
            uri: image.uri,
            type: mimeType,
            name: fileName,
          } as any);
        });
        endpoint = socialMediaEndpoints.generateCollage;
      } else if (toolType === "Generate Reel") {
        // Add media_files for Generate Reel
        // Backend expects 'media_files' as array
        reelMedia.forEach((media, index) => {
          const fileExtension =
            media.uri.split(".").pop()?.toLowerCase() || "jpg";
          let fileName = "";
          let mimeType = "";

          if (media.type === "video") {
            fileName = `reel_video_${index}.${fileExtension}`;
            mimeType =
              fileExtension === "mp4"
                ? "video/mp4"
                : fileExtension === "mov"
                ? "video/quicktime"
                : "video/mp4";
          } else {
            fileName = `reel_image_${index}.${fileExtension}`;
            mimeType =
              fileExtension === "jpg" || fileExtension === "jpeg"
                ? "image/jpeg"
                : fileExtension === "png"
                ? "image/png"
                : "image/jpeg";
          }

          formData.append("media_files", {
            uri: media.uri,
            type: mimeType,
            name: fileName,
          } as any);
        });

        // Add background_music if provided
        if (backgroundMusic) {
          const fileExtension =
            backgroundMusic.uri.split(".").pop()?.toLowerCase() || "mp3";
          const fileName =
            backgroundMusic.name || `background_music.${fileExtension}`;
          const mimeType =
            fileExtension === "mp3"
              ? "audio/mpeg"
              : fileExtension === "wav"
              ? "audio/wav"
              : fileExtension === "m4a"
              ? "audio/mp4"
              : "audio/mpeg";

          formData.append("background_music", {
            uri: backgroundMusic.uri,
            type: mimeType,
            name: fileName,
          } as any);
        }

        endpoint = socialMediaEndpoints.generateReel;
      }

      // Create axios instance with AI tool baseURL
      const aiToolClient = axios.create({
        baseURL: aiToolBaseUrl,
        timeout: 180000, // 3 min
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${aiApiBearerToken}`,
        },
      });

      const axiosResponse = await aiToolClient.post(endpoint, formData);
      response = axiosResponse.data;

      // Save the result
      setGeneratedResult(response);
      setResultModalVisible(true);
    } catch (error: any) {
      console.error(`Error generating ${toolType.toLowerCase()}:`, error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        `Failed to generate ${toolType.toLowerCase()}. Please try again.`;
      showBanner("Error", errorMessage, "error", 4000);
    } finally {
      setIsGenerating(false);
      dispatch(setActionLoader(false));
    }
  };

  const openImagePicker = useCallback(() => {
    setImagePickerVisible(true);
  }, []);

  const openMediaPicker = useCallback(() => {
    setMediaPickerVisible(true);
  }, []);

  const openAudioPicker = useCallback(() => {
    setAudioPickerVisible(true);
  }, []);

  const renderPostContent = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Image</Text>
      <TouchableOpacity
        style={styles.fileInput}
        onPress={openImagePicker}
        activeOpacity={0.7}
      >
        <Text style={styles.fileInputText}>
          {postImage ? "Image Selected" : "Choose File"}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={moderateWidthScale(24)}
          color={theme.text}
        />
      </TouchableOpacity>
      {postImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: postImage }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePostImage}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="delete"
              size={moderateWidthScale(20)}
              color={theme.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderCollageContent = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        Images (2-6 images) <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        style={styles.fileInput}
        onPress={openImagePicker}
        activeOpacity={0.7}
      >
        <Text style={styles.fileInputText}>
          {collageImages.length > 0
            ? `${collageImages.length} image(s) selected`
            : "Choose Files"}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={moderateWidthScale(24)}
          color={theme.text}
        />
      </TouchableOpacity>
      {collageImages.length > 0 && (
        <View style={styles.mediaGrid}>
          {collageImages.map((image) => (
            <View key={image.id} style={styles.mediaItem}>
              <Image
                source={{ uri: image.uri }}
                style={styles.mediaThumbnail}
              />
              <TouchableOpacity
                style={styles.deleteButtonSmall}
                onPress={() => handleDeleteImage(image.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="close"
                  size={moderateWidthScale(16)}
                  color={theme.white}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {collageImages.length > 0 && (
        <Text style={styles.hintText}>
          {collageImages.length}/6 images selected
        </Text>
      )}
    </View>
  );

  const renderReelContent = () => (
    <>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Media Files (3-15 images/videos){" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.fileInput}
          onPress={openMediaPicker}
          activeOpacity={0.7}
        >
          <Text style={styles.fileInputText}>
            {reelMedia.length > 0
              ? `${reelMedia.length} file(s) selected`
              : "Choose Files"}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={moderateWidthScale(24)}
            color={theme.text}
          />
        </TouchableOpacity>
        {reelMedia.length > 0 && (
          <View style={styles.mediaGrid}>
            {reelMedia.map((media) => (
              <View key={media.id} style={styles.mediaItem}>
                {media.type === "image" ? (
                  <Image
                    source={{ uri: media.uri }}
                    style={styles.mediaThumbnail}
                  />
                ) : (
                  <View style={styles.videoThumbnailContainer}>
                    {media.thumbnailUri ? (
                      <Image
                        source={{ uri: media.thumbnailUri }}
                        style={styles.mediaThumbnail}
                      />
                    ) : (
                      <View style={styles.videoThumbnail}>
                        <MaterialIcons
                          name="videocam"
                          size={moderateWidthScale(24)}
                          color={theme.white}
                        />
                      </View>
                    )}
                    <View style={styles.videoPlayIcon}>
                      <MaterialIcons
                        name="videocam"
                        size={moderateWidthScale(32)}
                        color={theme.white}
                      />
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.deleteButtonSmall}
                  onPress={() => handleDeleteImage(media.id)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="close"
                    size={moderateWidthScale(16)}
                    color={theme.white}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {reelMedia.length > 0 && (
          <Text style={styles.hintText}>
            {reelMedia.length}/15 files selected. The order of media files in
            the generated reel will be the same as the order you upload them.
          </Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Background Music (MP3, WAV, M4A)</Text>
        <TouchableOpacity
          style={styles.fileInput}
          onPress={openAudioPicker}
          activeOpacity={0.7}
        >
          <Text style={styles.fileInputText}>
            {backgroundMusic ? backgroundMusic.name : "Choose File"}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={moderateWidthScale(24)}
            color={theme.text}
          />
        </TouchableOpacity>
        {backgroundMusic && (
          <View style={styles.audioFileContainer}>
            <MaterialIcons
              name="audiotrack"
              size={moderateWidthScale(20)}
              color={theme.darkGreen}
            />
            <Text style={styles.audioFileName} numberOfLines={1}>
              {backgroundMusic.name}
            </Text>
            <TouchableOpacity
              style={styles.deleteButtonSmall}
              onPress={handleDeleteAudio}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="close"
                size={moderateWidthScale(16)}
                color={theme.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <StackHeader title={headerTitle} />

      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {toolType === "Generate Post" && renderPostContent()}
          {toolType === "Generate Collage" && renderCollageContent()}
          {toolType === "Generate Reel" && renderReelContent()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          {/* Show previous result button if result exists */}
          {generatedResult && (
            <TouchableOpacity
              style={{
                backgroundColor: theme.orangeBrown30,
                borderRadius: moderateWidthScale(8),
                padding: moderateWidthScale(16),
                marginBottom: moderateHeightScale(16),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => setResultModalVisible(true)}
              activeOpacity={0.7}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <MaterialIcons
                  name="visibility"
                  size={moderateWidthScale(20)}
                  color={theme.darkGreen}
                  style={{ marginRight: moderateWidthScale(12) }}
                />
                <Text
                  style={{
                    fontSize: fontSize.size14,
                    fontFamily: fonts.fontMedium,
                    color: theme.darkGreen,
                    flex: 1,
                  }}
                >
                  View Previous Result
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateWidthScale(20)}
                color={theme.darkGreen}
              />
            </TouchableOpacity>
          )}
          <Button
            title={`Generate ${toolType.replace("Generate ", "")}`}
            onPress={handleGenerate}
            disabled={isGenerating}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Image Picker Modal for Post and Collage */}
      <ModalizeBottomSheet
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        title="Select Photo"
      >
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleSelectFromGallery}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="photo-library"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="camera-alt"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Camera</Text>
        </TouchableOpacity>
      </ModalizeBottomSheet>

      {/* Media Picker Modal for Reel */}
      <ModalizeBottomSheet
        visible={mediaPickerVisible}
        onClose={() => setMediaPickerVisible(false)}
        title="Select Media"
      >
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleSelectFromGallery}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="photo-library"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="camera-alt"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>From Camera</Text>
        </TouchableOpacity>
      </ModalizeBottomSheet>

      {/* Audio Picker Modal */}
      <ModalizeBottomSheet
        visible={audioPickerVisible}
        onClose={() => setAudioPickerVisible(false)}
        title="Select Audio File"
      >
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleSelectAudio}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="audiotrack"
            size={moderateWidthScale(24)}
            color={theme.darkGreen}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Choose Audio File</Text>
        </TouchableOpacity>
      </ModalizeBottomSheet>

      {/* Result Modal */}
      <GeneratePostResultModal
        visible={resultModalVisible}
        onClose={() => setResultModalVisible(false)}
        result={generatedResult}
        toolType={toolType}
      />
    </SafeAreaView>
  );
}
