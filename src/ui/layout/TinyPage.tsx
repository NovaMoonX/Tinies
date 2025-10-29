import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { ReactNode } from 'react';

interface TinyPageProps {
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: 'max-w-4xl' | 'max-w-6xl' | 'max-w-7xl';
}

export function TinyPage({ 
  title, 
  description, 
  children, 
  maxWidth = 'max-w-7xl' 
}: TinyPageProps) {
  return (
    <div className='tiny-page'>
      <div className={join('mx-auto space-y-6', maxWidth)}>
        {/* Header */}
        <div className='space-y-3 text-center'>
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
