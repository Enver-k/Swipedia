'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Heart, Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('system');

  // Load theme preference
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const themeOptions = [
    { value: 'light' as Theme, icon: Sun, label: 'Light' },
    { value: 'dark' as Theme, icon: Moon, label: 'Dark' },
    { value: 'system' as Theme, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Customize your experience
        </p>
      </div>

      {/* Theme section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                theme === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  theme === value
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  theme === value
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          About
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {APP_NAME}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A swipe-first Wikipedia discovery experience. Discover random articles, save your favorites, and dive deep into topics that interest you.
            </p>
          </div>

          <a
            href="https://www.wikipedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center justify-between p-4 rounded-xl',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-800',
              'hover:border-gray-300 dark:hover:border-gray-700 transition-colors'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xl font-bold">W</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Powered by Wikipedia
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Content from the free encyclopedia
                </p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-500" /> for curious minds
        </p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </div>
  );
}
