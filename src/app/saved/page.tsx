'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { getAllSavedArticles, unsaveArticle } from '@/lib/storage';
import { SavedArticle } from '@/types';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui';

export default function SavedPage() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useUIStore();

  // Load saved articles
  useEffect(() => {
    async function loadSaved() {
      setIsLoading(true);
      try {
        const saved = await getAllSavedArticles();
        setArticles(saved);
      } catch (error) {
        console.error('Failed to load saved articles:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, []);

  // Filter articles by search query
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.extract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle remove article
  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await unsaveArticle(id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Removed from saved', 'info');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          No saved articles yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
          Articles you like will appear here. Start swiping to discover something new!
        </p>
        <Link href="/">
          <Button className="mt-4">
            Start Discovering
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Saved Articles
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search saved articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full pl-10 pr-4 py-3 rounded-xl',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        />
      </div>

      {/* No results */}
      {filteredArticles.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No articles found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Article list */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${encodeURIComponent(article.title)}`}
            className={cn(
              'flex gap-4 p-4 rounded-xl',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-800',
              'hover:border-gray-300 dark:hover:border-gray-700',
              'transition-colors group'
            )}
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {article.thumbnail ? (
                <img
                  src={article.thumbnail.url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500">
                  {article.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {article.extract}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Saved {new Date(article.savedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => handleRemove(article.id, e)}
              className={cn(
                'p-2 rounded-lg self-start',
                'text-gray-400 hover:text-red-500',
                'hover:bg-red-50 dark:hover:bg-red-900/20',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
