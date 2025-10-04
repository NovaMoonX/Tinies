export interface Tiny {
	id: string;
	title: string;
	description: string;
	startDate: string; // ISO date string
	tags: string[];
	categories: string[];
	status: 'active' | 'archived' | 'in-progress';
	route?: string; // optional route for the tiny
}
