'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useFeedStore, useUIStore } from '@/store';
import { ArticleCard } from './ArticleCard';
import { ActionBar } from './ActionBar';
import { SwipeContainer } from './SwipeContainer';
import { ArticleCardSkeleton } from '@/components/ui';

function FeedStack() {
  const router = useRouter();
  const { queue, currentIndex, isLoading, error, like, skip, loadMore } = useFeedStore();
  const { showToast } = useUIStore();

  const currentArticle = queue[currentIndex];

  // Load initial articles
  useEffect(() => {
    if (queue.length === 0 && !isLoading) {
      loadMore();
    }
  }, [queue.length, isLoading, loadMore]);

  // Handle like action
  const handleLike = useCallback(async () => {
    await like();
    showToast('Liked! 💚', 'success');
  }, [like, showToast]);

  // Handle skip action
  const handleSkip = useCallback(async () => {
    await skip();
  }, [skip]);

  // Handle deep dive
  const handleDeepDive = useCallback(() => {
    if (currentArticle) {
      router.push(`/article/${encodeURIComponent(currentArticle.title)}`);
    }
  }, [currentArticle, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          handleLike();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip();
          break;
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault();
          handleDeepDive();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLike, handleSkip, handleDeepDive]);

  // Loading state
  if (isLoading && queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <ArticleCardSkeleton />
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading articles...
        </p>
      </div>
    );
  }

  // Error state
  if (error && queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-red-500 dark:text-red-400">
          Failed to load articles
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {error}
        </p>
        <button
          onClick={() => loadMore()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state (shouldn't happen normally)
  if (!currentArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-gray-500 dark:text-gray-400">
          No more articles to show
        </p>
        <button
          onClick={() => loadMore()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Load More
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4">
      {/* Article card with swipe */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentArticle.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SwipeContainer
            onSwipeRight={handleLike}
            onSwipeLeft={handleSkip}
            onSwipeUp={handleDeepDive}
            onTap={handleDeepDive}
            disabled={isLoading}
          >
            <ArticleCard article={currentArticle} />
          </SwipeContainer>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <ActionBar
        onLike={handleLike}
        onSkip={handleSkip}
        onDeepDive={handleDeepDive}
        disabled={isLoading}
      />

      {/* Keyboard hint (desktop only) */}
      <div className="hidden md:flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
        <span>← Skip</span>
        <span>↓ Deep Dive</span>
        <span>Like →</span>
      </div>
    </div>
  );
}

export { FeedStack };
