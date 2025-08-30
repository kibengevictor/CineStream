'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function PlayerPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title')

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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black bg-opacity-90 p-4 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold">{title || 'Video Player'}</h1>
      </header>

      {/* Video Player */}
      <div className="relative w-full h-[calc(100vh-80px)]">
        <iframe
          src={decodeURIComponent(url)}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title || 'Video Player'}
        />
      </div>
    </div>
  )
}
