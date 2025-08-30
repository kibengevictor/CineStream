'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

// Types
interface Movie {
    id: number
    title: string
    poster_path: string
    backdrop_path: string
    overview: string
    release_date: string
    vote_average: number
    media_type?: string
}

interface TVShow {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
    overview: string
    first_air_date: string
    vote_average: number
    media_type?: string
}

type MediaItem = Movie | TVShow

export default function HomePage() {
    const router = useRouter()
    const [movies, setMovies] = useState<Movie[]>([])
    const [tvShows, setTvShows] = useState<TVShow[]>([])
    const [searchResults, setSearchResults] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

    // Fetch popular movies and TV shows on component mount
    useEffect(() => {
        fetchPopularContent()
    }, [])

    const fetchPopularContent = async () => {
        setLoading(true)
        try {
            // Fetch popular movies and TV shows in parallel
            const [moviesResponse, tvResponse] = await Promise.all([
                fetch('/api/tmdb?type=popular'),
                fetch('/api/tmdb?type=tv')
            ])

            const [moviesData, tvData] = await Promise.all([
                moviesResponse.json(),
                tvResponse.json()
            ])

            if (moviesData.results) {
                setMovies(moviesData.results.slice(0, 12))
            }

            if (tvData.results) {
                setTvShows(tvData.results.slice(0, 12))
            }
        } catch (error) {
            console.error('Error fetching content:', error)
            // Fallback data if API fails
            setMovies([
                {
                    id: 603,
                    title: "The Matrix",
                    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
                    overview: "A computer programmer discovers reality is a simulation.",
                    release_date: "1999-03-31",
                    vote_average: 8.2
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setIsSearching(false)
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        try {
            const response = await fetch(`/api/tmdb?query=${encodeURIComponent(searchTerm)}`)
            const data = await response.json()

            if (data.results) {
                setSearchResults(data.results.slice(0, 24))
                setIsSearching(true)
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setSearchLoading(false)
        }
    }

    const clearSearch = () => {
        setSearchResults([])
        setIsSearching(false)
        setSearchTerm('')
    }

    const playContent = (id: number, type: string, title: string) => {
        const mediaType = type === 'movie' || type === 'tv' ? type : (type === 'person' ? null : 'movie')

        if (!mediaType) return

        const vidsrcUrl = mediaType === 'movie'
            ? `https://vidsrc.me/embed/movie?tmdb=${id}`
            : `https://vidsrc.me/embed/tv?tmdb=${id}`

        // Show loading state briefly before navigation
        setLoading(true)

        // Navigate to player page within the same tab
        setTimeout(() => {
            router.push(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${mediaType}`)
        }, 300)
    }

    const playFirstMovie = () => {
        const firstMovie = movies[0]
        if (firstMovie) {
            playContent(firstMovie.id, 'movie', firstMovie.title)
        }
    }

    return (
        <div className="min-h-screen bg-netflix-black text-white">
            {/* Header */}
            <header className="bg-netflix-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-netflix-red">
                            CineStream
                        </h1>

                        <div className="flex items-center space-x-3 bg-netflix-gray rounded-xl px-6 py-3 max-w-2xl w-full mx-8">
                            <input
                                type="text"
                                placeholder="Search for movies, TV shows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-transparent flex-1 outline-none text-white placeholder-netflix-light-gray text-lg"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="text-netflix-light-gray hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={handleSearch}
                                disabled={searchLoading || !searchTerm.trim()}
                                className="bg-netflix-red hover:bg-red-600 disabled:bg-netflix-gray disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                            >
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            {!isSearching && (
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-netflix-black via-netflix-dark-gray to-netflix-black">
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-netflix-red/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                        <h1 className="text-6xl md:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-netflix-red to-red-600 bg-clip-text text-transparent">CineStream</span>
                        </h1>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                            Watch Without Limits
                        </h2>

                        <h3 className="text-2xl md:text-4xl font-light mb-8 text-netflix-light-gray">
                            Movies • Series • Originals
                        </h3>

                        <p className="text-xl md:text-2xl text-netflix-light-gray mb-12 max-w-3xl mx-auto">
                            Your gateway to endless entertainment, all in one place
                        </p>

                        <button
                            onClick={playFirstMovie}
                            className="bg-netflix-red hover:bg-red-600 text-white px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-netflix-red/25"
                        >
                            ▶ Start Streaming
                        </button>
                    </div>
                </section>
            )}

            {/* Search Results */}
            {isSearching && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-4xl font-bold">Search Results</h3>
                            <button
                                onClick={clearSearch}
                                className="bg-netflix-gray text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-netflix-light-gray transition-all duration-300"
                            >
                                <X className="w-5 h-5" />
                                <span>Clear Search</span>
                            </button>
                        </div>
                        {/* Search Results grid remains unchanged */}
                    </div>
                </section>
            )}

            {/* Popular Movies Section */}
            {/* (unchanged code for movies and TV shows below) */}

            {/* Footer */}
            <footer className="bg-netflix-gray/50 backdrop-blur-sm py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-netflix-red to-red-600 bg-clip-text text-transparent mb-4">
                            CineStream
                        </h4>
                        <p className="text-netflix-light-gray mb-4">
                            Your ultimate destination for streaming movies and TV shows
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-netflix-light-gray">
                            <span>&copy; 2025 CineStream</span>
                            <span>•</span>
                            <span>Built with Vidsrc integration</span>
                            <span>•</span>
                            <span>Powered by TMDB</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
