'use client';

import { Download, FileJson, Image, FileText, BookmarkPlus, X } from 'lucide-react';
import { useState } from 'react';
import { 
  downloadJSON, 
  downloadImage, 
  generateMovieInfoHTML, 
  downloadHTMLFile 
} from '@/utils/downloadHelpers';

interface DownloadMenuProps {
  content: {
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
  };
}

export default function DownloadMenu({ content }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const title = content.title || content.name || 'Unknown';

  const handleDownloadMetadata = () => {
    setDownloading('metadata');
    try {
      const metadata = {
        id: content.id,
        title: title,
        type: content.type,
        rating: content.vote_average,
        overview: content.overview,
        releaseDate: content.release_date || content.first_air_date,
        language: content.original_language,
        downloadedAt: new Date().toISOString(),
        source: 'CineStream',
        note: 'This is metadata only. No copyrighted video content included.'
      };
      
      downloadJSON(metadata, `${title}-metadata.json`);
    } finally {
      setDownloading(null);
      setIsOpen(false);
    }
  };

  const handleDownloadPoster = async () => {
    setDownloading('poster');
    try {
      const posterUrl = `https://image.tmdb.org/t/p/original${content.poster_path}`;
      await downloadImage(posterUrl, `${title}-poster.jpg`);
    } catch (error) {
      alert('Failed to download poster. Please try again.');
    } finally {
      setDownloading(null);
      setIsOpen(false);
    }
  };

  const handleDownloadInfo = () => {
    setDownloading('info');
    try {
      const html = generateMovieInfoHTML({
        ...content,
        title: title
      });
      downloadHTMLFile(html, `${title}-info.html`);
    } finally {
      setDownloading(null);
      setIsOpen(false);
    }
  };

  const handleAddToWatchlist = () => {
    setDownloading('watchlist');
    try {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      const exists = watchlist.find((item: any) => item.id === content.id && item.type === content.type);
      
      if (!exists) {
        watchlist.push({
          ...content,
          title: title,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`✅ "${title}" added to watchlist!`);
      } else {
        alert(`ℹ️ "${title}" is already in your watchlist!`);
      }
    } finally {
      setDownloading(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 shadow-lg w-full justify-center"
        title="Download Options"
      >
        <Download size={18} />
        <span className="text-sm font-medium">Download</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          
          {/* Menu - positioned to appear upward */}
          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[101] min-w-[280px] max-w-[320px]">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium">📥 Legal Downloads</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-2 space-y-1">
              {/* Metadata JSON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadMetadata();
                }}
                disabled={downloading === 'metadata'}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileJson size={18} className="text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium">Download Metadata</p>
                  <p className="text-xs text-gray-400">JSON file with details</p>
                </div>
                {downloading === 'metadata' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
                )}
              </button>

              {/* Poster Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPoster();
                }}
                disabled={downloading === 'poster'}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image size={18} className="text-purple-400" />
                <div className="flex-1">
                  <p className="font-medium">Download Poster</p>
                  <p className="text-xs text-gray-400">High-res image</p>
                </div>
                {downloading === 'poster' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
                )}
              </button>

              {/* Info HTML */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadInfo();
                }}
                disabled={downloading === 'info'}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={18} className="text-green-400" />
                <div className="flex-1">
                  <p className="font-medium">Download Info Page</p>
                  <p className="text-xs text-gray-400">Formatted HTML</p>
                </div>
                {downloading === 'info' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
                )}
              </button>

              {/* Add to Watchlist */}
              <div className="border-t border-gray-700 my-1"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWatchlist();
                }}
                disabled={downloading === 'watchlist'}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookmarkPlus size={18} className="text-yellow-400" />
                <div className="flex-1">
                  <p className="font-medium">Add to Watchlist</p>
                  <p className="text-xs text-gray-400">Save for later</p>
                </div>
                {downloading === 'watchlist' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
                )}
              </button>
            </div>

            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <p className="text-xs text-gray-500 text-center">
                ⚖️ Metadata & images only. No video content.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
