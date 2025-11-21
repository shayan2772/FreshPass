import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "business" | "client" | "staff" | null;

export interface GeneralState {
  theme: "light" | "dark" | "blue";
  themeType: "default" | "system";
  language: string;
  role: UserRole; // Selected user role: business, client, or staff
}

const initialState: GeneralState = {
  theme: "light",
  themeType: "default",
  language: "en",
  role: null,
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
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    },
    resetGeneral(state) {
      state.theme = initialState.theme;
      state.themeType = initialState.themeType;
      state.language = initialState.language;
      state.role = initialState.role;
    },
  },
});

export const { setTheme, setThemeType, setLanguage, setRole, resetGeneral } =
  generalSlice.actions;
export default generalSlice.reducer;
