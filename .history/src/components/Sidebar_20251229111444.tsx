'use client'

import { Home, Tv, Trophy, Store, FolderOpen, Clock, Film, MonitorPlay, Gauge, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, createContext, useContext } from 'react'

// Create context for sidebar state
const SidebarContext = createContext({ isCollapsed: false })

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <SidebarContext.Provider value={{ isCollapsed }}>
            {children}
        </SidebarContext.Provider>
    )
}

export default function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const mainNavItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Store, label: 'Store', href: '/store' },
    ]

    const libraryItems = [
        { icon: Clock, label: 'Watchlist', href: '/library/watchlist' },
        { icon: Film, label: 'favorites', href: '/library/favorites' },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <aside className={`peer fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} bg-[#1c1c1e] text-white flex flex-col border-r border-white/10 transition-all duration-300`}>
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <Tv className="w-6 h-6 text-white" />
                        <h1 className="text-xl font-semibold">CineStream</h1>
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex justify-center w-full">
                        <Tv className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-20 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-2 shadow-lg border-2 border-[#1c1c1e] transition-all hover:scale-110 z-50"
            >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Search */}
            {!isCollapsed && (
                <div className="px-4 py-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-[#2c2c2e] text-white placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
                <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-[#2c2c2e] text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-[#2c2c2e]/50'
                                    }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon className="w-5 h-5" />
                                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Library Section */}
                <div className="mt-6">
                    {!isCollapsed && (
                        <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
                            <div className="flex items-center space-x-2">
                                <FolderOpen className="w-5 h-5" />
                                <span>Library</span>
                            </div>
                        </button>
                    )}
                    {isCollapsed && (
                        <div className="flex justify-center px-3 py-2">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                    <ul className={`mt-2 space-y-1 ${!isCollapsed && 'pl-4'}`}>
                        {libraryItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-[#2c2c2e] text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-[#2c2c2e]/50'
                                        }`}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {!isCollapsed && <span className="text-sm">{item.label}</span>}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold">
                        KV
                    </div>
                    {!isCollapsed && <span className="text-sm font-medium">Kibenge Victor</span>}
                </div>
            </div>
        </aside>
    )
}
