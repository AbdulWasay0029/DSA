'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './page.module.css';
import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { Note } from '@/data/notes';
import { Suggestion } from '@/lib/storage'; // Interface only

export default function NotesPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';

    const [notes, setNotes] = useState<Note[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Partial<Note> | undefined>(undefined);
    const [editorContext, setEditorContext] = useState<'create' | 'edit' | 'review'>('create');
    const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);

    // Initial Fetch
    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const notesRes = await fetch('/api/notes');
            if (notesRes.ok) {
                setNotes(await notesRes.json());
            } else {
                const err = await notesRes.json();
                setError(err.error || 'Failed to fetch notes');
            }

            if (role === 'admin') {
                const suggRes = await fetch('/api/suggestions');
                if (suggRes.ok) setSuggestions(await suggRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session !== undefined) {
            fetchData();
        }
    }, [session, role]);

    const handleSeed = async () => {
        if (!confirm('This will populate the database with initial data. Continue?')) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/seed');
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                await fetchData();
            } else {
                alert('Seed failed: ' + data.error);
            }
        } catch (e) {
            alert('Seed failed: ' + e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingNote(undefined);
        setEditorContext('create');
        setIsEditorOpen(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setEditorContext('edit');
        setIsEditorOpen(true);
    };

    const handleReviewSuggestion = (suggestion: Suggestion) => {
        setEditingNote(suggestion);
        setActiveSuggestionId(suggestion.suggestionId || null);
        setEditorContext('review');
        setIsEditorOpen(true);
    };

    const onNoteSave = async (data: any) => {
        if (role === 'admin') {
            if (editorContext === 'review' && activeSuggestionId) {
                // Approve suggestion
                await fetch('/api/suggestions/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ suggestionId: activeSuggestionId, action: 'approve' })
                });
            } else if (editorContext === 'create') {
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // Edit
                await fetch('/api/notes', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
        } else {
            // Visitor: Submit Suggestion
            const payload = { ...data };
            if (editorContext === 'edit') payload.originalId = data.id;

            await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert('Suggestion submitted for review!');
        }

        await fetchData();
    };

    const handleRejectSuggestion = async (suggestionId: string) => {
        if (!confirm('Reject this suggestion?')) return;
        await fetch('/api/suggestions/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ suggestionId, action: 'reject' })
        });
        await fetchData();
    };

    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get all unique tags
    const allTags = Array.from(new Set(notes.flatMap(n => n.tags || []))).sort();

    const filteredNotes = selectedTag
        ? notes.filter(n => n.tags?.includes(selectedTag))
        : notes;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    {session?.user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '0.5rem' }}>
                                {session.user.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary)' }}
                                    />
                                )}
                                <h1 style={{ margin: 0, fontSize: '2rem' }}>
                                    {session.user.name?.split(' ')[0]}'s Workspace
                                </h1>
                            </div>
                            <p>Here is your personalized collection of notes and solutions.</p>
                        </>
                    ) : (
                        <>
                            <h1>Public Knowledge Base</h1>
                            <p>Browse community notes and solutions. Sign in to contribute.</p>
                        </>
                    )}
                </div>

                <div className={styles.controls}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/" className={styles.secondaryBtn}>Back</Link>
                        <Link href="/notes/create" className={styles.actionBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
                            + {role === 'admin' ? 'Create Note' : 'Suggest New'}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Tags Filter Bar */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <button
                    onClick={() => setSelectedTag(null)}
                    style={{
                        background: selectedTag === null ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All Notes
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                            background: selectedTag === tag ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            color: '#ccc',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Admin: Suggestions Review Section */}
            {role === 'admin' && suggestions.length > 0 && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewHeader}>
                        <h2>Pending Reviews ({suggestions.length})</h2>
                    </div>
                    <div className={styles.suggestionList}>
                        {suggestions.map((s, i) => (
                            <div key={i} className={styles.suggestionCard}>
                                <div className={styles.suggestionInfo}>
                                    <h4>{s.title}</h4>
                                    <p>Submitted: {new Date(s.submittedAt).toLocaleDateString()}</p>
                                    <p style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>Type: {s.originalId ? 'Edit' : 'New'}</p>
                                </div>
                                <div className={styles.suggestionActions}>
                                    <Link href={`/admin/review/${s.suggestionId}`} className={styles.reviewBtn}>
                                        Review Content
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Load/Error/Empty States */}
            {isLoading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }}>↻</div>
                    <p>Loading your knowledge base...</p>
                </div>
            )}

            {error && (
                <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '1rem', borderRadius: '8px', color: '#ff6b6b', marginBottom: '2rem' }}>
                    <p>Error: {error}</p>
                    <button onClick={fetchData} style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid currentColor', color: 'inherit', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Retry</button>
                </div>
            )}

            {!isLoading && !error && filteredNotes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed #444' }}>
                    <h2 style={{ marginBottom: '1rem' }}>No Notes Found</h2>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>
                        {selectedTag ? `No notes found with tag "${selectedTag}"` : "The database appears to be empty."}
                    </p>
                    {role === 'admin' && !selectedTag && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>As an admin, you can initialize the database with the default dataset.</p>
                            <button
                                onClick={handleSeed}
                                className={styles.actionBtn}
                                style={{ background: '#2196F3' }}
                            >
                                ⚡ Initialize Database (Seed Data)
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.grid}>
                {filteredNotes.map((note) => (
                    <div key={note.id} style={{ position: 'relative' }}>
                        <NoteCard note={note} />
                    </div>
                ))}
            </div>

            {/* NoteEditor Modal Removed - Usings Pages now */}
        </div>
    );
}
