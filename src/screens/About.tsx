import { Button } from '@moondreamsdev/dreamer-ui/components';

function About() {
  return (
    <div className='page flex flex-col items-center justify-center'>
      <div className='max-w-2xl space-y-6 px-4 text-center'>
        <h1 className='text-5xl font-bold md:text-6xl'>About Us</h1>
        <p className='text-foreground/80 text-lg md:text-xl'>
          This is your about page - lazy loaded for better performance!
        </p>
        <div className='pt-4'>
          <Button
            href='/'
            className='bg-accent hover:bg-accent/80 inline-block rounded-lg px-6 py-3 font-medium text-white transition-colors'
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default About;
