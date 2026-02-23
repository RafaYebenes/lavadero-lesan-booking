# 🚗 Lavadero Lesan - Sistema de Reservas

Sistema de reservas online para Lavadero Lesan, desarrollado con React + TypeScript.

![Lavadero Lesan](https://img.shields.io/badge/Lavadero-Lesan-00A6A6?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

## ✨ Características

- 📱 **Mobile-first**: Diseñado para móvil, optimizado para escritorio
- 🎨 **Diseño elegante**: Colores corporativos de Lavadero Lesan
- 🔄 **Flujo intuitivo**: Proceso de reserva en 4 pasos
- 📅 **Calendario interactivo**: Selección de fecha y hora disponible
- ✅ **Validación en tiempo real**: Formularios con feedback inmediato
- 🌐 **API Ready**: Conecta fácilmente con el backend de reservas

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar o descomprimir el proyecto
cd lavadero-lesan-booking

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
lavadero-lesan-booking/
├── src/
│   ├── components/
│   │   ├── booking/          # Componentes del flujo de reserva
│   │   │   ├── Header.tsx
│   │   │   ├── ProgressSteps.tsx
│   │   │   ├── ServiceSelector.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   └── BookingSuccess.tsx
│   │   └── ui/               # Componentes UI reutilizables
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       └── Card.tsx
│   ├── pages/
│   │   └── BookingPage.tsx   # Página principal de reservas
│   ├── services/
│   │   ├── api.ts            # Cliente API para el backend
│   │   ├── mockData.ts       # Datos de ejemplo para desarrollo
│   │   └── BookingContext.tsx # Estado global de la aplicación
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # Estilos globales y variables CSS
├── .env.example
├── package.json
└── README.md
```

## 🔧 Configuración

### Variables de Entorno

```env
# URL de la API Flask (tu backend de reservas)
VITE_API_URL=http://localhost:5000

# Identificador del negocio (slug)
VITE_BUSINESS_SLUG=lavadero-lesan

# Usar datos de prueba (true/false)
VITE_USE_MOCK_DATA=true
```

### Conexión con el Backend

Este frontend está diseñado para conectarse con la **API Flask de reservas** que creamos anteriormente. Para conectar:

1. Asegúrate de que el backend Flask está corriendo en `http://localhost:5000`
2. Configura el negocio en la base de datos con slug `lavadero-lesan`
3. Actualiza el archivo `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_BUSINESS_SLUG=lavadero-lesan
VITE_USE_MOCK_DATA=false
```

### Endpoints de la API Utilizados

El frontend consume los siguientes endpoints:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/business/slug/{slug}` | GET | Obtener negocio por slug |
| `/api/services?business_id={id}` | GET | Listar servicios |
| `/api/availability/slots` | GET | Obtener slots disponibles |
| `/api/customers/search` | GET | Buscar cliente por email |
| `/api/customers` | POST | Crear nuevo cliente |
| `/api/appointments` | POST | Crear nueva cita |

### Flujo de Reserva Completo

```
1. GET /api/business/slug/lavadero-lesan
   → Obtiene datos del negocio

2. GET /api/services?business_id=xxx
   → Lista todos los servicios disponibles

3. GET /api/availability/slots?business_id=xxx&service_id=yyy&date=zzz
   → Obtiene horarios disponibles para una fecha

4. GET /api/customers/search?business_id=xxx&email=cliente@email.com
   → Busca si el cliente ya existe

5. POST /api/customers (si no existe)
   → Crea nuevo cliente

6. POST /api/appointments
   → Crea la cita
```

## 🎨 Personalización

### Colores

Los colores se definen en `src/index.css`:

```css
:root {
  /* Colores principales - Lavadero Lesan */
  --color-primary: #00A6A6;      /* Turquesa */
  --color-primary-dark: #008585;
  --color-secondary: #1A1A1A;     /* Negro */
  --color-accent: #E63946;        /* Rojo (logo) */
}
```

### Servicios

Los servicios se pueden modificar en `src/services/mockData.ts` o se cargarán automáticamente desde la API cuando esté conectada.

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📱 Flujo de Reserva

1. **Selección de Servicio**: El cliente elige entre las diferentes categorías y tipos de lavado
2. **Fecha y Hora**: Calendario interactivo con slots disponibles según el horario del negocio
3. **Datos de Contacto**: Formulario con validación para nombre, email y teléfono
4. **Confirmación**: Resumen de la reserva antes de confirmar
5. **Éxito**: Confirmación visual con todos los detalles de la cita

## 🔐 Seguridad

- Validación de datos en el cliente y servidor
- Sanitización de entradas del usuario
- Sin almacenamiento de datos sensibles en el cliente

## 📄 Licencia

Propiedad de Lavadero Lesan. Todos los derechos reservados.

---

Desarrollado con ❤️ para Lavadero Lesan
