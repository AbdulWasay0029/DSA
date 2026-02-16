'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Note | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Fetch Note
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch('/api/notes');
                if (res.ok) {
                    const allNotes = await res.json();
                    const found = allNotes.find((n: any) => n.id === params.id);
                    if (found) {
                        // Infer difficulty from tags if not present
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
                        <span className={`${styles.difficultyBadge} ${styles[data.difficulty || 'Medium']}`}>
                            {data.difficulty || 'Medium'}
                        </span>

                        {isEditing ? (
                            <input
                                className={styles.inputTitle}
                                value={data.title}
                                onChange={e => setEditData({ ...data, title: e.target.value })}
                            />
                        ) : (
                            <h1 className={styles.title}>{data.title}</h1>
                        )}

                        <div className={styles.metaRow}>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>20 min read</span>
                            </div>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                <span>1.2k views</span>
                            </div>
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
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '1.5rem 0 0.5rem' }}>
                                    {isEditing ? (
                                        <input
                                            value={sol.title}
                                            onChange={e => {
                                                const newSols = [...data.solutions];
                                                newSols[i].title = e.target.value;
                                                setEditData({ ...data, solutions: newSols });
                                            }}
                                            style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '0.2rem' }}
                                        />
                                    ) : sol.title}
                                </h3>

                                <div className={styles.codeWindow}>
                                    <div className={styles.codeBar}>
                                        <div className={styles.dots}>
                                            <span className={styles.dot}></span><span className={styles.dot}></span><span className={styles.dot}></span>
                                        </div>
                                        <span className={styles.lang}>{sol.language}</span>
                                        <button className={styles.copyButton} onClick={() => copyToClipboard(sol.code, i)}>
                                            {copiedIndex === i ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            className={styles.inputArea}
                                            style={{ minHeight: '300px', border: 'none', borderRadius: 0 }}
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
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>Topic Mastery</h3>
                        <div className={styles.progressStat}>
                            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Progress</span>
                            <span className={styles.progressValue}>65%</span>
                        </div>
                        <div className={styles.progressBarBG}>
                            <div className={styles.progressBarFill} style={{ width: '65%' }}></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                            You're doing great! Keep solving to reach mastery.
                        </p>
                    </div>

                    {/* Contributors Card */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>Contributors</h3>
                        <div className={styles.contributorList}>
                            <div className={styles.contributorAvatar} style={{ background: '#3b82f6' }}>AW</div>
                            <div className={styles.contributorAvatar} style={{ background: '#ef4444' }}>JD</div>
                            <div className={styles.contributorAvatar} style={{ background: '#10b981' }}>KS</div>
                            <div className={styles.contributorAvatar} style={{ background: '#333', border: '1px dashed #666' }}>+2</div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                            Top contributors for this topic.
                        </p>
                    </div>

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
