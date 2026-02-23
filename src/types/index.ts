// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Business Types
export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  logo_url?: string;
  website?: string;
  active: boolean;
  business_hours: BusinessHours;
  booking_settings: BookingSettings;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
  breaks?: Array<{ start: string; end: string }>;
}

export interface BookingSettings {
  advance_booking_days: number;
  min_booking_notice_hours: number;
  max_bookings_per_day: number;
  allow_cancellation: boolean;
  cancellation_hours_notice: number;
  require_payment: boolean;
  auto_confirm: boolean;
  slot_duration_minutes?: number;
}

// Service Types
export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  currency: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  custom_fields?: CustomField[];
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

// Check if service is an "additional" service (extras)
export function isAdditionalService(service: Service): boolean {
  const additionalKeywords = ['suplemento', 'adicional', 'extra', 'tapicería', 'pulido', 'pelos'];
  const nameLower = service.name.toLowerCase();
  return additionalKeywords.some(keyword => nameLower.includes(keyword));
}

// Get service category from name
export function getServiceCategory(service: Service): string {
  const name = service.name.toLowerCase();
  if (name.includes('pequeño')) return 'Turismos Pequeños';
  if (name.includes('grande')) return 'Turismos Grandes';
  if (name.includes('terreno') || name.includes('monovolumen')) return 'Todo Terreno / Monovolumen';
  if (isAdditionalService(service)) return 'Servicios Adicionales';
  return 'Otros';
}

// Provider Types
export interface Provider {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  can_overlap_bookings: boolean;
  custom_hours?: BusinessHours;
  created_at: string;
  updated_at: string;
}

// Customer Types
export interface Customer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  provider_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  customer_notes?: string;
  internal_notes?: string;
  customer?: Customer;
  service?: Service;
  provider?: Provider;
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

// Time Slot Types
export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  provider_id: string;
  provider_name: string;
}

// Booking Flow State
export interface BookingState {
  step: BookingStep;
  selectedSlot: TimeSlot | null;
  selectedService: Service | null;
  selectedExtras: Service[];
  customerInfo: CustomerCreate | null;
  notes: string;
}

export type BookingStep = 
  | 'calendar'
  | 'service'
  | 'customer'
  | 'confirmation'
  | 'success';

// UI State
export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
