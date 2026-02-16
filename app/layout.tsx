import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: {
        template: '%s | AlgoStream',
        default: 'AlgoStream | Master Data Structures & Algorithms',
    },
    description: 'The premium platform for tracking DSA progress, visualizing solutions, and mastering coding interviews.',
    icons: {
        icon: '/icon.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable}`}>
                <AuthProvider>
                    <Navbar />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    )
}
