import { Tiny } from '@/lib/tinies';
import { Badge, Button, Card } from '@moondreamsdev/dreamer-ui/components';
import { BadgeVariant } from 'node_modules/@moondreamsdev/dreamer-ui/dist/src/components/badge/variants';

interface TinyCardProps {
  tiny: Tiny;
}

function TinyCard({ tiny }: TinyCardProps) {
  const formattedDate = new Date(tiny.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getBadgeVariant = (status: Tiny['status']): BadgeVariant => {
    switch (status) {
      case 'active':
        return 'success';
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
      <h3 className='text-foreground text-xl font-semibold'>{tiny.title}</h3>
      <Badge variant={getBadgeVariant(tiny.status)}>{tiny.status}</Badge>
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
