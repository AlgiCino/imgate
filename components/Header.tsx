'use client';

import { Heart, Scale } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Update comparison count
  useEffect(() => {
    const updateComparisonCount = () => {
      const stored = localStorage.getItem('comparisonProjects');
      if (stored) {
        try {
          const projects = JSON.parse(stored);
          setComparisonCount(projects.length);
        } catch (e) {
          setComparisonCount(0);
        }
      } else {
        setComparisonCount(0);
      }
    };

    // Initial count
    updateComparisonCount();

    // Listen for comparison updates
    window.addEventListener('comparisonUpdated', updateComparisonCount);
    window.addEventListener('storage', updateComparisonCount);

    return () => {
      window.removeEventListener('comparisonUpdated', updateComparisonCount);
      window.removeEventListener('storage', updateComparisonCount);
    };
  }, []);

  // Update favorites count
  useEffect(() => {
    const updateFavoritesCount = () => {
      const stored = localStorage.getItem('favoriteProjects');
      if (stored) {
        try {
          const favorites = JSON.parse(stored);
          setFavoritesCount(favorites.length);
        } catch (e) {
          setFavoritesCount(0);
        }
      } else {
        setFavoritesCount(0);
      }
    };

    // Initial count
    updateFavoritesCount();

    // Listen for favorites updates
    window.addEventListener('favoritesUpdated', updateFavoritesCount);
    window.addEventListener('storage', updateFavoritesCount);

    return () => {
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
      window.removeEventListener('storage', updateFavoritesCount);
    };
  }, []);

  return (
    <header
      role="banner"
      className="header-fixed fixed top-0 left-0 w-full z-50 header-blur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass rounded-lg p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M12 22V8" />
              <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              <circle cx="12" cy="5" r="3" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight">Imperium Gate</span>
        </div>

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="hidden md:flex gap-6 text-sm text-white/80"
        >
          <a href="/#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <Link href="/compare" className="hover:text-white transition-colors">
            Compare
          </Link>
          <Link href="/favorites" className="hover:text-white transition-colors">
            Favorites
          </Link>
          <a href="/#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Favorites Badge */}
          <Link
            href="/favorites"
            className="relative p-2 glass rounded-lg hover:bg-white/10 transition-colors"
            title={`${favoritesCount} ${favoritesCount === 1 ? 'favorite' : 'favorites'}`}
          >
            <Heart size={20} className={favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Comparison Badge */}
          <Link
            href="/compare"
            className="relative p-2 glass rounded-lg hover:bg-white/10 transition-colors"
            title={`${comparisonCount} ${comparisonCount === 1 ? 'property' : 'properties'} in comparison`}
          >
            <Scale size={20} />
            {comparisonCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonCount}
              </span>
            )}
          </Link>

          <a href="/#projects" className="btn-alt hidden sm:inline-flex">
            Explore Properties
          </a>

          {/* زر القائمة في الشاشات الصغيرة */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 glass rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة للجوال */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col items-center py-4 gap-3 md:hidden">
          <a href="/#projects" className="hover:text-brand-gold text-white transition-colors">
            Projects
          </a>
          <Link href="/favorites" className="hover:text-brand-gold text-white transition-colors flex items-center gap-2">
            Favorites
            {favoritesCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link href="/compare" className="hover:text-brand-gold text-white transition-colors flex items-center gap-2">
            Compare
            {comparisonCount > 0 && (
              <span className="bg-brand-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonCount}
              </span>
            )}
          </Link>
          <a href="/#contact" className="hover:text-brand-gold text-white transition-colors">
            Contact
          </a>
          <a href="/#projects" className="btn-alt mt-2">
            Explore Properties
          </a>
        </div>
      )}
    </header>
  );
}
