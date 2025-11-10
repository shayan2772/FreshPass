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
  countryIso: string;
  phonePlaceholder: string;
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
  countryIso: "US",
  phonePlaceholder: "234 123 4455",
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
        const nextStep = state.currentStep - 1;

        if (nextStep < 4) {
          state.addressSearch = "";
          state.selectedAddress = null;
          state.streetAddress = "";
          state.area = "";
          state.zipCode = "";
          state.useCurrentLocation = false;
        }

        if (nextStep < 3) {
          state.appointmentVolume = null;
        }

        if (nextStep < 2) {
          state.businessName = "";
          state.fullName = "";
          state.countryCode = "+1";
          state.phoneNumber = "";
        }

        if (nextStep < 1) {
          state.searchTerm = "";
          state.businessCategory = null;
        }

        state.currentStep = nextStep;
      } else {
        state.businessCategory = null;
        state.searchTerm = "";
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
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setCountryDetails: (
      state,
      action: PayloadAction<{
        countryCode: string;
        countryIso: string;
        phonePlaceholder?: string;
      }>
    ) => {
      state.countryCode = action.payload.countryCode;
      state.countryIso = action.payload.countryIso;
      state.phonePlaceholder =
        action.payload.phonePlaceholder ?? state.phonePlaceholder;
      state.phoneNumber = "";
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
  setCountryDetails,
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


