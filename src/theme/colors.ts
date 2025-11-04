export const themes = {
  light: {
    background: "#FFFFFF",
    text: "#111111",
    primary: "#365AB8",
    secondary: "#F3F4F6",
    borderLine: "black",
    icon: "black",
    selectedDropDownText:"#FFFFFF"
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#4F8EF7",
    secondary: "#1E1E1E",
    borderLine: "white",
    icon: "white",
     selectedDropDownText:"#FFFFFF"
  },
  blue: {
    background: "#001F3F",
    text: "#FFFFFF",
    primary: "#1E90FF",
    secondary: "#003366",
    borderLine: "white",
    icon: "white",
     selectedDropDownText:"#FFFFFF"
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;
