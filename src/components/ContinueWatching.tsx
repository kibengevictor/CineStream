'use client'

import { Play, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ContinueWatchingItem {
    id: number
    title: string
    backdropPath: string
    season?: number
    episode?: number
    duration: string
    progress: number // 0-100
    mediaType: 'movie' | 'tv'
}

interface ContinueWatchingProps {
    items: ContinueWatchingItem[]
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'

export default function ContinueWatching({ items }: ContinueWatchingProps) {
    const router = useRouter()

    const handlePlay = (item: ContinueWatchingItem) => {
        router.push(`/player?id=${item.id}&type=${item.mediaType}&title=${encodeURIComponent(item.title)}`)
    }

    if (items.length === 0) return null

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Continue Watching</h2>
                <button className="text-gray-400 hover:text-white text-sm">
                    See All →
                </button>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-[420px] group cursor-pointer"
                        onClick={() => handlePlay(item)}
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#2c2c2e] shadow-lg">
                            {item.backdropPath ? (
                                <img
                                    src={`${IMAGE_BASE_URL}${item.backdropPath}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Play Button */}
                            <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-black rounded-full p-3 transition-all transform group-hover:scale-110">
                                <Play className="w-5 h-5 fill-current" />
                            </button>

                            {/* Progress Info */}
                            <div className="absolute bottom-4 left-20 right-16 text-white">
                                {item.mediaType === 'tv' && item.season && item.episode && (
                                    <p className="text-xs text-gray-300 mb-1">
                                        S{item.season}, E{item.episode} · {item.duration}
                                    </p>
                                )}
                            </div>

                            {/* More Button */}
                            <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors backdrop-blur-sm">
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Apple TV Badge */}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                    <span className="text-black text-[10px] font-bold">tv</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 bg-[#2c2c2e] h-1 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
