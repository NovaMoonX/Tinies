---
applyTo: 'src/**/*'
---

# Adding New Tinies to Tinies

Instructions for adding and updating a new mini app (aka "tiny") to the repo.

## 1. Add to data

To add a new mini tiny to the gallery, simply add a new entry to the `TINIES` array in `src/lib/tinies/tinies.data.ts`:

```typescript
{
  id: 'your-tiny-id',
  title: 'The Tiny Title',
  description: 'A brief description of what your tiny does.',
  startDate: '2025-01-20', // ISO date format
  tags: ['tag1', 'tag2'], // Lowercase tags for filtering
  categories: ['Category Name'], // Categories for filtering
  status: 'in-progress', // always use 'in-progress'
  route: '/your-tiny-route', // Optional: if tiny has a dedicated route
}
```

## Example

```typescript
{
  id: 'calculator',
  title: 'Simple Calculator',
  description: 'A clean and minimal calculator for basic math operations.',
  startDate: '2025-02-01',
  tags: ['tools', 'math', 'utility'],
  categories: ['Tools', 'Productivity'],
  status: 'in-progress',
  route: '/calculator',
}
```

All tags and categories are automatically extracted and made available for filtering.

## 2. Create the Tiny

Below are the steps to create the actual tiny:


- Create a new folder in `src/tinies/` with the same name as the `id` you used in the data file (e.g., `calculator`).
- Inside that folder, create a main page component using the title-cased version of the tiny ID (e.g., `Calculator.tsx`).
  - This component should be the default export of the file.
- You can also create additional files as needed for types, utilities, hooks, data, components, etc.
  - These should use file qualifiers like `.types.ts`, `.utils.ts`, `.hooks.ts`, `.data.ts`, `.components.tsx`, etc.
  - Only one of each qualifier is allowed per tiny.
  - Example: `Calculator.tsx`, `Calculator.utils.ts`, `Calculator.hooks.ts`, `Calculator.types.ts`, `Calculator.data.ts`, `Calculator.components.tsx`.

## 3. Import and Use the Tiny

Add a new lazy-loaded route in `src/routes/AppRoutes.tsx` for the tiny by importing the main component: 

```typescript
import Calculator from '@tinies/calculator/Calculator';
```
