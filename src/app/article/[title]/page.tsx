'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bookmark, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getFullArticle } from '@/lib/wikipedia';
import { saveArticle, unsaveArticle, isArticleSaved } from '@/lib/storage';
import { useUIStore } from '@/store';
import { ArticleFull, ArticleSection } from '@/types';
import { cn } from '@/lib/utils';
import { Button, Skeleton } from '@/components/ui';

/**
 * Process Wikipedia HTML content to fix links and remove unwanted elements
 */
function processWikiContent(html: string): string {
  // First, remove unwanted elements using regex
  let processed = html
    // Remove reference sections entirely
    .replace(/<span class="mw-headline"[^>]*>References<\/span>.*?(?=<span class="mw-headline"|$)/gis, '')
    .replace(/<h2[^>]*>\s*References\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*Notes\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*Citations\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*Sources\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*Bibliography\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*Further reading\s*<\/h2>.*?(?=<h2|$)/gis, '')
    .replace(/<h2[^>]*>\s*External links\s*<\/h2>.*?(?=<h2|$)/gis, '')
    // Remove inline citations like [1], [2], etc.
    .replace(/<sup[^>]*class="reference"[^>]*>.*?<\/sup>/gi, '')
    .replace(/<sup[^>]*class="noprint"[^>]*>.*?<\/sup>/gi, '')
    // Remove citation needed tags
    .replace(/<sup[^>]*>\[citation needed\]<\/sup>/gi, '')
    // Remove reference lists
    .replace(/<div[^>]*class="[^"]*reflist[^"]*"[^>]*>.*?<\/div>/gis, '')
    .replace(/<ol[^>]*class="references"[^>]*>.*?<\/ol>/gis, '')
    .replace(/<div[^>]*class="[^"]*references[^"]*"[^>]*>.*?<\/div>/gis, '')
    // Remove navboxes and sidebars
    .replace(/<div[^>]*class="[^"]*navbox[^"]*"[^>]*>.*?<\/div>/gis, '')
    .replace(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>.*?<\/table>/gis, '')
    .replace(/<table[^>]*class="[^"]*sidebar[^"]*"[^>]*>.*?<\/table>/gis, '')
    // Remove edit links
    .replace(/<span class="mw-editsection"[^>]*>.*?<\/span>/gi, '');
  
  // Then fix links - Wikipedia article links open in app, external links in new tab
  processed = processed
    // Fix relative links like href="./Article_Name" - route within app
    .replace(/href="\.\/([^"]+)"/g, 'href="/article/$1" data-internal="true"')
    // Fix relative links like href="/wiki/Article_Name" - route within app
    .replace(/href="\/wiki\/([^"]+)"/g, 'href="/article/$1" data-internal="true"')
    // Fix href="/w/index.php..." links - these go to Wikipedia (edit pages etc)
    .replace(/href="\/w\/([^"]+)"/g, 'href="https://en.wikipedia.org/w/$1" target="_blank" rel="noopener noreferrer"')
    // Fix href="#..." citation links to not navigate away
    .replace(/href="#([^"]+)"/g, 'href="javascript:void(0)" data-ref="$1"')
    // Fix src="//" protocol-relative image URLs
    .replace(/src="\/\//g, 'src="https://')
    // External links (non-Wikipedia) open in new tab
    .replace(/<a ([^>]*)href="(https?:\/\/(?!en\.wikipedia\.org\/wiki)[^"]+)"([^>]*)>/g, '<a $1href="$2" target="_blank" rel="noopener noreferrer"$3>')
    // Wikipedia article links open in app
    .replace(/<a ([^>]*)href="https?:\/\/en\.wikipedia\.org\/wiki\/([^"]+)"([^>]*)>/g, '<a $1href="/article/$2" data-internal="true"$3>');
  
  return processed;
}

function SectionAccordion({ section, defaultExpanded = false }: { section: ArticleSection; defaultExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const processedContent = processWikiContent(section.content);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {section.title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-4 wiki-content prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const title = decodeURIComponent(params.title as string);
  
  const [article, setArticle] = useState<ArticleFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch article data
  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getFullArticle(title);
        setArticle(data);
        
        // Check if article is saved
        const saved = await isArticleSaved(data.id);
        setIsSaved(saved);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [title]);

  // Handle save/unsave
  const handleToggleSave = async () => {
    if (!article) return;
    
    if (isSaved) {
      await unsaveArticle(article.id);
      setIsSaved(false);
      showToast('Removed from saved', 'info');
    } else {
      await saveArticle({
        ...article,
        savedAt: new Date(),
        liked: true,
      });
      setIsSaved(true);
      showToast('Saved! 📚', 'success');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full mb-6 rounded-2xl" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-red-500 dark:text-red-400">
          Failed to load article
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {error}
        </p>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Sticky header */}
      <div className="sticky top-14 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSave}
              className={cn(
                'h-10 w-10',
                isSaved && 'text-blue-600 dark:text-blue-400'
              )}
            >
              <Bookmark className={cn('w-5 h-5', isSaved && 'fill-current')} />
            </Button>
            
            <a
              href={article.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Article content */}
      <article className="pb-8">
        {/* Hero image */}
        {article.thumbnail && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={article.thumbnail.url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-4 left-4 right-4 text-3xl md:text-4xl font-bold text-white">
              {article.title}
            </h1>
          </div>
        )}

        {/* Title (if no image) */}
        {!article.thumbnail && (
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {article.title}
            </h1>
          </div>
        )}

        {/* Overview */}
        <div className="px-5 py-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Overview
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.extract}
          </p>
        </div>

        {/* Sections */}
        {article.sections.length > 0 && (() => {
          // Filter out reference/citation sections
          const excludedSections = [
            'references', 'notes', 'citations', 'sources', 'bibliography',
            'further reading', 'external links', 'see also', 'footnotes'
          ];
          const filteredSections = article.sections.filter(section => 
            !excludedSections.includes(section.title.toLowerCase())
          );
          
          return filteredSections.length > 0 ? (
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Article Content
              </h2>
            </div>
            {filteredSections.map((section, index) => (
              <SectionAccordion 
                key={section.id} 
                section={section} 
                defaultExpanded={index < 2}
              />
            ))}
          </div>
          ) : null;
        })()}

        {/* Read full article on Wikipedia */}
        <div className="px-5 py-6 border-b border-gray-200 dark:border-gray-800">
          <a
            href={article.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl',
              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
              'font-medium'
            )}
          >
            <ExternalLink className="w-5 h-5" />
            Read full article on Wikipedia
          </a>
        </div>

        {/* Related articles */}
        {article.related.length > 0 && (
          <div className="px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
              Related Articles
            </h2>
            <div className="space-y-3">
              {article.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${encodeURIComponent(related.title)}`}
                  className="block p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {related.extract}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to feed button */}
        <div className="px-5 py-6">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            Continue Swiping
          </Button>
        </div>
      </article>
    </div>
  );
}
