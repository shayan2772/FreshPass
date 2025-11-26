import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "business" | "client" | "staff" | null;

export interface GeneralState {
  theme: "light" | "dark" | "blue";
  themeType: "default" | "system";
  language: string;
  role: UserRole; // Selected user role: business, client, or staff
  registerEmail: string | null; // Saved email after registration
  savedPassword: string | null; // Saved password if user checked "save password"
}

const initialState: GeneralState = {
  theme: "light",
  themeType: "default",
  language: "en",
  role: "business",
  registerEmail: null,
  savedPassword: null,
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
    setRegisterEmail(state, action: PayloadAction<string>) {
      state.registerEmail = action.payload;
    },
    setSavedPassword(state, action: PayloadAction<string | null>) {
      state.savedPassword = action.payload;
    },
    resetGeneral(state) {
      state.role = initialState.role;
      // state.theme = initialState.theme;
      // state.themeType = initialState.themeType;
      // state.language = initialState.language;
      // state.registerEmail = initialState.registerEmail;
      // state.savedPassword = initialState.savedPassword;
    },
  },
});

export const { setTheme, setThemeType, setLanguage, setRole, setRegisterEmail, setSavedPassword, resetGeneral } =
  generalSlice.actions;
export default generalSlice.reducer;
