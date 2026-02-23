import type {
  ApiResponse,
  Business,
  Service,
  Provider,
  Customer,
  CustomerCreate,
  Appointment,
  TimeSlot,
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Ensure trailing slash to avoid 308 redirects
    const url = endpoint.endsWith('/') || endpoint.includes('?') 
      ? `${API_BASE_URL}${endpoint}`
      : `${API_BASE_URL}${endpoint}/`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Error en la solicitud',
      };
    }

    return {
      success: data.success !== undefined ? data.success : true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión',
    };
  }
}

// ============================================
// BUSINESS API
// ============================================
export const businessApi = {
  getBySlug: async (slug: string): Promise<ApiResponse<Business>> => {
    return apiRequest<Business>(`/api/business/slug/${slug}`);
  },

  getById: async (id: string): Promise<ApiResponse<Business>> => {
    return apiRequest<Business>(`/api/business/${id}`);
  },

  getStats: async (businessId: string): Promise<ApiResponse<Record<string, number>>> => {
    return apiRequest<Record<string, number>>(`/api/business/${businessId}/stats`);
  },
};

// ============================================
// SERVICES API
// ============================================
export const servicesApi = {
  getAll: async (businessId: string): Promise<ApiResponse<Service[]>> => {
    return apiRequest<Service[]>(`/api/services/?business_id=${businessId}`);
  },

  getById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(`/api/services/${serviceId}`);
  },

  getProviders: async (serviceId: string): Promise<ApiResponse<Provider[]>> => {
    return apiRequest<Provider[]>(`/api/services/${serviceId}/providers`);
  },
};

// ============================================
// PROVIDERS API
// ============================================
export const providersApi = {
  getAll: async (businessId: string): Promise<ApiResponse<Provider[]>> => {
    return apiRequest<Provider[]>(`/api/providers/?business_id=${businessId}`);
  },

  getById: async (providerId: string): Promise<ApiResponse<Provider>> => {
    return apiRequest<Provider>(`/api/providers/${providerId}`);
  },
};

// ============================================
// AVAILABILITY API
// ============================================
export interface AvailabilityResponse {
  date: string;
  providers: ProviderSlots[];
}

export interface ProviderSlots {
  provider_id: string;
  provider_name: string;
  slots: Array<{
    start: string;
    end: string;
    available: boolean;
  }>;
}

export const availabilityApi = {
  getSlots: async (
    businessId: string,
    serviceId: string,
    date: string,
    providerId?: string
  ): Promise<ApiResponse<AvailabilityResponse>> => {
    let endpoint = `/api/availability/slots?business_id=${businessId}&service_id=${serviceId}&date=${date}`;
    if (providerId) {
      endpoint += `&provider_id=${providerId}`;
    }
    return apiRequest<AvailabilityResponse>(endpoint);
  },

  checkSlot: async (
    providerId: string,
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<{ available: boolean; reason?: string }>> => {
    return apiRequest<{ available: boolean; reason?: string }>('/api/availability/check', {
      method: 'POST',
      body: JSON.stringify({
        provider_id: providerId,
        start_time: startTime,
        end_time: endTime,
      }),
    });
  },
};

// ============================================
// CUSTOMERS API
// ============================================
export const customersApi = {
  create: async (customer: CustomerCreateAPI): Promise<ApiResponse<Customer>> => {
    return apiRequest<Customer>('/api/customers/', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  search: async (
    businessId: string,
    email: string
  ): Promise<ApiResponse<Customer[]>> => {
    return apiRequest<Customer[]>(
      `/api/customers/search?business_id=${businessId}&email=${encodeURIComponent(email)}`
    );
  },

  getById: async (customerId: string): Promise<ApiResponse<Customer>> => {
    return apiRequest<Customer>(`/api/customers/${customerId}`);
  },
};

interface CustomerCreateAPI {
  business_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// ============================================
// APPOINTMENTS API
// ============================================
export const appointmentsApi = {
  create: async (appointment: AppointmentCreateAPI): Promise<ApiResponse<Appointment>> => {
    return apiRequest<Appointment>('/api/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },

  getById: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    return apiRequest<Appointment>(`/api/appointments/${appointmentId}`);
  },

  getUpcoming: async (
    businessId: string,
    daysAhead: number = 7
  ): Promise<ApiResponse<Appointment[]>> => {
    return apiRequest<Appointment[]>(
      `/api/appointments/upcoming?business_id=${businessId}&days_ahead=${daysAhead}`
    );
  },

  cancel: async (
    appointmentId: string,
    reason?: string
  ): Promise<ApiResponse<Appointment>> => {
    return apiRequest<Appointment>(`/api/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        cancellation_reason: reason,
        cancelled_by: 'customer',
      }),
    });
  },
};

interface AppointmentCreateAPI {
  business_id: string;
  service_id: string;
  provider_id: string;
  customer_id: string;
  start_time: string;
  customer_notes?: string;
}

// ============================================
// BOOKING FLOW HELPER
// ============================================
export const bookingApi = {
  /**
   * Complete booking flow:
   * 1. Search for existing customer or create new one
   * 2. Create the appointment
   */
  completeBooking: async (
    businessId: string,
    customerData: CustomerCreate,
    serviceId: string,
    providerId: string,
    startTime: string,
    notes?: string
  ): Promise<ApiResponse<{ customer: Customer; appointment: Appointment }>> => {
    try {
      // Step 1: Search for existing customer
      let customer: Customer | undefined;
      
      const searchResult = await customersApi.search(businessId, customerData.email);
      
      if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
        customer = searchResult.data[0];
      } else {
        // Create new customer - split name into first_name and last_name
        const nameParts = customerData.name.trim().split(' ');
        const firstName = nameParts[0] || customerData.name;
        const lastName = nameParts.slice(1).join(' ') || '';

        const createResult = await customersApi.create({
          business_id: businessId,
          first_name: firstName,
          last_name: lastName,
          email: customerData.email,
          phone: customerData.phone,
        });

        if (!createResult.success || !createResult.data) {
          return {
            success: false,
            error: createResult.error || 'Error al crear el cliente',
          };
        }
        customer = createResult.data;
      }

      // Step 2: Create the appointment
      const appointmentResult = await appointmentsApi.create({
        business_id: businessId,
        service_id: serviceId,
        provider_id: providerId,
        customer_id: customer.id,
        start_time: startTime,
        customer_notes: notes,
      });

      if (!appointmentResult.success || !appointmentResult.data) {
        return {
          success: false,
          error: appointmentResult.error || 'Error al crear la cita',
        };
      }

      return {
        success: true,
        data: {
          customer,
          appointment: appointmentResult.data,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al procesar la reserva',
      };
    }
  },
};

// ============================================
// HELPER: Convert API slots to TimeSlot format
// ============================================
export function convertApiSlotsToTimeSlots(
  apiResponse: AvailabilityResponse
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (const provider of apiResponse.providers) {
    for (const slot of provider.slots) {
      if (slot.available) {
        slots.push({
          start_time: slot.start,
          end_time: slot.end,
          available: slot.available,
          provider_id: provider.provider_id,
          provider_name: provider.provider_name,
        });
      }
    }
  }
  
  return slots;
}
