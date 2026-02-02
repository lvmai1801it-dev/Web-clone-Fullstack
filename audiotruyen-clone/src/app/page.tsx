import Link from 'next/link';
import StoryCard from '@/components/features/story/StoryCard';
import StoryListItem from '@/components/features/story/StoryListItem';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';
import { mockRanking } from '@/test/mocks';
import { StoryService } from '@/services/story.service';

export default async function Home() {
  // Fetch data from API
  const [newStoriesRes, completedStoriesRes, hotStoriesRes] = await Promise.all([
    StoryService.getNewStories(6),
    StoryService.getCompletedStories(5),
    StoryService.getHotStories(12)
  ]);

  const newStories = newStoriesRes.success ? newStoriesRes.data?.items || [] : [];
  const completedStories = completedStoriesRes.success ? completedStoriesRes.data?.items || [] : [];
  const randomStories = hotStoriesRes.success ? hotStoriesRes.data?.items || [] : [];

  return (
    <div className="container-main py-6">
      <div className="layout-main">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Section: Truyện Mới Cập Nhật */}
          <section>
            <div className="section-title flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold uppercase text-[var(--color-primary)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                TRUYỆN MỚI CẬP NHẬT
              </h2>
              <Link
                href="/danh-sach/moi-cap-nhat"
                className="text-xs font-normal text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline"
              >
                Xem thêm →
              </Link>
            </div>
            <div className="story-grid">
              {newStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>

          {/* Section: Truyện Hoàn Thành */}
          <section>
            <div className="section-title flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold uppercase text-[var(--color-primary)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                TRUYỆN HOÀN THÀNH
              </h2>
              <Link
                href="/danh-sach/hoan-thanh"
                className="text-xs font-normal text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline"
              >
                Xem thêm →
              </Link>
            </div>
            <div className="bg-white rounded border border-[var(--color-border)] p-4">
              {completedStories.map((story) => (
                <StoryListItem key={story.id} story={story} />
              ))}
            </div>
          </section>

          {/* Section: Truyện Hot (Ngẫu nhiên placeholder replaced by Hot) */}
          <section>
            <h2 className="section-title mb-4">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                </svg>
                TRUYỆN HOT NHIỀU NGƯỜI NGHE
              </span>
            </h2>
            <div className="story-grid">
              {randomStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
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
