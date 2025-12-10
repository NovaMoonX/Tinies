import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { saveTinyVisit } from '@lib/firebase';

interface TinyPageProps {
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: 'max-w-4xl' | 'max-w-6xl' | 'max-w-7xl';
  tinyId: string;
}

export function TinyPage({ 
  title, 
  description, 
  children, 
  maxWidth = 'max-w-7xl',
  tinyId,
}: TinyPageProps) {
  const { user } = useAuth();

  // Log visit when page is mounted and user is authenticated
  useEffect(() => {
    if (user) {
      saveTinyVisit(tinyId, user.uid).catch((error) => {
        console.error('Error logging tiny visit:', error);
      });
    }
  }, [tinyId, user]);

  return (
    <div className='tiny-page'>
      <div className={join('mx-auto space-y-6', maxWidth)}>
        {/* Back button in upper left */}
        <div className='mb-8 ml-0 md:ml-2 mt-4 md:mt-2'>
          <Link to='/' className='text-foreground/70 hover:text-foreground flex items-center gap-1 text-sm transition-colors'>
            <span>←</span>
            <span>Back to gallery</span>
          </Link>
        </div>

        {/* Header */}
        <div className='space-y-3 text-center pt-6 md:pt-0 pb-4 md:pb-0'>
          <h1 className='text-3xl font-bold md:text-4xl'>{title}</h1>
          <p className='text-foreground/70 mx-auto max-w-2xl text-sm md:text-base'>
            {description}
          </p>
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className='pt-4 pb-8 text-center'>
          <Button href='/' variant='outline'>
            ← Back to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TinyPage;
