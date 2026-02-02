'use client';

import Link from 'next/link';

import { Paper, Box, Typography, List, ListItemButton, Chip } from '@mui/material';
import { TrendingUp, Eye } from 'lucide-react';
import { RankingItem } from '@/lib/types';

interface SidebarRankingProps {
    items: RankingItem[];
    title?: string;
}

export default function SidebarRanking({ items, title = 'Bảng Xếp Hạng' }: SidebarRankingProps) {
    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return {
                    background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                };
            case 2:
                return {
                    background: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(148, 163, 184, 0.3)'
                };
            case 3:
                return {
                    background: 'linear-gradient(135deg, #FDBA74 0%, #FB923C 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(251, 146, 60, 0.3)'
                };
            default:
                return {
                    bgcolor: 'action.selected',
                    color: 'text.secondary',
                    fontWeight: 600
                };
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(to right, primary.main, primary.dark)',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'white'
                }}
            >
                <TrendingUp size={18} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {title}
                </Typography>
            </Box>

            {/* List */}
            <List disablePadding sx={{ py: 0.5 }}>
                {items.map((item) => (
                    <ListItemButton
                        key={item.story.id}
                        component={Link}
                        href={`/truyen/${item.story.slug}`}
                        sx={{
                            gap: 2,
                            py: 1.5,
                            borderBottom: '1px border',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 0 }
                        }}
                    >
                        {/* Rank Number */}
                        <Box
                            sx={{
                                width: 28,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                transition: 'transform 0.2s',
                                '.MuiListItemButton-root:hover &': {
                                    transform: 'scale(1.1)'
                                },
                                ...getRankStyles(item.rank)
                            }}
                        >
                            {item.rank}
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'text.primary',
                                    mb: 0.5,
                                    transition: 'color 0.2s',
                                    '.MuiListItemButton-root:hover &': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                {item.story.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                    <Eye size={14} />
                                    <Typography variant="caption">{item.story.views.toLocaleString()}</Typography>
                                </Box>
                                {item.story.status === 'completed' && (
                                    <Chip
                                        label="Full"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 1 } }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
}
