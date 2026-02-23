import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon,
  ArrowLeft 
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addDays,
  getDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../../services/BookingContext';
import { Button, Card } from '../ui';
import type { TimeSlot } from '../../types';
import styles from './DateTimePicker.module.css';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const DateTimePicker: React.FC = () => {
  const { state, selectDate, selectTimeSlot, goBack } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let startDayOfWeek = getDay(start);
    // Convert to Monday-first (0 = Monday, 6 = Sunday)
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Add empty slots for days before the start of month
    const paddedDays: (Date | null)[] = Array(startDayOfWeek).fill(null);
    return [...paddedDays, ...days];
  }, [currentMonth]);

  // Check if a day is available (not Sunday, not in the past)
  const isDayAvailable = (date: Date): boolean => {
    const day = getDay(date);
    // Sunday = 0, we're closed
    if (day === 0) return false;
    // Can't book in the past
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return false;
    // Can't book more than 30 days in advance
    if (isBefore(addDays(new Date(), 30), date)) return false;
    return true;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = async (date: Date) => {
    if (isDayAvailable(date)) {
      await selectDate(date);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      selectTimeSlot(slot, slot.staff_id);
    }
  };

  const formatSlotTime = (isoString: string): string => {
    const date = new Date(isoString);
    return format(date, 'HH:mm');
  };

  // Group slots by period (morning/afternoon)
  const groupedSlots = useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];

    state.availableSlots.forEach(slot => {
      const hour = new Date(slot.start_time).getHours();
      if (hour < 14) {
        morning.push(slot);
      } else {
        afternoon.push(slot);
      }
    });

    return { morning, afternoon };
  }, [state.availableSlots]);

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goBack}
          icon={<ArrowLeft size={18} />}
          className={styles.backButton}
        >
          Volver
        </Button>
        <h2 className={styles.title}>Selecciona fecha y hora</h2>
        {state.selectedService && (
          <p className={styles.selectedService}>
            {state.selectedService.name} - {state.selectedService.price}€
          </p>
        )}
      </motion.div>

      <div className={styles.content}>
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="default" padding="md" className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <button 
                className={styles.navButton} 
                onClick={handlePrevMonth}
                disabled={isSameMonth(currentMonth, new Date())}
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className={styles.monthTitle}>
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h3>
              <button 
                className={styles.navButton} 
                onClick={handleNextMonth}
                disabled={isSameMonth(currentMonth, addMonths(new Date(), 1))}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className={styles.weekdays}>
              {WEEKDAYS.map(day => (
                <div key={day} className={styles.weekday}>{day}</div>
              ))}
            </div>

            <div className={styles.days}>
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className={styles.emptyDay} />;
                }

                const available = isDayAvailable(day);
                const selected = state.selectedDate && isSameDay(day, state.selectedDate);
                const today = isToday(day);

                return (
                  <motion.button
                    key={day.toISOString()}
                    className={`${styles.day} ${available ? styles.available : styles.unavailable} ${selected ? styles.selected : ''} ${today ? styles.today : ''}`}
                    onClick={() => handleDayClick(day)}
                    disabled={!available}
                    whileHover={available ? { scale: 1.1 } : undefined}
                    whileTap={available ? { scale: 0.95 } : undefined}
                  >
                    {format(day, 'd')}
                  </motion.button>
                );
              })}
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--color-primary)' }} />
                <span>Disponible</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--color-gray-300)' }} />
                <span>No disponible</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="default" padding="md" className={styles.slotsCard}>
            <div className={styles.slotsHeader}>
              <Clock size={20} />
              <h3 className={styles.slotsTitle}>
                {state.selectedDate 
                  ? format(state.selectedDate, "EEEE d 'de' MMMM", { locale: es })
                  : 'Selecciona una fecha'
                }
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {state.isLoading ? (
                <motion.div
                  key="loading"
                  className={styles.slotsLoading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.loadingSpinner} />
                  <p>Cargando horarios disponibles...</p>
                </motion.div>
              ) : !state.selectedDate ? (
                <motion.div
                  key="empty"
                  className={styles.slotsEmpty}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CalendarIcon size={48} strokeWidth={1.5} />
                  <p>Selecciona una fecha en el calendario para ver los horarios disponibles</p>
                </motion.div>
              ) : state.availableSlots.length === 0 ? (
                <motion.div
                  key="no-slots"
                  className={styles.slotsEmpty}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Clock size={48} strokeWidth={1.5} />
                  <p>No hay horarios disponibles para este día. Por favor, selecciona otra fecha.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="slots"
                  className={styles.slotGroups}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {groupedSlots.morning.length > 0 && (
                    <div className={styles.slotGroup}>
                      <h4 className={styles.slotGroupTitle}>Mañana</h4>
                      <div className={styles.slots}>
                        {groupedSlots.morning.map((slot, index) => (
                          <motion.button
                            key={slot.start_time}
                            className={`${styles.slot} ${slot.available ? styles.slotAvailable : styles.slotUnavailable} ${state.selectedTimeSlot?.start_time === slot.start_time ? styles.slotSelected : ''}`}
                            onClick={() => handleSlotClick(slot)}
                            disabled={!slot.available}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={slot.available ? { scale: 1.05 } : undefined}
                            whileTap={slot.available ? { scale: 0.98 } : undefined}
                          >
                            {formatSlotTime(slot.start_time)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {groupedSlots.afternoon.length > 0 && (
                    <div className={styles.slotGroup}>
                      <h4 className={styles.slotGroupTitle}>Tarde</h4>
                      <div className={styles.slots}>
                        {groupedSlots.afternoon.map((slot, index) => (
                          <motion.button
                            key={slot.start_time}
                            className={`${styles.slot} ${slot.available ? styles.slotAvailable : styles.slotUnavailable} ${state.selectedTimeSlot?.start_time === slot.start_time ? styles.slotSelected : ''}`}
                            onClick={() => handleSlotClick(slot)}
                            disabled={!slot.available}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={slot.available ? { scale: 1.05 } : undefined}
                            whileTap={slot.available ? { scale: 0.98 } : undefined}
                          >
                            {formatSlotTime(slot.start_time)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
