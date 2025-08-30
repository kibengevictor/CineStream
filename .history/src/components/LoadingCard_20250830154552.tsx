export function LoadingCard() {
    return (
        <div className="animate-fadeIn">
            <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden skeleton">
                <div className="w-full h-full bg-gradient-to-r from-netflix-gray via-netflix-light-gray to-netflix-gray"></div>
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-netflix-gray rounded skeleton"></div>
                <div className="h-3 bg-netflix-gray rounded w-3/4 skeleton"></div>
            </div>
        </div>
    )
}

export function LoadingGrid({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <LoadingCard key={i} />
            ))}
        </div>
    )
}
