'use client';

import Link from 'next/link';
import { TrendingUp, Eye } from 'lucide-react';
import { RankingItem } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarRankingProps {
    items: RankingItem[];
    title?: string;
}

export default function SidebarRanking({ items, title = 'Bảng Xếp Hạng' }: SidebarRankingProps) {
    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-br from-yellow-300 to-yellow-600 text-white shadow-[0_4px_12px_rgba(202,138,4,0.3)]";
            case 2:
                return "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-[0_4px_12px_rgba(100,116,139,0.3)]";
            case 3:
                return "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-[0_4px_12px_rgba(234,88,12,0.3)]";
            default:
                return "bg-muted text-muted-foreground font-bold";
        }
    };

    return (
        <Card className="border-none shadow-premium rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-0">
                <div className="bg-primary px-5 py-4 flex items-center gap-3 text-white">
                    <TrendingUp size={20} className="animate-pulse" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-muted/30">
                    {items.map((item) => (
                        <Link
                            key={item.story.id}
                            href={`/truyen/${item.story.slug}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-all group"
                        >
                            {/* Rank Number */}
                            <div
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shrink-0 transition-transform group-hover:scale-110",
                                    getRankStyles(item.rank)
                                )}
                            >
                                {item.rank}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                                    {item.story.title}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-muted-foreground/70">
                                        <Eye size={12} />
                                        <span className="text-[10px] font-bold font-mono">
                                            {item.story.views.toLocaleString()}
                                        </span>
                                    </div>
                                    {item.story.status === 'completed' && (
                                        <Badge
                                            variant="secondary"
                                            className="h-4 px-1.5 text-[9px] font-black uppercase tracking-tighter rounded-md bg-green-100 text-green-700 border-none"
                                        >
                                            Full
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
