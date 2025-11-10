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

// ✅ persist config
const persistConfig = {
  key: "root",
  storage: SecureStorageAdapter,
  whitelist: ["general", "completeProfile"], // which slices to persist
  keyPrefix: "",
};

// ✅ combine reducers
const rootReducer = combineReducers({
  general: generalReducer,
  completeProfile: completeProfileReducer,
});

// ✅ create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ store config
export const store = configureStore({
  reducer: persistedReducer,
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
