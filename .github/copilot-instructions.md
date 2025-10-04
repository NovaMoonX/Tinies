# GitHub AI Instructions for $APP_TITLE Project

2 IMPORTANT THINGS TO ALWAYS KEEP IN MIND: 
- Always refer to mini-apps as "tinies" (plural) and "tiny" (singular)
- Always optimize for smaller screens first by using mobile-first responsive design principles (i.e. using a modal for filters on mobile instead of a sidebar)

## Core Development Rules

### 1. Component Creation
- Use \`export function ComponentName\` syntax (NOT \`React.FC\` or arrow functions)

### 2. Styling & Class Names
- Use TailwindCSS exclusively
- Use \`join\` from \`@moondreamsdev/dreamer-ui/utils\` for conditional class names
- Use existing styles and colors from \`src/dreamer-ui.css\` and \`src/index.css\` when applicable (do not modify them)

\`\`\`tsx
import { join } from '@moondreamsdev/dreamer-ui/utils';

export function Test({ variant, className }: TestProps) {
  return (
    <div 
      className={join(
        'px-4 py-2 rounded',
        variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary',
        className
      )}
    >
      Click me
    </div>
  );
}
\`\`\`

### 3. Component Library Priority
- Always check Dreamer UI first before creating custom components
- Import from \`@moondreamsdev/dreamer-ui/components\`, \`/hooks\`, \`/symbols\`, \`/utils\`
- Always check existing props of Dream UI components before setting custom styles

### 4. File Structure
Follow the existing structure:
\`\`\`
src/
├── components/ # Reusable UI components
├── contexts/   # React context providers
├── hooks/      # Custom React hooks
├── lib/        # Utilities and constants
├── routes/     # Router configuration
├── screens/    # Page/route components
├── store/      # State management (i.e. Redux store)
├── styles/     # Additional CSS/styling files
├── tinies/     # Mini-apps (tinies)
├── ui/         # Layout and core UI components
├── utils/      # Utility functions
\`\`\`

### 5. Import Patterns
\`\`\`tsx
// Dreamer UI imports
import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useTheme } from '@moondreamsdev/dreamer-ui/hooks';

// Project imports using aliases
import { APP_TITLE } from '@lib/app';
import Home from '@screens/Home';
import Layout from '@ui/Layout';
import { router } from '@routes/AppRoutes';
import MyComponent from '@components/MyComponent';
import { useCustomHook } from '@hooks/useCustomHook';
import { MyContext } from '@contexts/MyContext';
import { store } from '@store';
import { helper } from '@utils/helper';
\`\`\`

### 6. Available Import Aliases
- \`@/\` → \`src/\`
- \`@components/\` → \`src/components/\`
- \`@contexts/\` → \`src/contexts/\`
- \`@hooks/\` → \`src/hooks/\`
- \`@lib/\` → \`src/lib/\`
- \`@routes/\` → \`src/routes/\`
- \`@screens/\` → \`src/screens/\`
- \`@store/\` → \`src/store/\`
- \`@tinies/\` → \`src/tinies/\`
- \`@styles/\` → \`src/styles/\`
- \`@ui/\` → \`src/ui/\`
- \`@utils/\` → \`src/utils/\`

## Quick Reference
- Component syntax: \`export function ComponentName\`
- Class names: Use \`join()\` for conditionals
- Check Dreamer UI first
- Use import aliases: \`@components/\`, \`@hooks/\`, \`@lib/\`, \`@screens/\`, \`@ui/\`, etc.
- Follow structured folder organization with proper separation of concerns