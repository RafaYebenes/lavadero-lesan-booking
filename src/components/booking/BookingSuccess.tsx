import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Mail,
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../../services/BookingContext';
import { Button, Card } from '../ui';
import styles from './BookingSuccess.module.css';

export const BookingSuccess: React.FC = () => {
  const { state, resetBooking, getTotalPrice } = useBooking();

  if (!state.confirmedAppointment || !state.selectedService) {
    return null;
  }

  const startDate = new Date(state.confirmedAppointment.start_time);
  const formattedDate = format(startDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  const formattedTime = format(startDate, 'HH:mm');

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.successAnimation}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <div className={styles.checkWrapper}>
          <CheckCircle size={64} strokeWidth={2} />
        </div>
        
        <div className={styles.confetti}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.confettiPiece}
              initial={{ opacity: 0, y: 0, x: 0, rotate: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [0, -80 - Math.random() * 60],
                x: [(i % 2 === 0 ? -1 : 1) * (20 + Math.random() * 40)],
                rotate: Math.random() * 360,
                scale: [0, 1, 1, 0.5]
              }}
              transition={{ duration: 1.5, delay: 0.4 + (i * 0.05), ease: 'easeOut' }}
              style={{ background: ['#00A6A6', '#E63946', '#F59E0B', '#22C55E'][i % 4] }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h2 className={styles.title}>¡Reserva confirmada!</h2>
        <p className={styles.subtitle}>
          Hemos enviado los detalles a tu email
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card variant="elevated" padding="lg" className={styles.detailsCard}>
          <div className={styles.serviceBadge}>
            {state.selectedService.name}
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <Calendar size={20} />
              <div>
                <span className={styles.detailLabel}>Fecha</span>
                <span className={styles.detailValue}>{formattedDate}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <Clock size={20} />
              <div>
                <span className={styles.detailLabel}>Hora</span>
                <span className={styles.detailValue}>{formattedTime}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <MapPin size={20} />
              <div>
                <span className={styles.detailLabel}>Ubicación</span>
                <span className={styles.detailValue}>{state.business?.address || 'Lavadero Lesan'}</span>
              </div>
            </div>
          </div>

          <div className={styles.priceTotal}>
            <span>Total a pagar</span>
            <span className={styles.priceValue}>{getTotalPrice()}€</span>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className={styles.contactSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <p className={styles.contactText}>¿Necesitas modificar o cancelar?</p>
        <div className={styles.contactActions}>
          {state.business?.phone && (
            <a href={`tel:${state.business.phone}`} className={styles.contactLink}>
              <Phone size={16} />
              <span>Llamar</span>
            </a>
          )}
          {state.business?.email && (
            <a href={`mailto:${state.business.email}`} className={styles.contactLink}>
              <Mail size={16} />
              <span>Email</span>
            </a>
          )}
        </div>
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={resetBooking}
          icon={<Home size={20} />}
        >
          Volver al inicio
        </Button>
      </motion.div>
    </div>
  );
};
