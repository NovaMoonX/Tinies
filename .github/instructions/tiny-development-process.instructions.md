---
applyTo: 'src/**/*'
---

# Adding New Tinies to Tinies

Instructions for adding and updating a new mini app (aka "tiny") to the repo.

## Important Development Guidelines
### 📝 Always Use Form Components
**Always use the `Form` component for forms. For individual fields, always use the corresponding form component (e.g., use `Select` instead of the native `select` element, `Input` instead of `input`, etc).**


Example usage:
```tsx
import { Form } from '@moondreamsdev/dreamer-ui/components';
import { FormFactories } from '@moondreamsdev/dreamer-ui/components';

const { select, textarea, checkboxGroup } = FormFactories;

export function MyForm({ categories, apartments, onAdd }) {
  const initialData = { category: '', question: '', associatedApartments: [] };
  const [formData, setFormData] = useState(initialData);

  return (
    <Form
      initialData={initialData}
      form={[
        select({
          name: 'category',
          label: 'Category',
          options: categories.map((cat) => ({ value: cat, label: cat })),
          required: true,
        }),
        textarea({
          name: 'question',
          label: 'Question',
          required: true,
        }),
        ...(apartments.length > 0
          ? [
              checkboxGroup({
                name: 'associatedApartments',
                label: 'Associate with apartments',
                options: apartments.map((apt) => ({ value: apt.id, label: apt.name })),
                required: true,
              }),
            ]
          : []),
      ]}
      onDataChange={setFormData}
    />
  );
}
```

See `src/tinies/apartment-tour-questions/ApartmentTourQuestions.components.tsx` for a real-world example of the Form component in use.

### 📝 Use Individual Form Components for Single Fields
If you do not need a full form, always use the corresponding Dreamer UI form component for individual fields. For example, use the `Select` component instead of the native `select` element, and `Input` instead of `input`.

- This ensures consistent styling, validation, and accessibility
- Do not use native HTML form elements unless there is no Dreamer UI or project form component available

Example:
```tsx
import { Select, Input } from '@moondreamsdev/dreamer-ui/components';

export function MySingleFieldComponent({ options, value, onChange }) {
  return (
    <Select
      name="type"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}
```

### 🚫 No Persistent Storage by Default
**Do NOT use localStorage or sessionStorage unless explicitly requested.** All tinies should work entirely in memory using React state.

### ⏰ Date and Time Storage
**Always store date and time values as milliseconds (numbers) using `Date.now()` or `new Date().getTime()`.**

- Store timestamps as `number` type, not as ISO strings or Date objects
- Use `Date.now()` for current timestamps
- Convert date inputs to milliseconds: `new Date(dateString).getTime()`
- Display dates by converting from milliseconds: `new Date(timestamp).toLocaleDateString()`

Example:
```tsx
// ✅ Correct - store as milliseconds
interface MyData {
  createdAt: number;  // timestamp in milliseconds
  lastModified: number | null;  // optional timestamp
}

// Creating timestamps
const newItem = {
  id: generateId(),
  createdAt: Date.now(),  // current time in ms
  lastModified: null,
};

// Converting from date input
const dateHeard = dateInputValue ? new Date(dateInputValue).getTime() : null;

// Displaying dates
<p>{new Date(item.createdAt).toLocaleDateString()}</p>

// ❌ Wrong - don't use ISO strings
const newItem = {
  createdAt: new Date().toISOString(),  // Don't do this
};
```

### 🗑️ Always Confirm Deletions
**Always use `useActionModal` to confirm any destructive actions (such as deleting vehicles, service entries, or locations).**

- This ensures users never accidentally delete important data
- The modal should clearly state what is being deleted and require explicit confirmation
- Never perform a deletion directly from a button click—always show a confirmation modal first

Example usage:
```tsx
const { showActionModal } = useActionModal();

function handleDelete(id: string) {
  showActionModal({
    title: 'Delete Vehicle',
    description: 'Are you sure you want to delete this vehicle? This action cannot be undone.',
    confirmLabel: 'Delete',
    onConfirm: () => onDeleteCar(id),
  });
}
```

This applies to all destructive actions in tinies.

### 📂 Use Disclosure for Expand/Collapse
**Always use the `Disclosure` component for collapsible sections with expand/collapse functionality.**

- Use `Disclosure` instead of manual button toggles for showing/hiding advanced options, filters, or additional content
- The component handles its own state and provides a consistent UI pattern
- Pass a `label` prop for the disclosure button text

Example usage:
```tsx
import { Disclosure } from '@moondreamsdev/dreamer-ui/components';

<Disclosure label='Advanced Filters' className='rounded-xl'>
  <div className='space-y-4 p-2 pt-2'>
    {/* Your collapsible content here */}
  </div>
</Disclosure>
```

See `src/tinies/recipe-book/RecipeBook.components.tsx` for a real-world example of Disclosure in use.
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

#### Defaults File

**File:** `Calculator.defaults.ts`

This file contains default values for all data objects used in Firebase persistence. Every tiny that persists data to Firebase must have a defaults file.

```typescript
import { CalculatorState, CalculatorData, CalculatorOperation } from './Calculator.types';

export const defaultCalculatorData: CalculatorData = {
  history: [],
  savedValues: [],
};

export const defaultCalculatorState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
};
```

**Key Points:**
- Import all interfaces from the `.types.ts` file (data interfaces should be defined in `.types.ts`, not `.defaults.ts`)
- Export default values for every object type that will be normalized when loading from Firebase
- Use these defaults with the `withDefaults()` utility from `@lib/tinies/tinies.hooks`

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
- `.defaults.ts` - Default values for Firebase data normalization (required for tinies with persistence)
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
├── Calculator.defaults.ts  # Default values for Firebase data (required if using Firebase)
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
