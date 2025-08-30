import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
    onSearch: (term: string) => void
    onClear: () => void
    loading: boolean
}

export function SearchBar({ onSearch, onClear, loading }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim())
        }
    }

    const handleClear = () => {
        setSearchTerm('')
        onClear()
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
            <div className="search-bar flex items-center space-x-3 rounded-xl px-6 py-4 shadow-lg">
                <Search className="w-6 h-6 text-netflix-light-gray flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search for movies, TV shows, actors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent flex-1 outline-none text-white placeholder-netflix-light-gray text-lg font-medium"
                />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-netflix-light-gray hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading || !searchTerm.trim()}
                    className="bg-netflix-red hover:bg-red-600 disabled:bg-netflix-gray disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 btn-primary"
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Searching...</span>
                        </div>
                    ) : (
                        'Search'
                    )}
                </button>
            </div>
        </form>
    )
}
