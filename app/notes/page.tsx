'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/lib/types';

function NotesPageContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const tagParam = searchParams.get('tag');

    const role = (session?.user as any)?.role || 'visitor';
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterDiff, setFilterDiff] = useState<string | null>(null);
    const [filterTag, setFilterTag] = useState<string | null>(tagParam); // Initialize from URL
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (tagParam) {
            setFilterTag(tagParam);
        }
    }, [tagParam]);

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

    // Extract all unique tags
    const allTags = Array.from(new Set(notes.flatMap(n => n.tags || []))).sort();
    const commonTags = ['Arrays', 'Strings', 'Recursion', 'Bit Manipulation', 'Sorting', 'Searching', 'Stack/Queue', 'Graph/Tree', 'DP'];
    // Merge common tags first, then others
    const displayTags = [...commonTags, ...allTags.filter(t => !commonTags.includes(t) && !['Easy', 'Medium', 'Hard', 'Variations'].includes(t))];

    // Filter & Sort Logic
    const filteredNotes = notes.filter(note => {
        // Check difficulty field (not tags anymore)
        const noteDifficulty = note.difficulty || note.tags?.find(t => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Medium';
        const matchesDiff = filterDiff ? noteDifficulty === filterDiff : true;
        const matchesTag = filterTag ? note.tags?.includes(filterTag) : true;
        const matchesSearch = searchQuery
            ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        return matchesDiff && matchesTag && matchesSearch;
    }).sort((a: any, b: any) => {
        // Sort by Date - Newest First
        // Handle both Date objects and ISO strings
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Algorithm Curriculum</h1>
                    <p className={styles.subtitle}>Your structured path to mastery.</p>
                </div>
                <Link href="/notes/create" className={styles.createBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {role === 'admin' ? 'New Problem' : 'Suggest Problem'}
                </Link>
            </header>

            {/* Search & Filter Bar */}
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search problems..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className={styles.filterGroup}>
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
            </div>

            {/* Tag Cloud */}
            <div className={styles.tagCloud}>
                {displayTags.map(tag => (
                    <button
                        key={tag}
                        className={`${styles.tagChip} ${filterTag === tag ? styles.activeTag : ''}`}
                        onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}><span className="spinner"></span></div>
            ) : (
                <div className={styles.syllabusList}>
                    {filteredNotes.length > 0 ? (
                        <div className={styles.notesGrid}>
                            {filteredNotes.map(note => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666', marginTop: '4rem' }}>
                            <p>No notes found matching your filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function NotesPage() {
    return (
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}><span className="spinner"></span></div>}>
            <NotesPageContent />
        </Suspense>
    );
}
