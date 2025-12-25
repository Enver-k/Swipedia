'use client';

import { Heart, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface ActionBarProps {
  onLike: () => void;
  onSkip: () => void;
  onDeepDive: () => void;
  disabled?: boolean;
  className?: string;
}

function ActionBar({
  onLike,
  onSkip,
  onDeepDive,
  disabled = false,
  className,
}: ActionBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-6',
        className
      )}
    >
      {/* Skip button */}
      <Button
        variant="danger"
        size="icon"
        onClick={onSkip}
        disabled={disabled}
        aria-label="Skip article"
        className="h-14 w-14 shadow-lg"
      >
        <X className="w-7 h-7" />
      </Button>

      {/* Deep Dive button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onDeepDive}
        disabled={disabled}
        aria-label="Open deep dive"
        className="h-12 w-12 shadow-md"
      >
        <BookOpen className="w-5 h-5" />
      </Button>

      {/* Like button */}
      <Button
        variant="primary"
        size="icon"
        onClick={onLike}
        disabled={disabled}
        aria-label="Like article"
        className="h-14 w-14 shadow-lg bg-green-500 hover:bg-green-600 focus-visible:ring-green-500"
      >
        <Heart className="w-7 h-7" />
      </Button>
    </div>
  );
}

export { ActionBar };
