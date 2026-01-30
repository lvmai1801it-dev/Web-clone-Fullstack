import Image from 'next/image';
import Link from 'next/link';
import { Story } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface StoryHeroProps {
    story: Story;
}

export default function StoryHero({ story }: StoryHeroProps) {

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/40 to-white pb-8 pt-6">
            <div className="container-main relative z-10">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Cover Column */}
                    <div className="shrink-0 md:w-[240px]">
                        <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-[var(--radius-card)] shadow-xl ring-1 ring-black/5 transition-transform hover:scale-[1.02]">
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
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
                                    <span className="p-4 text-center font-bold">{story.title}</span>
                                </div>
                            )}

                            {/* Mobile visual effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="flex flex-1 flex-col justify-start space-y-4">
                        {/* Status & Genres */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={story.status === 'completed' ? 'full' : 'hot'}>
                                {story.status === 'completed' ? 'Full' : 'Đang ra'}
                            </Badge>
                            {story.categories.map(genre => (
                                <Link
                                    key={genre.id}
                                    href={`/the-loai/${genre.slug}`}
                                    className="rounded-full border border-[var(--color-border)] bg-white px-3 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                                >
                                    {genre.name}
                                </Link>
                            ))}

                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold leading-tight text-[var(--color-text-primary)] md:text-3xl lg:text-4xl">
                            {story.title}
                        </h1>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 gap-y-2 gap-x-8 text-sm sm:grid-cols-2 lg:max-w-2xl">
                            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                <span className="w-20 font-medium">Tác giả:</span>
                                <span className="font-semibold text-[var(--color-primary)]">{story.author_name}</span>
                            </div>

                            {story.narrator && (
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <span className="w-20 font-medium">Giọng đọc:</span>
                                    <span className="text-[var(--color-text-primary)]">{story.narrator}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                <span className="w-20 font-medium">Số chương:</span>
                                <span>{story.total_chapters}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                <span className="w-20 font-medium">Lượt xem:</span>
                                <span>{story.views.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4 border-t border-[var(--color-border-light)] pt-3">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-[var(--color-text-primary)]">{story.rating_avg}</span>
                                <div className="flex text-amber-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`h-5 w-5 ${i < Math.floor(parseFloat(story.rating_avg)) ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]"></div>
                            <span className="text-sm text-[var(--color-text-muted)]">{story.rating_count} đánh giá</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
