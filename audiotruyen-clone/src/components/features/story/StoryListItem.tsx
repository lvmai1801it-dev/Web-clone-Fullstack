import Link from 'next/link';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { Eye } from 'lucide-react';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useStoryDisplay } from '@/hooks/useStoryDisplay';

interface StoryListItemProps {
    story: Story;
    showThumbnail?: boolean;
    className?: string;
}

export default function StoryListItem({ story, showThumbnail = true, className }: StoryListItemProps) {
    const { badges, chapterDisplay } = useStoryDisplay(story);

    return (
        <Link href={`/truyen/${story.slug}`} className={cn("block group no-underline", className)}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    px: 1,
                    mx: -1,
                    borderRadius: 1,
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                    transition: 'background-color 0.2s',
                    '&:active': { bgcolor: 'action.hover' },
                    '@media (min-width: 600px)': {
                        '&:hover': { bgcolor: 'action.hover' }
                    }
                }}
            >
                {/* Thumbnail */}
                {showThumbnail && (
                    <Box
                        sx={{
                            width: { xs: 48, md: 50 },
                            height: { xs: 64, md: 70 },
                            flexShrink: 0,
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            boxShadow: 1
                        }}
                    >
                        {story.cover_url ? (
                            <Image
                                src={story.cover_url}
                                alt={story.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="50px"
                                loading="lazy"
                            />
                        ) : (
                            <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #2563EB, #1E40AF)' }} />
                        )}
                    </Box>
                )}

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.2s',
                            '.group:hover &': { color: 'primary.main' }
                        }}
                    >
                        {story.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                        {badges.showFull ? (
                            <Badge variant="full" className="h-auto px-1.5 py-0 text-[10px]">Full</Badge>
                        ) : (
                            <Typography component="span" variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                {chapterDisplay}
                            </Typography>
                        )}
                        <Typography component="span" variant="caption" color="text.secondary">
                            • {story.updated_at}
                        </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {story.author_name}
                    </Typography>
                </Box>

                {/* Views */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', flexShrink: 0 }}>
                    <Eye size={14} />
                    <Typography variant="caption" color="text.secondary">
                        {story.views.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
}

