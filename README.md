# Sistema de Gestión de Activos con QR

Un sistema backend para registrar equipos de cómputo mediante códigos QR y gestionar su historial de mantenimiento.

## Tecnologías Utilizadas

**Backend**
+ **Node.js:** Entorno de ejecución JavaScript.
+ **Express:** Framework para construir APIs REST.
+ **MongoDB:** Base de datos NoSQL para almacenar activos y mantenimientos.
+ **Mongoose:** Librería para conectar Node.js con MongoDB.
+ **QRCode:** Generación de códigos QR en base64.

**Frontend (Próximas etapas)**
+ React Native (para la app móvil).
---
## Instalación y Configuración

# 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]  
cd gestion-activos-qr/backend
```

# 2.Instalar Dependencias 
```bash
npm install
```

# 3.Configuar MongoDB
+ Asegúrate de tener MongoDB instalado y el servicio corriendo.
+ Para verificarlo.
```bash
mongod --version
```
+ Si no está instalado, descárgalo desde: https://www.mongodb.com/try/download/community.

# 4.Variables de entorno
Crea un archivo `.env` en la carpeta `backend` con:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/gestion-activos  
PORT=5000  
```
---
# Uso del sistema
### 1.Inicio del servidor
```bash
node app.js
```
**Deberás ver**
```bash
✅ Conectado a MongoDB  
Servidor funcionando en http://localhost:5000  
```

### 2. Endpoints de la API
| Método | Endpoint                            | Descripción                        | Body (Ejemplo)                                                                 |
|--------|-------------------------------------|------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/api/assets`                       | Crear un nuevo activo con QR       | `{"assetNumber": "II-001", "type": "Laptop", "model": "De11 XPS 15"}`          |
| GET    | `/api/assets`                       | Listar todos los activos           | -                                                                              |
| GET    | `/api/assets/:assetNumber`          | Buscar activo por número           | -                                                                              |
| POST   | `/api/assets/:assetNumber/maintenance` | Agregar mantenimiento            | `{"description": "Cambio de teclado", "technician": "Juan Pérez"}`             |

### 3. Probar con Thunder Client
+ **Crear un activo**
```bash
POST http://localhost:5000/api/assets  
Body (JSON): { "assetNumber": "IT-001", "type": "Laptop", "model": "Dell XPS 15" }
```

+ **Listar activos**
```bash
GET http://localhost:5000/api/assets
```
---

## Estrucutura del proyecto
```bash
/backend  
  ├── /models  
  │   └── Asset.js          # Modelo de MongoDB  
  ├── /routes  
  │   └── assets.js         # Rutas de la API  
  ├── app.js                # Configuración del servidor  
  ├── package.json  
  └── .env                  # Variables de entorno (opcional)
```
---
## Posibles Errores y Soluciones

| Error                      | Causa                     | Solución                                                                 |
|----------------------------|---------------------------|--------------------------------------------------------------------------|
| `Cannot GET /api/assets`    | Ruta no definida          | Revisa `routes/assets.js`                                               |
| `E11000 duplicate key`      | assetNumber repetido      | Usa un valor único para `assetNumber`                                   |
| `MongoDB not running`       | Servicio no iniciado      | Ejecuta `sudo systemctl start mongod` (Linux/Mac) o inicia el servicio en Windows |

---
## Notas Adicionales
+ Para generar códigos QR desde el frontend, usa librerías como `react-qr-code`.
+ Si despliegas en la nube, considera usar MongoDB Atlas y Render/Railway.
