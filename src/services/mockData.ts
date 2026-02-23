import type {
  Business,
  Service,
  TimeSlot,
} from '../types';

// Mock Business Data - Lavadero Lesan
export const mockBusiness: Business = {
  id: 'b1',
  name: 'Lavadero Lesan',
  slug: 'lavadero-lesan',
  description: 'Lavadero de coches profesional con servicios de limpieza integral, pulido y tratamiento especializado.',
  phone: '+34 600 000 000',
  email: 'info@lavaderolesan.com',
  address: 'Córdoba, España',
  timezone: 'Europe/Madrid',
  active: true,
  business_hours: {
    monday: { open: '09:00', close: '20:00', closed: false, breaks: [{ start: '14:00', end: '16:30' }] },
    tuesday: { open: '09:00', close: '20:00', closed: false, breaks: [{ start: '14:00', end: '16:30' }] },
    wednesday: { open: '09:00', close: '20:00', closed: false, breaks: [{ start: '14:00', end: '16:30' }] },
    thursday: { open: '09:00', close: '20:00', closed: false, breaks: [{ start: '14:00', end: '16:30' }] },
    friday: { open: '09:00', close: '20:00', closed: false, breaks: [{ start: '14:00', end: '16:30' }] },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  },
  booking_settings: {
    advance_booking_days: 30,
    min_booking_notice_hours: 1,
    max_bookings_per_day: 20,
    allow_cancellation: true,
    cancellation_hours_notice: 12,
    require_payment: false,
    auto_confirm: true,
    slot_duration_minutes: 30,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock Services - Based on the price list in the image
export const mockServices: Service[] = [
  // Turismos Pequeños
  {
    id: 's1',
    business_id: 'b1',
    name: 'Limpieza Básica - Turismo Pequeño',
    description: 'Lavado exterior completo con secado a mano para turismos pequeños.',
    duration_minutes: 30,
    price: 15,
    currency: 'EUR',
    color: '#00A6A6',
    is_active: true,
    sort_order: 1,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's2',
    business_id: 'b1',
    name: 'Limpieza Completa - Turismo Pequeño',
    description: 'Lavado exterior e interior completo, aspirado y limpieza de cristales.',
    duration_minutes: 45,
    price: 22,
    currency: 'EUR',
    color: '#00A6A6',
    is_active: true,
    sort_order: 2,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's3',
    business_id: 'b1',
    name: 'Limpieza Integral - Turismo Pequeño',
    description: 'Tratamiento premium con lavado exterior, interior detallado, encerado y protección.',
    duration_minutes: 60,
    price: 30,
    currency: 'EUR',
    color: '#00A6A6',
    is_active: true,
    sort_order: 3,
    buffer_before_minutes: 0,
    buffer_after_minutes: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Turismos Grandes
  {
    id: 's4',
    business_id: 'b1',
    name: 'Limpieza Básica - Turismo Grande',
    description: 'Lavado exterior completo con secado a mano para turismos grandes.',
    duration_minutes: 35,
    price: 18,
    currency: 'EUR',
    color: '#008585',
    is_active: true,
    sort_order: 4,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's5',
    business_id: 'b1',
    name: 'Limpieza Completa - Turismo Grande',
    description: 'Lavado exterior e interior completo, aspirado y limpieza de cristales.',
    duration_minutes: 50,
    price: 25,
    currency: 'EUR',
    color: '#008585',
    is_active: true,
    sort_order: 5,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's6',
    business_id: 'b1',
    name: 'Limpieza Integral - Turismo Grande',
    description: 'Tratamiento premium con lavado exterior, interior detallado, encerado y protección.',
    duration_minutes: 75,
    price: 35,
    currency: 'EUR',
    color: '#008585',
    is_active: true,
    sort_order: 6,
    buffer_before_minutes: 0,
    buffer_after_minutes: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Todo Terreno / Monovolumen
  {
    id: 's7',
    business_id: 'b1',
    name: 'Limpieza Básica - Todo Terreno/Monovolumen',
    description: 'Lavado exterior completo con secado a mano para SUV y monovolúmenes.',
    duration_minutes: 40,
    price: 20,
    currency: 'EUR',
    color: '#006666',
    is_active: true,
    sort_order: 7,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's8',
    business_id: 'b1',
    name: 'Limpieza Completa - Todo Terreno/Monovolumen',
    description: 'Lavado exterior e interior completo, aspirado completo de todas las plazas.',
    duration_minutes: 60,
    price: 30,
    currency: 'EUR',
    color: '#006666',
    is_active: true,
    sort_order: 8,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's9',
    business_id: 'b1',
    name: 'Limpieza Integral - Todo Terreno/Monovolumen',
    description: 'Tratamiento premium completo con encerado y protección integral.',
    duration_minutes: 90,
    price: 40,
    currency: 'EUR',
    color: '#006666',
    is_active: true,
    sort_order: 9,
    buffer_before_minutes: 0,
    buffer_after_minutes: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Servicios Adicionales
  {
    id: 's10',
    business_id: 'b1',
    name: 'Limpieza de Tapicerías (por plaza)',
    description: 'Limpieza profunda de tapicerías con productos especializados. Precio por plaza.',
    duration_minutes: 30,
    price: 15,
    currency: 'EUR',
    color: '#E63946',
    is_active: true,
    sort_order: 10,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's11',
    business_id: 'b1',
    name: 'Pulido de Faros',
    description: 'Restauración y pulido de faros para mejorar la visibilidad.',
    duration_minutes: 45,
    price: 25,
    currency: 'EUR',
    color: '#E63946',
    is_active: true,
    sort_order: 11,
    buffer_before_minutes: 0,
    buffer_after_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's12',
    business_id: 'b1',
    name: 'Suplemento Pelos de Animal / Suciedad Extrema',
    description: 'Tratamiento adicional para vehículos con pelos de mascota o suciedad extrema.',
    duration_minutes: 20,
    price: 10,
    currency: 'EUR',
    color: '#E63946',
    is_active: true,
    sort_order: 12,
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate time slots for a given date
export function generateMockTimeSlots(date: Date, serviceDuration: number): TimeSlot[] {
  const dayOfWeek = date.getDay();
  
  // Sunday closed
  if (dayOfWeek === 0) return [];
  
  const slots: TimeSlot[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  // Morning: 9:00 - 14:00
  // Afternoon (Mon-Fri): 16:30 - 20:00
  const periods = dayOfWeek === 6 
    ? [{ start: 9, end: 14 }]  // Saturday
    : [{ start: 9, end: 14 }, { start: 16.5, end: 20 }];  // Mon-Fri

  periods.forEach(period => {
    let currentHour = period.start;
    
    while (currentHour + (serviceDuration / 60) <= period.end) {
      const hour = Math.floor(currentHour);
      const min = Math.round((currentHour - hour) * 60);
      
      const startTime = `${dateStr}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
      
      const endHour = currentHour + (serviceDuration / 60);
      const endH = Math.floor(endHour);
      const endM = Math.round((endHour - endH) * 60);
      const endTime = `${dateStr}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

      // Randomly mark some slots as unavailable
      const isAvailable = Math.random() > 0.3;

      slots.push({
        start_time: startTime,
        end_time: endTime,
        available: isAvailable,
        provider_id: 'p1',
        provider_name: 'Equipo Lesan',
      });

      currentHour += 0.5; // 30 min intervals
    }
  });

  return slots;
}

// Check if using mock data
export const useMockData = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true' || !import.meta.env.VITE_API_URL;
};
