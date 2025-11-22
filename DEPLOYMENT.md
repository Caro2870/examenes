# Guía de Despliegue en Producción

## Requisitos Previos

- Servidor con Docker y Docker Compose instalados
- Dominio configurado (opcional pero recomendado)
- Certificado SSL (Let's Encrypt recomendado)
- Credenciales de Stripe/PayPal para producción

## Pasos de Despliegue

### 1. Preparar el Entorno

```bash
# Clonar el repositorio
git clone <repo-url>
cd examenes

# Crear archivo de entorno de producción
cp backend/.env.example backend/.env.production
```

### 2. Configurar Variables de Entorno

Editar `backend/.env.production`:

```env
NODE_ENV=production
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=examenes_user
DATABASE_PASSWORD=<password-segura>
DATABASE_NAME=examenes_db

JWT_SECRET=<secret-muy-seguro>
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_MODE=live

CORS_ORIGIN=https://tu-dominio.com
PORT=3000
```

### 3. Crear docker-compose.prod.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: examenes_postgres_prod
    environment:
      POSTGRES_USER: examenes_user
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: examenes_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - examenes_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: examenes_backend_prod
    environment:
      NODE_ENV: production
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: examenes_user
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      DATABASE_NAME: examenes_db
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      PAYPAL_CLIENT_ID: ${PAYPAL_CLIENT_ID}
      PAYPAL_SECRET: ${PAYPAL_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: always
    networks:
      - examenes_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: examenes_frontend_prod
    ports:
      - "4200:4200"
    depends_on:
      - backend
    restart: always
    networks:
      - examenes_network

  nginx:
    image: nginx:alpine
    container_name: examenes_nginx_prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - examenes_network

volumes:
  postgres_data:

networks:
  examenes_network:
    driver: bridge
```

### 4. Configurar Nginx

Crear `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    upstream frontend {
        server frontend:4200;
    }

    server {
        listen 80;
        server_name tu-dominio.com;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 5. Desplegar

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

### 6. Configurar SSL con Let's Encrypt

```bash
# Instalar certbot
sudo apt-get update
sudo apt-get install certbot

# Obtener certificado
sudo certbot certonly --standalone -d tu-dominio.com

# Actualizar nginx.conf para usar SSL
```

### 7. Backups Automáticos

Crear script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U examenes_user examenes_db > backup_$DATE.sql
# Subir a S3 o almacenamiento remoto
```

Agregar a crontab:

```bash
0 2 * * * /ruta/al/backup.sh
```

## Monitoreo

### Ver logs

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Servicio específico
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Verificar salud

```bash
# Health check del backend
curl http://localhost:3000/health

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

## Actualizaciones

```bash
# Pull cambios
git pull

# Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Ejecutar nuevas migraciones si las hay
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

## Seguridad

1. Cambiar todas las contraseñas por defecto
2. Usar secrets management (Docker Secrets, AWS Secrets Manager, etc.)
3. Configurar firewall (solo puertos 80, 443)
4. Habilitar rate limiting
5. Configurar CORS correctamente
6. Usar HTTPS obligatorio
7. Implementar WAF (Web Application Firewall)

