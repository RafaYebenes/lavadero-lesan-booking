import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Truck, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  X,
  Check,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../../services/BookingContext';
import { Button, Card } from '../ui';
import { getServiceCategory } from '../../types';
import type { Service } from '../../types';
import styles from './ServiceSelector.module.css';

const categoryIcons: Record<string, React.ReactNode> = {
  'Turismos Pequeños': <Car size={22} />,
  'Turismos Grandes': <Car size={26} />,
  'Todo Terreno / Monovolumen': <Truck size={22} />,
};

const categoryColors: Record<string, string> = {
  'Turismos Pequeños': '#00A6A6',
  'Turismos Grandes': '#008585',
  'Todo Terreno / Monovolumen': '#006666',
};

export const ServiceSelector: React.FC = () => {
  const { 
    state, 
    selectService, 
    toggleExtra, 
    goBack, 
    goToStep,
    getTotalPrice,
    getTotalDuration 
  } = useBooking();
  
  const [showExtrasModal, setShowExtrasModal] = useState(false);

  // Group main services by category
  const categories = useMemo(() => {
    const categoryMap = new Map<string, Service[]>();
    
    state.mainServices.forEach(service => {
      const category = getServiceCategory(service);
      const existing = categoryMap.get(category) || [];
      categoryMap.set(category, [...existing, service]);
    });

    return Array.from(categoryMap.entries()).map(([name, services]) => ({
      name,
      services: services.sort((a, b) => a.price - b.price),
    }));
  }, [state.mainServices]);

  const formatPrice = (price: number): string => `${price}€`;

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getServiceType = (service: Service): string => {
    const name = service.name.toLowerCase();
    if (name.includes('básica')) return 'Básica';
    if (name.includes('completa')) return 'Completa';
    if (name.includes('integral')) return 'Integral';
    return '';
  };

  const handleServiceSelect = (service: Service) => {
    selectService(service);
    setShowExtrasModal(true);
  };

  const handleContinue = () => {
    setShowExtrasModal(false);
    goToStep('customer');
  };

  const handleSkipExtras = () => {
    setShowExtrasModal(false);
    goToStep('customer');
  };

  const isExtraSelected = (extra: Service): boolean => {
    return state.selectedExtras.some(e => e.id === extra.id);
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
        
        {state.selectedSlot && (
          <div className={styles.selectedTime}>
            <Clock size={16} />
            <span>
              {format(new Date(state.selectedSlot.start_time), "EEEE d 'de' MMMM", { locale: es })}
              {' a las '}
              {format(new Date(state.selectedSlot.start_time), 'HH:mm')}
            </span>
          </div>
        )}

        <h2 className={styles.title}>Elige tu servicio</h2>
        <p className={styles.subtitle}>
          Selecciona el tipo de lavado para tu vehículo
        </p>
      </motion.div>

      <div className={styles.categories}>
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            className={styles.category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
          >
            <div 
              className={styles.categoryHeader}
              style={{ '--category-color': categoryColors[category.name] || '#00A6A6' } as React.CSSProperties}
            >
              <div className={styles.categoryIcon}>
                {categoryIcons[category.name] || <Car size={22} />}
              </div>
              <h3 className={styles.categoryName}>{category.name}</h3>
            </div>

            <div className={styles.services}>
              {category.services.map((service, serviceIndex) => {
                const typeLabel = getServiceType(service);
                const isSelected = state.selectedService?.id === service.id;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (serviceIndex * 0.05) }}
                  >
                    <Card
                      variant="outlined"
                      padding="md"
                      clickable
                      selected={isSelected}
                      onClick={() => handleServiceSelect(service)}
                      className={styles.serviceCard}
                    >
                      <div className={styles.serviceContent}>
                        <div className={styles.serviceInfo}>
                          {typeLabel && (
                            <span 
                              className={styles.serviceType}
                              style={{ background: service.color || categoryColors[category.name] }}
                            >
                              {typeLabel}
                            </span>
                          )}
                          <h4 className={styles.serviceName}>{service.name}</h4>
                          <p className={styles.serviceDescription}>{service.description}</p>
                          <div className={styles.serviceMeta}>
                            <span className={styles.duration}>
                              <Clock size={14} />
                              {formatDuration(service.duration_minutes)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.servicePrice}>
                          <span className={styles.priceValue}>{formatPrice(service.price)}</span>
                          <ChevronRight size={20} className={styles.arrow} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Extras Modal */}
      <AnimatePresence>
        {showExtrasModal && state.selectedService && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExtrasModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>¿Añadir extras?</h3>
                  <p className={styles.modalSubtitle}>
                    Complementa tu {state.selectedService.name.toLowerCase()}
                  </p>
                </div>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowExtrasModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className={styles.modalContent}>
                {state.additionalServices.length === 0 ? (
                  <p className={styles.noExtras}>No hay servicios adicionales disponibles</p>
                ) : (
                  <div className={styles.extrasList}>
                    {state.additionalServices.map(extra => {
                      const selected = isExtraSelected(extra);
                      return (
                        <motion.button
                          key={extra.id}
                          className={`${styles.extraItem} ${selected ? styles.extraSelected : ''}`}
                          onClick={() => toggleExtra(extra)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={styles.extraInfo}>
                            <span className={styles.extraName}>{extra.name}</span>
                            <span className={styles.extraMeta}>
                              {formatDuration(extra.duration_minutes)} · {formatPrice(extra.price)}
                            </span>
                          </div>
                          <div className={`${styles.extraCheck} ${selected ? styles.checked : ''}`}>
                            {selected ? <Check size={16} /> : <Plus size={16} />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.modalSummary}>
                  <div className={styles.summaryRow}>
                    <span>Total</span>
                    <span className={styles.summaryPrice}>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Duración estimada</span>
                    <span>{formatDuration(getTotalDuration())}</span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    variant="ghost"
                    onClick={handleSkipExtras}
                  >
                    Sin extras
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleContinue}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
