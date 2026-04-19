---
name: docker
description: Convenciones para Docker, Dockerfiles y Docker Compose en el proyecto BI-IIEG.
applyTo: deploy/**
---

# Docker — Instrucciones globales

## Reglas generales

- Toda la configuración de contenedores vive en `deploy/`.
- Un Dockerfile por servicio, ubicado en `deploy/<servicio>/Dockerfile`.
- No mezclar configuración de infraestructura con código de aplicación.
- Mantener los archivos Docker claros, comentados cuando aporten valor, y fáciles de mantener.

## Dockerfiles — Multistage builds

- Usar siempre **multi-stage builds** para separar construcción de ejecución.
- Nombrar cada etapa de forma descriptiva (`AS builder`, `AS runtime`, etc.).
- La etapa final debe contener solo lo necesario para ejecutar la aplicación.
- No incluir herramientas de compilación, tests ni dependencias de desarrollo en la imagen final.
- Copiar solo artefactos necesarios entre etapas con `COPY --from=<etapa>`.
- Usar imágenes base oficiales y ligeras (`slim`, `alpine` cuando sea viable).
- Fijar versiones de imágenes base con tags explícitos (no usar `latest`).
- Ordenar instrucciones para maximizar cache de capas: dependencias antes que código fuente.
- Agrupar comandos relacionados en un solo `RUN` con `&&` para reducir capas.
- Incluir `.dockerignore` para excluir archivos innecesarios del contexto de build.
- Ejecutar el proceso principal con un usuario no root.
- No copiar archivos `.env`, secretos ni credenciales dentro de la imagen.

## Docker Compose

- Usar **Docker Compose V2** (comando `docker compose`, sin guion).
- Archivo principal: `deploy/docker-compose.yml`.
- Overrides para desarrollo: `deploy/docker-compose.dev.yml`.
- Definir cada servicio con nombre claro y descriptivo.
- Declarar `depends_on` con `condition: service_healthy` cuando el servicio lo soporte.
- Definir `healthcheck` para servicios críticos (base de datos, backend).
- Usar `volumes` nombrados para datos persistentes, no rutas absolutas del host.
- Para desarrollo, usar bind mounts para hot-reload del código fuente.
- No hardcodear puertos sensibles si pueden parametrizarse.

## Variables de entorno

- Toda configuración sensible o variable debe manejarse con variables de entorno.
- Definir variables de entorno en `deploy/.env` (nunca versionado).
- Mantener `deploy/.env.example` actualizado como referencia con valores de ejemplo.
- Referenciar variables en `docker-compose.yml` con la sintaxis `${VARIABLE}`.
- Usar `env_file` en los servicios de Compose para inyectar variables.
- No hardcodear secretos, credenciales, URLs ni puertos directamente en Dockerfiles ni Compose.
- No usar `ARG` para secretos en tiempo de build; los `ARG` quedan en el historial de capas.

## Buenas prácticas

- Mantener imágenes lo más pequeñas posible.
- No instalar paquetes innecesarios en la imagen final.
- Limpiar caches de package managers en el mismo `RUN` que instala (`rm -rf /var/cache`, `pip cache purge`, etc.).
- Usar `WORKDIR` para establecer el directorio de trabajo de forma explícita.
- Definir `EXPOSE` para documentar puertos, aunque no los publique.
- Preferir `COPY` sobre `ADD` salvo que se necesite descompresión automática.
- Etiquetar imágenes de forma consistente con `LABEL` (maintainer, versión, descripción).
- No correr múltiples procesos en un solo contenedor; un servicio por contenedor.

## Qué evitar

- No usar `docker-compose` (V1 con guion); usar `docker compose` (V2).
- No usar `latest` como tag de imagen base.
- No copiar secretos ni `.env` dentro de las imágenes.
- No instalar dependencias de desarrollo en la imagen final.
- No dejar herramientas de build en la etapa de ejecución.
- No usar `privileged` ni `--cap-add` sin justificación clara.
