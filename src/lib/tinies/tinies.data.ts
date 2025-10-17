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
		id: 'car-maintenance',
		title: 'Car Maintenance Tracker',
		description: 'Track maintenance and service records for multiple vehicles. Log routine services like oil changes, track service locations, and automatically tag affected car parts.',
		startDate: '2025-10-17',
		tags: ['automotive', 'tools', 'tracking', 'maintenance'],
		categories: ['lifestyle', 'utility'],
		status: 'in-progress',
		route: '/car-maintenance',
	},
];

export const ALL_TAGS = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(ALL_TINIES.flatMap(tiny => tiny.categories))
).sort();
