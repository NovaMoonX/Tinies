import { Card, Badge, Button } from '@moondreamsdev/dreamer-ui/components';
import { MiniApp } from '@lib/apps';

interface AppCardProps {
	app: MiniApp;
}

function AppCard({ app }: AppCardProps) {
	const formattedDate = new Date(app.startDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	const statusColors: Record<MiniApp['status'], string> = {
		active: 'bg-green-500 text-white',
		'in-progress': 'bg-yellow-500 text-black',
		archived: 'bg-gray-500 text-white',
	};

	return (
		<Card className='flex flex-col h-full hover:shadow-lg transition-shadow'>
			<div className='flex-1 space-y-3'>
				<div className='flex items-start justify-between gap-2'>
					<h3 className='text-xl font-semibold text-foreground'>{app.title}</h3>
					<Badge className={statusColors[app.status]}>
						{app.status}
					</Badge>
				</div>

				<p className='text-foreground/70 text-sm'>{app.description}</p>

				<div className='space-y-2'>
					<div className='text-xs text-foreground/60'>
						Started: {formattedDate}
					</div>

					{app.categories.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{app.categories.map(category => (
								<Badge
									key={category}
									className='bg-primary/10 text-primary text-xs'
								>
									{category}
								</Badge>
							))}
						</div>
					)}

					{app.tags.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{app.tags.map(tag => (
								<Badge
									key={tag}
									className='bg-secondary text-secondary-foreground text-xs'
								>
									#{tag}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>

			{app.route && (
				<div className='mt-4 pt-4 border-t border-border'>
					<Button href={app.route} className='w-full'>
						Open App
					</Button>
				</div>
			)}
		</Card>
	);
}

export default AppCard;
