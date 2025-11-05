export const themes = {
  light: {
    background: "#FEFAE0",
    text: "#111111",
    primary: "#365AB8",
    secondary: "#F3F4F6",
    borderLine: "black",
    icon: "black",
    selectedDropDownText: "#FFFFFF",
    darkGreen: "#283618",
    lightGreen: "rgba(40, 54, 24, 0.7)",
    lightGreen2:"rgba(40, 54, 24, 0.3)",
    darkGreen15: "rgba(40, 54, 24, 0.15)",
    orangeBrown: "#DDA15E",
    lightBeige: "#28361826",
    white: "#FFFFFF",
    buttonBack: "#606C38",
    buttonText: "#FFFFFF",
    link:"#F7856B"
  },
  dark: {},
  blue: {},
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;
