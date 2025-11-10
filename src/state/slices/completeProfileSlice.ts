import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const TOTAL_STEPS = 11 as const;

export interface CompleteProfileState {
  currentStep: number;
  totalSteps: number;
  searchTerm: string;
  businessCategory: string | null;
  businessName: string;
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  appointmentVolume: string | null;
  addressSearch: string;
  selectedAddress: string | null;
  streetAddress: string;
  area: string;
  zipCode: string;
  useCurrentLocation: boolean;
}

const initialState: CompleteProfileState = {
  currentStep: 1,
  totalSteps: TOTAL_STEPS,
  searchTerm: "",
  businessCategory: null,
  businessName: "",
  fullName: "",
  countryCode: "+1",
  phoneNumber: "",
  appointmentVolume: null,
  addressSearch: "",
  selectedAddress: null,
  streetAddress: "",
  area: "",
  zipCode: "",
  useCurrentLocation: false,
};

const completeProfileSlice = createSlice({
  name: "completeProfile",
  initialState,
  reducers: {
    resetCompleteProfile: () => initialState,
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    goToNextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    goToPreviousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setBusinessCategory: (state, action: PayloadAction<string | null>) => {
      state.businessCategory = action.payload;
    },
    setBusinessName: (state, action: PayloadAction<string>) => {
      state.businessName = action.payload;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setCountryCode: (state, action: PayloadAction<string>) => {
      state.countryCode = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setAppointmentVolume: (state, action: PayloadAction<string | null>) => {
      state.appointmentVolume = action.payload;
    },
    setAddressSearch: (state, action: PayloadAction<string>) => {
      state.addressSearch = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<string | null>) => {
      state.selectedAddress = action.payload;
    },
    setStreetAddress: (state, action: PayloadAction<string>) => {
      state.streetAddress = action.payload;
    },
    setArea: (state, action: PayloadAction<string>) => {
      state.area = action.payload;
    },
    setZipCode: (state, action: PayloadAction<string>) => {
      state.zipCode = action.payload;
    },
    setUseCurrentLocation: (state, action: PayloadAction<boolean>) => {
      state.useCurrentLocation = action.payload;
    },
  },
});

export const {
  resetCompleteProfile,
  setCurrentStep,
  goToNextStep,
  goToPreviousStep,
  setSearchTerm,
  setBusinessCategory,
  setBusinessName,
  setFullName,
  setCountryCode,
  setPhoneNumber,
  setAppointmentVolume,
  setAddressSearch,
  setSelectedAddress,
  setStreetAddress,
  setArea,
  setZipCode,
  setUseCurrentLocation,
} = completeProfileSlice.actions;

export default completeProfileSlice.reducer;


