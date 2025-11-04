import { StatusBar } from "react-native";
import { useTheme } from "../hooks/hooks";

export function ThemedStatusBar() {
  const { colors, theme } = useTheme();

  return (
    <StatusBar
      animated
      translucent
      backgroundColor={colors.background}
      barStyle={
        theme === "dark" || theme === "blue" ? "light-content" : "dark-content"
      }
    />
  );
}
