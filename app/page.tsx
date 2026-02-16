'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';

export default function Home() {
    return (
        <div className={styles.main}>
            {/* Background Elements */}
            <div className={styles.bgGlow} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={styles.hero}
            >
                <div className={styles.badge}>DSA Mastery Batch 2026</div>
                <h1 className={styles.title}>
                    Master Data Structures <br />
                    <span>& Algorithms Together</span>
                </h1>
                <p className={styles.subtitle}>
                    A community-driven workspace to track notes, visualize solutions,
                    and collaborate on complex problems. Built for excellence.
                </p>

                <div className={styles.ctaGroup}>
                    <Link href="/notes" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.1rem', textDecoration: 'none' }}>
                        Browse Notes
                    </Link>
                    <Link href="/links" className={styles.secondaryCta}>
                        View Resources
                    </Link>
                </div>
            </motion.div>

            {/* Stats / Features Grid */}
            <motion.div
                className={styles.grid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <div className={styles.card}>
                    <div className={styles.cardIcon}>📝</div>
                    <h3>Smart Notes</h3>
                    <p>Interactive, markdown-supported notes with complexity analysis and code syntax highlighting.</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardIcon}>🤝</div>
                    <h3>Collaboration</h3>
                    <p>Suggest edits and improvements to existing notes. Admins review and approve changes.</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardIcon}>🔗</div>
                    <h3>Curated Links</h3>
                    <p>A centralized repository of important problem links and external resources.</p>
                </div>
            </motion.div>
        </div>
    );
}
