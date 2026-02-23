import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Car, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../../services/BookingContext';
import { Button, Card } from '../ui';
import styles from './BookingConfirmation.module.css';

export const BookingConfirmation: React.FC = () => {
  const { state, goBack, confirmBooking, getTotalPrice, getTotalDuration } = useBooking();

  const handleConfirm = async () => {
    await confirmBooking();
  };

  if (!state.selectedService || !state.selectedSlot || !state.customerInfo) {
    return null;
  }

  const startDate = new Date(state.selectedSlot.start_time);
  const formattedDate = format(startDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  const formattedTime = format(startDate, 'HH:mm');

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

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
        <h2 className={styles.title}>Confirmar reserva</h2>
        <p className={styles.subtitle}>
          Revisa los detalles antes de confirmar
        </p>
      </motion.div>

      <div className={styles.content}>
        {/* Service Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="default" padding="lg" className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <div className={styles.serviceIcon}>
                <Car size={24} />
              </div>
              <div className={styles.serviceInfo}>
                <h3 className={styles.serviceName}>{state.selectedService.name}</h3>
                <p className={styles.serviceDesc}>{state.selectedService.description}</p>
              </div>
            </div>
            
            {state.selectedExtras.length > 0 && (
              <div className={styles.extras}>
                <h4 className={styles.extrasTitle}>
                  <Sparkles size={16} />
                  Extras incluidos
                </h4>
                <ul className={styles.extrasList}>
                  {state.selectedExtras.map(extra => (
                    <li key={extra.id}>
                      {extra.name} <span>+{extra.price}€</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.priceRow}>
              <div>
                <span className={styles.priceLabel}>Total</span>
                <span className={styles.duration}>{formatDuration(getTotalDuration())}</span>
              </div>
              <span className={styles.price}>{getTotalPrice()}€</span>
            </div>
          </Card>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card variant="outlined" padding="md" className={styles.detailCard}>
            <div className={styles.detailRow}>
              <Calendar size={20} />
              <div>
                <span className={styles.detailLabel}>Fecha</span>
                <span className={styles.detailValue}>{formattedDate}</span>
              </div>
            </div>
            <div className={styles.detailRow}>
              <Clock size={20} />
              <div>
                <span className={styles.detailLabel}>Hora</span>
                <span className={styles.detailValue}>{formattedTime}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="outlined" padding="md" className={styles.detailCard}>
            <div className={styles.detailRow}>
              <User size={20} />
              <div>
                <span className={styles.detailLabel}>Nombre</span>
                <span className={styles.detailValue}>{state.customerInfo.name}</span>
              </div>
            </div>
            <div className={styles.detailRow}>
              <Mail size={20} />
              <div>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{state.customerInfo.email}</span>
              </div>
            </div>
            {state.customerInfo.phone && (
              <div className={styles.detailRow}>
                <Phone size={20} />
                <div>
                  <span className={styles.detailLabel}>Teléfono</span>
                  <span className={styles.detailValue}>{state.customerInfo.phone}</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {state.error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span>{state.error}</span>
          </motion.div>
        )}

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleConfirm}
            loading={state.isLoading}
          >
            {state.isLoading ? 'Confirmando...' : 'Confirmar reserva'}
          </Button>
          <p className={styles.disclaimer}>
            Recibirás un email con los detalles de tu cita
          </p>
        </motion.div>
      </div>
    </div>
  );
};
