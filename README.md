# additionalTypes Plugin

A custom [Hey API](https://heyapi.dev) plugin that generates TypeScript union types for all **tags** and **operation IDs** found in your OpenAPI schema.

Its main purpose is to provide strongly-typed constants for use with **React Query** `meta` invalidation — so instead of plain strings you get compile-time safety when referencing tags or operation IDs.

## Generated output

Given an OpenAPI schema with operations tagged `users`, `products`, and operation IDs `getUsers`, `createUser`, the plugin generates:

```ts
// additionalTypes.gen.ts
export type AvailableTags = 'products' | 'users';
export type AvailableOperationIds = 'createUser' | 'getUsers';
```

Both unions are sorted alphabetically. If no tags / operation IDs exist in the schema, the type falls back to `never`.

## Installation

Copy `additionalTypes.ts` into your project alongside your `openapi-ts.config.ts`.

```
your-project/
├── openapi-ts.config.ts
├── additionalTypes.ts   ← plugin file
└── src/
    └── client/          ← generated output
```

## Usage

```ts
// openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts';
import { additionalTypesConfig } from './additionalTypes.js';

export default defineConfig({
  input: './openapi.yaml',
  output: 'src/client',
  plugins: [
    '@hey-api/typescript',
    additionalTypesConfig(),
  ],
});
```

### With options

```ts
additionalTypesConfig({
  generateTags: true,
  generateOperationIds: false,
  tagsTypeName: 'ApiTag',
})
```

## Options

| Option                | Type      | Default                  | Description                                          |
|-----------------------|-----------|--------------------------|------------------------------------------------------|
| `generateTags`        | `boolean` | `true`                   | Generate union type of all operation tags            |
| `generateOperationIds`| `boolean` | `true`                   | Generate union type of all operation IDs             |
| `tagsTypeName`        | `string`  | `'AvailableTags'`        | Name of the generated tags union type                |
| `operationIdsTypeName`| `string`  | `'AvailableOperationIds'`| Name of the generated operation IDs union type       |