'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User, Mic, Eye, Star, Hash } from 'lucide-react';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StoryHeroProps {
    story: Story;
}

export default function StoryHero({ story }: StoryHeroProps) {
    const isCompleted = story.status === 'completed';

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pb-12 pt-10">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container-main relative z-10">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Cover Column */}
                    <div className="w-full md:w-[260px] lg:w-[300px] shrink-0">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-premium-lg border-4 border-white/50 group">
                            {story.cover_url ? (
                                <Image
                                    src={story.cover_url}
                                    alt={story.title}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white p-6">
                                    <span className="text-xl font-black text-center uppercase tracking-wider">{story.title}</span>
                                </div>
                            )}

                            {/* Overlay effect on hover */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 space-y-6">
                        {/* Status & Genres */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={isCompleted ? "full" : "hot"} className="px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-premium">
                                {isCompleted ? 'FULL' : 'ĐANG RA'}
                            </Badge>
                            {story.categories.map(genre => (
                                <Link key={genre.id} href={`/the-loai/${genre.slug}`}>
                                    <Badge variant="secondary" className="px-3 py-1 text-[11px] font-bold bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all rounded-full cursor-pointer">
                                        {genre.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                            {story.title}
                        </h1>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-[700px] pt-2">
                            <div className="flex items-center gap-3 text-muted-foreground/80">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                                    <User size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Tác giả</span>
                                    <span className="text-sm font-bold text-primary">{story.author_name}</span>
                                </div>
                            </div>

                            {story.narrator && (
                                <div className="flex items-center gap-3 text-muted-foreground/80">
                                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                                        <Mic size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Giọng đọc</span>
                                        <span className="text-sm font-bold text-foreground">{story.narrator}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-muted-foreground/80">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                                    <Hash size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Quy mô</span>
                                    <span className="text-sm font-bold text-foreground">{story.total_chapters} chương</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground/80">
                                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                                    <Eye size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Lượt nghe</span>
                                    <span className="text-sm font-bold text-foreground font-mono">{story.views.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="pt-6 border-t border-muted/50 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-400 text-white shadow-[0_8px_20px_rgba(250,204,21,0.3)]">
                                    <span className="text-xl font-black">{story.rating_avg}</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex gap-0.5 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={16}
                                                fill={s <= Math.floor(parseFloat(story.rating_avg)) ? "currentColor" : "none"}
                                                className={cn(s <= Math.floor(parseFloat(story.rating_avg)) ? "text-yellow-500" : "text-muted-foreground/30")}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground mt-1 tracking-tight">
                                        {story.rating_count} lượt đánh giá
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
