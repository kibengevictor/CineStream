'use client'

import { useState, useEffect } from 'react'
import { X, Search, Play, Star, Calendar } from 'lucide-react'
import { MovieCard } from '@/components/MovieCard'
import { LoadingGrid } from '@/components/LoadingCard'
import { SearchBar } from '@/components/SearchBar'
import { Hero } from '@/components/Hero'

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

    const handleSearch = async (searchTerm: string) => {
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
    }

    const playContent = (id: number, type: string, title: string) => {
        const mediaType = type === 'movie' || type === 'tv' ? type : (type === 'person' ? null : 'movie')

        if (!mediaType) return

        const vidsrcUrl = mediaType === 'movie'
            ? `https://vidsrc.me/embed/movie?tmdb=${id}`
            : `https://vidsrc.me/embed/tv?tmdb=${id}`

        window.open(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${mediaType}`, '_blank')
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
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-netflix-red">CineStream</h1>

                        {/* Search Bar */}
                        <div className="flex items-center space-x-2 bg-netflix-gray rounded-lg px-4 py-2 max-w-md w-full">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies or TV shows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-netflix-red px-4 py-1 rounded text-white hover:bg-red-600 transition-colors"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            {!isSearching && (
                <section className="relative h-96 bg-gradient-to-r from-netflix-black to-netflix-gray flex items-center">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-5xl font-bold mb-4">Stream Unlimited Movies & TV Shows</h2>
                        <p className="text-xl text-gray-300 mb-6">Discover and watch your favorite content</p>
                        <button
                            onClick={() => {
                                const firstMovie = movies[0]
                                if (firstMovie) {
                                    playContent(firstMovie.id, 'movie', firstMovie.title)
                                }
                            }}
                            className="bg-netflix-red hover:bg-red-600 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Play className="w-5 h-5" />
                            <span>Start Watching</span>
                        </button>
                    </div>
                </section>
            )}

            {/* Search Results */}
            {isSearching && searchResults.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold">Search Results</h3>
                        <button
                            onClick={clearSearch}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {searchResults.map((item) => {
                            const isMovie = 'title' in item || item.media_type === 'movie'
                            const title = isMovie ? (item as Movie).title : (item as TVShow).name
                            const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date
                            const mediaType = item.media_type || (isMovie ? 'movie' : 'tv')

                            if (mediaType === 'person') return null // Skip person results

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
                                    onPlay={playContent}
                                />
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Movies Section */}
            {!isSearching && (
                <section className="max-w-7xl mx-auto px-4 py-12">
                    <h3 className="text-3xl font-bold mb-6">Popular Movies</h3>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-xl text-gray-400">Loading movies...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                                    onPlay={playContent}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* TV Shows Section */}
            {!isSearching && (
                <section className="max-w-7xl mx-auto px-4 py-12">
                    <h3 className="text-3xl font-bold mb-6">Popular TV Shows</h3>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-xl text-gray-400">Loading TV shows...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                                    onPlay={playContent}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Footer */}
            <footer className="bg-netflix-gray py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>&copy; 2026Built with Vidsrc integration.</p>
                </div>
            </footer>
        </div>
    )
}
