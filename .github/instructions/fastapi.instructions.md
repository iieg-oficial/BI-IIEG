---
name: fastapi
description: Convenciones globales para FastAPI en el backend del proyecto BI-IIEG.
applyTo: back/**/*.py
---

# FastAPI — Instrucciones globales

## Estructura del backend

- Usar FastAPI con una estructura modular y desacoplada.
- Ubicar los endpoints en `routes`.
- Ubicar la lógica de negocio y CRUDs en `services`.
- Ubicar los esquemas de entrada y salida en `schemas`.
- Ubicar los modelos de base de datos en `models`.
- Ubicar constantes, catálogos, diccionarios y mensajes en `consts`.
- Ubicar errores personalizados en `exceptions`.
- Para cada módulo nuevo, crear sus archivos correspondientes en estas capas cuando aplique.
- Mantener `main`, `config` y `db` en la raíz del backend.

## Convenciones para endpoints

- Cada endpoint debe ser delgado: recibir la petición, validar, delegar al service y retornar respuesta.
- No colocar lógica de negocio dentro de endpoints.
- No colocar consultas SQL ni lógica compleja dentro de `routes`.
- Definir `response_model` cuando corresponda.
- Usar códigos HTTP correctos y consistentes.
- Mantener nombres de rutas claros, cortos y orientados a recursos.
- Agrupar endpoints por dominio funcional.

## Validación y esquemas

- Usar `schemas` para validar entrada y estructurar salida.
- Separar esquemas de request y response cuando tenga sentido.
- No exponer directamente modelos de base de datos como respuesta de API.
- Mantener los esquemas claros, pequeños y orientados al caso de uso.

## Configuración y base de datos

- Centralizar configuración en `config`.
- No hardcodear secretos, credenciales ni URLs.
- Usar variables de entorno para configuración sensible.
- Centralizar la conexión y sesión de base de datos en `db`.
- Mantener separada la definición de modelos y el acceso a base de datos.

## Qué evitar

- No poner lógica de negocio en endpoints.
- No colocar consultas SQL dentro de routes.
- No exponer modelos de base de datos directamente como respuesta de API.
- No hardcodear secretos ni credenciales.
