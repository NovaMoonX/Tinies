import { useState, useMemo, useEffect } from 'react';
import { Input, Badge, Button, Modal } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { Tiny, ALL_TAGS, ALL_CATEGORIES } from '@/lib/tinies';

interface TiniesFiltersProps {
	tinies: Tiny[];
	onFilteredTiniesChange: (tinies: Tiny[]) => void;
}

function TiniesFilters({ tinies, onFilteredTiniesChange }: TiniesFiltersProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
	const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

	const filteredTinies = useMemo(() => {
		let filtered = tinies;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				tiny =>
					tiny.title.toLowerCase().includes(query) ||
					tiny.description.toLowerCase().includes(query) ||
					tiny.tags.some(tag => tag.toLowerCase().includes(query)) ||
					tiny.categories.some(cat => cat.toLowerCase().includes(query))
			);
		}

		// Filter by selected tags
		if (selectedTags.size > 0) {
			filtered = filtered.filter(tiny =>
				tiny.tags.some(tag => selectedTags.has(tag))
			);
		}

		// Filter by selected categories
		if (selectedCategories.size > 0) {
			filtered = filtered.filter(tiny =>
				tiny.categories.some(cat => selectedCategories.has(cat))
			);
		}

		return filtered;
	}, [tinies, searchQuery, selectedTags, selectedCategories]);

	// Update parent component when filtered tinies change
	useEffect(() => {
		onFilteredTiniesChange(filteredTinies);
	}, [filteredTinies, onFilteredTiniesChange]);

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
	
	const hasAdvancedFilters = selectedTags.size > 0 || selectedCategories.size > 0;

	return (
		<>
			{/* Modern Centered Layout */}
			<div className='space-y-6 p-4 sm:p-8'>
				{/* Large Centered Search */}
				<div className='flex flex-col items-center space-y-4'>
					<div className='w-full max-w-2xl'>
						<Input
							type='text'
							placeholder='Search your tiny...'
							value={searchQuery}
							variant='outline'
							rounded='full'
							onChange={e => setSearchQuery(e.target.value)}
							className='py-2 px-3 md:text-lg md:py-4 md:px-6 focus:border-primary/50! shadow-sm'
						/>
					</div>
					
					{/* Filters Button - Mobile Only */}
					<Button
						variant='outline'
						onClick={() => setIsFiltersModalOpen(true)}
						className={join(
							'sm:hidden',
							hasAdvancedFilters && 'bg-primary/10 border-primary text-primary flex items-center'
						)}
					>
						Filters
						{hasAdvancedFilters && (
							<Badge className='ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full'>
								{selectedTags.size + selectedCategories.size}
							</Badge>
						)}
					</Button>
				</div>

				{/* Desktop Filters - Hidden on Mobile */}
				<div className='hidden sm:block space-y-6'>
					{/* Categories */}
					{ALL_CATEGORIES.length > 0 && (
						<div className='text-center'>
							<h3 className='text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider'>
								Categories
							</h3>
							<div className='flex flex-wrap justify-center gap-3'>
								{ALL_CATEGORIES.map(category => (
									<button
										key={category}
										onClick={() => toggleCategory(category)}
										className='transition-all duration-200 hover:scale-105'
									>
										<Badge
											className={join(
												'rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200',
												selectedCategories.has(category)
													? 'bg-primary text-primary-foreground shadow-lg scale-105'
													: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:shadow-md'
											)}
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
						<div className='text-center'>
							<h3 className='text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider'>
								Tags
							</h3>
							<div className='flex flex-wrap justify-center gap-3'>
								{ALL_TAGS.map(tag => (
									<button
										key={tag}
										onClick={() => toggleTag(tag)}
										className='transition-all duration-200 hover:scale-105'
									>
										<Badge
											className={join(
												'rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200',
												selectedTags.has(tag)
													? 'bg-accent text-accent-foreground shadow-lg scale-105'
													: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:shadow-md'
											)}
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
						<div className='text-center pt-4'>
							<button
								onClick={clearFilters}
								className='text-sm text-primary hover:text-primary/80 font-medium underline decoration-2 underline-offset-4 transition-all duration-200 hover:decoration-primary/80'
							>
								Clear all filters
							</button>
						</div>
					)}
				</div>

				{/* Results count */}
				<div className='text-center text-sm text-foreground/60 pt-6 border-t border-border/50'>
					<span className='bg-muted/50 px-4 py-2 rounded-full'>
						Showing {filteredTinies.length} of {tinies.length} tinies
					</span>
				</div>
			</div>

			{/* Mobile Filters Modal */}
			<Modal
				isOpen={isFiltersModalOpen}
				onClose={() => setIsFiltersModalOpen(false)}
				title='Filter Tinies'
			>
				<div className='space-y-6 p-2'>
					{/* Categories */}
					{ALL_CATEGORIES.length > 0 && (
						<div className='text-center'>
							<h3 className='text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider'>
								Categories
							</h3>
							<div className='flex flex-wrap justify-center gap-3'>
								{ALL_CATEGORIES.map(category => (
									<button
										key={category}
										onClick={() => toggleCategory(category)}
										className='transition-all duration-200'
									>
										<Badge
											className={join(
												'rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200',
												selectedCategories.has(category)
													? 'bg-primary text-primary-foreground shadow-lg'
													: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:shadow-md'
											)}
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
						<div className='text-center'>
							<h3 className='text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider'>
								Tags
							</h3>
							<div className='flex flex-wrap justify-center gap-3'>
								{ALL_TAGS.map(tag => (
									<button
										key={tag}
										onClick={() => toggleTag(tag)}
										className='transition-all duration-200'
									>
										<Badge
											className={join(
												'rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200',
												selectedTags.has(tag)
													? 'bg-accent text-accent-foreground shadow-lg'
													: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:shadow-md'
											)}
										>
											#{tag}
										</Badge>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Modal Actions */}
					<div className='flex flex-col gap-3 pt-6 border-t border-border/50'>
						{hasAdvancedFilters && (
							<Button
								variant='outline'
								onClick={clearFilters}
								className='rounded-full py-3'
							>
								Clear Filters
							</Button>
						)}
						<Button
							onClick={() => setIsFiltersModalOpen(false)}
							className='rounded-full py-3'
						>
							Apply Filters
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default TiniesFilters;
