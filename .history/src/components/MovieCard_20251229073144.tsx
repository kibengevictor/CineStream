import { Star, Calendar, Play, MoreVertical } from 'lucide-react'

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

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <button
                        onClick={() => onPlay(id, mediaType, title)}
                        className="bg-white/90 hover:bg-white text-black p-3 rounded-full transition-all duration-200 shadow-lg"
                    >
                        <Play className="w-6 h-6 fill-current" />
                    </button>
                </div>

                {/* More button */}
                <button className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <MoreVertical className="w-4 h-4" />
                </button>

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
