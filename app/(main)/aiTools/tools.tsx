import React, { useMemo, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  moderateWidthScale,
} from "@/src/theme/dimensions";
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

interface MediaFile {
  id: string;
  uri: string;
  type: "image" | "video";
}

interface AudioFile {
  id: string;
  uri: string;
  name: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
 
export default function Tools() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
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
            Alert.alert(
              "Limit Exceeded",
              "You can select maximum 6 images. Only first 6 will be added."
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
            .map((asset) => ({
              id: generateId(),
              uri: asset.uri,
              type: asset.type === "video" ? "video" : "image",
            }));

          const totalMedia = reelMedia.length + newMedia.length;
          if (totalMedia > 15) {
            Alert.alert(
              "Limit Exceeded",
              "You can select maximum 15 media files. Only first 15 will be added."
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
      Alert.alert("Error", "Failed to select media. Please try again.");
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
            Alert.alert("Limit Exceeded", "You can select maximum 6 images.");
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
            Alert.alert(
              "Limit Exceeded",
              "You can select maximum 15 media files."
            );
            return;
          }
          setReelMedia([
            ...reelMedia,
            {
              id: generateId(),
              uri: asset.uri,
              type: asset.type === "video" ? "video" : "image",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
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
          Alert.alert(
            "Invalid File Type",
            "Please select an audio file in MP3, WAV, or M4A format."
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
      Alert.alert(
        "Error",
        "Failed to select audio file. Please try again."
      );
    }
  }, []);

  const handleGenerate = useCallback(() => {
    // Validation
    if (toolType === "Generate Post") {
      if (!postImage) {
        Alert.alert("Validation Error", "Please select an image.");
        return;
      }
    } else if (toolType === "Generate Collage") {
      if (collageImages.length < 2) {
        Alert.alert(
          "Validation Error",
          "Please select at least 2 images (maximum 6)."
        );
        return;
      }
    } else if (toolType === "Generate Reel") {
      if (reelMedia.length < 3 || reelMedia.length > 15) {
        Alert.alert(
          "Validation Error",
          "Please select 3-15 media files (images or videos)."
        );
        return;
      }
    }

    // TODO: API call will be added here
    console.log("Generate button pressed", {
      toolType,
      postImage,
      collageImages,
      reelMedia,
      backgroundMusic,
    });
  }, [toolType, postImage, collageImages, reelMedia, backgroundMusic]);

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
              <Image source={{ uri: image.uri }} style={styles.mediaThumbnail} />
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
          Media Files (3-15 images/videos) <Text style={styles.required}>*</Text>
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
                  <View style={styles.videoThumbnail}>
                    <MaterialIcons
                      name="videocam"
                      size={moderateWidthScale(24)}
                      color={theme.white}
                    />
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
            {backgroundMusic
              ? backgroundMusic.name
              : "Choose File"}
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
    <View style={styles.safeArea}>
      <StackHeader title={headerTitle} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {toolType === "Generate Post" && renderPostContent()}
        {toolType === "Generate Collage" && renderCollageContent()}
        {toolType === "Generate Reel" && renderReelContent()}

        <View style={styles.buttonContainer}>
          <Button
            title={`Generate ${toolType.replace("Generate ", "")}`}
            onPress={handleGenerate}
          />
        </View>
      </ScrollView>

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
    </View>
  );
}
