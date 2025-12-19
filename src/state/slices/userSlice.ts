import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "business" | "client" | "staff" | null;

export interface BusinessStatus {
  onboarding_completed: boolean;
  current_step: number | null;
  next_step: number | null;
  business_category: {
    id: number;
    name: string;
  } | null;
  stripe_onboarding_status: string;
  stripe_onboarding_link: string | null;
  has_subscription: boolean;
  subscription_status: string;
  active: boolean;
  business_id?: number;
  business_name?: string;
}

export interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  email_notifications: boolean | null;
  profile_image_url: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userRole: UserRole;
  unreadCount: number;
  businessStatus: BusinessStatus | null;
  // Business status loading/error states (NOT persisted)
  businessStatusLoading: boolean;
  businessStatusError: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  phone: null,
  country_code: null,
  email_notifications: null,
  profile_image_url: null,
  accessToken: null,
  refreshToken: null,
  userRole: null,
  businessStatus: null,
  unreadCount: 0,
  businessStatusLoading: false,
  businessStatusError: false,
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
      state.businessStatusError = false;
    },
    setBusinessStatusLoading(state, action: PayloadAction<boolean>) {
      state.businessStatusLoading = action.payload;
    },
    setBusinessStatusError(state, action: PayloadAction<boolean>) {
      state.businessStatusError = action.payload;
    },
    setUserDetails(
      state,
      action: PayloadAction<{
        name?: string | null;
        email?: string | null;
        phone?: string | null;
        country_code?: string | null;
        email_notifications?: boolean | null;
        profile_image_url?: string | null;
      }>
    ) {
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      if (action.payload.phone !== undefined) {
        state.phone = action.payload.phone;
      }
      if (action.payload.country_code !== undefined) {
        state.country_code = action.payload.country_code;
      }
      if (action.payload.email_notifications !== undefined) {
        state.email_notifications = action.payload.email_notifications;
      }
      if (action.payload.profile_image_url !== undefined) {
        state.profile_image_url = action.payload.profile_image_url;
      }
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    clearUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.phone = initialState.phone;
      state.country_code = initialState.country_code;
      state.email_notifications = initialState.email_notifications;
      state.profile_image_url = initialState.profile_image_url;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
      state.businessStatus = initialState.businessStatus;
      state.unreadCount = initialState.unreadCount;
      state.businessStatusLoading = initialState.businessStatusLoading;
      state.businessStatusError = initialState.businessStatusError;
    },
    resetUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.phone = initialState.phone;
      state.country_code = initialState.country_code;
      state.email_notifications = initialState.email_notifications;
      state.profile_image_url = initialState.profile_image_url;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
      state.businessStatus = initialState.businessStatus;
      state.unreadCount = initialState.unreadCount;
      state.businessStatusLoading = initialState.businessStatusLoading;
      state.businessStatusError = initialState.businessStatusError;
    },
  },
});

export const {
  setUser,
  setTokens,
  setUserRole,
  setBusinessStatus,
  setBusinessStatusLoading,
  setBusinessStatusError,
  setUserDetails,
  setUnreadCount,
  clearUser,
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
