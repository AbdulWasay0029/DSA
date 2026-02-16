'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Home() {
    const { status } = useSession();

    return (
        <div className={styles.main}>
            {/* Background Orbs */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />

            <div className={styles.container}>
                {/* Hero Section */}
                <motion.div
                    className={styles.hero}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.badge}>
                        <span className={styles.badgeDot}></span>
                        AlgoStream v1.0
                    </div>

                    <h1 className={styles.title}>
                        Unlock Your <br />
                        <span className={styles.gradientText}>Coding Potential</span>
                    </h1>

                    <p className={styles.subtitle}>
                        The premium platform for mastering Data Structures & Algorithms.
                        Curated notes, visualized solutions, and community-driven progress tracking.
                    </p>

                    <div className={styles.ctaGroup}>
                        {status === 'loading' ? (
                            <button className={styles.primaryBtn} disabled>
                                Loading...
                            </button>
                        ) : status === 'authenticated' ? (
                            <Link href="/notes" className={styles.primaryBtn}>
                                Continue Learning
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </Link>
                        ) : (
                            <Link href="/login" className={styles.primaryBtn}>
                                Start Learning Free
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </Link>
                        )}

                        <Link href="/notes" className={styles.secondaryBtn}>
                            Explore Curriculum
                        </Link>
                    </div>

                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <strong>500+</strong> <span>Problems</span>
                        </div>
                        <div className={styles.statItem}>
                            <strong>40+</strong> <span>Patterns</span>
                        </div>
                        <div className={styles.statItem}>
                            <strong>100%</strong> <span>Free</span>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Feature: Floating Code Card */}
                <motion.div
                    className={styles.visualWrapper}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className={styles.codeCard}>
                        <div className={styles.codeHeader}>
                            <div className={styles.dots}>
                                <span style={{ background: '#ef4444' }}></span>
                                <span style={{ background: '#fbbf24' }}></span>
                                <span style={{ background: '#22c55e' }}></span>
                            </div>
                            <span className={styles.fileName}>solution.py</span>
                        </div>
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{ background: 'transparent', padding: '1.5rem', fontSize: '0.85rem' }}
                        >
                            {`def floodFill(image, sr, sc, color):
    # DFS Approach
    if image[sr][sc] == color:
        return image
    
    fill(image, sr, sc, image[sr][sc], color)
    return image`}
                        </SyntaxHighlighter>
                    </div>
                </motion.div>
            </div>

            {/* Feature Grid */}
            <div className={styles.featuresSection}>
                <div className={styles.featureCard}>
                    <div className={styles.iconBox} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>🚀</div>
                    <h3>Curated Roadmap</h3>
                    <p>Stop guessing what to study. Follow a structured path from Arrays to Dynamic Programming.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.iconBox} style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>✨</div>
                    <h3>Premium Notes</h3>
                    <p>Beautifully formatted notes with intuition, complexity analysis, and multiple solution approaches.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.iconBox} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>🌱</div>
                    <h3>Track Growth</h3>
                    <p>Visualize your progress with detailed analytics and mastery charts. Watch yourself grow.</p>
                </div>
            </div>
        </div>
    );
}
