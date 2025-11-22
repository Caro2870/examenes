# Plataforma de Exámenes para Certificaciones

Plataforma web completa para practicar exámenes tipo test de certificaciones como AWS, con sistema de suscripciones, generación de preguntas por IA y comunidad.

## 🏗️ Arquitectura

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: Angular 17 + SCSS
- **Autenticación**: JWT + Passport
- **Infraestructura**: Docker + Docker Compose
- **Documentación**: Swagger API
- **Pagos**: Stripe y PayPal

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local sin Docker)

### Instalación con Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd examenes
```

2. Configurar variables de entorno:
```bash
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales
```

3. Iniciar todos los servicios:
```bash
docker-compose up -d
```

4. Esperar a que los servicios estén listos (30-60 segundos)

5. Ejecutar migraciones y seeds:
```bash
# Ejecutar migraciones (si es necesario)
docker-compose exec backend npm run migration:run

# Ejecutar seeds para datos iniciales
docker-compose exec backend npm run seed
```

6. Acceder a la aplicación:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api

### Credenciales por Defecto

Después de ejecutar los seeds, puedes iniciar sesión con:
- **Email**: admin@examenes.com
- **Password**: admin123
- **Rol**: superadmin

### Desarrollo Local (sin Docker)

#### Backend

```bash
cd backend
npm install

# Configurar base de datos PostgreSQL local
# Editar backend/.env con credenciales de tu BD

npm run migration:run
npm run seed
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend estará disponible en http://localhost:4200

## 👤 Roles de Usuario

- **superadmin**: CRUD completo de preguntas, categorías, niveles, aprobación de contenido IA
- **suscriptor** (premium): Acceso completo al banco de preguntas y exámenes ilimitados
- **free**: Límite diario de preguntas/exámenes y comentarios limitados

## 💳 Suscripciones

La plataforma integra Stripe y PayPal para suscripciones recurrentes. Configura las variables de entorno en `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_MODE=sandbox
```

## 📚 Características Principales

### Banco de Preguntas
- Preguntas generadas por IA (requiere aprobación de admin)
- Categorías: AWS Cloud Practitioner, AWS Solutions Architect, Azure, etc.
- Niveles: Básico, Intermedio, Avanzado
- Dificultades: Fácil, Medio, Difícil
- Filtros por categoría, nivel y dificultad

### Sistema de Exámenes
- Inicio de exámenes personalizados
- Navegación entre preguntas
- Barra de progreso
- Calificación automática al finalizar
- Retroalimentación detallada con explicaciones

### Comunidad
- Comentarios en preguntas
- Sistema de votos (positivos/negativos)
- Propuesta de respuestas correctas
- Reporte de errores en preguntas

### Panel de Administración
- Aprobación/rechazo de preguntas generadas por IA
- Generación de preguntas con IA
- Gestión de categorías
- Revisión de reportes

## 📡 API REST

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /users/me` - Información del usuario actual

#### Preguntas
- `GET /questions` - Listar preguntas (con filtros)
- `GET /questions/:id` - Obtener pregunta por ID
- `POST /questions` - Crear pregunta (admin)
- `PUT /questions/:id` - Actualizar pregunta (admin)
- `DELETE /questions/:id` - Eliminar pregunta (admin)

#### Exámenes
- `POST /exam/start` - Iniciar examen
- `POST /exam/answer` - Responder pregunta
- `POST /exam/finish/:id` - Finalizar examen
- `GET /exam/results/:id` - Obtener resultados

#### Comentarios
- `POST /comments` - Crear comentario
- `GET /comments/question/:preguntaId` - Obtener comentarios
- `POST /comments/vote` - Votar comentario
- `POST /comments/report-question` - Reportar pregunta

#### Facturación
- `GET /billing/plans` - Obtener planes
- `POST /billing/stripe/subscribe` - Suscripción Stripe
- `POST /billing/paypal/subscribe` - Suscripción PayPal
- `POST /billing/cancel/:id` - Cancelar suscripción

#### Administración
- `GET /admin/questions/pending` - Preguntas pendientes
- `POST /admin/questions/:id/approve` - Aprobar pregunta
- `POST /admin/questions/:id/reject` - Rechazar pregunta
- `POST /admin/ai-generator/create-question` - Generar pregunta con IA

## 🧪 Testing

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
```

## 📝 Documentación API

Accede a la documentación Swagger interactiva en: http://localhost:3000/api

## 🗄️ Estructura de Base de Datos

### Tablas Principales
- `usuarios` - Usuarios del sistema
- `roles` - Roles (superadmin, suscriptor, free)
- `planes` - Planes de suscripción
- `suscripciones` - Suscripciones activas
- `categorias` - Categorías de certificaciones
- `niveles` - Niveles (básico, intermedio, avanzado)
- `dificultades` - Dificultades (fácil, medio, difícil)
- `preguntas` - Banco de preguntas
- `opciones` - Opciones de respuesta
- `examenes` - Exámenes realizados
- `examen_pregunta` - Respuestas del usuario
- `comentarios` - Comentarios en preguntas
- `votos_comentarios` - Votos en comentarios
- `reportes_preguntas` - Reportes de errores

## 🚢 Despliegue en Producción

### Preparación

1. **Configurar variables de entorno de producción**:
   - Actualizar `backend/.env` con valores de producción
   - Cambiar `NODE_ENV=production`
   - Configurar credenciales de base de datos de producción
   - Configurar claves de Stripe/PayPal de producción

2. **Crear docker-compose.prod.yml**:
```yaml
version: '3.8'
services:
  postgres:
    # Configuración de producción
  backend:
    build:
      context: ./backend
    environment:
      NODE_ENV: production
    # ... más configuración
  frontend:
    build:
      context: ./frontend
    # ... más configuración
```

3. **Configurar servidor web (nginx)** para el frontend:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Configurar SSL/TLS** con Let's Encrypt

5. **Backups de base de datos**:
```bash
# Backup diario
docker-compose exec postgres pg_dump -U examenes_user examenes_db > backup_$(date +%Y%m%d).sql
```

### Despliegue

```bash
# Construir imágenes
docker-compose -f docker-compose.prod.yml build

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# Ejecutar seeds (solo primera vez)
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

## 🔧 Solución de Problemas

### Backend no inicia
- Verificar que PostgreSQL esté corriendo
- Revisar variables de entorno en `backend/.env`
- Ver logs: `docker-compose logs backend`

### Frontend no carga
- Verificar que el backend esté corriendo en http://localhost:3000
- Revisar CORS en `backend/src/main.ts`
- Ver logs: `docker-compose logs frontend`

### Errores de base de datos
- Verificar conexión a PostgreSQL
- Ejecutar migraciones: `npm run migration:run`
- Verificar que los seeds se ejecutaron correctamente

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o soporte, abre un issue en el repositorio.

