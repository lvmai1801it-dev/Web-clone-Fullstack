'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface StoryCardProps {
    story: Story;
    showBadge?: boolean;
    className?: string;
}

const StoryCard = memo(function StoryCard({ story, showBadge = true, className }: StoryCardProps) {
    const isCompleted = story.status === 'completed';
    const progressText = isCompleted
        ? `${story.total_chapters} Chương`
        : `Chương ${story.currentChapter || 0}`;

    return (
        <Card
            className={cn("h-full flex flex-col hover:shadow-lg transition-shadow duration-300", className)}
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <CardActionArea
                component={Link}
                href={`/truyen/${story.slug}`}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Cover Image Container */}
                <CardMedia
                    sx={{
                        position: 'relative',
                        paddingTop: '150%', /* 2:3 aspect ratio */
                    }}
                >
                    <div className="absolute inset-0">
                        <OptimizedImage
                            src={story.cover_url || ''}
                            alt={story.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            containerClassName="h-full w-full"
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />

                    {/* Status Badges */}
                    {showBadge && (
                        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5, zIndex: 2 }}>
                            {isCompleted && <Badge variant="full">Full</Badge>}
                            {story.views > 50000 && <Badge variant="hot">Hot</Badge>}
                        </Box>
                    )}

                    {/* Progress Badge */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            borderRadius: 1,
                            px: 0.75,
                            py: 0.25,
                            zIndex: 2
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, fontSize: '0.625rem' }}>
                            {progressText}
                        </Typography>
                    </Box>
                </CardMedia>

                {/* Content */}
                <CardContent sx={{ p: 1.5, flexGrow: 1, '&:last-child': { pb: 1.5 } }}>
                    <Typography
                        variant="subtitle2"
                        component="h3"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.4em'
                        }}
                        title={story.title}
                    >
                        {story.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>
                        <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {story.views.toLocaleString()}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
});

export default StoryCard;


