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
				return 'base';
			case 'archived':
				return 'muted';
			default:
				return 'base';
		}
	};

	const getBadgeClass = (status: Tiny['status']): string => {
		switch (status) {
			case 'in-progress':
				return 'bg-yellow-500 dark:bg-yellow-700 text-foreground';
			default:
				return '';
		}
	};

	return (
		<Card className='flex flex-col h-full hover:shadow-lg transition-shadow'>
			<div className='flex-1 space-y-3'>
				<div className='flex items-start justify-between gap-2'>
					<h3 className='text-xl font-semibold text-foreground'>{tiny.title}</h3>
					<Badge variant={getBadgeVariant(tiny.status)} className={getBadgeClass(tiny.status)}>
						{tiny.status}
					</Badge>
				</div>

				<p className='text-foreground/70 text-sm'>{tiny.description}</p>

				<div className='space-y-2'>
					<div className='text-xs text-foreground/60'>Started: {formattedDate}</div>

					{tiny.categories.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{tiny.categories.map((category) => (
								<Badge key={category} className='bg-primary/10 text-primary text-xs'>
									{category}
								</Badge>
							))}
						</div>
					)}

					{tiny.tags.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{tiny.tags.map((tag) => (
								<Badge key={tag} className='bg-secondary text-secondary-foreground text-xs'>
									#{tag}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>

			{tiny.route && (
				<div className='mt-4 pt-4 border-t border-border'>
					<Button href={tiny.route} className='w-full'>
						Open App
					</Button>
				</div>
			)}
		</Card>
	);
}

export default TinyCard;
