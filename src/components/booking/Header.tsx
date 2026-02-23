import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Phone, MapPin } from 'lucide-react';
import { useBooking } from '../../services/BookingContext';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { state } = useBooking();
  const business = state.business;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <motion.div 
          className={styles.logoSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              <Droplets size={28} strokeWidth={2.5} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>Lavadero</span>
              <span className={styles.logoBrand}>Lesan</span>
            </div>
          </div>
        </motion.div>

        {business && (
          <motion.div 
            className={styles.contactInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href={`tel:${business.phone}`} className={styles.contactItem}>
              <Phone size={16} />
              <span>{business.phone}</span>
            </a>
            <div className={styles.contactItem}>
              <MapPin size={16} />
              <span>{business.address}</span>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
