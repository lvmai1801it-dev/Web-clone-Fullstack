import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface StoryCardProps {
    story: Story;
    showBadge?: boolean;
    className?: string;
}

export default function StoryCard({ story, showBadge = true, className }: StoryCardProps) {


    const isCompleted = story.status === 'completed';
    // Format progress text
    const progressText = isCompleted
        ? `${story.total_chapters} Chương`
        : `Chương ${story.currentChapter || 0}`;

    return (
        <Link
            href={`/truyen/${story.slug}`}
            className={cn("block group h-full", className)}
            aria-label={`Nghe truyện ${story.title}`}
        >
            <div className="relative h-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-background-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-[var(--color-border-light)]">
                {/* Cover Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--color-background)]">
                    {story.cover_url ? (
                        <Image
                            src={story.cover_url}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)] opacity-10">
                            <span className="text-xs text-[var(--color-primary)]">No Image</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    {/* Status Badges */}
                    {showBadge && (
                        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
                            {isCompleted && <Badge variant="full">Full</Badge>}
                            {story.views > 50000 && <Badge variant="hot">Hot</Badge>}
                        </div>
                    )}

                    {/* Progress Badge (Bottom Right) */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                        {progressText}
                    </div>
                </div>

                {/* Content */}
                <div className="p-3">
                    <h3
                        className="line-clamp-2 text-sm font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-primary)]"
                        title={story.title}
                    >
                        {story.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {story.views.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
