import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "business" | "client" | "staff" | null;

export interface GeneralState {
  theme: "light" | "dark" | "blue";
  themeType: "default" | "system";
  language: string;
  registerEmail: string | null; // Saved email after registration
  savedPassword: string | null; // Saved password if user checked "save password"
  actionLoader: boolean; // Global action loader state
  toggleLoading: boolean; // Toggle loading state (not persisted)
  role: UserRole; // Selected user role
}

const initialState: GeneralState = {
  theme: "light",
  themeType: "default",
  language: "en",
  registerEmail: null,
  savedPassword: null,
  actionLoader: false,
  toggleLoading: false,
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

    setRegisterEmail(state, action: PayloadAction<string>) {
      state.registerEmail = action.payload;
    },
    setSavedPassword(state, action: PayloadAction<string | null>) {
      state.savedPassword = action.payload;
    },
    setActionLoader(state, action: PayloadAction<boolean>) {
      state.actionLoader = action.payload;
    },
    setToggleLoading(state, action: PayloadAction<boolean>) {
      state.toggleLoading = action.payload;
    },
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    },
    resetGeneral(state) {
      // state.theme = initialState.theme;
      // state.themeType = initialState.themeType;
      // state.language = initialState.language;
      // state.registerEmail = initialState.registerEmail;
      // state.savedPassword = initialState.savedPassword;
    },
  },
});

export const {
  setTheme,
  setThemeType,
  setLanguage,
  setRegisterEmail,
  setSavedPassword,
  setActionLoader,
  setToggleLoading,
  setRole,
  resetGeneral,
} = generalSlice.actions;
export default generalSlice.reducer;
