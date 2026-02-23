import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  Business,
  Service,
  TimeSlot,
  CustomerCreate,
  BookingStep,
  Appointment,
} from '../types';
import { isAdditionalService } from '../types';
import {
  businessApi,
  servicesApi,
  availabilityApi,
  bookingApi,
  convertApiSlotsToTimeSlots,
} from './api';
import { useMockData, mockBusiness, mockServices, generateMockTimeSlots } from './mockData';

const BUSINESS_SLUG = import.meta.env.VITE_BUSINESS_SLUG || 'lavadero-lesan';

// State Types
interface BookingState {
  // Business data
  business: Business | null;
  services: Service[];
  mainServices: Service[];
  additionalServices: Service[];
  
  // Calendar state
  selectedDate: Date;
  availableSlots: TimeSlot[];
  
  // Booking flow
  currentStep: BookingStep;
  selectedSlot: TimeSlot | null;
  selectedService: Service | null;
  selectedExtras: Service[];
  customerInfo: CustomerCreate | null;
  notes: string;
  
  // Result
  confirmedAppointment: Appointment | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
}

// Action Types
type BookingAction =
  | { type: 'SET_BUSINESS'; payload: Business }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_AVAILABLE_SLOTS'; payload: TimeSlot[] }
  | { type: 'SET_STEP'; payload: BookingStep }
  | { type: 'SELECT_SLOT'; payload: TimeSlot }
  | { type: 'SELECT_SERVICE'; payload: Service }
  | { type: 'TOGGLE_EXTRA'; payload: Service }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerCreate }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_CONFIRMED_APPOINTMENT'; payload: Appointment }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_BOOKING' };

// Initial State
const initialState: BookingState = {
  business: null,
  services: [],
  mainServices: [],
  additionalServices: [],
  selectedDate: new Date(),
  availableSlots: [],
  currentStep: 'calendar',
  selectedSlot: null,
  selectedService: null,
  selectedExtras: [],
  customerInfo: null,
  notes: '',
  confirmedAppointment: null,
  isLoading: false,
  error: null,
};

// Reducer
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_BUSINESS':
      return { ...state, business: action.payload };
    case 'SET_SERVICES': {
      const services = action.payload;
      const mainServices = services.filter(s => !isAdditionalService(s));
      const additionalServices = services.filter(s => isAdditionalService(s));
      return { ...state, services, mainServices, additionalServices };
    }
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload, availableSlots: [] };
    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SELECT_SLOT':
      return { ...state, selectedSlot: action.payload };
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'TOGGLE_EXTRA': {
      const exists = state.selectedExtras.find(e => e.id === action.payload.id);
      const newExtras = exists
        ? state.selectedExtras.filter(e => e.id !== action.payload.id)
        : [...state.selectedExtras, action.payload];
      return { ...state, selectedExtras: newExtras };
    }
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_CONFIRMED_APPOINTMENT':
      return { ...state, confirmedAppointment: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_BOOKING':
      return {
        ...initialState,
        business: state.business,
        services: state.services,
        mainServices: state.mainServices,
        additionalServices: state.additionalServices,
        selectedDate: state.selectedDate,
        availableSlots: state.availableSlots,
      };
    default:
      return state;
  }
}

// Context Types
interface BookingContextType {
  state: BookingState;
  loadBusinessData: () => Promise<void>;
  setDate: (date: Date) => void;
  loadSlotsForDate: (date: Date, serviceId?: string) => Promise<void>;
  selectSlot: (slot: TimeSlot) => void;
  selectService: (service: Service) => void;
  toggleExtra: (service: Service) => void;
  setCustomerInfo: (info: CustomerCreate) => void;
  setNotes: (notes: string) => void;
  goToStep: (step: BookingStep) => void;
  goBack: () => void;
  confirmBooking: () => Promise<boolean>;
  resetBooking: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load business and services data
  const loadBusinessData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      if (useMockData()) {
        dispatch({ type: 'SET_BUSINESS', payload: mockBusiness });
        dispatch({ type: 'SET_SERVICES', payload: mockServices });
      } else {
        const businessResponse = await businessApi.getBySlug(BUSINESS_SLUG);
        if (!businessResponse.success || !businessResponse.data) {
          throw new Error(businessResponse.error || 'Error al cargar el negocio');
        }
        dispatch({ type: 'SET_BUSINESS', payload: businessResponse.data });

        const servicesResponse = await servicesApi.getAll(businessResponse.data.id);
        if (!servicesResponse.success || !servicesResponse.data) {
          throw new Error(servicesResponse.error || 'Error al cargar los servicios');
        }
        dispatch({ type: 'SET_SERVICES', payload: servicesResponse.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadBusinessData();
  }, [loadBusinessData]);

  // Set selected date
  const setDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  // Load available slots for a date
  const loadSlotsForDate = useCallback(async (date: Date, serviceId?: string) => {
    if (!state.business) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (useMockData()) {
        // Use first main service for duration if no service selected
        const duration = serviceId 
          ? state.services.find(s => s.id === serviceId)?.duration_minutes || 30
          : state.mainServices[0]?.duration_minutes || 30;
        const slots = generateMockTimeSlots(date, duration);
        dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: slots });
      } else {
        // Use first main service if none selected (for initial calendar view)
        const svcId = serviceId || state.mainServices[0]?.id;
        if (!svcId) {
          dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: [] });
          return;
        }

