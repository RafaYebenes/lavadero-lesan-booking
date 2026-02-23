import React from 'react';
import { motion } from 'framer-motion';
import { Car, Calendar, User, CheckCircle } from 'lucide-react';
import { useBooking } from '../../services/BookingContext';
import type { BookingStep } from '../../types';
import styles from './ProgressSteps.module.css';

const steps: { key: BookingStep; label: string; icon: React.ReactNode }[] = [
  { key: 'service', label: 'Servicio', icon: <Car size={20} /> },
  { key: 'datetime', label: 'Fecha y Hora', icon: <Calendar size={20} /> },
  { key: 'customer', label: 'Datos', icon: <User size={20} /> },
  { key: 'confirmation', label: 'Confirmar', icon: <CheckCircle size={20} /> },
];

export const ProgressSteps: React.FC = () => {
  const { state, goToStep } = useBooking();
  const currentStepIndex = steps.findIndex(s => s.key === state.currentStep);

  const canNavigateTo = (stepIndex: number): boolean => {
    // Can always go back
    if (stepIndex < currentStepIndex) return true;
    
    // Can go to next step only if current data is complete
    if (stepIndex === 1) return !!state.selectedService;
    if (stepIndex === 2) return !!state.selectedService && !!state.selectedTimeSlot;
    if (stepIndex === 3) return !!state.selectedService && !!state.selectedTimeSlot && !!state.customerInfo;
    
    return false;
  };

  if (state.currentStep === 'success') {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isClickable = canNavigateTo(index);

          return (
            <React.Fragment key={step.key}>
              <motion.button
                className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                onClick={() => isClickable && goToStep(step.key)}
                disabled={!isClickable}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isClickable ? { scale: 1.05 } : undefined}
                whileTap={isClickable ? { scale: 0.98 } : undefined}
              >
                <div className={styles.iconWrapper}>
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle size={20} />
                    </motion.div>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={styles.label}>{step.label}</span>
              </motion.button>

              {index < steps.length - 1 && (
                <div className={`${styles.connector} ${isCompleted ? styles.connectorCompleted : ''}`}>
                  <motion.div
                    className={styles.connectorFill}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
