'use client';

import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock Data for now - waiting for backend implementation
const mockStats = {
    total: 13,
    mastered: 4,
    inProgress: 2,
    streak: 3
};

const topics = [
    { name: 'Arrays', count: 5, icon: '📊', color: '#4ade80' },
    { name: 'Strings', count: 3, icon: 'abc', color: '#2196f3' },
    { name: 'Bit Manipulation', count: 6, icon: '010', color: '#f59e0b' },
    { name: 'Math', count: 3, icon: '∑', color: '#ec4899' },
];

export default function ProgressPage() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h1>Track Your Journey</h1>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Sign in to see your stats, mastery, and streaks.</p>
                <Link href="/api/auth/signin" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '50px' }}>Sign In</Link>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <p>Welcome back, {session.user?.name?.split(' ')[0]}. You're doing great!</p>
            </header>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <motion.div className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className={styles.statIcon} style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)' }}>🎯</div>
                    <div className={styles.statInfo}>
                        <h3>{mockStats.mastered} / {mockStats.total}</h3>
                        <span>Notes Mastered</span>
                    </div>
                </motion.div>

                <motion.div className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className={styles.statIcon} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>🔥</div>
                    <div className={styles.statInfo}>
                        <h3>{mockStats.streak} Days</h3>
                        <span>Current Streak</span>
                    </div>
                </motion.div>

                <motion.div className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className={styles.statIcon} style={{ color: '#8a3ffc', background: 'rgba(138, 63, 252, 0.1)' }}>📝</div>
                    <div className={styles.statInfo}>
                        <h3>{mockStats.inProgress}</h3>
                        <span>In Progress</span>
                    </div>
                </motion.div>
            </div>

            {/* Mastery Progress Bar */}
            <div className={styles.section} style={{ marginTop: '3rem' }}>
                <h3>Overall Mastery</h3>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(mockStats.mastered / mockStats.total) * 100}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                    <span>{Math.round((mockStats.mastered / mockStats.total) * 100)}% Complete</span>
                    <span>Target: 100%</span>
                </div>
            </div>

            {/* Topic Cards */}
            <div className={styles.section}>
                <h3>Study by Topic</h3>
                <div className={styles.topicGrid}>
                    {topics.map((topic, i) => (
                        <Link href={`/notes?tag=${topic.name}`} key={i} className={styles.topicCard}>
                            <div className={styles.topicIcon} style={{ color: topic.color }}>{topic.icon}</div>
                            <div className={styles.topicInfo}>
                                <h4>{topic.name}</h4>
                                <span>{topic.count} Notes</span>
                            </div>
                            <div className={styles.arrow}>&rarr;</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
