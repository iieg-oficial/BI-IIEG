---
name: create-frontend-feature
description: Genera la estructura base de una feature nueva en el frontend de BI-IIEG con page, components, services, hooks y consts.
argument-hint: Nombre de la feature a crear (ejemplo: "connections", "queries", "dashboards")
---

# Crear feature frontend

Genera la estructura de archivos para una feature nueva en `front/src/features/`.

## Entrada

El usuario proporciona el **nombre de la feature**. Normalizar a `kebab-case` para carpetas y archivos, `PascalCase` para componentes y páginas.

Ejemplo: si el usuario dice "connections" → carpeta `connections`, página `ConnectionsPage`, componente `ConnectionList`, etc.

## Pasos

### 1. Validar contexto

- Leer la estructura actual de `front/src/` para respetar el patrón existente.
- Verificar que la feature no exista ya.
- Si ya existe, informar al usuario y preguntar si desea extenderla.

### 2. Crear la carpeta de la feature

Crear `front/src/features/{nombre_feature}/` con la siguiente estructura:

```
front/src/features/{nombre_feature}/
├── components/
│   └── index.ts
├── hooks/
│   └── index.ts
├── services/
│   └── {nombre_feature}Service.ts
├── consts/
│   └── index.ts
├── {NombreFeature}Page.tsx
└── index.ts
```

### 3. Generar los archivos base

Cada archivo debe contener solo imports mínimos, placeholders con `TODO` y la estructura base lista para implementar.

#### {NombreFeature}Page.tsx — Página principal

```tsx
/**
 * Main page for {nombre_feature}.
 */

export default function {NombreFeature}Page() {
  // TODO: implement data fetching via hooks
  const isLoading = false;
  const isError = false;
  const isEmpty = false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  if (isEmpty) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>{NombreFeature}</h1>
      {/* TODO: compose components here */}
    </div>
  );
}
```

#### components/index.ts — Barrel de componentes

```ts
/**
 * Reusable components for {nombre_feature}.
 */

// TODO: export components as they are created
```

#### hooks/index.ts — Barrel de hooks

```ts
/**
 * Custom hooks for {nombre_feature}.
 */

// TODO: export hooks as they are created
```

#### services/{nombre_feature}Service.ts — Comunicación con API

```ts
/**
 * API service for {nombre_feature}.
 */

// TODO: implement API calls

// Example placeholder:
// export async function fetch{NombreFeature}(): Promise<unknown> {
//   const response = await fetch(`${API_BASE_URL}/{nombre_feature}`);
//   return response.json();
// }
```

#### consts/index.ts — Constantes de la feature

```ts
/**
 * Constants, labels and messages for {nombre_feature}.
 */

// TODO: define constants
```

#### index.ts — Barrel de la feature

```ts
export { default as {NombreFeature}Page } from './{NombreFeature}Page';
```

### 4. Convenciones obligatorias

- `PascalCase` para componentes y páginas.
- `camelCase` para funciones, variables, hooks y props.
- `use...` para hooks personalizados.
- Nombres descriptivos; evitar abreviaciones.
- Componentes pequeños y de responsabilidad única.
- La página compone componentes; no concentra lógica.
- Llamadas HTTP solo en `services/`, nunca en componentes directamente.
- Toda vista debe contemplar estados: loading, empty, error y success como mínimo.

### 5. Registrar la ruta (si aplica)

- Buscar dónde se definen las rutas en `front/src/routes/` o equivalente.
- Agregar una ruta para la nueva página.
- Si la configuración de rutas no existe aún, indicar al usuario dónde registrarla cuando se cree.

### 6. Confirmar resultado

Listar los archivos creados y confirmar brevemente al usuario.

## Reglas

- No generar lógica de negocio. Solo estructura y placeholders.
- No inventar campos, props ni endpoints concretos salvo que el usuario los especifique.
- Respetar la estructura existente del proyecto; si ya hay features, seguir su patrón exacto.
- No agregar dependencias nuevas.
- Mantener todo simple y mínimo.
- Si el proyecto aún no está inicializado (no hay `src/`), crear solo la estructura de carpetas y avisar al usuario.
