---
name: create-backend-module
description: Genera la estructura base de un módulo nuevo en el backend de BI-IIEG con routes, services, schemas, models, consts y exceptions.
argument-hint: Nombre del módulo a crear (ejemplo: "connections", "queries", "dashboards")
---

# Crear módulo backend

Genera los archivos para un módulo nuevo distribuidos en las **carpetas de capa** existentes del backend (`back/`).

## Estructura de capas

El backend usa una **arquitectura por capas**, no por módulos. Cada capa es una carpeta en la raíz de `back/` y contiene un archivo por módulo:

```
back/
├── routes/
│   └── {nombre_modulo}.py       # Endpoints FastAPI
├── services/
│   └── {nombre_modulo}.py       # Lógica de negocio
├── schemas/
│   └── {nombre_modulo}.py       # Schemas Pydantic
├── models/
│   └── {nombre_modulo}.py       # Modelos SQLAlchemy
├── consts/
│   └── {nombre_modulo}.py       # Constantes y mensajes
├── exceptions/
│   └── {nombre_modulo}.py       # Excepciones personalizadas
├── main.py
├── config.py
└── db.py
```

**NO crear carpetas por módulo.** Los archivos de un módulo se distribuyen uno por capa.

## Entrada

El usuario proporciona el **nombre del módulo** en singular o plural. Normalizar a `snake_case`.

## Pasos

### 1. Validar contexto

- Leer la estructura actual de `back/` para respetar el patrón existente.
- Verificar que no exista ya un archivo `routes/{nombre_modulo}.py`.
- Si ya existe, informar al usuario y preguntar si desea extenderlo.

### 2. Generar los archivos

Crear los siguientes archivos en sus carpetas de capa. Cada uno debe contener solo imports mínimos, placeholders con `TODO` y la estructura base lista para implementar:

| Archivo | Responsabilidad |
|---|---|
| `routes/{nombre_modulo}.py` | Endpoints del módulo. Router de FastAPI con prefijo `/{nombre_modulo}`. Sin lógica de negocio. |
| `services/{nombre_modulo}.py` | Lógica de negocio y CRUDs. Funciones async. |
| `schemas/{nombre_modulo}.py` | Schemas Pydantic v2 de request y response. |
| `models/{nombre_modulo}.py` | Modelos SQLAlchemy 2.x. |
| `consts/{nombre_modulo}.py` | Constantes, mensajes y catálogos. |
| `exceptions/{nombre_modulo}.py` | Excepciones personalizadas. |

### 3. Convenciones de imports entre capas

Usar siempre rutas desde la capa correspondiente:

```python
# En services/{nombre_modulo}.py
from consts.{nombre_modulo} import ALGUNA_CONSTANTE
from exceptions.{nombre_modulo} import AlgunaExcepcion
from models.{nombre_modulo} import AlgunModelo
from schemas.{nombre_modulo} import AlgunSchema

# En routes/{nombre_modulo}.py
from consts.{nombre_modulo} import ALGUNA_CONSTANTE
from exceptions.{nombre_modulo} import AlgunaExcepcion
from schemas.{nombre_modulo} import AlgunSchema
from services import {nombre_modulo} as {nombre_modulo}_service
```

### 4. Convenciones obligatorias en cada archivo

- Imports en la parte superior.
- Typing en parámetros y retorno de toda función.
- Docstring breve en toda función (descripción, args, returns).
- Usar `logger` (nunca `print`).
- Nombres en `snake_case` para funciones/variables, `PascalCase` para clases, `UPPER_CASE` para constantes.

### 5. Plantilla de routes/{nombre_modulo}.py

```python
"""Routes for {nombre_modulo} module."""

import logging

from fastapi import APIRouter

from services import {nombre_modulo} as {nombre_modulo}_service

router = APIRouter(prefix="/{nombre_modulo}", tags=["{nombre_modulo}"])
logger = logging.getLogger(__name__)

# TODO: define endpoints
```

### 6. Plantilla de services/{nombre_modulo}.py

```python
"""Business logic for {nombre_modulo} module."""

import logging

logger = logging.getLogger(__name__)

# TODO: implement service functions
```

### 7. Plantilla de schemas/{nombre_modulo}.py

```python
"""Pydantic schemas for {nombre_modulo} module."""

# TODO: define request and response schemas
```

### 8. Plantilla de models/{nombre_modulo}.py

```python
"""SQLAlchemy models for {nombre_modulo} module."""

from db import Base

# TODO: define database models
```

### 9. Plantilla de consts/{nombre_modulo}.py

```python
"""Constants and messages for {nombre_modulo} module."""

# TODO: define constants
```

### 10. Plantilla de exceptions/{nombre_modulo}.py

```python
"""Custom exceptions for {nombre_modulo} module."""

# TODO: define exceptions
```

### 11. Registrar el router en main.py

```python
from routes.{nombre_modulo} import router as {nombre_modulo}_router

app.include_router({nombre_modulo}_router)
```

### 12. Confirmar resultado

Listar los archivos creados y confirmar brevemente al usuario.

## Reglas

- **No crear carpetas por módulo.** Un archivo por capa es el patrón correcto.
- No generar lógica de negocio. Solo estructura y placeholders.
- No inventar campos de modelos ni endpoints concretos salvo que el usuario los especifique.
- Respetar la estructura existente del proyecto; si ya hay módulos, seguir su patrón exacto.
- No agregar dependencias nuevas.
- Mantener todo simple y mínimo.
