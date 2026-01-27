import { notFound } from 'next/navigation';
import StoryCard from '@/components/features/story/StoryCard';
import Pagination from '@/components/ui/Pagination';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockStories, mockRanking } from '@/lib/mock-data';
import { Story } from '@/lib/types';

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
    let stories: Story[] = [...mockStories];

    // Filter and Sort Logic
    switch (slug) {
        case 'moi-cap-nhat':
            title = 'Truyện Mới Cập Nhật';
            // Sort by updatedAt descending
            stories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            break;
        case 'hot':
            title = 'Truyện Hot';
            // Sort by views descending
            stories.sort((a, b) => b.views - a.views);
            break;
        case 'hoan-thanh':
            title = 'Truyện Full';
            // Filter by status completed and sort by views
            stories = stories.filter(s => s.status === 'completed');
            stories.sort((a, b) => b.views - a.views);
            break;
        default:
            notFound();
    }

    // Pagination Logic
    const totalPages = Math.ceil(stories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStories = stories.slice(startIndex, startIndex + itemsPerPage);

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
