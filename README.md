# Veterinaria Patitas Felices — Página web multimedia

Frontend en **Angular 20**, backend en **Node.js + Express**, base de datos **MySQL**, y chatbot con **Ollama (gemma3)**.
Todo el contenido del frontend se obtiene desde la API del backend.

## Estructura

```
veterinaria-web/
├── database/schema.sql      # Tablas + datos de ejemplo
├── backend/
│   ├── app.js               # Entrada del servidor (Express)
│   ├── .env.example         # Variables de entorno (copiar a .env)
│   ├── config/db.js         # Pool de conexiones MySQL
│   ├── models/              # Consultas SQL por entidad
│   ├── controllers/         # Logica de cada endpoint
│   ├── middleware/          # Validacion de contacto, manejo de errores
│   ├── routes/api.js        # Definicion de rutas /api
│   └── chatbot/             # Cliente Ollama + servicio del chatbot
└── frontend/
    ├── proxy.conf.json      # /api → backend en desarrollo
    └── src/app/
        ├── pages/           # Inicio, Servicios, Especialidades, Nosotros, Precios, Contactos
        ├── components/chatbot/
        └── services/api.service.ts
```

## Tablas de MySQL que usa el frontend

| Tabla | Sección |
|---|---|
| `info_clinica` | Inicio, Nosotros, Contactos (nombre, historia, misión, dirección, teléfono, horario, mapa) |
| `multimedia` | Inicio (video en bucle, clave `hero_video`) |
| `servicios` | Servicios e Inicio |
| `especialidades` | Especialidades |
| `precios` | Precios (ligada opcionalmente a `servicios`) |
| `galeria` | Nosotros (fotos de la tienda/clínica) |
| `contactos` | Formulario de contacto (guarda los mensajes) |
| `chat_mensajes` | Historial del chatbot |

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/clinica` | Datos generales de la clínica |
| GET | `/api/multimedia/:clave` | Recurso multimedia (ej. `hero_video`) |
| GET | `/api/galeria` | Fotos |
| GET | `/api/servicios` | Servicios activos |
| GET | `/api/especialidades` | Especialidades activas |
| GET | `/api/precios` | Lista de precios |
| POST | `/api/contactos` | Enviar formulario `{nombre, email, telefono?, asunto?, mensaje}` |
| POST | `/api/chatbot` | Chat `{mensaje, sesionId?, historial?}` → `{respuesta}` |

## Puesta en marcha

### 1. Base de datos
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # editar DB_PASSWORD y demas valores
npm install
npm start                 # http://localhost:3000
```

### 3. Ollama + gemma3 (chatbot)
```bash
ollama pull gemma3
ollama serve              # http://localhost:11434
```
El modelo se configura con `OLLAMA_MODEL` en `.env`. Si Ollama no está disponible, el chat responde con un mensaje de cortesía.

### 4. Frontend
```bash
cd frontend
npm install
npm start                 # http://localhost:4200 (proxy de /api al backend)
```

## Video de Pexels

El video en bucle del inicio se toma de la tabla `multimedia` (clave `hero_video`).
Reemplazar la URL de ejemplo por la de un video de https://www.pexels.com/ (licencia gratuita de Pexels) con:

```sql
UPDATE multimedia SET url = 'URL_DEL_VIDEO.mp4', fuente = 'Pexels' WHERE clave = 'hero_video';
```

Lo mismo aplica a las fotos de `galeria`.

## Notas
- Los datos de ejemplo en `schema.sql` deben reemplazarse por la información real (teléfono, dirección, precios).
- Para producción, cambiar `CORS_ORIGIN` y la URL de la API en `frontend/src/app/services/api.service.ts`.
