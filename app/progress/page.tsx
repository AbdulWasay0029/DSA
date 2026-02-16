'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProgressPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ total: 0, mastered: 0, inProgress: 0, streak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) {
            setLoading(false);
            return;
        }

        const fetchProgress = async () => {
            try {
                const [progressRes, notesRes] = await Promise.all([
                    fetch('/api/progress'),
                    fetch('/api/notes')
                ]);

                if (progressRes.ok && notesRes.ok) {
                    const progressData = await progressRes.json();
                    const notesData = await notesRes.json();

                    const completed = progressData.completed || [];
                    const total = notesData.length;
                    const mastered = completed.length;

                    setStats({
                        total,
                        mastered,
                        inProgress: Math.min(2, Math.max(0, total - mastered)), // Mock in-progress count
                        streak: 3 // Mock streak for now
                    });
                }
            } catch (e) {
                console.error('Failed to fetch progress:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [session]);

    if (!session) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h1>Track Your Journey</h1>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Sign in to see your stats, mastery, and streaks.</p>
                <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '50px' }}>Sign In</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <span className="spinner"></span>
            </div>
        );
    }

    const topics = [
        { name: 'Arrays', count: 5, icon: '📊', color: '#4ade80' },
        { name: 'Strings', count: 3, icon: 'abc', color: '#2196f3' },
        { name: 'Bit Manipulation', count: 6, icon: '010', color: '#f59e0b' },
        { name: 'Math', count: 3, icon: '∑', color: '#ec4899' },
    ];

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
                        <h3>{stats.mastered} / {stats.total}</h3>
                        <span>Notes Mastered</span>
                    </div>
                </motion.div>

                <motion.div className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className={styles.statIcon} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>🔥</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.streak} Days</h3>
                        <span>Current Streak</span>
                    </div>
                </motion.div>

                <motion.div className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className={styles.statIcon} style={{ color: '#8a3ffc', background: 'rgba(138, 63, 252, 0.1)' }}>📝</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.inProgress}</h3>
                        <span>In Progress</span>
                    </div>
                </motion.div>
            </div>

            {/* Mastery Progress Bar */}
            <div className={styles.section} style={{ marginTop: '3rem' }}>
                <h3>Overall Mastery</h3>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                    <span>{stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}% Complete</span>
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
