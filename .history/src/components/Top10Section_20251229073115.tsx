'use client'

import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Top10Item {
    id: number
    title: string
    posterPath: string
    mediaType: 'movie' | 'tv'
    genre: string
    rank: number
}

interface Top10SectionProps {
    title: string
    items: Top10Item[]
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export default function Top10Section({ title, items }: Top10SectionProps) {
    const router = useRouter()

    const handleItemClick = (item: Top10Item) => {
        router.push(`/player?id=${item.id}&type=${item.mediaType}&title=${encodeURIComponent(item.title)}`)
    }

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <button className="text-gray-400 hover:text-white text-sm">
                    See All →
                </button>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                {items.slice(0, 10).map((item, index) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-[200px] group cursor-pointer"
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#2c2c2e] shadow-lg">
                            {/* Rank Badge */}
                            <div className="absolute top-4 left-4 z-10 w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20">
                                <span className="text-white text-xl font-bold">{index + 1}</span>
                            </div>

                            {/* Poster */}
                            {item.posterPath ? (
                                <img
                                    src={`${IMAGE_BASE_URL}${item.posterPath}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm text-center p-4">{item.title}</span>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* More Button */}
                            <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Genre Badge */}
                            <div className="absolute bottom-4 left-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                                    {item.genre}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mt-3">
                            <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-gray-300 transition-colors">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
