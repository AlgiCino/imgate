'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  projectId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({ projectId, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const checkFavoriteStatus = () => {
    const stored = localStorage.getItem('favoriteProjects');
    if (stored) {
      const favorites: string[] = JSON.parse(stored);
      setIsFavorite(favorites.includes(projectId));
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const stored = localStorage.getItem('favoriteProjects');
    let favorites: string[] = stored ? JSON.parse(stored) : [];

    if (isFavorite) {
      favorites = favorites.filter((id) => id !== projectId);
    } else {
      favorites.push(projectId);
    }

    localStorage.setItem('favoriteProjects', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`${sizeClasses[size]} rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center ${showLabel ? 'px-4 gap-2 w-auto' : ''} hover:bg-black/80 transition-colors`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={iconSizes[size]}
        className={`${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
        } transition-colors`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
