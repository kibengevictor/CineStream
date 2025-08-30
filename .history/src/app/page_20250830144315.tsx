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
}

interface TVShow {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  overview: string
  first_air_date: string
  vote_average: number
}

const TMDB_API_KEY = 'your_tmdb_api_key_here' // You'll need to get this from TMDB
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/1080p'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch popular movies and TV shows on component mount
  useEffect(() => {
    fetchPopularContent()
  }, [])

  const fetchPopularContent = async () => {
    try {
      // For demo purposes, using sample data since TMDB API key is needed
      setMovies([
        {
          id: 1,
          title: "The Matrix",
          poster_path: "/placeholder-poster.jpg",
          backdrop_path: "/placeholder-backdrop.jpg",
          overview: "A computer programmer discovers reality is a simulation.",
          release_date: "1999-03-31",
          vote_average: 8.7
        },
        {
          id: 2,
          title: "Inception",
          poster_path: "/placeholder-poster.jpg",
          backdrop_path: "/placeholder-backdrop.jpg",
          overview: "A thief enters people's dreams to steal secrets.",
          release_date: "2010-07-16",
          vote_average: 8.8
        }
      ])
      
      setTvShows([
        {
          id: 1,
          name: "Breaking Bad",
          poster_path: "/placeholder-poster.jpg",
          backdrop_path: "/placeholder-backdrop.jpg",
          overview: "A chemistry teacher becomes a meth manufacturer.",
          first_air_date: "2008-01-20",
          vote_average: 9.5
        }
      ])
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      // Implement search functionality here
      console.log('Searching for:', searchTerm)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const playContent = (id: number, type: 'movie' | 'tv', title: string) => {
    // Generate Vidsrc embed URL
    const vidsrcUrl = type === 'movie' 
      ? `https://vidsrc.me/embed/movie?tmdb=${id}`
      : `https://vidsrc.me/embed/tv?tmdb=${id}`
    
    // Open in new window or navigate to player page
    window.open(`/player?url=${encodeURIComponent(vidsrcUrl)}&title=${encodeURIComponent(title)}`, '_blank')
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
      <section className="relative h-96 bg-gradient-to-r from-netflix-black to-netflix-gray flex items-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-4">Stream Unlimited Movies & TV Shows</h2>
          <p className="text-xl text-gray-300 mb-6">Discover and watch your favorite content using Vidsrc integration</p>
          <button className="bg-netflix-red hover:bg-red-600 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors">
            <Play className="w-5 h-5" />
            <span>Start Watching</span>
          </button>
        </div>
      </section>

      {/* Movies Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold mb-6">Popular Movies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="group cursor-pointer">
              <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
                <img
                  src={`https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(movie.title)}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
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
                  <span>{movie.vote_average}</span>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TV Shows Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold mb-6">Popular TV Shows</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tvShows.map((show) => (
            <div key={show.id} className="group cursor-pointer">
              <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
                <img
                  src={`https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(show.name)}`}
                  alt={show.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
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
                  <span>{show.vote_average}</span>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-netflix-gray py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 VideoSource. Built with Vidsrc integration.</p>
        </div>
      </footer>
    </div>
  )
}
