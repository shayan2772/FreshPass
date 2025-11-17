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
  phoneIsValid: boolean;
  appointmentVolume: string | null;
  addressSearch: string;
  selectedAddress: string | null;
  streetAddress: string;
  area: string;
  zipCode: string;
  useCurrentLocation: boolean;
  addressStage: "search" | "confirm" | "map";
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  teamSize: string | null;
  staffInvitationEmail: string;
  staffInvitations: Array<{ email: string; status: "sent" | "accepted" }>;
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      fromHours: number;
      fromMinutes: number;
      tillHours: number;
      tillMinutes: number;
      breaks: Array<{
        fromHours: number;
        fromMinutes: number;
        tillHours: number;
        tillMinutes: number;
      }>;
    };
  };
}

const initialState: CompleteProfileState = {
  currentStep: 1,
  // currentStep: 7,
  totalSteps: TOTAL_STEPS,
  searchTerm: "",
  businessCategory: null,
  businessName: "",
  fullName: "",
  countryCode: "+1",
  countryIso: "US",
  phonePlaceholder: "201 555 0123",
  phoneNumber: "",
  phoneIsValid: false,
  appointmentVolume: null,
  addressSearch: "",
  selectedAddress: null,
  streetAddress: "",
  area: "",
  zipCode: "",
  useCurrentLocation: false,
  addressStage: "search",
  selectedLocation: null,
  teamSize: null,
  staffInvitationEmail: "",
  staffInvitations: [],
  businessHours: {
    Sunday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Monday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Tuesday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Wednesday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Thursday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Friday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
    Saturday: {
      isOpen: false,
      fromHours: 0,
      fromMinutes: 0,
      tillHours: 0,
      tillMinutes: 0,
      breaks: [],
    },
  },
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
 
        // Clear ALL Step 4 fields when going back to step 3 or earlier
        // This ensures all address-related fields are cleared when going from step 4 to step 3
        if (nextStep <= 3) {
          state.addressSearch = "";
          state.selectedAddress = null;
          state.streetAddress = "";
          state.area = "";
          state.zipCode = "";
          state.useCurrentLocation = false;
          state.addressStage = "search";
          state.selectedLocation = null;
        }

        if (nextStep < 3) {
          state.appointmentVolume = null;
        }

        if (nextStep < 2) {
          state.businessName = "";
          state.fullName = "";
          state.countryCode = "+1";
          state.countryIso = "US";
          state.phonePlaceholder = "201 555 0123";
          state.phoneNumber = "";
          state.phoneIsValid = false;
        }

        if (nextStep < 1) {
          state.searchTerm = "";
          state.businessCategory = null;
        }

        if (nextStep < 5) {
          state.teamSize = null;
        }

        if (nextStep < 6) {
          state.staffInvitationEmail = "";
          state.staffInvitations = [];
        }

        if (nextStep < 7) {
          // Reset business hours
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          days.forEach((day) => {
            state.businessHours[day] = {
              isOpen: false,
              fromHours: 0,
              fromMinutes: 0,
              tillHours: 0,
              tillMinutes: 0,
              breaks: [],
            };
          });
        }

        state.currentStep = nextStep;
      } else {
        state.businessCategory = null;
        state.searchTerm = "";
        state.phoneNumber = "";
        state.phoneIsValid = false;
        state.countryCode = "+1";
        state.countryIso = "US";
        state.phonePlaceholder = "201 555 0123";
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
    setPhoneNumber: (
      state,
      action: PayloadAction<{ value: string; isValid: boolean }>
    ) => {
      state.phoneNumber = action.payload.value.replace(/\s+/g, "");
      state.phoneIsValid = action.payload.isValid;
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
      state.phoneIsValid = false;
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
    setAddressStage: (
      state,
      action: PayloadAction<CompleteProfileState["addressStage"]>
    ) => {
      state.addressStage = action.payload;
    },
    setSelectedLocation: (
      state,
      action: PayloadAction<CompleteProfileState["selectedLocation"]>
    ) => {
      state.selectedLocation = action.payload;
    },
    setTeamSize: (state, action: PayloadAction<string | null>) => {
      state.teamSize = action.payload;
    },
    setStaffInvitationEmail: (state, action: PayloadAction<string>) => {
      state.staffInvitationEmail = action.payload;
    },
    addStaffInvitation: (
      state,
      action: PayloadAction<{ email: string; status: "sent" | "accepted" }>
    ) => {
      // Check if invitation already exists
      const exists = state.staffInvitations.some(
        (inv) => inv.email.toLowerCase() === action.payload.email.toLowerCase()
      );
      if (!exists) {
        state.staffInvitations.push(action.payload);
      }
    },
    removeStaffInvitation: (state, action: PayloadAction<number>) => {
      state.staffInvitations.splice(action.payload, 1);
    },
    setDayAvailability: (
      state,
      action: PayloadAction<{ day: string; isOpen: boolean }>
    ) => {
      if (!state.businessHours[action.payload.day]) {
        state.businessHours[action.payload.day] = {
          isOpen: false,
          fromHours: 0,
          fromMinutes: 0,
          tillHours: 0,
          tillMinutes: 0,
          breaks: [],
        };
      }
      state.businessHours[action.payload.day].isOpen = action.payload.isOpen;
    },
    setDayHours: (
      state,
      action: PayloadAction<{
        day: string;
        fromHours: number;
        fromMinutes: number;
        tillHours: number;
        tillMinutes: number;
        breaks: Array<{
          fromHours: number;
          fromMinutes: number;
          tillHours: number;
          tillMinutes: number;
        }>;
      }>
    ) => {
      if (!state.businessHours[action.payload.day]) {
        state.businessHours[action.payload.day] = {
          isOpen: true,
          fromHours: 0,
          fromMinutes: 0,
          tillHours: 0,
          tillMinutes: 0,
          breaks: [],
        };
      }
      state.businessHours[action.payload.day].fromHours =
        action.payload.fromHours;
      state.businessHours[action.payload.day].fromMinutes =
        action.payload.fromMinutes;
      state.businessHours[action.payload.day].tillHours =
        action.payload.tillHours;
      state.businessHours[action.payload.day].tillMinutes =
        action.payload.tillMinutes;
      state.businessHours[action.payload.day].breaks = action.payload.breaks;
      // Only set isOpen to true if we're setting valid hours (not clearing)
      if (action.payload.fromHours > 0 && action.payload.tillHours > 0) {
        state.businessHours[action.payload.day].isOpen = true;
      }
    },
    setDayBreakTime: (
      state,
      action: PayloadAction<{
        day: string;
        breakIndex: number;
        fromHours: number;
        fromMinutes: number;
        tillHours: number;
        tillMinutes: number;
      }>
    ) => {
      if (!state.businessHours[action.payload.day]) {
        return;
      }
      if (
        !state.businessHours[action.payload.day].breaks[
          action.payload.breakIndex
        ]
      ) {
        state.businessHours[action.payload.day].breaks[
          action.payload.breakIndex
        ] = {
          fromHours: 0,
          fromMinutes: 0,
          tillHours: 0,
          tillMinutes: 0,
        };
      }
      state.businessHours[action.payload.day].breaks[
        action.payload.breakIndex
      ].fromHours = action.payload.fromHours;
      state.businessHours[action.payload.day].breaks[
        action.payload.breakIndex
      ].fromMinutes = action.payload.fromMinutes;
      state.businessHours[action.payload.day].breaks[
        action.payload.breakIndex
      ].tillHours = action.payload.tillHours;
      state.businessHours[action.payload.day].breaks[
        action.payload.breakIndex
      ].tillMinutes = action.payload.tillMinutes;
    },
    removeDayBreakTime: (
      state,
      action: PayloadAction<{ day: string; breakIndex: number }>
    ) => {
      if (!state.businessHours[action.payload.day]) {
        return;
      }
      state.businessHours[action.payload.day].breaks.splice(
        action.payload.breakIndex,
        1
      );
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
  setAddressStage,
  setSelectedLocation,
  setTeamSize,
  setStaffInvitationEmail,
  addStaffInvitation,
  removeStaffInvitation,
  setDayAvailability,
  setDayHours,
  setDayBreakTime,
  removeDayBreakTime,
} = completeProfileSlice.actions;

export default completeProfileSlice.reducer;


