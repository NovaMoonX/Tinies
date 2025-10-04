import { ALL_TINIES, Tiny } from '@/lib/tinies';
import TiniesFilters from '@components/TiniesFilters';
import TinyCard from '@components/TinyCard';
import { APP_TITLE } from '@lib/app';
import { useState } from 'react';

function Home() {
	const [filteredTinies, setFilteredTinies] = useState<Tiny[]>(ALL_TINIES);

	return (
		<div className='min-h-screen w-screen p-4 md:p-8 pt-16 md:pt-32'>
			<div className='max-w-7xl mx-auto space-y-8'>
				{/* Header */}
				<div className='text-center space-y-2'>
					<h1 className='text-4xl md:text-5xl font-bold'>{APP_TITLE}</h1>
					<p className='text-base md:text-lg text-foreground/70 max-w-3xl mx-auto'>
						Where dreams take their first breath
					</p>
				</div>

				{/* Filters */}
				<TiniesFilters tinies={ALL_TINIES} onFilteredTiniesChange={setFilteredTinies} />

				{/* App Grid */}
				<div>
					{filteredTinies.length === 0 ? (
						<div className='text-center py-12'>
							<p className='text-lg text-foreground/60'>
								No tinies match your filters. Try adjusting your search or filters.
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{filteredTinies.map((tiny) => (
								<TinyCard key={tiny.id} tiny={tiny} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Home;
