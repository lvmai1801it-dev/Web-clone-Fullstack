'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useStoryDisplay } from '@/hooks/useStoryDisplay';

interface StoryListItemProps {
    story: Story;
    showThumbnail?: boolean;
    className?: string;
}

const StoryListItem = memo(function StoryListItem({ story, showThumbnail = true, className }: StoryListItemProps) {
    const { badges, chapterDisplay } = useStoryDisplay(story);

    return (
        <Link href={`/truyen/${story.slug}`} className={cn("block group", className)}>
            <div className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-xl border-b border-dashed border-muted/50 transition-all hover:bg-muted/50 active:scale-[0.99]">
                {/* Thumbnail */}
                {showThumbnail && (
                    <div className="w-12 h-16 md:w-14 md:h-20 shrink-0 relative rounded-lg overflow-hidden shadow-sm border border-muted/20">
                        {story.cover_url ? (
                            <Image
                                src={story.cover_url}
                                alt={story.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="60px"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary text-[10px] text-white flex items-center justify-center font-black">
                                NO IMG
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {story.title}
                    </h4>

                    <div className="flex items-center gap-2 text-muted-foreground/70">
                        {badges.showFull ? (
                            <Badge variant="full" className="h-4 px-1.5 text-[9px] font-black uppercase tracking-tighter rounded-md">Full</Badge>
                        ) : (
                            <span className="text-[10px] md:text-xs font-black text-primary uppercase">
                                {chapterDisplay}
                            </span>
                        )}
                        <span className="text-[10px] md:text-xs font-medium text-muted-foreground/50">•</span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground/60">
                            {formatRelativeTime(story.updated_at)}
                        </span>
                    </div>

                    <div className="text-[10px] md:text-xs font-medium text-muted-foreground/80 truncate">
                        {story.author_name}
                    </div>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1 text-muted-foreground/50 shrink-0 pr-1">
                    <Eye size={14} className="group-hover:text-primary/70 transition-colors" />
                    <span className="text-[10px] md:text-xs font-black font-mono tracking-tighter">
                        {story.views.toLocaleString()}
                    </span>
                </div>
            </div>
        </Link>
    );
});

export default StoryListItem;
