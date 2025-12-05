'use client';

import { useState, useEffect } from 'react';
import { Trash2, Download, FileJson, X, BookmarkX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MovieCard } from '@/components/MovieCard';
import { downloadJSON, downloadCSV, convertToCSV } from '@/utils/downloadHelpers';

interface WatchlistItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  addedAt: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    try {
      const saved = localStorage.getItem('watchlist');
      if (saved) {
        const items = JSON.parse(saved);
        setWatchlist(items);
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (id: number, type: string) => {
    const updated = watchlist.filter(item => !(item.id === id && item.type === type));
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const clearWatchlist = () => {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
      setWatchlist([]);
      localStorage.removeItem('watchlist');
    }
  };

  const exportWatchlistJSON = () => {
    downloadJSON(watchlist, `cinestream-watchlist-${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportWatchlistCSV = () => {
    const csvData = watchlist.map(item => ({
      title: item.title || item.name,
      type: item.type === 'movie' ? 'Movie' : 'TV Show',
      rating: item.vote_average,
      releaseDate: item.release_date || item.first_air_date,
      addedDate: new Date(item.addedAt).toLocaleDateString(),
    }));
    
    const csv = convertToCSV(csvData);
    downloadCSV(csv, `cinestream-watchlist-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const playContent = (id: number, type: string, title: string) => {
    const vidsrcUrl = type === 'movie'
      ? `https://vidsrc.me/embed/movie?tmdb=${id}`
      : `https://vidsrc.me/embed/tv?tmdb=${id}`;

    router.push(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${type}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-netflix-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-netflix-light-gray text-lg">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* Header */}
      <header className="bg-netflix-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-netflix-light-gray hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h1 className="text-3xl font-bold text-netflix-red">
                My Watchlist
              </h1>
            </div>
            
            {watchlist.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={exportWatchlistJSON}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileJson size={18} />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>
                
                <button
                  onClick={exportWatchlistCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
                
                <button
                  onClick={clearWatchlist}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX size={80} className="mx-auto text-netflix-light-gray mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your watchlist is empty</h2>
            <p className="text-netflix-light-gray text-lg mb-8">
              Browse movies and TV shows to add them to your watchlist
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-netflix-red hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-netflix-light-gray text-lg">
                  {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {watchlist.map((item) => {
                const title = item.title || item.name || 'Unknown';
                const releaseDate = item.release_date || item.first_air_date || '';
                
                return (
                  <div key={`${item.id}-${item.type}`} className="relative group">
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWatchlist(item.id, item.type)}
                      className="absolute -top-2 -right-2 z-10 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <MovieCard
                      id={item.id}
                      title={title}
                      posterPath={item.poster_path}
                      voteAverage={item.vote_average}
                      releaseDate={releaseDate}
                      mediaType={item.type}
                      overview={item.overview}
                      originalLanguage={item.original_language}
                      onPlay={playContent}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
