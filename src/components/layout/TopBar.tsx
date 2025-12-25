'use client';

import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function TopBar({ title, showLogo = true, className, children }: TopBarProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg',
        'border-b border-gray-200 dark:border-gray-800',
        'safe-area-top',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          {showLogo && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          )}
          {title && !showLogo && (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Actions */}
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

export { TopBar };
