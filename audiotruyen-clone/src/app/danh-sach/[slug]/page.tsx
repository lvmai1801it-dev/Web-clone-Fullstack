import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoryCard from '@/components/features/story/StoryCard';
import Pagination from '@/components/ui/Pagination';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/test/mocks';
import { Story } from '@/lib/types';
import { StoryService } from '@/services/story.service';
import { ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ListPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ListPageProps) {
    const { slug } = await params;

    const titles: Record<string, string> = {
        'moi-cap-nhat': 'Truyện Mới Cập Nhật',
        'hot': 'Truyện Hot Nhiều Người Nghe',
        'hoan-thanh': 'Truyện Đã Hoàn Thành (Full)',
    };

    const title = titles[slug] || 'Danh Sách Truyện';
    return {
        title: `${title} | AudioTruyen Clone`,
        description: `Danh sách ${title.toLowerCase()} mới nhất, hay nhất tại AudioTruyen.org`,
    };
}

export default async function ListPage({ params, searchParams }: ListPageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 24;

    let title = '';
    let stories: Story[] = [];
    let totalPages = 0;

    // Filter and Sort Logic using API
    let response;
    switch (slug) {
        case 'moi-cap-nhat':
            title = 'Truyện Mới Cập Nhật';
            response = await StoryService.getNewStories(itemsPerPage, currentPage);
            break;
        case 'hot':
            title = 'Truyện Hot';
            response = await StoryService.getHotStories(itemsPerPage, currentPage);
            break;
        case 'hoan-thanh':
            title = 'Truyện Full';
            response = await StoryService.getCompletedStories(itemsPerPage, currentPage);
            break;
        default:
            notFound();
    }

    if (response && response.success && response.data) {
        stories = response.data.items || [];
        const pagination = response.data.pagination;
        totalPages = pagination ? pagination.total_pages : 1;
    }

    const paginatedStories = stories;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Breadcrumb Area */}
            <div className="bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-12 mb-8 border-b border-muted/30">
                <div className="container-main">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight size={10} />
                        <span className="text-foreground">{title}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                                <LayoutGrid size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles size={14} className="text-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Danh sách truyện</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                                    {title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-main layout-main">
                {/* Main Content */}
                <div className="space-y-12">
                    {/* Story Grid */}
                    <div className="story-grid">
                        {paginatedStories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center pt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={`/danh-sach/${slug}`}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-10">
                    <SidebarRanking items={mockRanking} title="Gợi Ý Cho Bạn" />

                    {/* Categories Widget */}
                    <div className="glass-premium rounded-2xl border border-primary/10 shadow-premium overflow-hidden">
                        <div className="bg-primary/10 px-5 py-4 flex items-center gap-3">
                            <Sparkles size={18} className="text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                                Thể Loại Hot
                            </h3>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-wrap gap-2">
                                {['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn'].map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="px-3 py-1.5 rounded-xl cursor-pointer bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all font-bold text-[11px]"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
