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
        // Ensure active field exists, default to false if not provided
        const businessStatusData = {
          ...response.data,
          active: response.data.active ?? false,
        };
        dispatch(setBusinessStatus(businessStatusData));
        dispatch(setBusinessStatusError(false));
        return businessStatusData;
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

export const updateBusinessActiveStatus = createAsyncThunk<
  boolean,
  { active: boolean },
  { dispatch: AppDispatch; state: RootState }
>(
  "business/updateActiveStatus",
  async ({ active }, { dispatch, rejectWithValue, getState }) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data: {
          id: number;
          updated_at: string;
          active: boolean;
        };
      }>(businessEndpoints.profile, {
        active,
      });

      if (response.success && response.data) {
        // Only update active field in existing businessStatus, keep rest same
        const currentBusinessStatus = getState().user.businessStatus;
        if (currentBusinessStatus) {
          dispatch(
            setBusinessStatus({
              ...currentBusinessStatus,
              active: response.data.active ?? false,
            })
          );
        }
        return response.data.active ?? false;
      }
      return rejectWithValue("Failed to update active status");
    } catch (error: any) {
      console.error("Failed to update business active status:", error);
      // Pass through isNoInternet flag so component can handle it differently
      return rejectWithValue({
        message: error.message || "Failed to update active status",
        isNoInternet: error?.isNoInternet || false,
      });
    }
  }
);

