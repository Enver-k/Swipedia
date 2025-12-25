'use client';

import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArticleSummary } from '@/types';

interface ArticleCardProps {
  article: ArticleSummary;
  className?: string;
}

function ArticleCard({ article, className }: ArticleCardProps) {
  const { title, extract, thumbnail, pageUrl } = article;

  // Generate a gradient background for cards without images
  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
  ];
  const gradientIndex =
    title.charCodeAt(0) % gradientColors.length;
  const gradient = gradientColors[gradientIndex];

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto rounded-2xl bg-white dark:bg-gray-900',
        'shadow-xl shadow-gray-200/50 dark:shadow-black/30',
        'overflow-hidden select-none',
        className
      )}
    >
      {/* Image or gradient header */}
      <div className="relative h-48 overflow-hidden pointer-events-none">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
            draggable={false}
          />
        ) : (
          <div
            className={cn(
              'h-full w-full bg-gradient-to-br flex items-center justify-center',
              gradient
            )}
          >
            <span className="text-6xl font-bold text-white/80">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Wikipedia link overlay */}
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full pointer-events-auto',
            'bg-black/30 backdrop-blur-sm text-white',
            'hover:bg-black/50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-white'
          )}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {title}
        </h2>

        {/* Summary */}
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-5">
          {extract}
        </p>
      </div>
    </div>
  );
}

export { ArticleCard };
