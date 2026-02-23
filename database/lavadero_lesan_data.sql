-- ============================================
-- DATOS LAVADERO LESAN
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CONFIGURACIÓN DEL NEGOCIO
-- ============================================
INSERT INTO business_config (
    name,
    slug,
    description,
    timezone,
    email,
    phone,
    address,
    booking_settings,
    business_hours,
    active
) VALUES (
    'Lavadero Lesan',
    'lavadero-lesan',
    'Lavadero de coches profesional con servicios de limpieza integral, pulido y tratamiento especializado. Limpieza básica, completa e integral para todo tipo de vehículos.',
    'Europe/Madrid',
    'info@lavaderolesan.com',
    '+34 600 000 000',  -- Actualizar con el teléfono real
    'Córdoba, España',   -- Actualizar con la dirección real
    '{
        "advance_booking_days": 30,
        "min_booking_notice_hours": 1,
        "max_bookings_per_day": 20,
        "allow_cancellation": true,
        "cancellation_hours_notice": 12,
        "require_payment": false,
        "auto_confirm": true,
        "slot_duration_minutes": 30
    }'::jsonb,
    '{
        "monday": {"open": "09:00", "close": "20:00", "closed": false, "breaks": [{"start": "14:00", "end": "16:30"}]},
        "tuesday": {"open": "09:00", "close": "20:00", "closed": false, "breaks": [{"start": "14:00", "end": "16:30"}]},
        "wednesday": {"open": "09:00", "close": "20:00", "closed": false, "breaks": [{"start": "14:00", "end": "16:30"}]},
        "thursday": {"open": "09:00", "close": "20:00", "closed": false, "breaks": [{"start": "14:00", "end": "16:30"}]},
        "friday": {"open": "09:00", "close": "20:00", "closed": false, "breaks": [{"start": "14:00", "end": "16:30"}]},
        "saturday": {"open": "09:00", "close": "14:00", "closed": false},
        "sunday": {"open": "00:00", "close": "00:00", "closed": true}
    }'::jsonb,
    true
);

-- ============================================
-- 2. PROVEEDORES (TÉCNICOS/EMPLEADOS)
-- ============================================
-- Creamos al menos un proveedor para que el sistema funcione

INSERT INTO providers (business_id, name, email, phone, bio, is_active)
SELECT 
    id,
    'Equipo Lesan',
    'equipo@lavaderolesan.com',
    '+34 600 000 000',
    'Equipo profesional de limpieza de vehículos con años de experiencia.',
    true
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Si tienes más empleados, puedes añadirlos así:
-- INSERT INTO providers (business_id, name, email, is_active)
-- SELECT id, 'Carlos García', 'carlos@lavaderolesan.com', true
-- FROM business_config WHERE slug = 'lavadero-lesan';

-- ============================================
-- 3. SERVICIOS - TURISMOS PEQUEÑOS
-- ============================================

