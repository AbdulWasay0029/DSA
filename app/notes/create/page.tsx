'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import RichTextToolbar from '@/components/RichTextToolbar';
import { Note } from '@/data/notes';

export default function CreateNotePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role || 'visitor';

    const [data, setData] = useState<Partial<Note>>({
        title: '',
        description: '',
        fullDescription: '',
        tags: [],
        tips: [],
        solutions: [{ title: 'Main Solution', language: 'python', code: '', complexity: { time: '', space: '' } }]
    });

    const [isSaving, setIsSaving] = useState(false);

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
            <Link href="/notes" className={styles.backLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Curriculum
            </Link>

            <div className={styles.header}>
                <h1 className={styles.pageTitle}>
                    {role === 'admin' ? '✨ Create New Problem' : '💡 Suggest New Problem'}
                </h1>

                <input
                    className={`${styles.input} ${styles.titleInput}`}
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                    placeholder="Problem Title..."
                />

                <input
                    className={styles.input}
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
            </div>

            <div className={styles.grid}>
                {/* Tips */}
                <div className={styles.card}>
                    <h3>💡 Tips & Tricks</h3>
                    <div className={styles.tipsList}>
                        {data.tips?.map((tip, i) => (
                            <div key={i} className={styles.tipItem}>
                                <input
                                    className={styles.input}
                                    style={{ marginBottom: 0 }}
                                    value={tip}
                                    onChange={e => {
                                        const newTips = [...(data.tips || [])];
                                        newTips[i] = e.target.value;
                                        setData({ ...data, tips: newTips });
                                    }}
                                    placeholder="Enter a tip..."
                                />
                                <button className={styles.deleteBtn} onClick={() => {
                                    const newTips = [...(data.tips || [])];
                                    newTips.splice(i, 1);
                                    setData({ ...data, tips: newTips });
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button className={styles.addBtn} onClick={() => setData({ ...data, tips: [...(data.tips || []), ''] })}>
                        + Add Tip
                    </button>
                </div>

                {/* Tags */}
                <div className={styles.card}>
                    <h3>🏷️ Tags</h3>
                    <input
                        className={styles.input}
                        value={data.tags?.join(', ')}
                        onChange={e => setData({ ...data, tags: e.target.value.split(',').map(s => s.trim()) })}
                        placeholder="Arrays, Easy, DP..."
                    />
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                        Separate tags with commas. Include topic and difficulty.
                    </p>
                </div>
            </div>

            {/* Solutions */}
            <div>
                {data.solutions?.map((solution, index) => (
                    <div key={index} className={styles.solutionBlock}>
                        <div className={styles.solutionHeader}>
                            <input
                                className={`${styles.input} ${styles.solutionTitle}`}
                                style={{ marginBottom: 0 }}
                                value={solution.title}
                                onChange={e => updateSolution(index, 'title', e.target.value)}
                                placeholder="Solution name..."
                            />
                            <select
                                className={styles.select}
                                value={solution.language}
                                onChange={e => updateSolution(index, 'language', e.target.value)}
                            >
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                            </select>
                            {data.solutions && data.solutions.length > 1 && (
                                <button className={styles.deleteBtn} onClick={() => {
                                    const newSols = [...(data.solutions || [])];
                                    newSols.splice(index, 1);
                                    setData({ ...data, solutions: newSols });
                                }}>Remove Solution</button>
                            )}
                        </div>

                        {/* Complexity */}
                        <div className={styles.complexityGrid}>
                            <div className={styles.complexityInput}>
                                <label>Time Complexity</label>
                                <input
                                    className={styles.input}
                                    style={{ marginBottom: 0 }}
                                    value={solution.complexity?.time || ''}
                                    onChange={e => updateSolution(index, 'complexity.time', e.target.value)}
                                    placeholder="e.g. O(N)"
                                />
                            </div>
                            <div className={styles.complexityInput}>
                                <label>Space Complexity</label>
                                <input
                                    className={styles.input}
                                    style={{ marginBottom: 0 }}
                                    value={solution.complexity?.space || ''}
                                    onChange={e => updateSolution(index, 'complexity.space', e.target.value)}
                                    placeholder="e.g. O(1)"
                                />
                            </div>
                        </div>

                        <textarea
                            className={`${styles.textarea} ${styles.codeEditor}`}
                            value={solution.code}
                            onChange={e => updateSolution(index, 'code', e.target.value)}
                            spellCheck={false}
                            placeholder="Paste your solution code here..."
                        />
                    </div>
                ))}

                <button
                    className={styles.addBtn}
                    onClick={() => setData({
                        ...data,
                        solutions: [...(data.solutions || []), { title: 'Alternative Solution', language: 'python', code: '', complexity: {} }]
                    })}
                >
                    + Add Another Solution
                </button>
            </div>

            <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : (role === 'admin' ? '✓ Publish Problem' : '📤 Submit Suggestion')}
            </button>
        </div>
    );
}
