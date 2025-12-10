import { Tiny } from '@/lib/tinies';
import { Badge, Button, Card } from '@moondreamsdev/dreamer-ui/components';
import { BadgeVariant } from 'node_modules/@moondreamsdev/dreamer-ui/dist/src/components/badge/variants';
import { useNavigate } from 'react-router-dom';

interface TinyCardProps {
  tiny: Tiny;
}

function TinyCard({ tiny }: TinyCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(tiny.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getBadgeVariant = (status: Tiny['status']): BadgeVariant => {
    switch (status) {
      case 'in-progress':
        return 'warning';
      case 'archived':
        return 'muted';
      default:
        return 'base';
    }
  };

  const header = (
    <div className='flex items-start justify-between gap-2'>
      <h3
        role='button'
        aria-label={`check out tiny ${tiny.title}`}
        className='text-foreground text-xl font-semibold hover:cursor-pointer hover:underline'
        onClick={() => navigate(tiny.route || '')}
      >
        {tiny.title}
      </h3>
      {tiny.status !== 'active' && (
        <Badge variant={getBadgeVariant(tiny.status)} className='text-nowrap'>
          {tiny.status}
        </Badge>
      )}
    </div>
  );

  const footer = tiny.route ? (
    <Button href={tiny.route} variant='link'>
      Check it out →
    </Button>
  ) : undefined;

  return (
    <Card
      className='h-full transition-shadow hover:shadow-lg'
      header={header}
      footer={footer}
      padding={20}
    >
      <div className='space-y-3'>
        <p className='text-foreground/70 text-sm'>{tiny.description}</p>

        <div className='space-y-2 pb-1'>
          <div className='text-foreground/60 text-xs'>
            Started: {formattedDate}
          </div>

          {tiny.categories.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {tiny.categories.map((category) => (
                <Badge key={category} variant='primary'>
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {tiny.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {tiny.tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default TinyCard;
