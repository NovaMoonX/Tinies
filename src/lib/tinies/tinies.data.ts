import { Tiny } from './tinies.types';

export const ALL_TINIES: Tiny[] = [
	{
		id: 'apartment-tour-questions',
		title: 'Apartment Tour Questions',
		description: 'A handy checklist of important questions to ask during apartment tours to help you make informed rental decisions.',
		startDate: '2025-02-04',
		tags: ['lifestyle', 'tools', 'checklist'],
		categories: ['lifestyle', 'utility'],
		status: 'in-progress',
		route: '/apartment-tour-questions',
	},
	{
		id: 'car-maintenance',
		title: 'Car Maintenance Tracker',
		description: 'Track maintenance and service records for multiple vehicles. Log routine services like oil changes, track service locations, and automatically tag affected car parts.',
		startDate: '2025-10-17',
		tags: ['automotive', 'tools', 'tracking', 'maintenance'],
		categories: ['lifestyle', 'utility'],
		status: 'in-progress',
		route: '/car-maintenance',
	},
  {
    id: 'recipe-book',
		title: 'Recipe Book',
		description: 'Your personal digital recipe book for organizing all your favorite recipes. Search by name, filter by cook time, prep time, and recipe type.',
		startDate: '2025-02-05',
		tags: ['lifestyle', 'food', 'cooking', 'organization'],
		categories: ['lifestyle', 'productivity'],
		status: 'in-progress',
		route: '/recipe-book',
  },
  {
		id: 'travel-tracker',
		title: 'Travel Tracker',
		description: 'Track places you\'ve visited across the US and around the world. Add descriptions and photos for each destination.',
		startDate: '2025-10-17',
		tags: ['travel', 'lifestyle', 'tracking'],
		categories: ['lifestyle'],
		status: 'in-progress',
		route: '/travel-tracker',
	},
	{
		id: 'personal-crm',
		title: 'Personal CRM',
		description: 'Manage your personal and professional contacts with artifacts (links, notes, photos, files). Track relationships, important dates, and memories.',
		startDate: '2025-10-29',
		tags: ['productivity', 'contacts', 'relationships', 'organization'],
		categories: ['productivity', 'lifestyle'],
		status: 'in-progress',
		route: '/personal-crm',
	},
	{
		id: 'notes',
		title: 'Notes',
		description: 'A simple note-taking app inspired by Google Keep. Create notes with titles, tags, emojis, and custom colors. Pin important notes, archive old ones, and move unwanted notes to trash (auto-deleted after 30 days).',
		startDate: '2025-11-04',
		tags: ['productivity', 'notes', 'organization'],
		categories: ['productivity'],
		status: 'in-progress',
		route: '/notes',
	},
];

export const ALL_TAGS = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.categories))
).sort();
