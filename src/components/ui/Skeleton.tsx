'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="h-48 w-full rounded-none" />
        
        {/* Content skeleton */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />
          
          {/* Summary lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Skeleton, ArticleCardSkeleton };
