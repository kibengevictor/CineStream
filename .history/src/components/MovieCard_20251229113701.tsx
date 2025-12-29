import { Star, Calendar, Play, MoreVertical, Heart, Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MovieCardProps {
    id: number
    title: string
    posterPath?: string
    voteAverage: number
    releaseDate: string
    mediaType: string
    overview?: string
    originalLanguage?: string
    onPlay: (id: number, type: string, title: string) => void
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export function MovieCard({
    id,
    title,
    posterPath,
    voteAverage,
    releaseDate,
    mediaType,
    overview,
    originalLanguage,
    onPlay
}: MovieCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isInWatchlist, setIsInWatchlist] = useState(false)

    useEffect(() => {
        // Check if item is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setIsFavorite(favorites.some((item: any) => item.id === id))

        // Check if item is in watchlist
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
        setIsInWatchlist(watchlist.some((item: any) => item.id === id))
    }, [id])

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

        if (isFavorite) {
            const updated = favorites.filter((item: any) => item.id !== id)
            localStorage.setItem('favorites', JSON.stringify(updated))
            setIsFavorite(false)
        } else {
            favorites.push({ id, title, posterPath, voteAverage, releaseDate, mediaType, overview })
            localStorage.setItem('favorites', JSON.stringify(favorites))
            setIsFavorite(true)
        }
        setShowMenu(false)
    }

    const toggleWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation()
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')

        if (isInWatchlist) {
            const updated = watchlist.filter((item: any) => item.id !== id)
            localStorage.setItem('watchlist', JSON.stringify(updated))
            setIsInWatchlist(false)
        } else {
            watchlist.push({ id, title, posterPath, voteAverage, releaseDate, mediaType, overview })
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            setIsInWatchlist(true)
        }
        setShowMenu(false)
    }

    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'

    return (
        <div className="group cursor-pointer movie-card animate-fadeIn flex-shrink-0 w-[180px]">
            <div className="relative aspect-[2/3] bg-[#2c2c2e] rounded-2xl overflow-hidden shadow-xl">
                {posterPath ? (
                    <img
                        src={`${IMAGE_BASE_URL}${posterPath}`}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x450/2c2c2e/808080?text=${encodeURIComponent(title)}`
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
                        <span className="text-center p-4 text-sm font-medium">{title}</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Three-dot menu button - top right */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(!showMenu)
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm z-10 transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute top-10 right-2 w-36 bg-[#2c2c2e] rounded-lg shadow-xl border border-white/10 py-1 z-50">
                        <button
                            onClick={toggleFavorite}
                            className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-[#3a3a3c] flex items-center space-x-2"
                        >
                            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{isFavorite ? 'Remove' : 'Favorite'}</span>
                        </button>
                        <button
                            onClick={toggleWatchlist}
                            className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-[#3a3a3c] flex items-center space-x-2"
                        >
                            <Bookmark className={`w-3 h-3 ${isInWatchlist ? 'fill-blue-500 text-blue-500' : ''}`} />
                            <span>{isInWatchlist ? 'Remove' : 'Watchlist'}</span>
                        </button>
                    </div>
                )}

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <button
                        onClick={() => onPlay(id, mediaType, title)}
                        className="bg-white/90 hover:bg-white text-black p-3 rounded-full transition-all duration-200 shadow-lg"
                    >
                        <Play className="w-6 h-6 fill-current" />
                    </button>
                </div>

                {/* Rating badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{voteAverage.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Card info */}
            <div className="mt-3">
                <h4 className="font-medium text-white text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-200">
                    {title}
                </h4>
                {releaseDate && (
                    <p className="text-gray-500 text-xs mt-1">
                        {new Date(releaseDate).getFullYear()}
                    </p>
                )}
            </div>
        </div>
    )
}
