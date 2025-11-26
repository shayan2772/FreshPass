import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "./generalSlice";

export interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userRole: UserRole;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  userRole: null,
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
    clearUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
    },
    resetUser(state) {
      state.id = initialState.id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.userRole = initialState.userRole;
    },
  },
});

export const { setUser, setTokens, setUserRole, clearUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

