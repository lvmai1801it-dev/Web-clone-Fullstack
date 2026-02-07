import { RankingService } from '@/services/ranking.service';
import SidebarRanking from './SidebarRanking';

export default async function RankingSidebarLoader() {
    const rankingData = await RankingService.getTopStories(10);
    return <SidebarRanking items={rankingData} title="Gợi Ý Cho Bạn" />;
}
