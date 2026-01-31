import Link from 'next/link';
import { notFound } from 'next/navigation';
import AudioPlayer from '@/components/features/audio/AudioPlayer';
import StoryHero from '@/components/features/story/StoryHero';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/lib/mock-data';
import { StoryService } from '@/services/story.service';

interface StoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
    const { slug } = await params;

    // Fetch story from API (with chapters)
    const response = await StoryService.getById(slug, true);

    if (!response.success || !response.data) {
        notFound();
    }

    const story = response.data;

    // Use actual chapters from API
    const chapters = story.chapters?.map(chap => ({
        number: chap.number,
        title: `Chương ${chap.number}: ${chap.title}`,
        audioUrl: chap.audio_url,
    })) || [];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* NEW: Story Hero (Pro Max) */}
            <div className="-mt-6 mb-8">
                <StoryHero story={story} />
            </div>

            <div className="layout-main container-main pb-12">
                {/* Main Content */}
                <div className="space-y-8">

                    {/* Description Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            Giới Thiệu
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 text-base leading-loose whitespace-pre-line">
                            {story.description}
                        </div>

                        {/* Tags */}
                        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                            {(story.tags || []).map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/tag/${tag.toLowerCase().replace(' ', '-')}`}
                                    className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Audio Player Section */}
                    <section>
                        <AudioPlayer
                            storyId={story.id}
                            title="Nghe Truyện"
                            chapters={chapters}
                            currentChapter={1}
                        />
                    </section>

                    {/* Comments Section */}
                    <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                            </svg>
                            Bình luận
                        </h3>

                        {/* Comment Input */}
                        <div className="flex gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                                T
                            </div>
                            <div className="flex-1">
                                <textarea
                                    placeholder="Tham gia thảo luận về bộ truyện này..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                    <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                                        Gửi bình luận
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sample Comments */}
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                                    N
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900">Người dùng</span>
                                        <span className="text-xs text-gray-400">1 ngày trước</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Truyện rất hay, đọc rất cuốn hút! Cảm ơn admin đã up truyện. Giọng đọc AI cũng khá tự nhiên.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <SidebarRanking items={mockRanking} title="Bảng Xếp Hạng" />
                </aside>
            </div>
        </div>
    );
}
