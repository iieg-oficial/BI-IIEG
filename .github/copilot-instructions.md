# Copilot Instructions — BI-IIEG

## Reglas globales

- Este repositorio es un **monorepo** con tres carpetas principales: `front/`, `back/` y `deploy/`.
- Mantener **separación estricta** entre frontend, backend y despliegue.
- No mezclar lógica de negocio con configuración ni infraestructura.
- Priorizar **claridad, modularidad y mantenibilidad** sobre brevedad.
- Usar **nombres descriptivos y consistentes**: documentación en español, código en inglés.
- Antes de generar código nuevo, **verificar y respetar** la estructura existente del monorepo.
- Documentar decisiones importantes en Markdown dentro de la carpeta relevante.
- Pensar en **escalabilidad futura**: múltiples conectores de BD, ejecución parametrizada de queries, variedad de gráficas y dashboard builder extensible.

## Convenciones de código

### Python (back/)
- Python 3.12+, tipado estricto con type hints
- FastAPI + Pydantic v2 + SQLAlchemy 2.x async
- Lint y formato con Ruff
- Tests con pytest

### TypeScript (front/)
- React + TypeScript estricto
- Vite como bundler
- Plotly para visualizaciones
- Componentes funcionales con hooks

### Docker (deploy/)
- Un Dockerfile por servicio
- Compose para orquestación
- Variables de entorno vía archivos `.env`

## Referencias

- Estructura general y contexto: [AGENTS.md](../AGENTS.md)
- Frontend: [front/README.md](../front/README.md)
- Backend: [back/README.md](../back/README.md)
- Despliegue: [deploy/README.md](../deploy/README.md)
