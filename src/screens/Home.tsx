import { ALL_TINIES, Tiny } from '@/lib/tinies';
import TiniesFilters from '@components/TiniesFilters';
import TinyCard from '@components/TinyCard';
import { APP_TITLE } from '@lib/app';
import { useEffect, useState } from 'react';

function Home() {
  const [filteredTinies, setFilteredTinies] = useState<Tiny[]>(ALL_TINIES);

  // Set document title for home page
  useEffect(() => {
    document.title = 'Tinies';
  }, []);

  return (
    <div className='min-h-screen w-screen p-4 pt-36 md:p-8 md:pt-40'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-4xl font-bold md:text-5xl'>{APP_TITLE}</h1>
          <p className='text-foreground/70 mx-auto max-w-3xl text-base md:text-lg'>
            Where dreams take their first breath
          </p>
        </div>

        {/* Filters */}
        <TiniesFilters
          tinies={ALL_TINIES}
          onFilteredTiniesChange={setFilteredTinies}
        />

        {/* App Grid */}
        <div>
          {filteredTinies.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-foreground/60 text-lg'>
                No tinies match your filters. Try adjusting your search or
                filters.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
