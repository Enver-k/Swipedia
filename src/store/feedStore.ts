import { create } from 'zustand';
import { ArticleSummary } from '@/types';
import { prefetchFeed } from '@/lib/wikipedia';
import { saveArticle, addSkippedId, addLikedId } from '@/lib/storage';
import { PREFETCH_COUNT } from '@/lib/utils';

interface FeedState {
  // State
  queue: ArticleSummary[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  currentArticle: ArticleSummary | null;
  
  // Actions
  like: () => Promise<void>;
  skip: () => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  // Initial state
  queue: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  
  // Computed getter
  get currentArticle() {
    const { queue, currentIndex } = get();
    return queue[currentIndex] ?? null;
  },
  
  // Like current article and move to next
  like: async () => {
    const { queue, currentIndex, loadMore } = get();
    const article = queue[currentIndex];
    
    if (article) {
      // Save to IndexedDB
      await saveArticle({
        ...article,
        savedAt: new Date(),
        liked: true,
      });
      await addLikedId(article.id);
      
      // Move to next
      set({ currentIndex: currentIndex + 1 });
      
      // Prefetch if running low
      if (queue.length - currentIndex - 1 < 3) {
        loadMore();
      }
    }
  },
  
  // Skip current article and move to next
  skip: async () => {
    const { queue, currentIndex, loadMore } = get();
    const article = queue[currentIndex];
    
    if (article) {
      await addSkippedId(article.id);
      
      // Move to next
      set({ currentIndex: currentIndex + 1 });
      
      // Prefetch if running low
      if (queue.length - currentIndex - 1 < 3) {
        loadMore();
      }
    }
  },
  
  // Load more articles into queue
  loadMore: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const newArticles = await prefetchFeed(PREFETCH_COUNT);
      set((state) => ({
        queue: [...state.queue, ...newArticles],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load articles',
        isLoading: false,
      });
    }
  },
  
  // Reset feed state
  reset: () => {
    set({
      queue: [],
      currentIndex: 0,
      isLoading: false,
      error: null,
    });
  },
}));
