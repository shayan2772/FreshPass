import { SecureStorageService } from "@/src/services/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import generalReducer from "./slices/generalSlice";
import completeProfileReducer from "./slices/completeProfileSlice";

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
  whitelist: ["theme", "themeType", "language"], // Only persist these fields
};

// ✅ Persist the general reducer with field filtering
const persistedGeneralReducer = persistReducer(generalPersistConfig, generalReducer);

// ✅ combine reducers
const rootReducer = combineReducers({
  general: persistedGeneralReducer, // Already persisted with field filtering
  completeProfile: completeProfileReducer, // Not persisted
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
