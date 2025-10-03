# Tinies

Where dreams take their first breath. These are my tinies—concept apps, MVPs, whimsical experiments, and those late-night ‘wouldn’t it be cool if…’ sparks. Some may grow, most will simply exist as they are. No pressure. Just dreams in motion.

## Tech Stack

- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Dreamer UI](https://www.npmjs.com/package/@moondreamsdev/dreamer-ui)

## Import Aliases

This project is configured with import aliases for cleaner imports:

```tsx
// Instead of messy relative paths
import { something } from '../../../lib/utils'

// Use clean aliases
import { something } from '@lib/utils'
```

Available aliases:
- `@/` → `src/`
- `@components/` → `src/components/`
- `@contexts/` → `src/contexts/`
- `@hooks/` → `src/hooks/`
- `@lib/` → `src/lib/`
- `@routes/` → `src/routes/`
- `@screens/` → `src/screens/`
- `@store/` → `src/store/`
- `@styles/` → `src/styles/`
- `@ui/` → `src/ui/`
- `@utils/` → `src/utils/`