-- Limpieza Básica - Turismo Pequeño (15€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Básica - Turismo Pequeño',
    'Lavado exterior completo con secado a mano. Incluye limpieza de llantas y cristales exteriores. Ideal para mantenimiento regular de tu vehículo.',
    30,
    15.00,
    'EUR',
    '#00A6A6',
    true,
    5,
    1,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Completa - Turismo Pequeño (22€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Completa - Turismo Pequeño',
    'Lavado exterior e interior completo. Incluye aspirado, limpieza de salpicadero, cristales interiores y exteriores, y ambientador.',
    45,
    22.00,
    'EUR',
    '#00A6A6',
    true,
    5,
    2,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Integral - Turismo Pequeño (30€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Integral - Turismo Pequeño',
    'Tratamiento premium completo. Lavado exterior con encerado, interior detallado, limpieza de tapicería, acondicionamiento de plásticos y protección de superficies.',
    60,
    30.00,
    'EUR',
    '#00A6A6',
    true,
    10,
    3,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- ============================================
-- 4. SERVICIOS - TURISMOS GRANDES
-- ============================================

-- Limpieza Básica - Turismo Grande (18€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Básica - Turismo Grande',
    'Lavado exterior completo con secado a mano para vehículos grandes. Incluye limpieza de llantas y cristales exteriores.',
    35,
    18.00,
    'EUR',
    '#008585',
    true,
    5,
    4,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Completa - Turismo Grande (25€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Completa - Turismo Grande',
    'Lavado exterior e interior completo para vehículos grandes. Incluye aspirado, limpieza de salpicadero, cristales y ambientador.',
    50,
    25.00,
    'EUR',
    '#008585',
    true,
    5,
    5,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Integral - Turismo Grande (35€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Integral - Turismo Grande',
    'Tratamiento premium completo para vehículos grandes. Lavado con encerado, interior detallado, limpieza de tapicería y protección de superficies.',
    75,
    35.00,
    'EUR',
    '#008585',
    true,
    10,
    6,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- ============================================
-- 5. SERVICIOS - TODO TERRENO / MONOVOLUMEN
-- ============================================

-- Limpieza Básica - Todo Terreno/Monovolumen (20€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Básica - Todo Terreno/Monovolumen',
    'Lavado exterior completo con secado a mano para SUV, todo terreno y monovolúmenes. Incluye limpieza de llantas y cristales.',
    40,
    20.00,
    'EUR',
    '#006666',
    true,
    5,
    7,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Completa - Todo Terreno/Monovolumen (30€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Completa - Todo Terreno/Monovolumen',
    'Lavado exterior e interior completo para SUV, todo terreno y monovolúmenes. Aspirado completo, limpieza de todas las plazas y maletero.',
    60,
    30.00,
    'EUR',
    '#006666',
    true,
    5,
    8,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Limpieza Integral - Todo Terreno/Monovolumen (40€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza Integral - Todo Terreno/Monovolumen',
    'Tratamiento premium completo para SUV, todo terreno y monovolúmenes. Incluye encerado, tratamiento de todas las plazas, maletero y protección integral.',
    90,
    40.00,
    'EUR',
    '#006666',
    true,
    10,
    9,
    '[{"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- ============================================
-- 6. SERVICIOS ADICIONALES
-- ============================================

-- Limpieza de Tapicerías (15€ por plaza)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Limpieza de Tapicerías (por plaza)',
    'Limpieza profunda de tapicerías con productos especializados. Eliminación de manchas y olores. Precio por cada plaza/asiento.',
    30,
    15.00,
    'EUR',
    '#E63946',
    true,
    5,
    10,
    '[{"id": "num_plazas", "label": "Número de plazas a limpiar", "type": "number", "required": true}, {"id": "vehiculo", "label": "Marca y modelo del vehículo", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Pulido de Faros (desde 25€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Pulido de Faros',
    'Restauración y pulido profesional de faros. Mejora la visibilidad nocturna y el aspecto del vehículo. Incluye sellado protector.',
    45,
    25.00,
    'EUR',
    '#E63946',
    true,
    5,
    11,
    '[{"id": "estado_faros", "label": "Estado de los faros (leve/medio/grave)", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- Suplemento Pelos de Animal / Suciedad Extrema (desde 10€)
INSERT INTO services (
    business_id, name, description, duration_minutes, price, currency,
    color, is_active, buffer_after_minutes, sort_order, custom_fields
)
SELECT 
    id,
    'Suplemento Pelos de Animal / Suciedad Extrema',
    'Tratamiento adicional para vehículos con pelos de mascota o suciedad extrema. Incluye aspirado especial y limpieza profunda adicional. Añadir a cualquier servicio de limpieza.',
    20,
    10.00,
    'EUR',
    '#E63946',
    true,
    0,
    12,
    '[{"id": "tipo_suciedad", "label": "Tipo (pelos de animal / suciedad extrema / ambos)", "type": "text", "required": false}]'::jsonb
FROM business_config 
WHERE slug = 'lavadero-lesan';

-- ============================================
-- 7. ASIGNAR SERVICIOS AL PROVEEDOR
-- ============================================
-- Asignamos todos los servicios al "Equipo Lesan"

INSERT INTO service_providers (service_id, provider_id)
SELECT s.id, p.id
FROM services s
CROSS JOIN providers p
WHERE s.business_id = (SELECT id FROM business_config WHERE slug = 'lavadero-lesan')
  AND p.business_id = (SELECT id FROM business_config WHERE slug = 'lavadero-lesan');

-- ============================================
-- 8. VERIFICACIÓN
-- ============================================
-- Ejecuta estas queries para verificar que todo se insertó correctamente:

-- SELECT * FROM business_config WHERE slug = 'lavadero-lesan';
-- SELECT * FROM providers WHERE business_id = (SELECT id FROM business_config WHERE slug = 'lavadero-lesan');
-- SELECT name, price, duration_minutes, color FROM services WHERE business_id = (SELECT id FROM business_config WHERE slug = 'lavadero-lesan') ORDER BY sort_order;
-- SELECT COUNT(*) as total_service_providers FROM service_providers;

-- ============================================
-- RESUMEN DE SERVICIOS INSERTADOS:
-- ============================================
-- 
-- TURISMOS PEQUEÑOS:
--   • Limpieza Básica: 15€ (30 min)
--   • Limpieza Completa: 22€ (45 min)
--   • Limpieza Integral: 30€ (60 min)
--
-- TURISMOS GRANDES:
--   • Limpieza Básica: 18€ (35 min)
--   • Limpieza Completa: 25€ (50 min)
--   • Limpieza Integral: 35€ (75 min)
--
-- TODO TERRENO / MONOVOLUMEN:
--   • Limpieza Básica: 20€ (40 min)
--   • Limpieza Completa: 30€ (60 min)
--   • Limpieza Integral: 40€ (90 min)
--
-- SERVICIOS ADICIONALES:
--   • Limpieza de Tapicerías: 15€/plaza (30 min)
--   • Pulido de Faros: desde 25€ (45 min)
--   • Suplemento Pelos/Suciedad: desde 10€ (20 min)
-- ============================================
