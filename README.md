# **Gestión de Activos con QR**  

Un sistema completo para administrar activos tecnológicos con generación de códigos QR para identificación rápida. Desarrollado con MERN Stack (MongoDB, Express, React, Node.js).

![Captura del Sistema](https://ejemplo.com/captura-sistema.jpg) *(Reemplazar con imagen real del proyecto)*

## **✨ Características**  

- **CRUD completo** de activos tecnológicos  
- Generación automática de **códigos QR** para cada activo  
- **Dos vistas**: Tabla y Tarjetas  
- Filtros avanzados por tipo, estado y fechas  
- Importación/Exportación de datos en Excel  
- Historial de cambios y mantenimientos  
- Autenticación y autorización de usuarios  

## **🛠️ Tecnologías**  

| Frontend               | Backend             | Base de Datos       | Otras Herramientas  |
|------------------------|---------------------|---------------------|---------------------|
| React 18               | Node.js             | MongoDB             | QRCode.react        |
| Material-UI (MUI)      | Express.js          | Mongoose            | XLSX (Excel)        |
| Redux Toolkit          | JWT                 |                     | date-fns            |
| Axios                  | Bcrypt              |                     | Notistack           |

## **🚀 Instalación**  

### **Requisitos previos**  
- Node.js v16+  
- MongoDB Atlas o local  
- Git  

### **Pasos**  

1. **Clonar el repositorio**  
```bash
git clone https://github.com/tu-usuario/gestion-activos-qr.git
cd gestion-activos-qr

Instalar dependencias

bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Configurar variables de entorno
Crear un archivo .env en /backend:

env
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
API_BASE_URL=http://localhost:5000
Iniciar la aplicación

bash
# Backend (puerto 5000)
cd backend
npm run dev

# Frontend (puerto 3000)
cd ../frontend
npm start
📂 Estructura del Proyecto
gestion-activos-qr/
├── backend/
│   ├── controllers/    # Lógica de los endpoints
│   ├── models/         # Esquemas de MongoDB
│   ├── routes/         # Rutas de la API
│   └── server.js       # Configuración del servidor
│
├── frontend/
│   ├── public/         # Assets estáticos
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Vistas principales
│   │   └── App.js      # Configuración de rutas
│   └── ...             
│
└── README.md           # Este archivo
🔐 Credenciales de Prueba
(Opcional: Si tienes usuarios demo)

Admin: admin@example.com / Password123

Usuario: user@example.com / Password123

🌍 Despliegue
Opción 1: Render (Recomendado)
Deploy to Render

Opción 2: Vercel (Frontend) + Railway (Backend)
Frontend: vercel --prod

Backend: Importar repositorio en Railway

📝 Licencia
MIT License © 2023 Luis Eduardo García Soto

🎯 Roadmap Futuro
Aplicación móvil para escanear QR

Dashboard de reportes

Integración con Active Directory
