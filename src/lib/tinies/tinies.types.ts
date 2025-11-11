export type TinyCategory = 'productivity' | 'utility' | 'lifestyle' | 'entertainment' | 'education' | 'health' | 'finance' | 'social' | 'development' | 'design' | 'marketing';

export interface Tiny {
	id: string;
	title: string;
	description: string;
	startDate: string; // ISO date string
	tags: string[];
	categories: TinyCategory[];
	status: 'active' | 'archived' | 'in-progress';
	route?: string; // optional route for the tiny
}

export interface TinyVisit {
	lastVisitedAt: number; // timestamp in milliseconds
}
