// Story Interface (Synced with Backend API)
export interface Story {
  id: number;
  slug: string;
  title: string;
  cover_url: string; // Changed from cover
  author_name: string; // Changed from author
  author_id: number; // Added
  narrator?: string;
  categories: Category[]; // Changed from genres
  status: 'ongoing' | 'completed';
  total_chapters: number; // Changed from totalChapters
  currentChapter?: number;
  views: number;
  rating_avg: string; // Changed from rating
  rating_count: number; // Changed from ratingCount
  description: string;
  tags?: string[];
  created_at: string;
  updated_at: string; // Changed from updatedAt
  chapters?: Chapter[]; // Added for eager loading
  author?: Author; // Added
}

// Author Interface
export interface Author {
  id: number;
  name: string;
  slug: string;
  description?: string;
  story_count?: number;
}

// User Interface
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
}

// Chapter Interface
// Chapter Interface
export interface Chapter {
  id: number;
  story_id?: number;
  number: number;
  title: string;
  audio_url: string;
  duration_sec: number; // in seconds
  created_at?: string;
}

// Category Interface
export interface Category {
  id: number;
  slug: string;
  name: string;
  story_count?: number; // Changed from storyCount
  items?: Category[];
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
