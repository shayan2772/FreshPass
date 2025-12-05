import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  setBusinessStatus,
  setBusinessStatusLoading,
  setBusinessStatusError,
} from "../slices/userSlice";
import { ApiService } from "@/src/services/api";
import { businessEndpoints } from "@/src/services/endpoints";
import { BusinessStatus } from "../slices/userSlice";

interface FetchBusinessStatusOptions {
  showError?: boolean;
}

export const fetchBusinessStatus = createAsyncThunk<
  BusinessStatus | null,
  FetchBusinessStatusOptions | undefined,
  { dispatch: AppDispatch; state: RootState }
>(
  "business/fetchStatus",
  async (options, { dispatch, rejectWithValue }) => {
    const { showError = true } = options || {};

    dispatch(setBusinessStatusLoading(true));
    dispatch(setBusinessStatusError(false));

    try {
      const response = await ApiService.get<{
        success: boolean;
        message: string;
        data: BusinessStatus;
      }>(businessEndpoints.status);

      if (response.success && response.data) {
        dispatch(setBusinessStatus(response.data));
        dispatch(setBusinessStatusError(false));
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to fetch business status:", error);
      dispatch(setBusinessStatusError(true));
      dispatch(setBusinessStatusLoading(false));
      
      if (showError) {
        // Error will be handled by the component using the thunk
        return rejectWithValue(error.message || "Failed to fetch business status");
      }
      throw error;
    } finally {
      dispatch(setBusinessStatusLoading(false));
    }
  }
);

