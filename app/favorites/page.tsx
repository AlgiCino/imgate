'use client';
import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import FavoriteButton from '@/components/FavoriteButton';

interface Project {
  id: string;
  title: string;
  developer: string;
  location: string;
  price: string;
  image: string;
  link?: string;
  tags?: string[];
  type?: string;
  status?: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFavorites();

    // Listen for favorites updates
    const handleUpdate = () => loadFavorites();
    window.addEventListener('favoritesUpdated', handleUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('favoriteProjects');
      if (!stored) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const favoriteIds: string[] = JSON.parse(stored);
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch all projects
      const res = await fetch('/api/dubai/projects');
      if (res.ok) {
        const data = await res.json();
        const allProjects = data.projects || [];
        
        // Filter to only favorite projects
        const favoriteProjects = allProjects.filter((p: Project) =>
          favoriteIds.includes(p.id)
        );
        
        setFavorites(favoriteProjects);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      localStorage.removeItem('favoriteProjects');
      setFavorites([]);
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={32} className="text-red-500 fill-red-500" />
                  <h1 className="text-3xl md:text-5xl font-bold">My Favorites</h1>
                </div>
                <p className="text-white/70">
                  {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
              
              {favorites.length > 0 && (
                <button
                  onClick={clearAllFavorites}
                  className="btn-ghost text-sm flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
              <p className="text-white/60">Loading your favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            /* Empty State */
            <div className="glass-strong rounded-2xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} className="text-white/40" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No Favorites Yet</h3>
                <p className="text-white/60 mb-6">
                  Start exploring properties and save your favorites to view them here.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-gold"
                >
                  Explore Properties
                </button>
              </div>
            </div>
          ) : (
            /* Favorites Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((project) => (
                <div
                  key={project.id}
                  className="group glass rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.image || '/images/default-project.svg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/default-project.svg';
                      }}
                    />
                    <div className="absolute top-3 left-3 chip">{project.developer}</div>
                    <div className="absolute top-3 right-3">
                      <FavoriteButton projectId={project.id} size="sm" />
                    </div>
                    {project.status && (
                      <div className="absolute bottom-3 right-3 text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                        {project.status}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold tracking-tight mb-1 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">{project.location}</p>
                    <p className="text-brand-gold font-semibold mb-3">{project.price}</p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-white/80 border border-white/10 rounded-full px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`/projects/${project.id}`}
                        className="btn-gold flex-1 text-center text-sm"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
