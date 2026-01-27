// Story Interface
export interface Story {
  id: string;
  slug: string;
  title: string;
  cover: string;
  author: string;
  narrator?: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  totalChapters: number;
  currentChapter?: number;
  views: number;
  rating: number;
  ratingCount: number;
  description: string;
  tags: string[];
  updatedAt: string;
}

// Chapter Interface
export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  title: string;
  audioUrl: string;
  duration: number; // in seconds
}

// Category Interface
export interface Category {
  id: string;
  slug: string;
  name: string;
  storyCount: number;
}

// Comment Interface
export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

// Ranking Item
export interface RankingItem {
  rank: number;
  story: Story;
}

// Pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
