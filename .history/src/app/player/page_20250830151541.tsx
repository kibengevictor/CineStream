'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Suspense } from 'react'

function PlayerContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title')
  const type = searchParams.get('type')

  if (!url) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Video URL Provided</h1>
          <a href="/" className="text-blue-500 hover:underline">Go back to home</a>
        </div>
      </div>
    )
  }

  const decodedUrl = decodeURIComponent(url)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black bg-opacity-90 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white text-xl font-semibold">{title || 'Video Player'}</h1>
            {type && (
              <p className="text-gray-400 text-sm capitalize">
                {type === 'movie' ? 'Movie' : 'TV Show'}
              </p>
            )}
          </div>
        </div>
        
        <a
          href={decodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition-colors flex items-center space-x-2"
          title="Open in new tab"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="hidden sm:inline">Open in new tab</span>
        </a>
      </header>

      {/* Video Player */}
      <div className="relative w-full h-[calc(100vh-80px)]">
        <iframe
          src={decodedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title={title || 'Video Player'}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Footer with instructions */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 text-center text-white text-sm">
        <p>If the video doesn't load, try refreshing the page or opening in a new tab.</p>
      </div>
    </div>
  )
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Loading player...</div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  )
}
