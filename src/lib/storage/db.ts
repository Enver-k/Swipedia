import Dexie, { type EntityTable } from 'dexie';
import { SavedArticle, UserPreferences } from '@/types';

// Define the database
const db = new Dexie('SwipediaDB') as Dexie & {
  saved: EntityTable<SavedArticle, 'id'>;
  preferences: EntityTable<UserPreferences & { id: string }, 'id'>;
};

// Define schema
db.version(1).stores({
  saved: 'id, savedAt, liked, title',
  preferences: 'id',
});

export { db };

// Helper functions for saved articles
export async function saveArticle(article: SavedArticle): Promise<void> {
  await db.saved.put(article);
}

export async function unsaveArticle(id: string): Promise<void> {
  await db.saved.delete(id);
}

export async function getSavedArticle(id: string): Promise<SavedArticle | undefined> {
  return db.saved.get(id);
}

export async function getAllSavedArticles(): Promise<SavedArticle[]> {
  return db.saved.orderBy('savedAt').reverse().toArray();
}

export async function isArticleSaved(id: string): Promise<boolean> {
  const article = await db.saved.get(id);
  return !!article;
}

export async function getSavedCount(): Promise<number> {
  return db.saved.count();
}

// Helper functions for user preferences
const PREFERENCES_ID = 'user-preferences';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  haptics: true,
  interests: [],
  skippedIds: [],
  likedIds: [],
};

export async function getPreferences(): Promise<UserPreferences> {
  const prefs = await db.preferences.get(PREFERENCES_ID);
  return prefs ? { ...prefs, id: undefined } as UserPreferences : defaultPreferences;
}

export async function updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
  const current = await getPreferences();
  await db.preferences.put({ ...current, ...updates, id: PREFERENCES_ID });
}

export async function addSkippedId(id: string): Promise<void> {
  const prefs = await getPreferences();
  if (!prefs.skippedIds.includes(id)) {
    prefs.skippedIds.push(id);
    await updatePreferences({ skippedIds: prefs.skippedIds });
  }
}

export async function addLikedId(id: string): Promise<void> {
  const prefs = await getPreferences();
  if (!prefs.likedIds.includes(id)) {
    prefs.likedIds.push(id);
    await updatePreferences({ likedIds: prefs.likedIds });
  }
}
