import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from '../services/BookingContext';
import {
  Header,
  CalendarView,
  ServiceSelector,
  CustomerForm,
  BookingConfirmation,
  BookingSuccess,
} from '../components/booking';
import styles from './BookingPage.module.css';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const BookingPage: React.FC = () => {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'calendar':
        return <CalendarView key="calendar" />;
      case 'service':
        return <ServiceSelector key="service" />;
      case 'customer':
        return <CustomerForm key="customer" />;
      case 'confirmation':
        return <BookingConfirmation key="confirmation" />;
      case 'success':
        return <BookingSuccess key="success" />;
      default:
        return <CalendarView key="calendar" />;
    }
  };

  if (state.isLoading && !state.services.length) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (state.error && !state.services.length) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.errorContainer}>
          <h2>Error al cargar</h2>
          <p>{state.error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.content}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Lavadero Lesan</p>
      </footer>
    </div>
  );
};
