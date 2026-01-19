'use client'

import Link from 'next/link'
import styles from './page.module.css'
import { motion } from 'framer-motion'

export default function Home() {
    return (
        <main className={styles.main}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={styles.hero}
            >
                <h1 className={styles.title}>DSA Dashboard</h1>
                <p className={styles.subtitle}>Mastering Data Structures & Algorithms with handwritten precision.</p>
            </motion.div>

            <motion.div
                className={styles.grid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                <Link href="/notes" className={styles.card}>
                    <div className={styles.cardIcon}>📝</div>
                    <h2>Notes &rarr;</h2>
                    <p>View your handwritten notes and problem solutions.</p>
                </Link>
                <Link href="/links" className={styles.card}>
                    <div className={styles.cardIcon}>🔗</div>
                    <h2>Links &rarr;</h2>
                    <p>Explore the list of problems and resources.</p>
                </Link>
            </motion.div>
        </main>
    )
}