        const dateStr = date.toISOString();
        const response = await availabilityApi.getSlots(
          state.business.id,
          svcId,
          dateStr
        );
        
        if (response.success && response.data) {
          const slots = convertApiSlotsToTimeSlots(response.data);
          dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: slots });
        } else {
          dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: [] });
        }
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.business, state.services, state.mainServices]);

  // Load slots when date changes
  useEffect(() => {
    if (state.business && state.mainServices.length > 0) {
      loadSlotsForDate(state.selectedDate);
    }
  }, [state.selectedDate, state.business, state.mainServices.length, loadSlotsForDate]);

  // Select a time slot
  const selectSlot = useCallback((slot: TimeSlot) => {
    dispatch({ type: 'SELECT_SLOT', payload: slot });
    dispatch({ type: 'SET_STEP', payload: 'service' });
  }, []);

  // Select main service
  const selectService = useCallback((service: Service) => {
    dispatch({ type: 'SELECT_SERVICE', payload: service });
  }, []);

  // Toggle additional service
  const toggleExtra = useCallback((service: Service) => {
    dispatch({ type: 'TOGGLE_EXTRA', payload: service });
  }, []);

  // Set customer info
  const setCustomerInfo = useCallback((info: CustomerCreate) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info });
  }, []);

  // Set notes
  const setNotes = useCallback((notes: string) => {
    dispatch({ type: 'SET_NOTES', payload: notes });
  }, []);

  // Navigate to step
  const goToStep = useCallback((step: BookingStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  // Go back
  const goBack = useCallback(() => {
    const stepOrder: BookingStep[] = ['calendar', 'service', 'customer', 'confirmation', 'success'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({ type: 'SET_STEP', payload: stepOrder[currentIndex - 1] });
    }
  }, [state.currentStep]);

  // Calculate total price
  const getTotalPrice = useCallback(() => {
    let total = state.selectedService?.price || 0;
    state.selectedExtras.forEach(extra => {
      total += extra.price;
    });
    return total;
  }, [state.selectedService, state.selectedExtras]);

  // Calculate total duration
  const getTotalDuration = useCallback(() => {
    let total = state.selectedService?.duration_minutes || 0;
    state.selectedExtras.forEach(extra => {
      total += extra.duration_minutes;
    });
    return total;
  }, [state.selectedService, state.selectedExtras]);

  // Confirm booking
  const confirmBooking = useCallback(async (): Promise<boolean> => {
    if (!state.business || !state.selectedService || !state.selectedSlot || !state.customerInfo) {
      dispatch({ type: 'SET_ERROR', payload: 'Faltan datos para completar la reserva' });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      if (useMockData()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockAppointment: Appointment = {
          id: `apt-${Date.now()}`,
          business_id: state.business.id,
          customer_id: `cust-${Date.now()}`,
          service_id: state.selectedService.id,
          provider_id: state.selectedSlot.provider_id,
          start_time: state.selectedSlot.start_time,
          end_time: state.selectedSlot.end_time,
          status: 'confirmed',
          customer_notes: state.notes,
          service: state.selectedService,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        dispatch({ type: 'SET_CONFIRMED_APPOINTMENT', payload: mockAppointment });
        dispatch({ type: 'SET_STEP', payload: 'success' });
        return true;
      } else {
        const result = await bookingApi.completeBooking(
          state.business.id,
          state.customerInfo,
          state.selectedService.id,
          state.selectedSlot.provider_id,
          state.selectedSlot.start_time,
          state.notes
        );

        if (result.success && result.data) {
          dispatch({ type: 'SET_CONFIRMED_APPOINTMENT', payload: result.data.appointment });
          dispatch({ type: 'SET_STEP', payload: 'success' });
          return true;
        } else {
          throw new Error(result.error || 'Error al confirmar la reserva');
        }
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Error al confirmar la reserva',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state]);

  // Reset booking
  const resetBooking = useCallback(() => {
    dispatch({ type: 'RESET_BOOKING' });
  }, []);

  const value: BookingContextType = {
    state,
    loadBusinessData,
    setDate,
    loadSlotsForDate,
    selectSlot,
    selectService,
    toggleExtra,
    setCustomerInfo,
    setNotes,
    goToStep,
    goBack,
    confirmBooking,
    resetBooking,
    getTotalPrice,
    getTotalDuration,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
