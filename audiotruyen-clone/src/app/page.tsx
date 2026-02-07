import Link from 'next/link';
import StoryCard from '@/components/features/story/StoryCard';
import StoryListItem from '@/components/features/story/StoryListItem';
import SidebarRanking from '@/components/features/ranking/SidebarRanking';

import { StoryService } from '@/services/story.service';
import { Sparkles, Trophy, Flame, ChevronRight } from 'lucide-react';

export default async function Home() {
  // Fetch data from API
  const [newStoriesRes, completedStoriesRes, hotStoriesRes] = await Promise.all([
    StoryService.getNewStories(6),
    StoryService.getCompletedStories(5),
    StoryService.getHotStories(12),
  ]);

  const newStories = newStoriesRes.success ? newStoriesRes.data?.items || [] : [];
  const completedStories = completedStoriesRes.success ? completedStoriesRes.data?.items || [] : [];
  const randomStories = hotStoriesRes.success ? hotStoriesRes.data?.items || [] : [];

  // Reuse hot stories for ranking (Client-side transformation to save 1 API call)
  const rankingData = randomStories.slice(0, 10).map((story, index) => ({
    rank: index + 1,
    story,
  }));

  return (
    <div className="container-main py-10 space-y-16">
      <div className="layout-main">
        {/* Main Content */}
        <div className="space-y-16">

          {/* Section: Truyện Mới Cập Nhật */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                    Truyện Mới Cập Nhật
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mt-0.5">Vừa mới cập bến hôm nay</p>
                </div>
              </div>
              <Link
                href="/danh-sach/moi-cap-nhat"
                className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all border-b-2 border-primary/20 hover:border-primary pb-1"
              >
                Xem thêm <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="story-grid">
              {newStories.map((story, index) => (
                <StoryCard key={story.id} story={story} priority={index < 2} />
              ))}
            </div>
          </section>

          {/* Section: Truyện Hoàn Thành */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shadow-sm ring-1 ring-green-500/20">
                  <Trophy size={22} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                    Truyện Đã Hoàn Thành
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mt-0.5">Sẵn sàng trải nghiệm từ đầu đến cuối</p>
                </div>
              </div>
              <Link
                href="/danh-sach/hoan-thanh"
                className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-all border-b-2 border-green-500/20 hover:border-green-500 pb-1"
              >
                Khám phá <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="glass-premium rounded-3xl border border-muted/50 p-2 md:p-6 shadow-premium">
              <div className="divide-y divide-muted/30">
                {completedStories.map((story) => (
                  <StoryListItem key={story.id} story={story} />
                ))}
              </div>
            </div>
          </section>

          {/* Section: Truyện Hot */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shadow-sm ring-1 ring-orange-500/20">
                <Flame size={22} className="animate-bounce-slow" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                  Đang Gây Sốt Cộng Đồng
                </h2>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mt-0.5">Cực nhiều người đang theo dõi</p>
              </div>
            </div>

            <div className="story-grid">
              {randomStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          <SidebarRanking items={rankingData} title="Top Nghe Nhiều Nhất" />

          {/* Decorative Sticky Section (Optional) */}
          <div className="sticky top-24 space-y-6">
            <div className="glass-premium rounded-2xl p-6 border border-primary/10 shadow-premium overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-3">Thông báo mới</h3>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                Chào mừng bạn đến với phiên bản <strong>Pro Max</strong> của AudioTruyenFree! Trải nghiệm nghe truyện đỉnh cao với giao diện hiện đại.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
