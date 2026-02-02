import { notFound } from 'next/navigation';
import StoryCard from '@/components/features/story/StoryCard';
import Pagination from '@/components/ui/Pagination';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/test/mocks';
import { Story } from '@/lib/types';
import { StoryService } from '@/services/story.service';

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
        // Handle PaginatedResponse
        stories = response.data.items || [];
        const pagination = response.data.pagination;
        totalPages = pagination ? pagination.total_pages : 1;
    }

    // Since our Service methods currently take 'limit' but not 'page' explicity for these specific helpers,
    // we might need to update StoryService to accept 'page' or use getAll directly with params.
    // For now, let's assume the specific methods utilize the limit and we might need to pass page if we want real pagination.
    // The current getNewStories implementation only takes limit.

    // Let's rely on standard GetAll for better control if specific methods are limited?
    // Actually, let's stick to specific methods but we should update them to accept page.

    const paginatedStories = stories; // API already paginates

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header / Breadcrumb Area */}
            <div className="bg-white border-b border-[var(--color-border-light)] mb-8">
                <div className="container-main py-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full block"></span>
                        {title}
                    </h1>
                    <p className="text-[var(--color-text-secondary)] ml-4.5">
                        Tổng hợp {title.toLowerCase()} chọn lọc, cập nhật liên tục.
                    </p>
                </div>
            </div>

            <div className="container-main layout-main">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Story Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {paginatedStories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center pt-8 border-t border-[var(--color-border-light)]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={`/danh-sach/${slug}`}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <SidebarRanking items={mockRanking} title="Bảng Xếp Hạng" />

                    {/* Optional: Categories Widget */}
                    <div className="bg-white p-4 rounded-[var(--radius-card)] border border-[var(--color-border-light)] shadow-sm">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border-light)]">
                            Thể Loại Hot
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-50 text-xs text-gray-600 rounded-full border border-gray-100 cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
