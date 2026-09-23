import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscribeFavorites, toggleFavoriteItem, getCachedFavorites } from '../services/favoriteService';

interface FavoritesContextType {
  favoriteIds: string[];
  favoritesCount: number;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
  isFavoritesModalOpen: boolean;
  openFavoritesModal: () => void;
  closeFavoritesModal: () => void;
  favoriteFeedback: { message: string; propertyId?: string } | null;
  clearFavoriteFeedback: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getCachedFavorites(user?.uid));
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [favoriteFeedback, setFavoriteFeedback] = useState<{ message: string; propertyId?: string } | null>(null);

  // Subscribe to favorites when user changes
  useEffect(() => {
    const unsubscribe = subscribeFavorites(user?.uid, (ids) => {
      setFavoriteIds(ids);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const isFavorite = (propertyId: string) => {
    return favoriteIds.includes(propertyId);
  };

  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    const currentStatus = isFavorite(propertyId);
    
    // Optimistic local update
    if (currentStatus) {
      setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
      setFavoriteFeedback({ message: 'Removed from Saved Properties', propertyId });
    } else {
      setFavoriteIds((prev) => [...prev, propertyId]);
      setFavoriteFeedback({ message: 'Saved to My Favorites', propertyId });
    }

    const nextState = await toggleFavoriteItem(propertyId, user?.uid, currentStatus);
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFavoriteFeedback((prev) => (prev?.propertyId === propertyId ? null : prev));
    }, 3000);

    return nextState;
  };

  const clearFavoriteFeedback = () => setFavoriteFeedback(null);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoritesCount: favoriteIds.length,
        isFavorite,
        toggleFavorite,
        isFavoritesModalOpen,
        openFavoritesModal: () => setIsFavoritesModalOpen(true),
        closeFavoritesModal: () => setIsFavoritesModalOpen(false),
        favoriteFeedback,
        clearFavoriteFeedback
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
