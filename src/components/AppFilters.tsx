import { useState, useMemo, useEffect } from 'react';
import { Input, Badge } from '@moondreamsdev/dreamer-ui/components';
import { MiniApp, ALL_TAGS, ALL_CATEGORIES } from '@lib/apps';

interface AppFiltersProps {
	apps: MiniApp[];
	onFilteredAppsChange: (apps: MiniApp[]) => void;
}

function AppFilters({ apps, onFilteredAppsChange }: AppFiltersProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

	const filteredApps = useMemo(() => {
		let filtered = apps;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				app =>
					app.title.toLowerCase().includes(query) ||
					app.description.toLowerCase().includes(query) ||
					app.tags.some(tag => tag.toLowerCase().includes(query)) ||
					app.categories.some(cat => cat.toLowerCase().includes(query))
			);
		}

		// Filter by selected tags
		if (selectedTags.size > 0) {
			filtered = filtered.filter(app =>
				app.tags.some(tag => selectedTags.has(tag))
			);
		}

		// Filter by selected categories
		if (selectedCategories.size > 0) {
			filtered = filtered.filter(app =>
				app.categories.some(cat => selectedCategories.has(cat))
			);
		}

		return filtered;
	}, [apps, searchQuery, selectedTags, selectedCategories]);

	// Update parent component when filtered apps change
	useEffect(() => {
		onFilteredAppsChange(filteredApps);
	}, [filteredApps, onFilteredAppsChange]);

	const toggleTag = (tag: string) => {
		setSelectedTags(prev => {
			const next = new Set(prev);
			if (next.has(tag)) {
				next.delete(tag);
			} else {
				next.add(tag);
			}
			return next;
		});
	};

	const toggleCategory = (category: string) => {
		setSelectedCategories(prev => {
			const next = new Set(prev);
			if (next.has(category)) {
				next.delete(category);
			} else {
				next.add(category);
			}
			return next;
		});
	};

	const clearFilters = () => {
		setSearchQuery('');
		setSelectedTags(new Set());
		setSelectedCategories(new Set());
	};

	const hasActiveFilters =
		searchQuery.trim() || selectedTags.size > 0 || selectedCategories.size > 0;

	return (
		<div className='space-y-4 p-6 bg-muted/30 rounded-lg'>
			{/* Search */}
			<div>
				<Input
					type='text'
					placeholder='Search apps by title, description, tags, or categories...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full'
				/>
			</div>

			{/* Categories */}
			{ALL_CATEGORIES.length > 0 && (
				<div>
					<h3 className='text-sm font-medium text-foreground/80 mb-2'>
						Categories
					</h3>
					<div className='flex flex-wrap gap-2'>
						{ALL_CATEGORIES.map(category => (
							<button
								key={category}
								onClick={() => toggleCategory(category)}
								className='transition-all'
							>
								<Badge
									className={
										selectedCategories.has(category)
											? 'bg-primary text-primary-foreground cursor-pointer'
											: 'bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80'
									}
								>
									{category}
								</Badge>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Tags */}
			{ALL_TAGS.length > 0 && (
				<div>
					<h3 className='text-sm font-medium text-foreground/80 mb-2'>Tags</h3>
					<div className='flex flex-wrap gap-2'>
						{ALL_TAGS.map(tag => (
							<button
								key={tag}
								onClick={() => toggleTag(tag)}
								className='transition-all'
							>
								<Badge
									className={
										selectedTags.has(tag)
											? 'bg-accent text-accent-foreground cursor-pointer'
											: 'bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80'
									}
								>
									#{tag}
								</Badge>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Clear filters button */}
			{hasActiveFilters && (
				<div className='pt-2'>
					<button
						onClick={clearFilters}
						className='text-sm text-primary hover:text-primary/80 underline'
					>
						Clear all filters
					</button>
				</div>
			)}

			{/* Results count */}
			<div className='text-sm text-foreground/60 pt-2 border-t border-border'>
				Showing {filteredApps.length} of {apps.length} apps
			</div>
		</div>
	);
}

export default AppFilters;
