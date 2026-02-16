'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/data/notes';

export default function NotesPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDiff, setFilterDiff] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch('/api/notes');
                if (res.ok) setNotes(await res.json());
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    // Grouping Logic
    const groupedNotes = notes.reduce((acc, note) => {
        // Find the "Topic" tag (anything that is NOT Easy/Medium/Hard)
        const topic = note.tags?.find(t => !['Easy', 'Medium', 'Hard'].includes(t)) || 'Uncategorized';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    const topics = Object.keys(groupedNotes).sort();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Algorithm Curriculum</h1>
                    <p className={styles.subtitle}>Your structured path to mastery.</p>
                </div>
                {role === 'admin' && (
                    <Link href="/notes/create" className={styles.createBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Problem
                    </Link>
                )}
            </header>

            {/* Difficulty Filter */}
            <div className={styles.filterBar}>
                {['Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                        key={diff}
                        className={`${styles.filterBtn} ${filterDiff === diff ? styles.active : ''}`}
                        onClick={() => setFilterDiff(filterDiff === diff ? null : diff)}
                    >
                        {diff}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}><span className="spinner"></span></div>
            ) : (
                <div className={styles.syllabusList}>
                    {topics.map(topic => {
                        const topicNotes = groupedNotes[topic].filter(n => !filterDiff || n.tags?.includes(filterDiff));
                        if (topicNotes.length === 0) return null;

                        return (
                            <div key={topic} className={styles.topicSection}>
                                <div className={styles.topicHeader}>
                                    <h2 className={styles.topicTitle}>{topic}</h2>
                                    <span className={styles.topicCount}>{topicNotes.length} Problems</span>
                                </div>
                                <div className={styles.notesGrid}>
                                    {topicNotes.map(note => (
                                        <NoteCard key={note.id} note={note} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {notes.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', color: '#666', marginTop: '4rem' }}>
                            <p>No notes found in the curriculum.</p>
                            {role === 'admin' && (
                                <button onClick={() => fetch('/api/seed').then(() => window.location.reload())} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
                                    Seed Default Data
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
