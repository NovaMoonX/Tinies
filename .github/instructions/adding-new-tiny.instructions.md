---
applyTo: 'src/**/*'
---

# Adding New Tinies to Tinies

Instructions for adding a new mini app (aka "tiny") to the repo.

## Quick Guide

To add a new mini tiny to the gallery, simply add a new entry to the `TINIES` array in `src/lib/tinies/tinies.data.ts`:

```typescript
{
  id: 'your-tiny-id',
  title: 'The Tiny Title',
  description: 'A brief description of what your tiny does.',
  startDate: '2025-01-20', // ISO date format
  tags: ['tag1', 'tag2'], // Lowercase tags for filtering
  categories: ['Category Name'], // Categories for filtering
  status: 'active', // or 'in-progress' or 'archived'
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
  status: 'active',
  route: '/calculator',
}
```

## Status Colors

- `active`: Green badge - tiny is live and working
- `in-progress`: Yellow badge - tiny is under development
- `archived`: Gray badge - tiny is no longer maintained

## Features

The tiny gallery automatically provides:
- Search by title, description, tags, or categories
- Filter by categories and tags
- Responsive card layout
- Dark mode support
- Status badges with color coding
- Date formatting
- "Open App" button (if route is provided)

All tags and categories are automatically extracted and made available for filtering.
