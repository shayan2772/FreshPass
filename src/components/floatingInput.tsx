import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
  widthScale,
} from "@/src/theme/dimensions";
import { CloseIcon } from "@/assets/icons";

type RightAccessoryRenderer = (params: { isFocused: boolean }) => ReactNode;

interface FloatingInputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  renderRightAccessory?: RightAccessoryRenderer;
  floatOnFocus?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: moderateWidthScale(8),
      borderWidth: 1,
      borderColor: theme.lightGreen2,
      backgroundColor: theme.white,
      paddingHorizontal: moderateWidthScale(12),
    },
    containerFocused: {
      // borderColor: theme.darkGreen,
    },
    label: {
      position: "absolute",
      left: moderateWidthScale(13),
      color: theme.lightGreen,
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size11,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    input: {
      flex: 1,
      paddingVertical: 0,
      textAlignVertical: "center",
      fontSize: fontSize.size15,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      height: heightScale(22),
      includeFontPadding: false,
    },
    clearButton: {},
    accessoryContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
  });

const FloatingInput = forwardRef<TextInput, FloatingInputProps>(
  (
    {
      label,
      value,
      containerStyle,
      renderRightAccessory,
      floatOnFocus = false,
      placeholderTextColor,
      showClearButton = true,
      onClear,
      onFocus,
      onBlur,
      onChangeText,
      ...rest
    },
    ref
  ) => {
    const { colors } = useTheme();
    const theme = colors as Theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(value && value.toString().length > 0);
    const labelAnimation = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

    const shouldShowLabel = hasValue || (floatOnFocus && isFocused);

    useEffect(() => {
      Animated.timing(labelAnimation, {
        toValue: shouldShowLabel ? 1 : 0,
        duration: 140,
        useNativeDriver: false,
      }).start();
    }, [labelAnimation, shouldShowLabel]);

    const handleFocus = useCallback(
      (event: any) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: any) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
      } else if (onChangeText) {
        onChangeText("");
      }
    }, [onClear, onChangeText]);

    const labelAnimatedStyle = {
      top: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateHeightScale(15), moderateHeightScale(4)],
      }),
      fontSize: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [fontSize.size15, fontSize.size11],
      }),
      opacity: labelAnimation,
    };

    const accessoryContent = useMemo(() => {
      if (!renderRightAccessory) {
        return null;
      }
      return renderRightAccessory({ isFocused });
    }, [renderRightAccessory, isFocused]);

    const showClear = showClearButton && hasValue;

    const containerAnimatedStyle = {
      paddingTop: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateHeightScale(15), moderateHeightScale(18)],
      }),
      paddingBottom: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateHeightScale(15), moderateHeightScale(12)],
      }),
    };

    return (
      <Animated.View
        style={[
          styles.container,
          containerAnimatedStyle,
          (isFocused || hasValue) && styles.containerFocused,
          containerStyle,
        ]}
      >
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
        </Animated.Text>
        <View style={styles.inputRow}>
          {/*
            TextInput must remain first for screen readers, so accessory content is computed after.
          */}
          <TextInput
            ref={ref}
            style={styles.input}
            value={value}
            placeholderTextColor={placeholderTextColor ?? theme.lightGreen2}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            {...rest}
          />
          {showClear && (
            <Pressable
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={moderateWidthScale(8)}
            >
              <CloseIcon color={theme.darkGreen} />
            </Pressable>
          )}
          {accessoryContent ? (
            <View style={styles.accessoryContainer}>{accessoryContent}</View>
          ) : null}
        </View>
      </Animated.View>
    );
  }
);

export default FloatingInput;
