import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  theme: "light" | "dark" | "blue";
  themeType: "default" | "system";
  language: string;
}

const initialState: GeneralState = {
  theme: "light",
  themeType: "default",
  language: "en",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"light" | "dark" | "blue">) {
      state.theme = action.payload;
    },
    setThemeType(state, action: PayloadAction<"default" | "system">) {
      state.themeType = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    resetGeneral(state) {
      state.theme = initialState.theme;
      state.themeType = initialState.themeType;
      state.language = initialState.language;
    },
  },
});

export const { setTheme,setThemeType, setLanguage, resetGeneral } = generalSlice.actions;
export default generalSlice.reducer;
