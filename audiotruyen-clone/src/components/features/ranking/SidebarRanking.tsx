import Link from 'next/link';
import { RankingItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarRankingProps {
    items: RankingItem[];
    title?: string;
}

export default function SidebarRanking({ items, title = 'Bảng Xếp Hạng' }: SidebarRankingProps) {
    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-md shadow-yellow-200'; // Gold
            case 2:
                return 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md shadow-slate-200'; // Silver
            case 3:
                return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-md shadow-orange-200'; // Bronze
            default:
                return 'bg-slate-100 text-slate-500 font-semibold';
        }
    };

    return (
        <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-border-light)] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 py-3">
                <div className="flex items-center gap-2 text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 className="font-bold text-sm uppercase tracking-wide">{title}</h3>
                </div>
            </div>

            {/* List */}
            <div className="p-2 space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.story.id}
                        href={`/truyen/${item.story.slug}`}
                        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-background)] transition-all duration-200"
                    >
                        {/* Rank Number */}
                        <span
                            className={cn(
                                "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-transform group-hover:scale-110",
                                getRankStyles(item.rank)
                            )}
                        >
                            {item.rank}
                        </span>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                                {item.story.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {item.story.views.toLocaleString()}
                                </span>
                                {item.story.status === 'completed' && (
                                    <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                        Full
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
