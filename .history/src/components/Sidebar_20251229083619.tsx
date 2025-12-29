'use client'

import { Home, Tv, Trophy, Store, FolderOpen, Clock, Film, MonitorPlay, Gauge } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()

    const mainNavItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Trophy, label: 'MLS', href: '/mls' },
        { icon: Store, label: 'Store', href: '/store' },
    ]

    const libraryItems = [
        { icon: Clock, label: 'Recently Added', href: '/library/recent' },
        { icon: Film, label: 'Movies', href: '/library/movies' },
        { icon: MonitorPlay, label: 'TV Shows', href: '/library/tv-shows' },
        { icon: Gauge, label: '4K HDR', href: '/library/4k' },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1c1c1e] text-white flex flex-col border-r border-white/10">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <Tv className="w-6 h-6 text-white" />
                    <h1 className="text-xl font-semibold">Apple TV</h1>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#2c2c2e] text-white placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
                <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-[#2c2c2e] text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-[#2c2c2e]/50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Library Section */}
                <div className="mt-6">
                    <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
                        <div className="flex items-center space-x-2">
                            <FolderOpen className="w-5 h-5" />
                            <span>Library</span>
                        </div>
                    </button>
                    <ul className="mt-2 space-y-1 pl-4">
                        {libraryItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-[#2c2c2e] text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-[#2c2c2e]/50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold">
                        KV
                    </div>
                    <span className="text-sm font-medium">Kibenge Victor</span>
                </div>
            </div>
        </aside>
    )
}
