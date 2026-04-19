---
name: python
description: Convenciones globales para Python en el backend del proyecto BI-IIEG.
applyTo: back/**/*.py
---

# Python — Instrucciones globales

## Reglas generales

- Priorizar código simple, claro, mantenible y modular.
- Evitar sobreingeniería.
- Mantener consistencia en nombres, estructura y estilo en todo el proyecto.
- Antes de agregar archivos o módulos nuevos, respetar la estructura ya definida del repositorio.
- Toda lectura y escritura de archivos debe manejarse en UTF-8.
- No usar prints para depuración o seguimiento; usar logger.
- No mezclar acceso a datos, validación, reglas de negocio y presentación en un mismo archivo.

## Lenguaje y entorno

- Versión objetivo: Python 3.12.
- Usar siempre el entorno Conda llamado `bi-iieg` cuando se ejecute, pruebe o desarrolle código del proyecto.

## Imports

- Mantener imports solamente en la parte superior del archivo.
- No usar imports dentro de funciones, salvo que exista una razón técnica clara.

## Convenciones de nombres

- `snake_case` para variables, funciones, módulos y archivos.
- `PascalCase` para clases.
- `UPPER_CASE` para constantes.

## Funciones

- Toda función debe incluir typing en parámetros y retorno.
- Toda función debe tener docstring clara y breve con:
  - descripción
  - args
  - returns
- Preferir funciones atómicas, reutilizables y con una sola responsabilidad.
- Evitar funciones demasiado largas.
- Evitar código duplicado; extraer lógica repetida a funciones reutilizables.

## Comentarios y logging

- Comentar únicamente bloques concretos cuando aporte claridad real.
- Los comentarios deben ser simples, cortos y usando `#`.
- No usar prints; usar logger.
- Mantener el logger sencillo, directo y consistente.

## Manejo de errores

- Manejar errores de forma explícita y clara.

## Estilo de implementación

- Escribir primero código legible antes que código "inteligente".
- Preferir claridad sobre abreviaciones.
- Mantener cada archivo enfocado en una responsabilidad concreta.
- Si una solución se puede resolver de forma simple o compleja, elegir la simple.
- Al generar código nuevo, seguir el patrón existente del proyecto antes de proponer estructuras distintas.

## Qué evitar

- No usar prints.
- No usar imports dentro de funciones sin razón técnica clara.
- No mezclar múltiples responsabilidades en un mismo archivo.
- No generar código innecesariamente abstracto.
- No agregar dependencias nuevas sin justificación clara.
