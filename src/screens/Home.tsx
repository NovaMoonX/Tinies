import { useState } from 'react';
import { APP_TITLE, APP_DESCRIPTION } from '@lib/app';
import { MINI_APPS, MiniApp } from '@lib/apps';
import AppCard from '@components/AppCard';
import AppFilters from '@components/AppFilters';

function Home() {
	const [filteredApps, setFilteredApps] = useState<MiniApp[]>(MINI_APPS);

	return (
		<div className='min-h-screen w-screen p-4 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				{/* Header */}
				<div className='text-center space-y-4'>
					<h1 className='text-4xl md:text-5xl font-bold'>{APP_TITLE}</h1>
					<p className='text-base md:text-lg text-foreground/70 max-w-3xl mx-auto'>
						{APP_DESCRIPTION}
					</p>
				</div>

				{/* Filters */}
				<AppFilters apps={MINI_APPS} onFilteredAppsChange={setFilteredApps} />

				{/* App Grid */}
				<div>
					{filteredApps.length === 0 ? (
						<div className='text-center py-12'>
							<p className='text-lg text-foreground/60'>
								No apps match your filters. Try adjusting your search or filters.
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{filteredApps.map(app => (
								<AppCard key={app.id} app={app} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Home;
