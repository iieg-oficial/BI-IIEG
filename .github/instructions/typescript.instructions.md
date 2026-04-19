---
name: typescript
description: Convenciones globales para TypeScript en el frontend del proyecto BI-IIEG.
applyTo: front/**/*.{ts,tsx,js,jsx}
---

# TypeScript — Instrucciones globales

## Reglas generales

- Priorizar código simple, claro, mantenible y modular.
- Evitar sobreingeniería.
- Mantener consistencia en nombres, estructura y estilo en todo el frontend.
- Antes de agregar archivos, carpetas o patrones nuevos, respetar la estructura ya definida del proyecto.
- No mezclar lógica de presentación, lógica de negocio, manejo de estado y acceso a APIs en un mismo archivo.
- Cada archivo debe tener una responsabilidad clara.

## Convenciones de nombres

- Usar `PascalCase` para componentes, páginas, layouts y tipos/interfaces.
- Usar `camelCase` para variables, funciones, props y hooks.
- Usar `use...` para hooks personalizados.
- Usar nombres claros y semánticos para archivos y carpetas.
- Evitar abreviaciones innecesarias.

## Estructura sugerida

- `components`: componentes reutilizables de UI o funcionales.
- `pages`: vistas principales o pantallas.
- `layouts`: estructuras generales de página.
- `routes`: definición y organización de rutas.
- `services`: llamadas a API y comunicación con backend.
- `hooks`: lógica reutilizable basada en hooks.
- `utils`: funciones auxiliares puras.
- `consts`: constantes, catálogos, labels y configuraciones simples.
- `types` o `interfaces`: tipados globales.
- `assets`: imágenes, íconos y recursos estáticos.

## Servicios y APIs

- Toda llamada al backend debe vivir en `services`.
- No hacer llamadas HTTP directamente dentro de componentes grandes si puede abstraerse.
- Mantener separada la lógica de transformación de datos de la UI.
- Centralizar URLs base, configuración y helpers relacionados con API.
- Manejar errores de forma clara y predecible.

## Estilo de implementación

- Escribir primero código legible antes que código "ingenioso".
- Preferir claridad sobre abreviaciones.
- Mantener archivos cortos y enfocados.
- Si una solución se puede resolver de forma simple o compleja, elegir la simple.
- Al generar código nuevo, seguir el patrón existente del proyecto antes de proponer estructuras distintas.

## Qué evitar

- No mezclar UI, estado, negocio y acceso a datos en un solo archivo.
- No crear abstracciones tempranas sin necesidad real.
- No agregar librerías nuevas sin justificación clara.
