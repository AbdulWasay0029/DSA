'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../[id]/page.module.css';
import RichTextToolbar from '@/components/RichTextToolbar';
import { Note } from '@/data/notes';

// Reuse styles from detail page for consistency
// We are essentially recreating the "Edit Mode" of the detail page but starting blank

export default function CreateNotePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role || 'visitor';

    // Initial blank state
    const [data, setData] = useState<Partial<Note>>({
        title: '',
        description: '',
        fullDescription: '',
        tags: [],
        tips: [],
        solutions: [{ title: 'Main Solution', language: 'python', code: '', complexity: { time: '', space: '' } }]
    });

    const [isSaving, setIsSaving] = useState(false);

    // --- Handlers (copied & adapted from Detail Page) ---
    const handleInsertText = (text: string) => {
        setData(prev => ({ ...prev, fullDescription: (prev.fullDescription || '') + text }));
    };

    const updateSolution = (index: number, field: string, value: any) => {
        const newSolutions = [...(data.solutions || [])];
        if (field.startsWith('complexity.')) {
            const compField = field.split('.')[1];
            newSolutions[index] = {
                ...newSolutions[index],
                complexity: { ...newSolutions[index].complexity, [compField]: value }
            };
        } else {
            newSolutions[index] = { ...newSolutions[index], [field]: value };
        }
        setData({ ...data, solutions: newSolutions });
    };

    const handleSave = async () => {
        if (!data.title) return alert('Title is required');
        setIsSaving(true);

        try {
            if (role === 'admin') {
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                router.push('/notes');
            } else {
                await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                alert('Suggestion submitted for review!');
                router.push('/notes');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/notes" className={styles.backLink}>&larr; Cancel</Link>

            <header className={styles.header}>
                <h1 style={{ color: '#888', fontSize: '1rem', marginBottom: '1rem' }}>
                    {role === 'admin' ? 'Create New Note' : 'Suggest New Note'}
                </h1>

                <input
                    className={`${styles.input} ${styles.headerInput}`}
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                    placeholder="Note Title..."
                />

                <input
                    className={styles.input}
                    style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#ccc' }}
                    value={data.description}
                    onChange={e => setData({ ...data, description: e.target.value })}
                    placeholder="Short summary (shown on card)..."
                />

                <RichTextToolbar onInsert={handleInsertText} />

                <textarea
                    className={styles.textarea}
                    value={data.fullDescription}
                    onChange={e => setData({ ...data, fullDescription: e.target.value })}
                    placeholder="Full detailed explanation (Markdown supported)..."
                />
            </header>

            <div className={styles.grid}>
                {/* Tips */}
                <div className={styles.tipsSection}>
                    <h3>🚀 Tips & Tricks</h3>
                    {data.tips?.map((tip, i) => (
                        <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                            <input
                                className={styles.smallInput}
                                value={tip}
                                onChange={e => {
                                    const newTips = [...(data.tips || [])];
                                    newTips[i] = e.target.value;
                                    setData({ ...data, tips: newTips });
                                }}
                            />
                            <button className={styles.deleteBtn} onClick={() => {
                                const newTips = [...(data.tips || [])];
                                newTips.splice(i, 1);
                                setData({ ...data, tips: newTips });
                            }}>X</button>
                        </div>
                    ))}
                    <button className={styles.addBtn} onClick={() => setData({ ...data, tips: [...(data.tips || []), ''] })}>+ Add Tip</button>
                </div>

                {/* Tags */}
                <div className={styles.card}>
                    <h3>🏷️ Tags</h3>
                    <input
                        className={styles.input}
                        value={data.tags?.join(', ')}
                        onChange={e => setData({ ...data, tags: e.target.value.split(',').map(s => s.trim()) })}
                        placeholder="Arrays, DP, Graph..."
                    />
                </div>
            </div>

            <div className={styles.solutions}>
                {data.solutions?.map((solution, index) => (
                    <div key={index} className={styles.solutionBlock}>
                        <div className={styles.solutionHeader}>
                            <input
                                className={`${styles.input}`}
                                style={{ fontSize: '1.5rem', color: 'var(--primary)', width: 'auto' }}
                                value={solution.title}
                                onChange={e => updateSolution(index, 'title', e.target.value)}
                            />
                            <select
                                className={styles.smallInput}
                                style={{ width: 'auto', marginLeft: 'auto' }}
                                value={solution.language}
                                onChange={e => updateSolution(index, 'language', e.target.value)}
                            >
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                            </select>
                            <button className={styles.deleteBtn} onClick={() => {
                                const newSols = [...(data.solutions || [])];
                                newSols.splice(index, 1);
                                setData({ ...data, solutions: newSols });
                            }}>Remove</button>
                        </div>

                        {/* Complexity */}
                        <div className={`${styles.card} ${styles.complexity}`} style={{ marginBottom: '1rem' }}>
                            <div className={styles.complexityGrid} style={{ flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className={styles.stat} style={{ flex: 1 }}>
                                        <span>Time Complexity</span>
                                        <input
                                            className={styles.smallInput}
                                            value={solution.complexity?.time || ''}
                                            onChange={e => updateSolution(index, 'complexity.time', e.target.value)}
                                            placeholder="e.g. O(N)"
                                        />
                                    </div>
                                    <div className={styles.stat} style={{ flex: 1 }}>
                                        <span>Space Complexity</span>
                                        <input
                                            className={styles.smallInput}
                                            value={solution.complexity?.space || ''}
                                            onChange={e => updateSolution(index, 'complexity.space', e.target.value)}
                                            placeholder="e.g. O(1)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.codeWindow}>
                            <textarea
                                className={`${styles.textarea} ${styles.codeEditor}`}
                                value={solution.code}
                                onChange={e => updateSolution(index, 'code', e.target.value)}
                                spellCheck={false}
                                placeholder="Paste your solution code here..."
                            />
                        </div>
                    </div>
                ))}

                <button className={styles.addBtn} onClick={() => setData({ ...data, solutions: [...(data.solutions || []), { title: 'New Solution', language: 'python', code: '', complexity: {} }] })}>
                    + Add Solution
                </button>
            </div>

            <div className={styles.editControls}>
                <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : (role === 'admin' ? 'Publish Note' : 'Submit Suggestion')}
                </button>
            </div>
        </div>
    );
}
