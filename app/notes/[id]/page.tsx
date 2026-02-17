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
    const [tagInput, setTagInput] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);

    // Common tags for autocomplete (NOT including difficulty levels)
    const commonTags = ['Arrays', 'Strings', 'Recursion', 'Bit Manipulation',
        'Sorting', 'Searching', 'Stack/Queue', 'Graph/Tree', 'DP', 'Backtracking',
        'Two Pointers', 'Sliding Window', 'Hashing', 'Math', 'Greedy', 'Matrix', 'Variations'];

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
                        // Use difficulty field if it exists, otherwise extract from tags
                        const diff = found.difficulty || found.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Medium';
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

    // Handle Delete
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

        try {
            const res = await fetch('/api/notes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: params.id })
            });

            if (res.ok) {
                // Redirect to notes list
                window.location.href = '/notes';
            } else {
                alert('Failed to delete note');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting note');
        }
    };

    // Handle Save
    const handleSave = async () => {
        if (!editData) return;

        console.log('Saving editData:', editData);

        const endpoint = role === 'admin' ? '/api/notes' : '/api/suggestions';
        const method = role === 'admin' ? 'PUT' : 'POST';
        const body = role === 'admin' ? editData : { ...editData, originalId: editData.id };

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log('Save response:', res.status, await res.text());

            if (role === 'admin') {
                setNote(editData);
                setIsEditing(false);
            } else {
                alert('Suggestion submitted for review!');
                setIsEditing(false);
            }
        } catch (e) {
            console.error('Save error:', e);
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
                                            style={{
                                                fontSize: '1rem',
                                                padding: '0.5rem',
                                                width: 'auto',
                                                color: '#fff',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}
                                            value={data.difficulty || 'Medium'}
                                            onChange={e => setEditData({ ...data, difficulty: e.target.value as any })}
                                        >
                                            <option value="Easy" style={{ background: '#1a1a1a', color: '#fff' }}>Easy</option>
                                            <option value="Medium" style={{ background: '#1a1a1a', color: '#fff' }}>Medium</option>
                                            <option value="Hard" style={{ background: '#1a1a1a', color: '#fff' }}>Hard</option>
                                        </select>
                                        <input
                                            type="date"
                                            className={styles.inputTitle}
                                            style={{ fontSize: '1rem', padding: '0.5rem', width: 'auto' }}
                                            value={data.date ? (typeof data.date === 'string' ? data.date.split('T')[0] : new Date(data.date).toISOString().split('T')[0]) : ''}
                                            onChange={e => setEditData({ ...data, date: e.target.value })}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span className={`${styles.difficultyBadge} ${styles[data.difficulty || 'Medium']}`}>
                                            {data.difficulty || 'Medium'}
                                        </span>
                                        {data.date && (
                                            <span style={{ color: '#888', fontSize: '0.9rem' }}>
                                                • {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
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

                                    {/* Description (Short Summary) */}
                                    <input
                                        className={styles.input}
                                        value={data.description || ''}
                                        onChange={e => setEditData({ ...data, description: e.target.value })}
                                        placeholder="Short summary (shown on card)..."
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                    />

                                    {/* Tag Selector with Chips */}
                                    <div style={{ marginTop: '0.5rem', width: '100%' }}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                            padding: '0.5rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            minHeight: '50px'
                                        }}>
                                            {data.tags?.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'var(--primary)',
                                                        color: '#fff',
                                                        padding: '0.3rem 0.6rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => {
                                                            const newTags = data.tags?.filter((_, i) => i !== idx) || [];
                                                            setEditData({ ...data, tags: newTags });
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            padding: 0,
                                                            fontSize: '1.1rem',
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="Add tags..."
                                                value={tagInput}
                                                onChange={e => setTagInput(e.target.value)}
                                                onFocus={() => setShowTagSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && tagInput.trim()) {
                                                        e.preventDefault();
                                                        const newTag = tagInput.trim();
                                                        if (!data.tags?.includes(newTag)) {
                                                            setEditData({ ...data, tags: [...(data.tags || []), newTag] });
                                                        }
                                                        setTagInput('');
                                                    }
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#fff',
                                                    outline: 'none',
                                                    flex: 1,
                                                    minWidth: '120px',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </div>

                                        {/* Tag Suggestions */}
                                        {showTagSuggestions && (
                                            <div style={{
                                                marginTop: '0.5rem',
                                                background: 'rgba(0,0,0,0.9)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '0.3rem',
                                                maxHeight: '150px',
                                                overflowY: 'auto'
                                            }}>
                                                {commonTags
                                                    .filter(tag => !data.tags?.includes(tag))
                                                    .filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()))
                                                    .map(tag => (
                                                        <button
                                                            key={tag}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                setEditData({ ...data, tags: [...(data.tags || []), tag] });
                                                                setTagInput('');
                                                            }}
                                                            style={{
                                                                background: 'rgba(255,255,255,0.1)',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                color: '#aaa',
                                                                padding: '0.3rem 0.6rem',
                                                                borderRadius: '15px',
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                                                e.currentTarget.style.color = '#fff';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                                e.currentTarget.style.color = '#aaa';
                                                            }}
                                                        >
                                                            + {tag}
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
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

                    {/* Examples */}
                    {(isEditing || (data.examples && data.examples.length > 0)) && (
                        <>
                            <div className={styles.sectionTitle}>📝 Examples</div>
                            {isEditing ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {data.examples?.map((ex, i) => (
                                        <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <strong style={{ color: '#aaa' }}>Example {i + 1}</strong>
                                                <button
                                                    onClick={() => {
                                                        const newExamples = data.examples?.filter((_, idx) => idx !== i) || [];
                                                        setEditData({ ...data, examples: newExamples });
                                                    }}
                                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <input
                                                className={styles.input}
                                                value={ex.input}
                                                onChange={e => {
                                                    const newExamples = [...(data.examples || [])];
                                                    newExamples[i] = { ...newExamples[i], input: e.target.value };
                                                    setEditData({ ...data, examples: newExamples });
                                                }}
                                                placeholder="Input"
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <input
                                                className={styles.input}
                                                value={ex.output || ''}
                                                onChange={e => {
                                                    const newExamples = [...(data.examples || [])];
                                                    newExamples[i] = { ...newExamples[i], output: e.target.value };
                                                    setEditData({ ...data, examples: newExamples });
                                                }}
                                                placeholder="Output"
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <textarea
                                                className={styles.inputArea}
                                                value={ex.explanation || ''}
                                                onChange={e => {
                                                    const newExamples = [...(data.examples || [])];
                                                    newExamples[i] = { ...newExamples[i], explanation: e.target.value };
                                                    setEditData({ ...data, examples: newExamples });
                                                }}
                                                placeholder="Explanation (optional)"
                                                rows={2}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setEditData({ ...data, examples: [...(data.examples || []), { input: '', output: '', explanation: '' }] })}
                                        style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        + Add Example
                                    </button>
                                </div>
                            ) : (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {data.examples?.map((ex, i) => (
                                        <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <strong style={{ color: '#4ade80' }}>Input:</strong>
                                                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem', color: '#fff' }}>{ex.input}</pre>
                                            </div>
                                            {ex.output && (
                                                <div style={{ marginBottom: '0.5rem' }}>
                                                    <strong style={{ color: '#60a5fa' }}>Output:</strong>
                                                    <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem', color: '#fff' }}>{ex.output}</pre>
                                                </div>
                                            )}
                                            {ex.explanation && (
                                                <div>
                                                    <strong style={{ color: '#fbbf24' }}>Explanation:</strong>
                                                    <p style={{ color: '#aaa', marginTop: '0.25rem' }}>{ex.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
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
                                        <>
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
                                            {/* Complexity Fields */}
                                            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                <input
                                                    className={styles.input}
                                                    value={sol.complexity?.time || ''}
                                                    onChange={e => {
                                                        const newSols = [...data.solutions];
                                                        newSols[i] = {
                                                            ...newSols[i],
                                                            complexity: { ...newSols[i].complexity, time: e.target.value }
                                                        };
                                                        setEditData({ ...data, solutions: newSols });
                                                    }}
                                                    placeholder="Time Complexity (e.g., O(n))"
                                                    style={{ flex: 1, margin: 0 }}
                                                />
                                                <input
                                                    className={styles.input}
                                                    value={sol.complexity?.space || ''}
                                                    onChange={e => {
                                                        const newSols = [...data.solutions];
                                                        newSols[i] = {
                                                            ...newSols[i],
                                                            complexity: { ...newSols[i].complexity, space: e.target.value }
                                                        };
                                                        setEditData({ ...data, solutions: newSols });
                                                    }}
                                                    placeholder="Space Complexity (e.g., O(1))"
                                                    style={{ flex: 1, margin: 0 }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <SyntaxHighlighter
                                                language={sol.language}
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.9rem' }}
                                            >
                                                {sol.code}
                                            </SyntaxHighlighter>
                                            {/* Show Complexity in View Mode */}
                                            {(sol.complexity?.time || sol.complexity?.space) && (
                                                <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                                                    {sol.complexity?.time && (
                                                        <div>
                                                            <strong style={{ color: '#4ade80' }}>Time:</strong> <span style={{ color: '#aaa' }}>{sol.complexity.time}</span>
                                                        </div>
                                                    )}
                                                    {sol.complexity?.space && (
                                                        <div>
                                                            <strong style={{ color: '#60a5fa' }}>Space:</strong> <span style={{ color: '#aaa' }}>{sol.complexity.space}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
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
                    {(data.tips && data.tips.length > 0) || isEditing ? (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.cardTitle}>Quick Tips</h3>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {data.tips?.map((tip, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                className={styles.input}
                                                value={tip}
                                                onChange={e => {
                                                    const newTips = [...(data.tips || [])];
                                                    newTips[i] = e.target.value;
                                                    setEditData({ ...data, tips: newTips });
                                                }}
                                                placeholder="Enter a tip..."
                                                style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newTips = data.tips?.filter((_, idx) => idx !== i) || [];
                                                    setEditData({ ...data, tips: newTips });
                                                }}
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setEditData({ ...data, tips: [...(data.tips || []), ''] })}
                                        style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.25rem' }}
                                    >
                                        + Add Tip
                                    </button>
                                </div>
                            ) : (
                                <ul className={styles.tipList}>
                                    {data.tips?.map((tip, i) => (
                                        <li key={i} className={styles.tipItem}>
                                            <svg className={styles.tipIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><path d="M9 21h6" /></svg>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : null}
                </motion.aside>
            </div>

            {/* Floating Edit Button */}
            <div className={styles.editControls}>
                {isEditing ? (
                    <>
                        <>
                            <button className={styles.fabBtn} style={{ background: '#ef4444' }} onClick={handleDelete} title="Delete Note">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                            <button className={styles.fabBtn} style={{ background: '#f59e0b' }} onClick={() => setIsEditing(false)} title="Cancel Edit">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                            <button className={styles.fabBtn} style={{ background: '#22c55e' }} onClick={handleSave} title="Save Changes">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            </button>
                        </>
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
