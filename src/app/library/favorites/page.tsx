'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MovieCard } from '@/components/MovieCard'
import { Heart } from 'lucide-react'

interface MediaItem {
    id: number
    title: string
    posterPath?: string
    voteAverage: number
    releaseDate: string
    mediaType: string
    overview?: string
}

export default function FavoritesPage() {
    const router = useRouter()
    const [favorites, setFavorites] = useState<MediaItem[]>([])

    useEffect(() => {
        loadFavorites()
    }, [])

    const loadFavorites = () => {
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavorites(stored)
    }

    const playContent = (id: number, type: string, title: string) => {
        const mediaType = type === 'movie' || type === 'tv' ? type : 'movie'
        const vidsrcUrl = mediaType === 'movie'
            ? `https://vidsrc.me/embed/movie?tmdb=${id}`
            : `https://vidsrc.me/embed/tv?tmdb=${id}`
        
        router.push(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${mediaType}`)
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white">
            <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-12 py-6">
                    <div className="flex items-center space-x-3">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <h1 className="text-3xl font-semibold">Favorites</h1>
                    </div>
                </div>
            </header>

            <main className="px-12 py-8">
                {favorites.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {favorites.map((item) => (
                            <MovieCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                posterPath={item.posterPath}
                                voteAverage={item.voteAverage}
                                releaseDate={item.releaseDate}
                                mediaType={item.mediaType}
                                overview={item.overview}
                                originalLanguage=""
                                onPlay={playContent}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Heart className="w-16 h-16 text-gray-600 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-400 mb-2">No favorites yet</h2>
                        <p className="text-gray-500">Add movies and shows to your favorites to see them here</p>
                    </div>
                )}
            </main>
        </div>
    )
}
