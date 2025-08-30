import { Star, Calendar, Play } from 'lucide-react'

interface MovieCardProps {
  id: number
  title: string
  posterPath?: string
  voteAverage: number
  releaseDate: string
  mediaType: string
  onPlay: (id: number, type: string, title: string) => void
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export function MovieCard({ 
  id, 
  title, 
  posterPath, 
  voteAverage, 
  releaseDate, 
  mediaType, 
  onPlay 
}: MovieCardProps) {
  return (
    <div className="group cursor-pointer movie-card animate-fadeIn">
      <div className="relative aspect-[2/3] bg-netflix-gray rounded-xl overflow-hidden shadow-netflix">
        {posterPath ? (
          <img
            src={`${IMAGE_BASE_URL}${posterPath}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/300x450/2F2F2F/808080?text=${encodeURIComponent(title)}`
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-netflix-gray to-netflix-dark-gray flex items-center justify-center text-netflix-light-gray">
            <span className="text-center p-4 font-medium">{title}</span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <button
            onClick={() => onPlay(id, mediaType, title)}
            className="bg-netflix-red text-white p-4 rounded-full hover:bg-red-600 transition-all duration-200 btn-primary shadow-glow"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>{voteAverage.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      {/* Card info */}
      <div className="mt-4 px-1">
        <h4 className="font-semibold text-white truncate text-lg group-hover:text-netflix-red transition-colors duration-200">
          {title}
        </h4>
        <div className="flex items-center space-x-3 text-sm text-netflix-light-gray mt-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium">{voteAverage.toFixed(1)}</span>
          </div>
          {releaseDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(releaseDate).getFullYear()}</span>
            </div>
          )}
          <span className="capitalize bg-netflix-gray px-2 py-0.5 rounded-full text-xs">
            {mediaType === 'movie' ? 'Movie' : 'TV Show'}
          </span>
        </div>
      </div>
    </div>
  )
}
