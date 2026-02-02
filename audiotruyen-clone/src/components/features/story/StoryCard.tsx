'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useStoryDisplay } from '@/hooks/useStoryDisplay';

interface StoryCardProps {
    story: Story;
    showBadge?: boolean;
    className?: string;
    priority?: boolean;
}

const StoryCard = memo(function StoryCard({ story, showBadge = true, className, priority = false }: StoryCardProps) {
    const { progressText, badges } = useStoryDisplay(story);

    return (
        <Card className={cn(
            "group h-full flex flex-col border-none shadow-premium hover:shadow-premium-lg transition-all duration-500 rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm",
            className
        )}>
            <Link href={`/truyen/${story.slug}`} className="block h-full cursor-pointer">
                {/* Cover Image Container */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    <OptimizedImage
                        src={story.cover_url || ''}
                        alt={story.title}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        containerClassName="h-full w-full"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Status Badges */}
                    {showBadge && (
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 transition-transform duration-500 group-hover:translate-x-1">
                            {badges.showFull && <Badge variant="full" className="shadow-premium text-[10px] font-black tracking-wider px-2.5 py-0.5">FULL</Badge>}
                            {badges.showHot && <Badge variant="hot" className="shadow-premium text-[10px] font-black tracking-wider px-2.5 py-0.5">HOT</Badge>}
                        </div>
                    )}

                    {/* Progress Badge */}
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-lg px-2 py-0.5 shadow-premium">
                            <span className="text-[10px] font-black tracking-tight whitespace-nowrap">
                                {progressText}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-3.5 space-y-2">
                    <h3
                        className="font-bold text-sm leading-tight text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300"
                        title={story.title}
                    >
                        {story.title}
                    </h3>

                    <div className="flex items-center gap-2 text-muted-foreground/70">
                        <Eye size={12} className="group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold font-mono tracking-tighter">
                            {story.views.toLocaleString()}
                        </span>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
});

export default StoryCard;
