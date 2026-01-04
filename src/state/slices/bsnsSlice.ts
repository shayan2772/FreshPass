import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  label?: string | null;
}

export interface StaffMember {
  id: number;
  name: string;
  experience: number | null;
  image: string | null;
}

export interface BusinessState {
  selectedService: Service | null;
  allServices: Service[];
  staffMembers: StaffMember[];
  businessId: string;
  selectedServices: Service[];
  selectedStaff: string; // "anyone" or staff id as string
}

const initialState: BusinessState = {
  selectedService: null,
  allServices: [],
  staffMembers: [],
  businessId: "",
  selectedServices: [],
  selectedStaff: "anyone",
};

const bsnsSlice = createSlice({
  name: "bsns",
  initialState,
  reducers: {
    setBusinessData(
      state,
      action: PayloadAction<{
        selectedService?: Service;
        allServices?: Service[];
        staffMembers?: StaffMember[];
        businessId?: string;
      }>
    ) {
      if (action.payload.selectedService !== undefined) {
        state.selectedService = action.payload.selectedService;
        // Also set it as first item in selectedServices if not already there
        if (
          !state.selectedServices.find(
            (s) => s.id === action.payload.selectedService!.id
          )
        ) {
          state.selectedServices = [action.payload.selectedService];
        }
      }
      if (action.payload.allServices !== undefined) {
        state.allServices = action.payload.allServices;
      }
      if (action.payload.staffMembers !== undefined) {
        state.staffMembers = action.payload.staffMembers;
      }
      if (action.payload.businessId !== undefined) {
        state.businessId = action.payload.businessId;
      }
    },
    setSelectedServices(state, action: PayloadAction<Service[]>) {
      state.selectedServices = action.payload;
    },
    setSelectedStaff(state, action: PayloadAction<string>) {
      state.selectedStaff = action.payload;
    },
    addService(state, action: PayloadAction<Service>) {
      const service = action.payload;
      if (!state.selectedServices.find((s) => s.id === service.id)) {
        state.selectedServices.push(service);
      }
    },
    removeService(state, action: PayloadAction<number>) {
      state.selectedServices = state.selectedServices.filter(
        (s) => s.id !== action.payload
      );
    },
    clearBusinessData(state) {
      state.selectedService = null;
      state.selectedServices = [];
      state.selectedStaff = "anyone";
      state.allServices = [];
      state.staffMembers = [];
      state.businessId = "";
    },
    resetBusinessState(state) {
      return initialState;
    },
  },
});

export const {
  setBusinessData,
  setSelectedServices,
  setSelectedStaff,
  addService,
  removeService,
  clearBusinessData,
  resetBusinessState,
} = bsnsSlice.actions;
export default bsnsSlice.reducer;

