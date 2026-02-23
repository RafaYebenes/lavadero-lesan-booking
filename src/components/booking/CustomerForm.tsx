import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, FileText, Clock, Car } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../../services/BookingContext';
import { Button, Input, Textarea, Card } from '../ui';
import type { CustomerCreate } from '../../types';
import styles from './CustomerForm.module.css';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export const CustomerForm: React.FC = () => {
  const { state, setCustomerInfo, setNotes, goBack, goToStep, getTotalPrice, getTotalDuration } = useBooking();
  
  const [formData, setFormData] = useState<CustomerCreate>({
    name: state.customerInfo?.name || '',
    email: state.customerInfo?.email || '',
    phone: state.customerInfo?.phone || '',
  });
  const [notes, setLocalNotes] = useState(state.notes || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 9;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Introduce un email válido';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Introduce un teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CustomerCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof CustomerCreate) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    
    if (validate()) {
      setCustomerInfo(formData);
      setNotes(notes);
      goToStep('confirmation');
    }
  };

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
        <h2 className={styles.title}>Tus datos</h2>
        <p className={styles.subtitle}>
          Completa tus datos para confirmar la reserva
        </p>
      </motion.div>

      {/* Summary Card */}
      {state.selectedService && state.selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="outlined" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryItem}>
              <Car size={18} />
              <div>
                <strong>{state.selectedService.name}</strong>
                {state.selectedExtras.length > 0 && (
                  <span className={styles.extras}>
                    {' + '}{state.selectedExtras.map(e => e.name).join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Clock size={18} />
              <span>
                {format(new Date(state.selectedSlot.start_time), "EEEE d MMM 'a las' HH:mm", { locale: es })}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>{formatDuration(getTotalDuration())}</span>
              <span className={styles.price}>{getTotalPrice()}€</span>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card variant="default" padding="lg" className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Nombre completo *"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : undefined}
              icon={<User size={18} />}
              autoComplete="name"
            />

            <Input
              label="Email *"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              icon={<Mail size={18} />}
              autoComplete="email"
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="+34 600 000 000"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : undefined}
              hint="Opcional, para confirmaciones"
              icon={<Phone size={18} />}
              autoComplete="tel"
            />

            <Textarea
              label="Notas"
              placeholder="Marca, modelo, color del vehículo..."
              value={notes}
              onChange={(e) => setLocalNotes(e.target.value)}
              rows={3}
            />

            <div className={styles.privacyNote}>
              <FileText size={16} />
              <p>
                Al continuar, aceptas que guardemos tus datos para gestionar tu reserva.
              </p>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Continuar
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
