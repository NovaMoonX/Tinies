import { Tiny } from './tinies.types';

export const MINI_APPS: Tiny[] = [
	{
		id: 'about',
		title: 'About',
		description: 'Learn more about Tinies and the philosophy behind this collection of mini tinies.',
		startDate: '2025-01-15',
		tags: ['informational', 'documentation'],
		categories: ['Core'],
		status: 'active',
		route: '/about',
	},
	{
		id: 'task-tracker',
		title: 'Task Tracker',
		description: 'A simple and elegant task management tiny to keep track of your daily to-dos.',
		startDate: '2025-01-20',
		tags: ['productivity', 'tools'],
		categories: ['Productivity'],
		status: 'in-progress',
	},
	{
		id: 'color-palette',
		title: 'Color Palette Generator',
		description: 'Generate beautiful color palettes for your design projects with AI assistance.',
		startDate: '2025-01-10',
		tags: ['design', 'tools', 'creative'],
		categories: ['Design', 'Tools'],
		status: 'active',
	},
	{
		id: 'quote-daily',
		title: 'Daily Quotes',
		description: 'Get inspired with a new motivational quote every day. Share your favorites!',
		startDate: '2024-12-28',
		tags: ['inspiration', 'social'],
		categories: ['Lifestyle'],
		status: 'active',
	},
	{
		id: 'pomodoro',
		title: 'Pomodoro Timer',
		description: 'Focus on your work with this simple Pomodoro technique timer.',
		startDate: '2025-01-05',
		tags: ['productivity', 'focus'],
		categories: ['Productivity', 'Tools'],
		status: 'archived',
	},
	{
		id: 'markdown-preview',
		title: 'Markdown Previewer',
		description: 'Write and preview markdown in real-time with syntax highlighting.',
		startDate: '2025-01-18',
		tags: ['tools', 'documentation', 'developer'],
		categories: ['Developer Tools', 'Tools'],
		status: 'in-progress',
	},
];

export const ALL_TAGS = Array.from(
	new Set(MINI_APPS.flatMap(tiny => tiny.tags))
).sort();

export const ALL_CATEGORIES = Array.from(
	new Set(MINI_APPS.flatMap(tiny => tiny.categories))
).sort();
