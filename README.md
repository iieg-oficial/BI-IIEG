<div align="center">

<img src="logo_gris_iieg.png" alt="IIEG — Instituto de Información Estadística y Geográfica de Jalisco" width="420" />

# BI-IIEG

**Plataforma de Business Intelligence del IIEG**

Conecta bases de datos, ejecuta consultas SQL, construye gráficas interactivas y arma dashboards — todo desde el navegador.

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Inicio rápido](#inicio-rápido)
- [Desarrollo local](#desarrollo-local)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Variables de entorno](#variables-de-entorno)
- [Tests](#tests)

---

## Descripción

BI-IIEG es una plataforma web de inteligencia de negocios desarrollada para el Instituto de Información Estadística y Geográfica de Jalisco. Permite a los usuarios:

- **Conectar** bases de datos PostgreSQL externas de forma segura
- **Consultar** datos mediante un editor SQL con explorador de esquemas
- **Visualizar** resultados con gráficas interactivas (barras, líneas, pie, etc.) usando Plotly
- **Construir** dashboards arrastrables con gráficas y bloques de Markdown
- **Guardar** consultas, gráficas y dashboards para reutilización

---

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React+Vite  │◀────│   FastAPI    │◀────│   16-alpine  │
│  :5173       │     │  :8000       │     │  :5432       │
└─────────────┘     └─────────────┘     └─────────────┘
```

| Capa | Tecnología | Ubicación |
|------|-----------|-----------|
| Frontend | React 19 + TypeScript + Vite | `front/` |
| Backend | FastAPI + SQLAlchemy 2 async + Pydantic v2 | `back/` |
| Base de datos | PostgreSQL 16 | Docker / local |
| Despliegue | Docker Compose + Nginx | `deploy/` |

---

## Requisitos

### Con Docker (recomendado)

- [Docker](https://docs.docker.com/get-docker/) ≥ 24.0
- [Docker Compose](https://docs.docker.com/compose/) V2

### Desarrollo local

- Python 3.12+ (con conda o venv)
- Node.js 20+
- PostgreSQL 16+

---

## Inicio rápido

### Con Docker Compose

```bash
# Clonar el repositorio
git clone git@github.com.iieg:iieg-oficial/BI-IIEG.git
cd BI-IIEG

# Configurar variables de entorno
cd deploy
cp .env.example .env
# Editar .env con tus valores

# Construir y levantar
docker compose up --build -d

# Verificar servicios
docker compose ps
```

Los servicios estarán disponibles en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Health check**: http://localhost:8000/

---

## Desarrollo local

### 1. Base de datos (Docker)

```bash
cd deploy
docker compose up -d db
```

### 2. Migraciones y seed

```bash
cd back

# Ejecutar migraciones
for f in migrations/0*.sql; do
  PGPASSWORD="changeme" psql -h localhost -U bi_iieg -d bi_iieg -f "$f"
done

# Seed de datos de demostración
PGPASSWORD="changeme" psql -h localhost -U bi_iieg -d postgres -f migrations/seed_dummy_data.sql
python seed.py
```

### 3. Backend

```bash
cd back
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```

---

## Estructura del proyecto

```
BI-IIEG/
├── back/                       # Backend — FastAPI
│   ├── main.py                 # Entry point
│   ├── config.py               # Settings (env vars)
│   ├── db.py                   # Async SQLAlchemy engine
│   ├── dependencies.py         # FastAPI dependencies (auth, db)
│   ├── seed.py                 # Demo data seeder
│   ├── migrations/             # SQL migrations secuenciales
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── services/               # Business logic
│   ├── routes/                 # API endpoints
│   ├── consts/                 # Constants por módulo
│   ├── exceptions/             # Custom exceptions por módulo
│   └── tests/                  # pytest test suite
│
├── front/                      # Frontend — React + TypeScript
│   ├── src/
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Login, registro
│   │   │   ├── connections/    # Conexiones a BD
│   │   │   ├── queries/        # Editor SQL
│   │   │   ├── charts/         # Constructor de gráficas
│   │   │   ├── dashboards/     # Dashboard builder
│   │   │   └── home/           # Página de inicio
│   │   ├── components/         # Componentes compartidos
│   │   ├── context/            # React context (auth)
│   │   ├── hooks/              # Hooks compartidos
│   │   ├── services/           # API client (axios)
│   │   └── types/              # TypeScript types
│   └── public/                 # Assets estáticos
│
├── deploy/                     # Docker & despliegue
│   ├── docker-compose.yml      # Compose producción
│   ├── docker-compose.dev.yml  # Override para desarrollo
│   ├── .env.example            # Template de variables
│   ├── init-db.sh              # Script de migraciones + seed
│   └── docker/                 # Dockerfiles + nginx config
│
└── .github/                    # Configuración de Copilot
    ├── copilot-instructions.md
    ├── agents/                 # Agentes especializados
    ├── instructions/           # Instrucciones por tecnología
    ├── prompts/                # Prompts reutilizables
    └── skills/                 # Skills de generación
```

---

## Stack tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| **Frontend** | React | 19.x |
| **Bundler** | Vite | 8.x |
| **Lenguaje (front)** | TypeScript | 6.x |
| **Gráficas** | Plotly.js + react-plotly.js | 3.x |
| **Dashboard grid** | react-grid-layout | 2.x |
| **Backend** | FastAPI | 0.115+ |
| **ORM** | SQLAlchemy 2 (async) | 2.x |
| **Validación** | Pydantic v2 | 2.x |
| **Base de datos** | PostgreSQL | 16 |
| **Contenedores** | Docker + Compose V2 | 24+ |
| **Proxy** | Nginx | alpine |

---

## Variables de entorno

### Backend (`deploy/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `bi_iieg` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `changeme` |
| `POSTGRES_DB` | Nombre de la base de datos | `bi_iieg` |
| `DATABASE_URL` | Connection string asyncpg | `postgresql+asyncpg://...` |
| `SECRET_KEY` | Clave secreta para JWT | `random-secret` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token (min) | `30` |
| `CORS_ORIGINS` | Orígenes CORS permitidos | `["http://localhost:5173"]` |

### Frontend (`front/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend | `http://localhost:8000` |

---

## Tests

### Backend

```bash
cd back
python -m pytest -v
```

### Frontend

```bash
cd front
npm test
```

---

<div align="center">

**IIEG** — Instituto de Información Estadística y Geográfica de Jalisco

</div>
