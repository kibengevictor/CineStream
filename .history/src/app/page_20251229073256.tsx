'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Bookmark, Search } from 'lucide-react'
import { MovieCard } from '@/components/MovieCard'
import ContinueWatching from '@/components/ContinueWatching'
import Top10Section from '@/components/Top10Section'

// Types
interface Movie {
    id: number
    title: string
    poster_path: string
    backdrop_path: string
    overview: string
    release_date: string
    vote_average: number
    original_language: string
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
    original_language: string
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
                setMovies(moviesData.results)
            }

            if (tvData.results) {
                setTvShows(tvData.results)
            }
        } catch (error) {
            console.error('Error fetching content:', error)
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

        router.push(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${mediaType}`)
    }

    // Mock data for Continue Watching
    const continueWatchingItems = movies.slice(0, 3).map((movie, index) => ({
        id: movie.id,
        title: movie.title,
        backdropPath: movie.backdrop_path,
        season: index + 1,
        episode: index + 6,
        duration: '34m',
        progress: Math.floor(Math.random() * 60) + 30,
        mediaType: 'tv' as const
    }))

    // Prepare Top 10 items
    const top10TVShows = tvShows.slice(0, 10).map((show, index) => ({
        id: show.id,
        title: show.name,
        posterPath: show.poster_path,
        mediaType: 'tv' as const,
        genre: 'Drama',
        rank: index + 1
    }))

    const top10Movies = movies.slice(0, 10).map((movie, index) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        mediaType: 'movie' as const,
        genre: 'Action',
        rank: index + 1
    }))

    return (
        <div className="min-h-screen bg-[#000000] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-12 py-6 flex items-center justify-between">
                    <div className="flex-1">
                        {/* Search can be here or kept in sidebar */}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/watchlist')}
                            className="flex items-center gap-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Bookmark size={18} />
                            <span className="text-sm font-medium">Watchlist</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-12 py-8">
                {isSearching ? (
                    /* Search Results */
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-4xl font-semibold text-white">Search Results</h2>
                            <button
                                onClick={clearSearch}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                                <span className="text-sm">Clear Search</span>
                            </button>
                        </div>

                        {searchLoading ? (
                            <div className="flex space-x-6 overflow-x-auto pb-6">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="flex-shrink-0 w-[180px] animate-pulse">
                                        <div className="aspect-[2/3] bg-[#2c2c2e] rounded-2xl mb-3"></div>
                                        <div className="h-4 bg-[#2c2c2e] rounded mb-2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                                {searchResults.map((item) => {
                                    const isMovie = 'title' in item || item.media_type === 'movie'
                                    const title = isMovie ? (item as Movie).title : (item as TVShow).name
                                    const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date
                                    const mediaType = item.media_type || (isMovie ? 'movie' : 'tv')

                                    if (mediaType === 'person') return null

                                    return (
                                        <MovieCard
                                            key={`${item.id}-${mediaType}`}
                                            id={item.id}
                                            title={title}
                                            posterPath={item.poster_path}
                                            voteAverage={item.vote_average}
                                            releaseDate={releaseDate}
                                            mediaType={mediaType}
                                            overview={item.overview}
                                            originalLanguage={item.original_language}
                                            onPlay={playContent}
                                        />
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h4 className="text-2xl font-semibold mb-4">No results found</h4>
                                <p className="text-gray-500">Try searching for something else</p>
                            </div>
                        )}
                    </section>
                ) : (
                    /* Home Content */
                    <>
                        {/* Continue Watching Section */}
                        <ContinueWatching items={continueWatchingItems} />

                        {/* Top 10 TV Shows */}
                        {!loading && top10TVShows.length > 0 && (
                            <Top10Section title="Top 10 TV Shows on Apple TV" items={top10TVShows} />
                        )}

                        {/* Top 10 Movies */}
                        {!loading && top10Movies.length > 0 && (
                            <Top10Section title="Top 10 Movies on Apple TV" items={top10Movies} />
                        )}

                        {/* Popular Movies Row */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-white mb-6">Popular Movies</h2>
                            {loading ? (
                                <div className="flex space-x-6 overflow-x-auto pb-6">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={i} className="flex-shrink-0 w-[180px] animate-pulse">
                                            <div className="aspect-[2/3] bg-[#2c2c2e] rounded-2xl mb-3"></div>
                                            <div className="h-4 bg-[#2c2c2e] rounded mb-2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                                    {movies.slice(0, 15).map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            id={movie.id}
                                            title={movie.title}
                                            posterPath={movie.poster_path}
                                            voteAverage={movie.vote_average}
                                            releaseDate={movie.release_date}
                                            mediaType="movie"
                                            overview={movie.overview}
                                            originalLanguage={movie.original_language}
                                            onPlay={playContent}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Popular TV Shows Row */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-white mb-6">Popular TV Shows</h2>
                            {loading ? (
                                <div className="flex space-x-6 overflow-x-auto pb-6">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={i} className="flex-shrink-0 w-[180px] animate-pulse">
                                            <div className="aspect-[2/3] bg-[#2c2c2e] rounded-2xl mb-3"></div>
                                            <div className="h-4 bg-[#2c2c2e] rounded mb-2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                                    {tvShows.slice(0, 15).map((show) => (
                                        <MovieCard
                                            key={show.id}
                                            id={show.id}
                                            title={show.name}
                                            posterPath={show.poster_path}
                                            voteAverage={show.vote_average}
                                            releaseDate={show.first_air_date}
                                            mediaType="tv"
                                            overview={show.overview}
                                            originalLanguage={show.original_language}
                                            onPlay={playContent}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    )
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
            <header className="bg-netflix-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-netflix-red whitespace-nowrap">
                            CineStream
                        </h1>

                        <div className="flex items-center space-x-3 bg-netflix-gray rounded-xl px-4 sm:px-6 py-3 max-w-2xl flex-1">
                            <input
                                type="text"
                                placeholder="Search for movies, TV shows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-transparent flex-1 outline-none text-white placeholder-netflix-light-gray text-sm sm:text-lg"
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
                                className="bg-netflix-red hover:bg-red-600 disabled:bg-netflix-gray disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                            >
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        <button
                            onClick={() => router.push('/watchlist')}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                            title="My Watchlist"
                        >
                            <Bookmark size={20} />
                            <span className="hidden sm:inline">Watchlist</span>
                        </button>
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
                            <span className="bg-gradient-to-r from-netflix-red to-red-600 bg-clip-text text-transparent">VideoSource</span>
                        </h1>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                            Stream Unlimited
                        </h2>

                        <h3 className="text-2xl md:text-4xl font-light mb-8 text-netflix-light-gray">
                            Movies & TV Shows
                        </h3>

                        <p className="text-xl md:text-2xl text-netflix-light-gray mb-12 max-w-3xl mx-auto">
                            Discover and watch your favorite content with our modern streaming platform
                        </p>

                        <button
                            onClick={playFirstMovie}
                            className="bg-netflix-red hover:bg-red-600 text-white px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-netflix-red/25"
                        >
                            ▶ Start Watching
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

                        {searchLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[2/3] bg-netflix-gray rounded-lg mb-3"></div>
                                        <div className="h-4 bg-netflix-gray rounded mb-2"></div>
                                        <div className="h-3 bg-netflix-gray rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {searchResults.map((item) => {
                                    const isMovie = 'title' in item || item.media_type === 'movie'
                                    const title = isMovie ? (item as Movie).title : (item as TVShow).name
                                    const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date
                                    const mediaType = item.media_type || (isMovie ? 'movie' : 'tv')

                                    if (mediaType === 'person') return null

                                    return (
                                        <MovieCard
                                            key={`${item.id}-${mediaType}`}
                                            id={item.id}
                                            title={title}
                                            posterPath={item.poster_path}
                                            voteAverage={item.vote_average}
                                            releaseDate={releaseDate}
                                            mediaType={mediaType}
                                            overview={item.overview}
                                            originalLanguage={item.original_language}
                                            onPlay={playContent}
                                        />
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h4 className="text-2xl font-semibold mb-4">No results found</h4>
                                <p className="text-netflix-light-gray">Try searching for something else</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Popular Movies Section */}
            {!isSearching && (
                <section className="py-16 bg-gradient-to-b from-transparent to-netflix-dark-gray/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-4xl font-bold mb-8">Popular Movies</h3>
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[2/3] bg-netflix-gray rounded-lg mb-3"></div>
                                        <div className="h-4 bg-netflix-gray rounded mb-2"></div>
                                        <div className="h-3 bg-netflix-gray rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {movies.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        id={movie.id}
                                        title={movie.title}
                                        posterPath={movie.poster_path}
                                        voteAverage={movie.vote_average}
                                        releaseDate={movie.release_date}
                                        mediaType="movie"
                                        overview={movie.overview}
                                        originalLanguage={movie.original_language}
                                        onPlay={playContent}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Popular TV Shows Section */}
            {!isSearching && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-4xl font-bold mb-8">Popular TV Shows</h3>
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[2/3] bg-netflix-gray rounded-lg mb-3"></div>
                                        <div className="h-4 bg-netflix-gray rounded mb-2"></div>
                                        <div className="h-3 bg-netflix-gray rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {tvShows.map((show) => (
                                    <MovieCard
                                        key={show.id}
                                        id={show.id}
                                        title={show.name}
                                        posterPath={show.poster_path}
                                        voteAverage={show.vote_average}
                                        releaseDate={show.first_air_date}
                                        mediaType="tv"
                                        overview={show.overview}
                                        originalLanguage={show.original_language}
                                        onPlay={playContent}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-netflix-gray/50 backdrop-blur-sm py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-netflix-red to-red-600 bg-clip-text text-transparent mb-4">
                            VideoSource
                        </h4>
                        <p className="text-netflix-light-gray mb-4">
                            Your ultimate destination for streaming movies and TV shows
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-netflix-light-gray">
                            <span>&copy; 2025 VideoSource</span>
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
