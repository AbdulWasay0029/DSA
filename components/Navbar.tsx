'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'
import { motion } from 'framer-motion'

export default function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Notes', path: '/notes' },
        { name: 'Links', path: '/links' },
    ]

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link href="/" className={styles.logo}>
                DSA Mastery
            </Link>
            <div className={styles.navLinks}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </motion.nav>
    )
}
