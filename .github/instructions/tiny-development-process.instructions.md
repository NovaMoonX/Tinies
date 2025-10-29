---
applyTo: 'src/**/*'
---

# Adding New Tinies to Tinies

Instructions for adding and updating a new mini app (aka "tiny") to the repo.

## Important Development Guidelines

### 🚫 No Persistent Storage by Default
**Do NOT use localStorage or sessionStorage unless explicitly requested.** All tinies should work entirely in memory using React state. This ensures:
- Clean demos that reset on each visit
- No data persistence complications
- Simpler, more maintainable code
- Consistent user experience

If persistent storage is needed for a specific tiny, it must be explicitly requested and justified.

## Step 1: Add to Data

Add a new entry to the `ALL_TINIES` array in `src/lib/tinies/tinies.data.ts`:

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

### Example Entry

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

## Step 2: Create the Tiny Structure

### 2.1 Create Folder Structure

Create a new folder in `src/tinies/` with the **exact same name** as the `id` you used in the data file:

```
src/tinies/calculator/
```

### 2.2 Create Main Component

Inside that folder, create a main component using the **title-cased version** of the tiny ID:

**File:** `src/tinies/calculator/Calculator.tsx`

```typescript
import { TinyPage } from '@ui/layout/TinyPage';

export function Calculator() {
  return (
    <TinyPage
      title='Calculator'
      description='A clean and minimal calculator for basic math operations.'
    >
      {/* Your calculator UI here */}
    </TinyPage>
  );
}

export default Calculator;
```

### 2.3 Organize Additional Files (Optional)

Create additional files as needed using the **exact file naming pattern**:

#### Types File

**File:** `Calculator.types.ts`

IMPORTANT: Never have `undefined` fields in your types. Use `null` instead.

```typescript
export interface CalculatorOperation {
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  value: number;
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: CalculatorOperation['type'] | null;
}
```

#### Data File

**File:** `Calculator.data.ts`

```typescript
import { CalculatorOperation } from './Calculator.types';

export const CALCULATOR_BUTTONS = [
  '7',
  '8',
  '9',
  '/',
  '4',
  '5',
  '6',
  '*',
  '1',
  '2',
  '3',
  '-',
  '0',
  '.',
  '=',
  '+',
];

export const OPERATIONS: CalculatorOperation['type'][] = [
  'add',
  'subtract',
  'multiply',
  'divide',
];
```

#### Utils File

**File:** `Calculator.utils.ts`

```typescript
import { CalculatorOperation } from './Calculator.types';

export function performCalculation(
  prev: number,
  current: number,
  operation: CalculatorOperation['type'],
): number {
  switch (operation) {
    case 'add':
      return prev + current;
    case 'subtract':
      return prev - current;
    case 'multiply':
      return prev * current;
    case 'divide':
      return prev / current;
    default:
      return current;
  }
}

export function formatDisplay(value: string): string {
  return parseFloat(value).toLocaleString();
}
```

#### Hooks File

Only create this file if you really need custom hooks (i.e. to encapsulate complex stateful logic). Otherwise, keep logic in the main component.

**File:** `Calculator.hooks.ts`

```typescript
import { useState } from 'react';
import { CalculatorState } from './Calculator.types';
import { performCalculation } from './Calculator.utils';

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
  });

  const handleNumber = (num: string) => {
    // Calculator logic here
    // Note: Keep all state in memory - no localStorage/sessionStorage
  };

  return { state, handleNumber };
}
```

#### Components File

**File:** `Calculator.components.tsx`

```typescript
import { Button } from '@moondreamsdev/dreamer-ui/components';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  variant?: 'default' | 'operation';
}

export function CalculatorButton({ value, onClick, variant = 'default' }: CalculatorButtonProps) {
  return (
    <Button
      onClick={() => onClick(value)}
      variant={variant === 'operation' ? 'secondary' : 'outline'}
      className='h-12 text-lg'
    >
      {value}
    </Button>
  );
}
```

### 2.4 Import Structure in Main Component

Update your main component to import from the additional files:

```typescript
import { Button } from '@moondreamsdev/dreamer-ui/components';
import { CALCULATOR_BUTTONS } from './Calculator.data';
import { useCalculator } from './Calculator.hooks';
import { CalculatorButton } from './Calculator.components';

export function Calculator() {
  const { state, handleNumber } = useCalculator();

  return (
    <div className='page min-h-screen w-full p-4 pt-16 md:p-8 md:pt-24'>
      {/* Component JSX */}
    </div>
  );
}

export default Calculator;
```

## Step 3: Add Route

Add a new lazy-loaded route in `src/routes/AppRoutes.tsx`:

```typescript
// Calculator (lazy loaded)
{
  path: 'calculator',
  HydrateFallback: Loading,
  lazy: async () => {
    const { default: Calculator } = await import('@tinies/calculator/Calculator');
    return { Component: Calculator };
  },
},
```

## File Naming Rules

### ✅ Allowed File Qualifiers

- `.types.ts` - TypeScript interfaces and types
- `.data.ts` - Static data, constants, and arrays
- `.utils.ts` - Pure utility functions
- `.hooks.ts` - Custom React hooks
- `.components.tsx` - Reusable React components

### ❌ Restrictions

- Only **one file of each qualifier** per tiny
- File names must match the **exact pattern**: `TinyName.qualifier.extension`
- Main component must be **title-cased** and match the folder name

### Example File Structure

```
src/tinies/calculator/
├── Calculator.tsx          # Main component (required)
├── Calculator.types.ts     # Types and interfaces (never have undefined fields. Use null instead)
├── Calculator.data.ts      # Static data
├── Calculator.utils.ts     # Utility functions
├── Calculator.hooks.ts     # Custom hooks
└── Calculator.components.tsx # Reusable components
```

## Complete Example

For a tiny with ID `calculator`, you would have:

1. **Data entry** in `tinies.data.ts` with `id: 'calculator'`
2. **Folder** at `src/tinies/calculator/`
3. **Main component** at `Calculator.tsx`
4. **Route** importing `@tinies/calculator/Calculator`
5. **Additional files** following the naming pattern (optional)

This structure ensures consistency, maintainability, and follows the established patterns across all tinies.
