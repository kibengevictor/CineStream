'use client'

import { useState, useEffect } from 'react'
import { Search, Play, Star, Calendar } from 'lucide-react'

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

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [searchResults, setSearchResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Fetch popular movies and TV shows on component mount
  useEffect(() => {
    fetchPopularContent()
  }, [])

  const fetchPopularContent = async () => {
    setLoading(true)
    try {
      // Fetch popular movies
      const moviesResponse = await fetch('/api/tmdb?type=popular')
      const moviesData = await moviesResponse.json()
      
      // Fetch popular TV shows
      const tvResponse = await fetch('/api/tmdb?type=tv')
      const tvData = await tvResponse.json()
      
      if (moviesData.results) {
        setMovies(moviesData.results.slice(0, 12)) // Limit to 12 items
      }
      
      if (tvData.results) {
        setTvShows(tvData.results.slice(0, 12)) // Limit to 12 items
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
    
    setLoading(true)
    try {
      const response = await fetch(`/api/tmdb?query=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      
      if (data.results) {
        setSearchResults(data.results.slice(0, 20))
        setIsSearching(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const playContent = (id: number, type: string, title: string) => {
    // Determine media type
    const mediaType = type === 'movie' || type === 'tv' ? type : (type === 'person' ? null : 'movie')
    
    if (!mediaType) return // Skip if it's a person result
    
    // Generate Vidsrc embed URL
    const vidsrcUrl = mediaType === 'movie' 
      ? `https://vidsrc.me/embed/movie?tmdb=${id}`
      : `https://vidsrc.me/embed/tv?tmdb=${id}`
    
    // Navigate to player page
    window.open(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}&type=${mediaType}`, '_blank')
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setIsSearching(false)
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* Header */}
      <header className="bg-netflix-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-netflix-red">VideoSource</h1>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-2 bg-netflix-gray rounded-lg px-4 py-2 max-w-md w-full">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies, TV shows..."
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
            <p className="text-xl text-gray-300 mb-6">Discover and watch your favorite content using Vidsrc integration</p>
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
                <div key={`${item.id}-${mediaType}`} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
                    {item.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${item.poster_path}`}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(title)}`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-netflix-gray flex items-center justify-center text-gray-400">
                        <span className="text-center p-2">{title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => playContent(item.id, mediaType, title)}
                        className="opacity-0 group-hover:opacity-100 bg-netflix-red text-white p-3 rounded-full hover:bg-red-600 transition-all"
                      >
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold truncate">{title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{item.vote_average.toFixed(1)}</span>
                      {releaseDate && (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(releaseDate).getFullYear()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
                <div key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(movie.title)}`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-netflix-gray flex items-center justify-center text-gray-400">
                        <span className="text-center p-2">{movie.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => playContent(movie.id, 'movie', movie.title)}
                        className="opacity-0 group-hover:opacity-100 bg-netflix-red text-white p-3 rounded-full hover:bg-red-600 transition-all"
                      >
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold truncate">{movie.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  </div>
                </div>
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
                <div key={show.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
                    {show.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(show.name)}`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-netflix-gray flex items-center justify-center text-gray-400">
                        <span className="text-center p-2">{show.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => playContent(show.id, 'tv', show.name)}
                        className="opacity-0 group-hover:opacity-100 bg-netflix-red text-white p-3 rounded-full hover:bg-red-600 transition-all"
                      >
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold truncate">{show.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{show.vote_average.toFixed(1)}</span>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(show.first_air_date).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="bg-netflix-gray py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 VideoSource. Built with Vidsrc integration.</p>
        </div>
      </footer>
    </div>
  )
}
