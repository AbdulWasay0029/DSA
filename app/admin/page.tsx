'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Suggestion {
    suggestionId: string;
    title: string;
    originalId?: string;
    submittedBy?: string;
    submittedAt?: string;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role || 'visitor';
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role !== 'admin') {
            router.push('/');
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch('/api/suggestions');
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (e) {
                console.error('Failed to fetch suggestions:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [role, router]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Review community contributions</p>
                </div>
                <Link href="/notes" className={styles.backBtn}>
                    ← Back to Notes
                </Link>
            </header>

            {suggestions.length === 0 ? (
                <div className={styles.emptyState}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    <h2>All caught up!</h2>
                    <p>No pending suggestions to review.</p>
                </div>
            ) : (
                <div className={styles.suggestionsList}>
                    {suggestions.map((suggestion) => (
                        <Link
                            key={suggestion.suggestionId}
                            href={`/admin/review/${suggestion.suggestionId}`}
                            className={styles.suggestionCard}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>{suggestion.title}</h3>
                                <span className={`${styles.badge} ${suggestion.originalId ? styles.edit : styles.new}`}>
                                    {suggestion.originalId ? 'Edit' : 'New'}
                                </span>
                            </div>
                            <div className={styles.cardMeta}>
                                <span>👤 {suggestion.submittedBy || 'Anonymous'}</span>
                                {suggestion.submittedAt && (
                                    <span>📅 {new Date(suggestion.submittedAt).toLocaleDateString()}</span>
                                )}
                            </div>
                            <div className={styles.cardFooter}>
                                <span className={styles.reviewLink}>
                                    Review →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
