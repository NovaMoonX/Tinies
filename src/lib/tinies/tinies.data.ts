import { Tiny } from './tinies.types';

export const MINI_APPS: Tiny[] = [
	{
		id: 'about',
		title: 'About',
		description: 'Learn more about Tinies and the philosophy behind this collection of mini tinies.',
		startDate: '2025-01-15',
		tags: [],
		categories: [],
		status: 'active',
		route: '/about',
	},
];

export const ALL_TAGS = Array.from(
	new Set(MINI_APPS.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(MINI_APPS.flatMap(tiny => tiny.categories))
).sort();
