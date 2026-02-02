import { searchStories, mockRanking } from '@/test/mocks';
import StoryCard from '@/components/features/story/StoryCard';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, ChevronRight, Home as HomeIcon, Sparkles } from 'lucide-react';

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';
    const results = query ? searchStories(query) : [];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Search Hero */}
            <div className="bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-12 mb-8 border-b border-muted/30">
                <div className="container-main">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <HomeIcon size={12} className="mb-0.5" />
                            Trang chủ
                        </Link>
                        <ChevronRight size={10} />
                        <span className="text-foreground">Tìm kiếm</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Search size={14} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Kết quả tìm kiếm</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                                Từ khóa: <span className="text-primary italic">&ldquo;{query}&rdquo;</span>
                            </h1>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-3 shrink-0">
                            <span className="text-[11px] font-black text-primary/60 uppercase tracking-widest block mb-1">Trạng thái</span>
                            <span className="text-xl font-black text-primary">
                                {query ? `Tìm thấy ${results.length} truyện` : 'Chưa nhập từ khóa'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-main">
                {results.length > 0 ? (
                    <div className="layout-main">
                        <div className="space-y-12">
                            <div className="story-grid">
                                {results.map((story) => (
                                    <StoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="hidden lg:block space-y-10">
                            <SidebarRanking items={mockRanking} title="Gợi Ý Cho Bạn" />
                        </aside>
                    </div>
                ) : (
                    <div className="glass-premium rounded-[40px] border border-muted/50 overflow-hidden shadow-premium">
                        <div className="flex flex-col items-center justify-center py-20 md:py-32 px-6 text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary shadow-glow ring-1 ring-primary/20">
                                <Search size={40} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
                                Không tìm thấy truyện phù hợp
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground/80 mb-10 max-w-xl font-medium leading-relaxed">
                                Chúng tôi đã lục lọi khắp kho truyện nhưng không tìm thấy kết quả nào cho <span className="font-bold text-primary">&ldquo;{query}&rdquo;</span>.
                                <br className="hidden md:block" />
                                Hãy thử đổi từ khóa khác, hoặc ghé qua bảng xếp hạng để xem mọi người thích gì nhé!
                            </p>
                            <Link href="/">
                                <Button
                                    size="lg"
                                    className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Sparkles size={18} className="mr-2" />
                                    Khám phá kho truyện
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
