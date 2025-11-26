/**
 * Logout Service
 * Handles complete logout including clearing tokens and resetting all Redux slices
 */
import { ApiService } from "./api";
import { store } from "@/src/state/store";
import { resetGeneral } from "@/src/state/slices/generalSlice";
import { resetCompleteProfile } from "@/src/state/slices/completeProfileSlice";
import { resetUser } from "@/src/state/slices/userSlice";

/**
 * Complete logout - clears tokens and resets all Redux slices
 */
export const performLogout = async () => {
  try {
    // Clear tokens from API service
    await ApiService.clearTokens();

    // Reset all Redux slices
    store.dispatch(resetGeneral());
    store.dispatch(resetCompleteProfile());
    store.dispatch(resetUser());

    console.log("🚪 Complete logout successful - all data cleared");
  } catch (error) {
    console.error("❌ Failed to perform logout:", error);
    throw error;
  }
};

