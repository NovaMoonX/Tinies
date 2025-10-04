# Adding New Apps to Tinies

## Quick Guide

To add a new mini app to the gallery, simply add a new entry to the `MINI_APPS` array in `src/lib/apps/apps.data.ts`:

```typescript
{
  id: 'your-app-id',
  title: 'Your App Title',
  description: 'A brief description of what your app does.',
  startDate: '2025-01-20', // ISO date format
  tags: ['tag1', 'tag2'], // Lowercase tags for filtering
  categories: ['Category Name'], // Categories for filtering
  status: 'active', // or 'in-progress' or 'archived'
  route: '/your-app-route', // Optional: if app has a dedicated route
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
  status: 'active',
  route: '/calculator',
}
```

## Status Colors

- `active`: Green badge - app is live and working
- `in-progress`: Yellow badge - app is under development
- `archived`: Gray badge - app is no longer maintained

## Features

The app gallery automatically provides:
- Search by title, description, tags, or categories
- Filter by categories and tags
- Responsive card layout
- Dark mode support
- Status badges with color coding
- Date formatting
- "Open App" button (if route is provided)

All tags and categories are automatically extracted and made available for filtering.
