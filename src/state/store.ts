import { SecureStorageService } from "@/src/services/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import generalReducer from "./slices/generalSlice";
import completeProfileReducer from "./slices/completeProfileSlice";
import userReducer from "./slices/userSlice";

// ✅ Custom SecureStore adapter for redux-persist
const SecureStorageAdapter = {
  setItem: (key: string, value: string) => SecureStorageService.setItem(key, value),
  getItem: (key: string) => SecureStorageService.getItem(key),
  removeItem: (key: string) => SecureStorageService.removeItem(key),
};

// ✅ Nested persist config for general slice - only persist specific fields
// This approach is more reliable than using transforms at root level
const generalPersistConfig = {
  key: "general",
  storage: SecureStorageAdapter,
  whitelist: ["theme", "themeType", "language", "savedPassword","registerEmail"], // Only persist these fields
};

// ✅ Nested persist config for user slice - only persist name, id, email, tokens, and userRole
const userPersistConfig = {
  key: "user",
  storage: SecureStorageAdapter,
  whitelist: ["id", "name", "email", "accessToken", "refreshToken", "userRole"], // Only persist these fields
};

// ✅ Persist the general reducer with field filtering
const persistedGeneralReducer = persistReducer(generalPersistConfig, generalReducer);

// ✅ Persist the user reducer with field filtering
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// ✅ combine reducers
const rootReducer = combineReducers({
  general: persistedGeneralReducer, // Already persisted with field filtering
  completeProfile: completeProfileReducer, // Not persisted
  user: persistedUserReducer, // Persisted with field filtering (id, name, token)
});

// ✅ No root-level persistence needed - general is already persisted with nested config
// Just use rootReducer directly since nested persist handles it

// ✅ store config
export const store = configureStore({
  reducer: rootReducer, // Use rootReducer directly - general is already persisted via nested persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// ✅ types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
