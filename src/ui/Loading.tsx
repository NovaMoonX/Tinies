function Loading() {
  return (
    <div className='page flex items-center justify-center'>
      <div className='space-y-4 text-center'>
        <div className='border-foreground/20 border-t-accent mx-auto h-16 w-16 animate-spin rounded-full border-4'></div>
        <p className='text-foreground/60 text-lg'>Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
