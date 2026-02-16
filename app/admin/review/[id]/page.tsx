'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../../../notes/[id]/page.module.css'; // Reusing detail styles
import { Suggestion } from '@/lib/storage';
import NoteDetailPage from '@/app/notes/[id]/page'; // HACK: We could reuse the component but logic differs. Let's rebuild for safety.
import SimpleMarkdown from '@/components/SimpleMarkdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ReviewPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role || 'visitor';

    // We fetch the suggestion by ID (which might be the `suggestionId`)
    // Currently API `/api/suggestions` returns ALL suggestions. We might need to filter client side or update API for fetch-one.
    // For simplicity, let's fetch all and find it.

    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [originalNote, setOriginalNote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'preview' | 'diff'>('preview');

    useEffect(() => {
        const fetchData = async () => {
            if (role !== 'admin') {
                router.push('/');
                return;
            }

            try {
                // 1. Fetch Suggestions
                const res = await fetch('/api/suggestions');
                const suggestions = await res.json();
                const found = suggestions.find((s: any) => s.suggestionId === params.id);
                setSuggestion(found || null);

                // 2. Fetch Original if it exists
                if (found && found.originalId) {
                    const notesRes = await fetch('/api/notes');
                    const notes = await notesRes.json();
                    const original = notes.find((n: any) => n.id === found.originalId);
                    setOriginalNote(original || null);
                    setMode('diff'); // Default to 'diff' mode if it's an edit
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, role]);

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this?`)) return;
        try {
            await fetch('/api/suggestions/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suggestionId: params.id, action })
            });
            router.push('/notes');
        } catch (e) {
            alert('Error: ' + e);
        }
    };

    if (loading) return <div className={styles.container}><div className="spinner"></div></div>;
    if (!suggestion) return <div className={styles.container}><h1>Suggestion not found</h1></div>;

    // --- Render Helpers ---

    return (
        <div className={styles.container}>
            <Link href="/notes" className={styles.backLink}>&larr; Back to Dashboard</Link>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Reviewing Suggestion</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                    <span>Submitted by: {(suggestion as any).submittedBy || 'Anonymous'}</span>
                    <span>Type: {suggestion.originalId ? 'Edit to Existing Note' : 'New Note Proposal'}</span>
                </div>
            </div>

            {originalNote && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setMode('diff')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            background: mode === 'diff' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Compare with Original
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            background: mode === 'preview' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Preview Proposed
                    </button>
                </div>
            )}

            {mode === 'diff' && originalNote ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* LEFT: ORIGINAL */}
                    <div style={{ opacity: 0.6 }}>
                        <h3 style={{ color: '#888', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>Original</h3>
                        <h1>{originalNote.title}</h1>
                        <SimpleMarkdown content={originalNote.fullDescription} />
                        {/* Simplified list for other fields */}
                        <h4>Solutions: {originalNote.solutions.length}</h4>
                    </div>

                    {/* RIGHT: PROPOSED */}
                    <div>
                        <h3 style={{ color: '#4ade80', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>Proposed</h3>
                        <h1 style={{ color: suggestion.title !== originalNote.title ? '#4ade80' : 'inherit' }}>{suggestion.title}</h1>
                        <div style={{ border: suggestion.fullDescription !== originalNote.fullDescription ? '1px solid #4ade80' : 'none', padding: '0.5rem', borderRadius: '8px' }}>
                            <SimpleMarkdown content={suggestion.fullDescription} />
                        </div>
                        <h4>Solutions: {suggestion.solutions.length}</h4>
                    </div>
                </div>
            ) : (
                /* PREVIEW MODE (Uses standard layout style) */
                <>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{suggestion.title}</h1>
                        <div className={styles.description}>
                            <SimpleMarkdown content={suggestion.fullDescription} />
                        </div>
                    </header>

                    <div className={styles.grid}>
                        {suggestion.tips && suggestion.tips.length > 0 && (
                            <div className={styles.tipsSection}>
                                <h3>🚀 Tips & Tricks</h3>
                                <ul>{suggestion.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}</ul>
                            </div>
                        )}

                        {/* Solutions */}
                        <div className={styles.solutions} style={{ gridColumn: '1/-1', marginTop: 0 }}>
                            {suggestion.solutions.map((sol: any, i: number) => (
                                <div key={i} className={styles.solutionBlock}>
                                    <div className={styles.solutionHeader}>
                                        <h3 className={styles.solutionTitle}>{sol.title}</h3>
                                        <span className={styles.lang}>{sol.language}</span>
                                    </div>
                                    <div className={styles.codeWindow}>
                                        <SyntaxHighlighter language={sol.language} style={vscDarkPlus} customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', background: 'transparent' }}>
                                            {sol.code}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className={styles.editControls} style={{ justifyContent: 'flex-end' }}>
                <button className={styles.cancelBtn} style={{ borderColor: '#f55', color: '#f55' }} onClick={() => handleAction('reject')}>Reject</button>
                <button className={styles.saveBtn} style={{ background: '#4ade80', color: '#000' }} onClick={() => handleAction('approve')}>Approve & Publish</button>
            </div>
        </div>
    );
}
