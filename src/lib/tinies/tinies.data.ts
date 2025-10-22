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
		id: 'recipe-book',
		title: 'Recipe Book',
		description: 'Your personal digital recipe book for organizing all your favorite recipes. Search by name, filter by cook time, prep time, and recipe type.',
		startDate: '2025-02-05',
		tags: ['lifestyle', 'food', 'cooking', 'organization'],
		categories: ['lifestyle', 'productivity'],
		status: 'in-progress',
		route: '/recipe-book',
	},
];

export const ALL_TAGS = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.categories))
).sort();
