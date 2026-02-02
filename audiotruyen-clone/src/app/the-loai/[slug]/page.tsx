import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoryCard from '@/components/features/story/StoryCard';
import Pagination from '@/components/ui/Pagination';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/test/mocks';
import { CategoryService } from '@/services/category.service';
import { StoryService } from '@/services/story.service';

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
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Category Header Hero */}
            <div className="bg-white border-b border-gray-100 py-8 mb-8 shadow-sm">
                <div className="container-main">
                    <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <span className="text-slate-300">/</span>
                        <Link href="/the-loai" className="hover:text-blue-600 transition-colors">Thể loại</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">{category.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {category.name}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Tổng hợp {category.story_count || 0} truyện {category.name} chọn lọc

                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-main container-main">
                {/* Main Content */}
                <div>
                    {/* Story Grid */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
                        {currentStories.length > 0 ? (
                            <div className="story-grid">
                                {currentStories.map((story) => {
                                    return <StoryCard key={story.id} story={story} />
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p>Không tìm thấy truyện nào.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={`/the-loai/${slug}`}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <SidebarRanking items={mockRanking} title="Top Thịnh Hành" />

                    {/* Other Categories */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-gray-100 px-4 py-3">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Khám Phá
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {allCategories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/the-loai/${cat.slug}`}
                                        className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${cat.slug === slug
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                                            }`}
                                    >
                                        {cat.name}
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
