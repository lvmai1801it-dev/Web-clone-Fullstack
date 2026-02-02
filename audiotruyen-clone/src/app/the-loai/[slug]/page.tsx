import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoryCard from '@/components/features/story/StoryCard';
import Pagination from '@/components/ui/Pagination';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/test/mocks';
import { CategoryService } from '@/services/category.service';
import { StoryService } from '@/services/story.service';
import { ChevronRight, LayoutGrid, Library, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}


export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const response = await CategoryService.getBySlug(slug);
    const category = response.success ? response.data : null;

    if (!category) {
        return {
            title: 'Không tìm thấy thể loại',
        };
    }

    return {
        title: `Truyện ${category.name} - Nghe Truyện Audio Hay Nhất`,
        description: `Danh sách truyện ${category.name} chọn lọc hay nhất. Nghe truyện audio ${category.name} miễn phí chất lượng cao cập nhật liên tục.`,
        openGraph: {
            title: `Truyện ${category.name} - AudioTruyen`,
            description: `Tuyển tập truyện ${category.name} hay nhất.`,
            images: ['/og-image.png'],
        },
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {

    // Get slug from params
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 24;

    // 1. Fetch current category by slug
    const response = await CategoryService.getBySlug(slug);

    if (!response.success || !response.data) {
        notFound();
    }

    const category = response.data;

    // 2. Fetch stories by category_id
    const storiesRes = await StoryService.getAll({
        category_id: category.id,
        page: currentPage,
        limit: itemsPerPage,
        sort: 'updated_at', // Optional: sort by something relevant
        order: 'desc'
    });

    const currentStories = storiesRes.success ? storiesRes.data?.items || [] : [];
    const pagination = storiesRes.success ? storiesRes.data?.pagination : null;
    const totalPages = pagination ? pagination.total_pages : 1;

    // 3. Fetch all categories for sidebar
    const allCategoriesRes = await CategoryService.getAll();
    const allCategories = allCategoriesRes.success ? allCategoriesRes.data?.items || [] : [];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Category Header Hero */}
            <div className="bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-12 mb-8 border-b border-muted/30">
                <div className="container-main">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight size={10} />
                        <Link href="/the-loai" className="hover:text-primary transition-colors">Thể loại</Link>
                        <ChevronRight size={10} />
                        <span className="text-foreground">{category.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                                <Library size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles size={14} className="text-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Thể loại truyện</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                                    {category.name}
                                </h1>
                            </div>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-3 shrink-0">
                            <span className="text-[11px] font-black text-primary/60 uppercase tracking-widest block mb-1">Quy mô kho truyện</span>
                            <span className="text-xl font-black text-primary">
                                {category.story_count || 0} Tác phẩm
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-main container-main">
                {/* Main Content */}
                <div className="space-y-12">
                    {/* Story Grid */}
                    {currentStories.length > 0 ? (
                        <div className="story-grid">
                            {currentStories.map((story) => {
                                return <StoryCard key={story.id} story={story} />
                            })}
                        </div>
                    ) : (
                        <div className="glass-premium rounded-3xl border border-muted/50 p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-6">
                                <Library size={40} strokeWidth={1} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Chưa có truyện nào</h2>
                            <p className="text-sm text-muted-foreground max-w-xs font-medium">
                                Thể loại này hiện đang được admin cập nhật thêm nội dung. Quay lại sau bạn nhé!
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center pt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={`/the-loai/${slug}`}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-10">
                    <SidebarRanking items={mockRanking} title="Cực Hot Tuần Này" />

                    {/* Other Categories */}
                    <div className="glass-premium rounded-2xl border border-primary/10 shadow-premium overflow-hidden">
                        <div className="bg-primary/10 px-5 py-4 flex items-center gap-3">
                            <LayoutGrid size={18} className="text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                                Thế Giới Truyện
                            </h3>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-wrap gap-2">
                                {allCategories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/the-loai/${cat.slug}`}
                                    >
                                        <Badge
                                            variant={cat.slug === slug ? "default" : "secondary"}
                                            className={cn(
                                                "px-3 py-1.5 rounded-xl cursor-pointer transition-all font-bold text-[11px]",
                                                cat.slug === slug
                                                    ? "shadow-glow scale-105"
                                                    : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
                                            )}
                                        >
                                            {cat.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
