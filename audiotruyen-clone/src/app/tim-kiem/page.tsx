import { searchStories, mockRanking } from '@/lib/mock-data';
import StoryCard from '@/components/features/story/StoryCard';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { Button } from '@mui/material';
import Link from 'next/link';

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';
    const results = query ? searchStories(query) : [];

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Search Hero - Mobile Optimized */}
            <div className="bg-white border-b border-[var(--color-border)]">
                <div className="container-main py-6 md:py-10">
                    {/* Breadcrumb - Hidden on small mobile */}
                    <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-4 md:mb-6">
                        <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Trang chủ
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        <span className="text-gray-900 font-medium">Tìm kiếm</span>
                    </nav>

                    <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 md:mb-3 tracking-tight">
                        Kết quả cho <span className="text-blue-600">&ldquo;{query}&rdquo;</span>
                    </h1>
                    <p className="text-sm md:text-lg text-gray-500">
                        {query
                            ? `Tìm thấy ${results.length} kết quả phù hợp`
                            : 'Vui lòng nhập từ khóa để tìm kiếm'}
                    </p>
                </div>
            </div>

            <div className="container-main py-6 md:py-10">
                {results.length > 0 ? (
                    <div className="layout-main">
                        <div className="space-y-6 md:space-y-8">
                            <div className="story-grid">
                                {results.map((story) => (
                                    <StoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <SidebarRanking items={mockRanking} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Không tìm thấy truyện nào
                            </h2>
                            <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed">
                                Chúng tôi không tìm thấy kết quả nào cho <span className="font-semibold text-gray-900">&ldquo;{query}&rdquo;</span>.
                                <br className="hidden md:block" />
                                Hãy thử sử dụng các từ khóa chung hơn hoặc kiểm tra lại lỗi chính tả.
                            </p>
                            <Button
                                component={Link}
                                href="/"
                                variant="contained"
                                size="large"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 h-auto text-base shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
                            >
                                Khám phá truyện mới
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

