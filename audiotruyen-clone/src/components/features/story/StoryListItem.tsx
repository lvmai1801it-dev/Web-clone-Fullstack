import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface StoryListItemProps {
    story: Story;
    showThumbnail?: boolean;
}

export default function StoryListItem({ story, showThumbnail = true }: StoryListItemProps) {
    const isCompleted = story.status === 'completed';

    return (
        <Link href={`/truyen/${story.slug}`} className="block group">
            <div className="flex items-center gap-3 py-3 border-b border-dashed border-[var(--color-border-light)] hover:bg-[var(--color-background)] transition-colors px-2 -mx-2 rounded">
                {/* Thumbnail */}
                {showThumbnail && (
                    <div className="w-[50px] h-[70px] flex-shrink-0 relative rounded overflow-hidden shadow-sm">
                        {story.cover ? (
                            <Image
                                src={story.cover}
                                alt={story.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="50px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]"></div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                        {story.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-muted)]">
                        {isCompleted ? (
                            <Badge variant="full" className="text-[10px] px-1.5 py-0 h-auto">Full</Badge>
                        ) : (
                            <span className="text-[var(--color-primary)] font-medium">
                                C.{story.currentChapter}/{story.totalChapters}
                            </span>
                        )}
                        <span>• {story.updatedAt}</span>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 truncate">
                        {story.author}
                    </p>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    <span>{story.views.toLocaleString()}</span>
                </div>
            </div>
        </Link>
    );
}
