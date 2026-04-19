---
name: react
description: Convenciones globales para React en el frontend del proyecto BI-IIEG.
applyTo: front/**/*.{tsx,jsx}
---

# React — Instrucciones globales

## React

- Usar React con una arquitectura simple, escalable y fácil de mantener.
- Priorizar componentes reutilizables y de responsabilidad única.
- Mantener los componentes pequeños y enfocados.
- Evitar componentes demasiado grandes o con demasiada lógica interna.
- Extraer lógica reutilizable a hooks, helpers o servicios cuando tenga sentido.
- Mantener el JSX limpio y fácil de leer.
- Evitar lógica compleja directamente dentro del JSX.
- Usar nombres descriptivos para componentes, props, funciones y variables.

## Reglas para componentes

- Un componente debe encargarse de una responsabilidad concreta.
- Separar componentes de presentación de componentes con lógica cuando sea necesario.
- Evitar componentes "todólogos".
- Recibir datos por props de forma clara y explícita.
- Mantener props simples y bien nombradas.
- Extraer secciones repetidas a componentes reutilizables.
- No duplicar interfaces visuales si pueden abstraerse de forma simple.

## Reglas para páginas

- Las páginas deben componer componentes, no concentrar demasiada lógica.
- Mantener las páginas enfocadas al flujo de la vista.
- Delegar lógica reutilizable a hooks y llamadas a datos a services.
- No llenar las páginas con JSX repetido o bloques muy largos.

## Estado y lógica

- Mantener el estado lo más local posible.
- Elevar estado solo cuando realmente se comparta entre componentes.
- Evitar estado global innecesario.
- No guardar en estado valores que puedan derivarse fácilmente.
- Mantener clara la diferencia entre estado de UI, datos de API y estado derivado.
- Extraer lógica compleja de estado a hooks personalizados cuando ayude a la legibilidad.

## UX mínima esperada

- Toda vista que consuma datos debe contemplar:
  - estado de carga
  - estado vacío
  - estado de error
  - estado exitoso
- No dejar pantallas en blanco sin explicación al usuario.
- Mostrar mensajes claros y simples.
- Priorizar interfaces entendibles antes que interfaces complejas.

## Formularios e interacción

- Mantener formularios claros y controlados.
- Validar datos de entrada de forma simple y predecible.
- Mostrar mensajes de error comprensibles.
- Evitar mezclar validación, render y envío en bloques difíciles de leer.

## Estilos y UI

- Mantener consistencia visual entre componentes.
- Evitar estilos desordenados o duplicados.
- Priorizar una UI simple, limpia y funcional.
- Reutilizar patrones visuales antes de crear variantes nuevas.
- Separar estructura, comportamiento y estilo de forma ordenada.

## Qué evitar

- No poner lógica compleja directamente en JSX.
- No hacer componentes demasiado grandes.
- No duplicar llamadas a API en múltiples lugares sin necesidad.
- No hacer componentes demasiado grandes.
- No duplicar llamadas a API en múltiples lugares sin necesidad.
- No mezclar UI, estado, negocio y acceso a datos en un solo archivo.
- No crear abstracciones tempranas sin necesidad real.
- No agregar librerías nuevas sin justificación clara.
