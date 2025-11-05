import { StatusBar } from "react-native";
import { useTheme } from "../hooks/hooks";
import { Theme } from "../theme/colors";

export function ThemedStatusBar() {
  const { colors, theme } = useTheme();

  return (
    <StatusBar
      animated
      translucent
      backgroundColor={(colors as Theme).background}
      barStyle={
        theme === "dark" || theme === "blue" ? "light-content" : "dark-content"
      }
    />
  );
}
