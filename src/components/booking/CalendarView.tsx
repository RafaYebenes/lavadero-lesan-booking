import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Calendar as CalendarIcon,
  Plus
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
import styles from './CalendarView.module.css';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const CalendarView: React.FC = () => {
  const { state, setDate, selectSlot, goToStep } = useBooking();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    let startDayOfWeek = getDay(start);
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const paddedDays: (Date | null)[] = Array(startDayOfWeek).fill(null);
    return [...paddedDays, ...days];
  }, [currentMonth]);

  // Check if a day is available
  const isDayAvailable = (date: Date): boolean => {
    const day = getDay(date);
    if (day === 0) return false; // Sunday closed
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return false;
    if (isBefore(addDays(new Date(), 30), date)) return false;
    return true;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (date: Date) => {
    if (isDayAvailable(date)) {
      setDate(date);
    }
  };

  const handleSlotClick = (slot: typeof state.availableSlots[0]) => {
    selectSlot(slot);
  };

  const handleNewBooking = () => {
    goToStep('service');
  };

  const formatSlotTime = (isoString: string): string => {
    const date = new Date(isoString);
    return format(date, 'HH:mm');
  };

  // Group slots by period
  const groupedSlots = useMemo(() => {
    const morning: typeof state.availableSlots = [];
    const afternoon: typeof state.availableSlots = [];

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

  const availableSlotsCount = state.availableSlots.filter(s => s.available).length;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.div 
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>Reserva tu cita</h1>
        <p className={styles.subtitle}>
          Selecciona un día y hora disponible para tu lavado
        </p>
      </motion.div>

      <div className={styles.content}>
        {/* Calendar */}
        <motion.div
          className={styles.calendarSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="default" padding="md">
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
                const selected = isSameDay(day, state.selectedDate);
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
          </Card>
        </motion.div>

        {/* Time Slots */}
        <motion.div
          className={styles.slotsSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="default" padding="md" className={styles.slotsCard}>
            <div className={styles.slotsHeader}>
              <div className={styles.slotsHeaderLeft}>
                <CalendarIcon size={20} />
                <div>
                  <h3 className={styles.slotsTitle}>
                    {format(state.selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </h3>
                  {availableSlotsCount > 0 && (
                    <span className={styles.slotsCount}>
                      {availableSlotsCount} huecos disponibles
                    </span>
                  )}
                </div>
              </div>
            </div>

            {state.isLoading ? (
              <div className={styles.slotsLoading}>
                <div className={styles.loadingSpinner} />
                <p>Cargando horarios...</p>
              </div>
            ) : state.availableSlots.length === 0 ? (
              <div className={styles.slotsEmpty}>
                <Clock size={48} strokeWidth={1.5} />
                <p>No hay horarios disponibles para este día</p>
              </div>
            ) : (
              <div className={styles.slotGroups}>
                {groupedSlots.morning.length > 0 && (
                  <div className={styles.slotGroup}>
                    <h4 className={styles.slotGroupTitle}>Mañana</h4>
                    <div className={styles.slots}>
                      {groupedSlots.morning.map((slot, index) => (
                        <motion.button
                          key={slot.start_time}
                          className={`${styles.slot} ${slot.available ? styles.slotAvailable : styles.slotUnavailable}`}
                          onClick={() => slot.available && handleSlotClick(slot)}
                          disabled={!slot.available}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
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
                          className={`${styles.slot} ${slot.available ? styles.slotAvailable : styles.slotUnavailable}`}
                          onClick={() => slot.available && handleSlotClick(slot)}
                          disabled={!slot.available}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={slot.available ? { scale: 1.05 } : undefined}
                          whileTap={slot.available ? { scale: 0.98 } : undefined}
                        >
                          {formatSlotTime(slot.start_time)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <motion.div 
        className={styles.bottomAction}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNewBooking}
          icon={<Plus size={20} />}
        >
          Nueva reserva
        </Button>
      </motion.div>
    </div>
  );
};
