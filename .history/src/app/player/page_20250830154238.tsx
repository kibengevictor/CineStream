'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Home, RotateCcw } from 'lucide-react'
import { Suspense } from 'react'

function PlayerContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title')
  const type = searchParams.get('type')

  if (!url) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center text-white">
        <div className="text-center glass p-12 rounded-2xl max-w-md">
          <h1 className="text-3xl font-bold mb-6">No Video URL Provided</h1>
          <p className="text-netflix-light-gray mb-8">
            Please select a movie or TV show to watch
          </p>
          <a 
            href="/" 
            className="btn-primary text-white px-8 py-3 rounded-lg inline-flex items-center space-x-2 hover:bg-red-600 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Go back to home</span>
          </a>
        </div>
      </div>
    )
  }

  const decodedUrl = decodeURIComponent(url)

  const refreshPlayer = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Enhanced Header */}
      <header className="glass bg-black/90 backdrop-blur-md p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-netflix-red transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">{title || 'Video Player'}</h1>
            {type && (
              <div className="flex items-center space-x-2">
                <span className="bg-netflix-red px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <span className="text-netflix-light-gray text-sm">
                  Powered by Vidsrc
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshPlayer}
            className="text-white hover:text-netflix-red transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
            title="Refresh player"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <a
            href={decodedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-netflix-red transition-colors duration-200 flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="hidden sm:inline">New Tab</span>
          </a>
        </div>
      </header>

      {/* Video Player Container */}
      <div className="relative w-full h-[calc(100vh-80px)]">
        {/* Loading overlay */}
        <div className="absolute inset-0 bg-netflix-black flex items-center justify-center z-5">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-netflix-red/30 border-t-netflix-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading player...</p>
            <p className="text-netflix-light-gray text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
        
        {/* Video iframe */}
        <iframe
          src={decodedUrl}
          className="w-full h-full border-0 relative z-10"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title={title || 'Video Player'}
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            // Hide loading overlay when iframe loads
            const loadingOverlay = document.querySelector('.absolute.inset-0.bg-netflix-black') as HTMLElement
            if (loadingOverlay) {
              loadingOverlay.style.display = 'none'
            }
          }}
        />
      </div>

      {/* Instructions footer */}
      <div className="glass absolute bottom-0 left-0 right-0 p-4 text-center backdrop-blur-sm bg-black/70">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-netflix-light-gray">
          <span>🎬 Press F11 for fullscreen experience</span>
          <span>•</span>
          <span>⚡ If video doesn't load, try refreshing</span>
          <span>•</span>
          <span>🔄 Use the refresh button for playback issues</span>
        </div>
      </div>
    </div>
  )
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-netflix-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-netflix-red/30 border-t-netflix-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading player...</p>
        </div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  )
}
