export const themes = {
  light: {
    background: "#FEFAE0",
    text: "#111111",
    primary: "#365AB8",
    secondary: "#F3F4F6",
    borderLine: "black",
    icon: "black",
    selectedDropDownText: "#FFFFFF",
    green:"#91E630",
    darkGreen: "#283618",
    lightGreen: "rgba(40, 54, 24, 0.7)",
    lightGreen2:"rgba(40, 54, 24, 0.3)",
    borderLight:"#2836181A",
    darkGreen15: "rgba(40, 54, 24, 0.15)",
    orangeBrown: "#DDA15E",
    lightBeige: "rgba(40, 54, 24, 0.05)",
    white: "#FFFFFF",
    black: "#000000",
    buttonBack: "#606C38",
    buttonText: "#FFFFFF",
    link:"#F7856B",
  },
  dark: {},
  blue: {},
  
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;
