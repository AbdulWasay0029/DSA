import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'DSA Dashboard',
    description: 'Track your Data Structures and Algorithms progress',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}
