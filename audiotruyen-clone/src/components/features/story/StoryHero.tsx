'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Box, Typography, Chip, Stack, Rating, Container, CardMedia } from '@mui/material';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { User, Mic, BookOpen, Eye } from 'lucide-react';

interface StoryHeroProps {
    story: Story;
}

export default function StoryHero({ story }: StoryHeroProps) {

    return (
        <Box
            sx={{
                width: '100%',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.08), #ffffff)',
                pb: 4,
                pt: 3
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Cover Column */}
                    <Box sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
                        <CardMedia
                            sx={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '2/3',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: 6,
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                        >
                            {story.cover_url ? (
                                <Image
                                    src={story.cover_url}
                                    alt={story.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 240px"
                                />
                            ) : (
                                <Box sx={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(to bottom right, primary.main, primary.dark)',
                                    color: 'white'
                                }}>
                                    <Typography variant="body1" align="center" fontWeight="bold" p={2}>
                                        {story.title}
                                    </Typography>
                                </Box>
                            )}

                            {/* Mobile visual effect */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    '&:hover': { opacity: 1 },
                                    zIndex: 1
                                }}
                            />
                        </CardMedia>
                    </Box>

                    {/* Info Column */}
                    <Box sx={{ flex: 1 }}>
                        <Stack spacing={2}>
                            {/* Status & Genres */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                                <Badge variant={story.status === 'completed' ? 'full' : 'hot'}>
                                    {story.status === 'completed' ? 'Full' : 'Đang ra'}
                                </Badge>
                                {story.categories.map(genre => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        component={Link}
                                        href={`/the-loai/${genre.slug}`}
                                        clickable
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'text.secondary',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Title */}
                            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2.25rem' } }}>
                                {story.title}
                            </Typography>

                            {/* Metadata Grid (using CSS Grid via Box) */}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                                maxWidth: '600px'
                            }}>
                                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                    <User size={18} />
                                    <Typography variant="body2" width={80} fontWeight={500}>Tác giả:</Typography>
                                    <Typography variant="body2" fontWeight={600} color="primary.main">{story.author_name}</Typography>
                                </Stack>

                                {story.narrator && (
                                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                        <Mic size={18} />
                                        <Typography variant="body2" width={80} fontWeight={500}>Giọng đọc:</Typography>
                                        <Typography variant="body2" color="text.primary">{story.narrator}</Typography>
                                    </Stack>
                                )}

                                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                    <BookOpen size={18} />
                                    <Typography variant="body2" width={80} fontWeight={500}>Số chương:</Typography>
                                    <Typography variant="body2">{story.total_chapters}</Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                    <Eye size={18} />
                                    <Typography variant="body2" width={80} fontWeight={500}>Lượt xem:</Typography>
                                    <Typography variant="body2">{story.views.toLocaleString()}</Typography>
                                </Stack>
                            </Box>

                            {/* Rating */}
                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        {story.rating_avg}
                                    </Typography>
                                    <Rating value={parseFloat(story.rating_avg)} precision={0.5} readOnly size="small" />
                                </Box>
                                <Box sx={{ width: 1, height: 24, bgcolor: 'divider' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {story.rating_count} đánh giá
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
