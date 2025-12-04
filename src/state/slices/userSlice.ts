import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "business" | "client" | "staff" | null;

export interface BusinessStatus {
  onboarding_completed: boolean;
  current_step: number | null;
  next_step: number | null;
  stripe_onboarding_status: string;
  stripe_onboarding_link: string | null;
  has_subscription: boolean;
  subscription_status: string;
}

export interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userRole: UserRole;
  businessStatus: BusinessStatus | null;
  isOnline: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  userRole: null,
  businessStatus: null,
  isOnline: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        email?: string;
        accessToken: string;
        refreshToken?: string;
        userRole?: UserRole;
      }>
    ) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email || null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;
      state.userRole = action.payload.userRole || null;
    },
    setUserRole(state, action: PayloadAction<UserRole>) {
      state.userRole = action.payload;
    },
    setTokens(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;
    },
    setBusinessStatus(state, action: PayloadAction<BusinessStatus>) {
      state.businessStatus = action.payload;
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    clearUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
      state.businessStatus = initialState.businessStatus;
      state.isOnline = initialState.isOnline;
    },
    resetUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
      state.businessStatus = initialState.businessStatus;
      state.isOnline = initialState.isOnline;
    },
  },
});

export const { setUser, setTokens, setUserRole, setBusinessStatus, setOnlineStatus, clearUser, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
