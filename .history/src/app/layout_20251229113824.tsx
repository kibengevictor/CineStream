import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CineStream - Stream Movies & TV Shows',
    description: 'Your ultimate destination for streaming movies and TV shows',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex min-h-screen bg-[#000000]">
                    <Sidebar />
                    <main className="flex-1 ml-64 transition-all duration-300 peer-[.w-20]:ml-20">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
