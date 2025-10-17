import { Tiny } from './tinies.types';

export const ALL_TINIES: Tiny[] = [
	{
		id: 'about',
		title: 'About',
		description: 'Learn more about Tinies and the philosophy behind this collection of mini tinies.',
		startDate: '2025-01-15',
		tags: ['informational', 'documentation'],
		categories: [],
		status: 'active',
		route: '/about',
	},
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
		id: 'travel-tracker',
		title: 'Travel Tracker',
		description: 'Track places you\'ve visited across the US and around the world. Add descriptions and photos for each destination.',
		startDate: '2025-10-17',
		tags: ['travel', 'lifestyle', 'tracking'],
		categories: ['lifestyle'],
		status: 'in-progress',
		route: '/travel-tracker',
	},
];

export const ALL_TAGS = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.categories))
).sort();
