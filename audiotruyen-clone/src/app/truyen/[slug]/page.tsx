import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { StoryService } from '@/services/story.service';
import { RankingService } from '@/services/ranking.service';
import { Metadata } from 'next';
import { generateStoryStructuredData } from '@/lib/structuredData';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Tag as TagIcon } from 'lucide-react';

import ClientAudioPlayer from '@/components/features/audio/ClientAudioPlayer';

const StoryHero = dynamic(() => import('@/components/features/story/StoryHero'), {
    loading: () => <div className="h-[400px] animate-pulse bg-slate-100/50 rounded-2xl" />
});

interface StoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const response = await StoryService.getById(slug);

    if (!response.success || !response.data) {
        return { title: 'Không tìm thấy truyện' };
    }

    const story = response.data;
    return {
        title: `${story.title} - Nghe Audio Truyện Online Miễn Phí`,
        description: `Nghe truyện ${story.title} audio online. ${story.description.substring(0, 150)}... Tác giả: ${story.author_name}`,
        openGraph: {
            title: story.title,
            description: story.description.substring(0, 160),
            images: [{ url: story.cover_url }],
        }
    };
}

export default async function StoryPage({ params }: StoryPageProps) {
    const { slug } = await params;

    // Fetch story data and ranking in parallel
    const [response, rankingData] = await Promise.all([
        StoryService.getById(slug, true),
        RankingService.getTopStories(10)
    ]);

    if (!response.success || !response.data) {
        notFound();
    }

    const story = response.data;

    const chapters = story.chapters?.map(chap => ({
        number: chap.number,
        title: chap.title,
        audioUrl: chap.audio_url,
    })) || [];

    const jsonLd = generateStoryStructuredData(story);

    return (
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
            />

            {/* NEW: Story Hero (Pro Max) */}
            <div className="-mt-8 mb-12">
                <StoryHero story={story} />
            </div>

            <div className="layout-main container-main pb-20">
                {/* Main Content */}
                <div className="space-y-10">

                    {/* Description Section */}
                    <Card className="border-none shadow-premium bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-primary" />
                                Giới Thiệu Tác Phẩm
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/80 text-base leading-relaxed whitespace-pre-line font-medium">
                                {story.description}
                            </div>

                            {/* Tags */}
                            <div className="mt-8 flex flex-wrap gap-2.5 pt-6 border-t border-muted">
                                <div className="flex items-center gap-2 text-muted-foreground mr-2">
                                    <TagIcon size={16} />
                                    <span className="text-xs uppercase font-bold tracking-wider">Từ khóa:</span>
                                </div>
                                {(story.tags || []).map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/tag/${tag.toLowerCase().replace(' ', '-')}`}
                                    >
                                        <Badge variant="secondary" className="px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer rounded-full font-semibold">
                                            #{tag}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audio Player Section */}
                    <section className="scroll-mt-24" id="nghe-truyen">
                        <ClientAudioPlayer
                            storyId={story.id}
                            storyTitle={story.title}
                            storySlug={story.slug}
                            coverUrl={story.cover_url}
                            title="Trình Phát Audio"
                            chapters={chapters}
                            currentChapter={1}
                        />
                    </section>


                    {/* Comments Section */}
                    <Card className="border-none shadow-premium bg-card overflow-hidden rounded-2xl">
                        <CardHeader className="border-b bg-muted/50">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                Cộng Đồng Thảo Luận
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            {/* Comment Input */}
                            <div className="flex gap-4 mb-10">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-lg border border-primary/20">
                                    T
                                </div>
                                <div className="flex-1 space-y-3">
                                    <textarea
                                        placeholder="Bạn nghĩ gì về bộ truyện này? Hãy chia sẻ cảm xúc của mình nhé..."
                                        className="w-full px-5 py-4 bg-muted/30 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
                                        rows={4}
                                    />
                                    <div className="flex justify-end">
                                        <Button className="px-8 py-6 rounded-xl font-bold text-base shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Gửi Bình Luận
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Sample Comments */}
                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold border border-orange-200">
                                        N
                                    </div>
                                    <div className="flex-1 bg-muted/30 rounded-2xl p-5 group-hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-foreground">Độc giả ẩn danh</span>
                                            <span className="text-xs text-muted-foreground font-medium">1 ngày trước</span>
                                        </div>
                                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                                            Truyện rất hay, đọc rất cuốn hút! Cảm ơn admin đã up truyện. Giọng đọc AI cũng khá tự nhiên, dễ nghe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <SidebarRanking items={rankingData} title="Top Truyện Nghe Nhiều" />
                </aside>
            </div>
        </div>
    );
}
