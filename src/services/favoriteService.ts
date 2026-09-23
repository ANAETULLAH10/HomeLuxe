import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from '../firebase';

const FAVORITES_COLLECTION = 'favorites';
const GUEST_KEY = 'homeluxe_favorites_guest';

const getCacheKey = (userId?: string | null) => {
  return userId ? `homeluxe_favorites_${userId}` : GUEST_KEY;
};

export const getCachedFavorites = (userId?: string | null): string[] => {
  try {
    const key = getCacheKey(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
};

export const setCachedFavorites = (userId: string | null | undefined, ids: string[]) => {
  try {
    const key = getCacheKey(userId);
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // ignore
  }
};

/**
 * Subscribes to favorites for the current user (or fallback to local storage).
 */
export function subscribeFavorites(
  userId: string | null | undefined,
  callback: (favoriteIds: string[]) => void
) {
  // Always emit cached favorites immediately so UI is responsive
  const cached = getCachedFavorites(userId);
  callback(cached);

  if (!userId) {
    // Guest user - listen to local storage storage events or return
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GUEST_KEY) {
        callback(getCachedFavorites(null));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }

  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ids: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.propertyId) {
            ids.push(data.propertyId);
          }
        });
        setCachedFavorites(userId, ids);
        callback(ids);
      },
      (error) => {
        console.warn('Favorites listener notice (using cached data):', error?.message || error);
        callback(getCachedFavorites(userId));
      }
    );

    return () => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch {
        // safely ignore any tear-down abort errors
      }
    };
  } catch {
    callback(getCachedFavorites(userId));
    return () => {};
  }
}

/**
 * Toggles a property in favorites, persisting to both Firestore and localStorage.
 */
export async function toggleFavoriteItem(
  propertyId: string,
  userId: string | null | undefined,
  isCurrentlyFavorite: boolean
): Promise<boolean> {
  const nextState = !isCurrentlyFavorite;
  const currentCached = getCachedFavorites(userId);
  
  const updatedIds = nextState
    ? Array.from(new Set([...currentCached, propertyId]))
    : currentCached.filter((id) => id !== propertyId);

  // Update local cache immediately
  setCachedFavorites(userId, updatedIds);

  const docId = `${userId || 'guest'}_${propertyId}`;

  try {
    if (nextState) {
      await setDoc(doc(db, FAVORITES_COLLECTION, docId), {
        userId: userId || 'guest',
        propertyId,
        createdAt: Date.now()
      });
    } else {
      await deleteDoc(doc(db, FAVORITES_COLLECTION, docId));
    }
  } catch (err: any) {
    console.warn('Firestore favorite toggle notice (saved locally):', err?.message || err);
  }

  return nextState;
}
