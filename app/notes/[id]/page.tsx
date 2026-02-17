'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import SimpleMarkdown from '@/components/SimpleMarkdown';

// --- Types ---
interface Note {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    tags?: string[];
    tips?: string[];
    examples?: { input: string; output?: string; explanation?: string }[];
    solutions: {
        title: string;
        language: string;
        code: string;
        isPseudo?: boolean;
        complexity?: { time?: string; space?: string; analysis?: string };
    }[];
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    category?: string;
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [note, setNote] = useState<Note | null>(null);
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Note | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completionLoading, setCompletionLoading] = useState(false);
    const [completedNotes, setCompletedNotes] = useState<string[]>([]);
    const [topicProgress, setTopicProgress] = useState({ completed: 0, total: 0 });

    // Fetch Note
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch('/api/notes');
                if (res.ok) {
                    const notes = await res.json();
                    setAllNotes(notes);
                    const found = notes.find((n: any) => n.id === params.id);
                    if (found) {
                        const diff = found.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Medium';
                        setNote({ ...found, difficulty: diff });
                        setEditData({ ...found, difficulty: diff });
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [params.id]);

    // Fetch completion status and calculate topic progress
    useEffect(() => {
        if (!session || !note || allNotes.length === 0) return;

        const fetchProgress = async () => {
            try {
                const res = await fetch('/api/progress');
                if (res.ok) {
                    const data = await res.json();
                    const completed = data.completed || [];
                    setCompletedNotes(completed);
                    setIsCompleted(completed.includes(params.id));

                    // Calculate topic-specific progress
                    // Find notes with same topic (excluding difficulty tags)
                    const currentTopics = note.tags?.filter(t => !['Easy', 'Medium', 'Hard'].includes(t)) || [];
                    if (currentTopics.length > 0) {
                        const topicNotes = allNotes.filter(n =>
                            n.tags?.some(tag => currentTopics.includes(tag))
                        );
                        const topicCompleted = topicNotes.filter(n => completed.includes(n.id)).length;
                        setTopicProgress({ completed: topicCompleted, total: topicNotes.length });
                    }
                }
            } catch (e) {
                console.error('Failed to fetch progress:', e);
            }
        };
        fetchProgress();
    }, [session, params.id, note, allNotes]);

    // Toggle completion
    const toggleCompletion = async () => {
        if (!session) return;

        setCompletionLoading(true);
        try {
            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId: params.id, completed: !isCompleted })
            });

            if (res.ok) {
                const newCompletedState = !isCompleted;
                setIsCompleted(newCompletedState);

                // Update topic progress in real-time
                const newCompletedNotes = newCompletedState
                    ? [...completedNotes, params.id]
                    : completedNotes.filter(id => id !== params.id);
                setCompletedNotes(newCompletedNotes);

                // Recalculate topic progress
                if (note) {
                    const currentTopics = note.tags?.filter(t => !['Easy', 'Medium', 'Hard'].includes(t)) || [];
                    if (currentTopics.length > 0) {
                        const topicNotes = allNotes.filter(n =>
                            n.tags?.some(tag => currentTopics.includes(tag))
                        );
                        const topicCompleted = topicNotes.filter(n => newCompletedNotes.includes(n.id)).length;
                        setTopicProgress({ completed: topicCompleted, total: topicNotes.length });
                    }
                }
            }
        } catch (e) {
            console.error('Failed to update progress:', e);
        } finally {
            setCompletionLoading(false);
        }
    };

    // Handle Save
    const handleSave = async () => {
        if (!editData) return;
        const endpoint = role === 'admin' ? '/api/notes' : '/api/suggestions';
        const method = role === 'admin' ? 'PUT' : 'POST';
        const body = role === 'admin' ? editData : { ...editData, originalId: editData.id };

        try {
            await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (role === 'admin') {
                setNote(editData);
                setIsEditing(false);
            } else {
                alert('Suggestion submitted for review!');
                setIsEditing(false);
            }
        } catch (e) {
            alert('Failed to save.');
        }
    };

    const copyToClipboard = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner"></span></div>;
    if (!note) return <div className={styles.container}><h1>Note not found</h1></div>;

    const data = isEditing ? editData! : note;

    return (
        <div className={styles.container}>
            <Link href="/notes" className={styles.backLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                Back to Curriculum
            </Link>

            <div className={styles.contentWrapper}>
                {/* --- MAIN CONTENT (Left) --- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <header className={styles.header}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <select
                                            className={styles.inputTitle}
                                            style={{ fontSize: '1rem', padding: '0.5rem', width: 'auto' }}
                                            value={data.difficulty || 'Medium'}
                                            onChange={e => setEditData({ ...data, difficulty: e.target.value as any })}
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                        <input
                                            className={styles.inputTitle}
                                            style={{ fontSize: '1rem', padding: '0.5rem', width: '150px' }}
                                            placeholder="DD/MM/YYYY"
                                            value={data.category || ''}
                                            onChange={e => setEditData({ ...data, category: e.target.value })}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span className={`${styles.difficultyBadge} ${styles[data.difficulty || 'Medium']}`}>
                                            {data.difficulty || 'Medium'}
                                        </span>
                                        {data.category && (
                                            <span style={{ color: '#888', fontSize: '0.9rem' }}>• {data.category}</span>
                                        )}
                                    </div>
                                )}

                                {session && !isEditing && (
                                    <button
                                        onClick={toggleCompletion}
                                        disabled={completionLoading}
                                        style={{
                                            background: isCompleted ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div style={{ width: '100%' }}>
                                    <input
                                        className={styles.inputTitle}
                                        value={data.title}
                                        onChange={e => setEditData({ ...data, title: e.target.value })}
                                        placeholder="Problem Title"
                                        style={{ width: '100%' }}
                                    />
                                    <input
                                        className={styles.inputTitle}
                                        style={{ fontSize: '0.9rem', marginTop: '0.5rem', width: '100%' }}
                                        placeholder="Tags (comma separated)"
                                        value={data.tags?.join(', ') || ''}
                                        onChange={e => setEditData({ ...data, tags: e.target.value.split(',').map(t => t.trim()) })}
                                    />
                                </div>
                            ) : (
                                <h1 className={styles.title}>{data.title}</h1>
                            )}
                        </div>
                    </header>

                    {/* Problem Statement */}
                    <div className={styles.sectionTitle}>Problem Statement</div>
                    {isEditing ? (
                        <textarea
                            className={styles.inputArea}
                            value={data.fullDescription}
                            onChange={e => setEditData({ ...data, fullDescription: e.target.value })}
                        />
                    ) : (
                        <div className={styles.description}>
                            <SimpleMarkdown content={data.fullDescription} />
                        </div>
                    )}

                    {/* Solutions */}
                    <div className={styles.sectionTitle}>Solutions & Analysis</div>
                    <div className={styles.solutions}>
                        {data.solutions.map((sol, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                            <input
                                                value={sol.title}
                                                onChange={e => {
                                                    const newSols = [...data.solutions];
                                                    newSols[i].title = e.target.value;
                                                    setEditData({ ...data, solutions: newSols });
                                                }}
                                                placeholder="Solution Title"
                                                style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: '4px', flex: 1 }}
                                            />
                                            <select
                                                value={sol.language}
                                                onChange={e => {
                                                    const newSols = [...data.solutions];
                                                    newSols[i].language = e.target.value;
                                                    setEditData({ ...data, solutions: newSols });
                                                }}
                                                style={{ background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                                            >
                                                <option value="cpp">C++</option>
                                                <option value="python">Python</option>
                                                <option value="javascript">JS</option>
                                                <option value="java">Java</option>
                                            </select>
                                            <button
                                                onClick={() => {
                                                    const newSols = data.solutions.filter((_, idx) => idx !== i);
                                                    setEditData({ ...data, solutions: newSols });
                                                }}
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    ) : (
                                        <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>{sol.title}</h3>
                                    )}
                                </div>

                                <div className={styles.codeWindow}>
                                    {!isEditing && (
                                        <div className={styles.codeBar}>
                                            <div className={styles.dots}>
                                                <span className={styles.dot}></span><span className={styles.dot}></span><span className={styles.dot}></span>
                                            </div>
                                            <span className={styles.lang}>{sol.language}</span>
                                            <button className={styles.copyButton} onClick={() => copyToClipboard(sol.code, i)}>
                                                {copiedIndex === i ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    )}
                                    {isEditing ? (
                                        <textarea
                                            className={styles.inputArea}
                                            style={{ minHeight: '300px', border: 'none', borderRadius: 0, fontFamily: 'monospace' }}
                                            value={sol.code}
                                            onChange={e => {
                                                const newSols = [...data.solutions];
                                                newSols[i].code = e.target.value;
                                                setEditData({ ...data, solutions: newSols });
                                            }}
                                        />
                                    ) : (
                                        <SyntaxHighlighter
                                            language={sol.language}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.9rem' }}
                                        >
                                            {sol.code}
                                        </SyntaxHighlighter>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => {
                                    setEditData({
                                        ...data,
                                        solutions: [...data.solutions, { title: 'New Solution', language: 'cpp', code: '// Write code here' }]
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa',
                                    marginTop: '1rem',
                                    cursor: 'pointer',
                                    borderRadius: '8px'
                                }}
                            >
                                + Add Solution
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* --- SIDEBAR (Right) --- */}
                <motion.aside
                    className={styles.sidebar}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Progress Card */}
                    {session && topicProgress.total > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.cardTitle}>Topic Mastery</h3>
                            <div className={styles.progressStat}>
                                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                    {topicProgress.completed} / {topicProgress.total} Completed
                                </span>
                                <span className={styles.progressValue}>
                                    {Math.round((topicProgress.completed / topicProgress.total) * 100)}%
                                </span>
                            </div>
                            <div className={styles.progressBarBG}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${(topicProgress.completed / topicProgress.total) * 100}%` }}
                                ></div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                                {topicProgress.completed === topicProgress.total
                                    ? '🎉 Topic mastered! Amazing work!'
                                    : 'Keep going! You\'re making great progress.'}
                            </p>
                        </div>
                    )}

                    {/* Tips Card */}
                    {data.tips && data.tips.length > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.cardTitle}>Quick Tips</h3>
                            <ul className={styles.tipList}>
                                {data.tips.map((tip, i) => (
                                    <li key={i} className={styles.tipItem}>
                                        <svg className={styles.tipIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><path d="M9 21h6" /></svg>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.aside>
            </div>

            {/* Floating Edit Button */}
            <div className={styles.editControls}>
                {isEditing ? (
                    <>
                        <button className={styles.fabBtn} style={{ background: '#ef4444' }} onClick={() => setIsEditing(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                        <button className={styles.fabBtn} style={{ background: '#22c55e' }} onClick={handleSave}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        </button>
                    </>
                ) : (
                    <button className={styles.fabBtn} onClick={() => setIsEditing(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
