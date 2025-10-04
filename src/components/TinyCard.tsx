import { Tiny } from '@/lib/tinies';
import { Badge, Button, Card } from '@moondreamsdev/dreamer-ui/components';

interface TinyCardProps {
	tiny: Tiny;
}

function TinyCard({ tiny }: TinyCardProps) {
	const formattedDate = new Date(tiny.startDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	const getBadgeClass = (status: Tiny['status']): string => {
		switch (status) {
			case 'active':
				return 'bg-green-300 dark:bg-green-700';
			case 'in-progress':
				return 'bg-yellow-300 dark:bg-yellow-700';
			case 'archived':
				return 'bg-muted text-muted-foreground';
			default:
				return '';
		}
	};

	const header = (
		<div className='flex items-start justify-between gap-2'>
			<h3 className='text-xl font-semibold text-foreground'>{tiny.title}</h3>
			<Badge variant='base' className={getBadgeClass(tiny.status)}>
				{tiny.status}
			</Badge>
		</div>
	);

	const footer = tiny.route ? (
		<Button href={tiny.route} variant='link'>
			Check it out →
		</Button>
	) : undefined;

	return (
		<Card className='h-full hover:shadow-lg transition-shadow' header={header} footer={footer} padding={20}>
			<div className='space-y-3'>
				<p className='text-foreground/70 text-sm'>{tiny.description}</p>

				<div className='space-y-2 pb-1'>
					<div className='text-xs text-foreground/60'>Started: {formattedDate}</div>

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
