// Article data types for Swipedia

export interface ArticleSummary {
  id: string;                    // Wikipedia page ID
  title: string;
  extract: string;               // 2-6 sentence summary
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  pageUrl: string;               // Wikipedia source URL
  timestamp?: string;            // Last modified
}

export interface ArticleFull extends ArticleSummary {
  sections: ArticleSection[];
  fastFacts?: FastFact[];
  related: ArticleSummary[];
  categories?: string[];
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;               // HTML content
  level: number;                 // Heading level (2, 3, etc.)
}

export interface FastFact {
  label: string;
  value: string;
}

export interface SavedArticle extends ArticleSummary {
  savedAt: Date;
  liked: boolean;
  lastViewedAt?: Date;
  offlineContent?: ArticleFull;  // For offline access
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  haptics: boolean;
  interests: string[];           // Topic categories
  skippedIds: string[];          // Don't show again
  likedIds: string[];            // For recommendations
}
