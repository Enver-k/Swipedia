import { ArticleSummary, ArticleSection, ArticleFull } from '@/types';
import { WIKIPEDIA_API } from '@/lib/utils';

// Wikipedia API response types
interface WikipediaSummaryResponse {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
  timestamp?: string;
}

interface WikipediaSectionsResponse {
  lead: {
    sections: WikipediaSection[];
    text?: string;
  };
  remaining: {
    sections: WikipediaSection[];
  };
}

interface WikipediaSection {
  id: number;
  text: string;
  line: string;
  toclevel: number;
}

interface WikipediaRelatedResponse {
  pages: WikipediaSummaryResponse[];
}

/**
 * Transform Wikipedia API summary response to our ArticleSummary type
 */
function transformSummary(data: WikipediaSummaryResponse): ArticleSummary {
  return {
    id: String(data.pageid),
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail
      ? {
          url: data.thumbnail.source,
          width: data.thumbnail.width,
          height: data.thumbnail.height,
        }
      : undefined,
    pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
    timestamp: data.timestamp,
  };
}

/**
 * Transform Wikipedia sections response to our ArticleSection type
 */
function transformSections(data: WikipediaSectionsResponse): ArticleSection[] {
  const sections: ArticleSection[] = [];
  
  // Add lead section content if available
  if (data.lead?.text && data.lead.text.trim().length > 0) {
    sections.push({
      id: 'lead',
      title: 'Introduction',
      content: data.lead.text,
      level: 1,
    });
  }
  
  // Add remaining sections
  if (data.remaining?.sections) {
    for (const section of data.remaining.sections) {
      if (section.text && section.text.trim().length > 0) {
        sections.push({
          id: String(section.id),
          title: section.line,
          content: section.text,
          level: section.toclevel + 1,
        });
      }
    }
  }
  
  return sections;
}

/**
 * Fetch a random article summary from Wikipedia
 */
export async function getRandomSummary(): Promise<ArticleSummary> {
  const response = await fetch(`${WIKIPEDIA_API}/page/random/summary`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status}`);
  }

  const data: WikipediaSummaryResponse = await response.json();
  return transformSummary(data);
}

/**
 * Fetch a specific article summary by title
 */
export async function getArticleSummary(title: string): Promise<ArticleSummary> {
  // Replace spaces with underscores for Wikipedia API
  const normalizedTitle = title.replace(/ /g, '_');
  
  const response = await fetch(
    `${WIKIPEDIA_API}/page/summary/${encodeURIComponent(normalizedTitle)}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status}`);
  }

  const data: WikipediaSummaryResponse = await response.json();
  return transformSummary(data);
}

/**
 * Fetch article sections for deep dive view
 */
export async function getArticleSections(title: string): Promise<ArticleSection[]> {
  // Replace spaces with underscores for Wikipedia API
  const normalizedTitle = title.replace(/ /g, '_');
  
  try {
    const response = await fetch(
      `${WIKIPEDIA_API}/page/mobile-sections/${encodeURIComponent(normalizedTitle)}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch sections for ${title}: ${response.status}`);
      return [];
    }

    const data: WikipediaSectionsResponse = await response.json();
    const sections = transformSections(data);
    return sections;
  } catch (error) {
    console.warn('Error fetching sections:', error);
    return [];
  }
}

/**
 * Fetch related articles for a given title
 */
export async function getRelatedArticles(title: string): Promise<ArticleSummary[]> {
  // Replace spaces with underscores for Wikipedia API
  const normalizedTitle = title.replace(/ /g, '_');
  
  const response = await fetch(
    `${WIKIPEDIA_API}/page/related/${encodeURIComponent(normalizedTitle)}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    // Return empty array instead of throwing for related articles
    return [];
  }

  const data: WikipediaRelatedResponse = await response.json();
  return (data.pages || []).slice(0, 8).map(transformSummary);
}

/**
 * Fetch full article data for deep dive
 */
export async function getFullArticle(title: string): Promise<ArticleFull> {
  // First get the summary - this is the most reliable
  const summary = await getArticleSummary(title);
  
  // Try to get sections and related, but don't fail if they error
  let sections: ArticleSection[] = [];
  let related: ArticleSummary[] = [];
  
  try {
    sections = await getArticleSections(title);
    
    // If no sections from mobile-sections, try the action API
    if (sections.length === 0) {
      sections = await getArticleSectionsFromActionApi(title);
    }
  } catch (e) {
    console.warn('Failed to fetch sections:', e);
  }
  
  try {
    related = await getRelatedArticles(title);
  } catch (e) {
    console.warn('Failed to fetch related:', e);
  }

  return {
    ...summary,
    sections,
    related,
  };
}

/**
 * Fallback: Fetch article sections using MediaWiki action API
 */
async function getArticleSectionsFromActionApi(title: string): Promise<ArticleSection[]> {
  const normalizedTitle = title.replace(/ /g, '_');
  
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(normalizedTitle)}&prop=text|sections&format=json&origin=*`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.parse) {
      return [];
    }
    
    const sections: ArticleSection[] = [];
    
    // Add the full article content as one section
    if (data.parse.text?.['*']) {
      sections.push({
        id: 'main',
        title: 'Article Content',
        content: data.parse.text['*'],
        level: 1,
      });
    }
    
    return sections;
  } catch (error) {
    console.warn('Action API fallback failed:', error);
    return [];
  }
}

/**
 * Prefetch multiple random articles for the feed queue
 */
export async function prefetchFeed(count: number = 5): Promise<ArticleSummary[]> {
  const promises = Array(count)
    .fill(null)
    .map(() => getRandomSummary());

  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<ArticleSummary> => 
      result.status === 'fulfilled'
    )
    .map((result) => result.value);
}
