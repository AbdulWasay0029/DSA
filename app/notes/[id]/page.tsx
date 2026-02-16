'use client'

import Link from 'next/link'
import styles from './page.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState, useEffect, useRef } from 'react'
import RichTextToolbar from '@/components/RichTextToolbar'
import SimpleMarkdown from '@/components/SimpleMarkdown'
import { useSession } from 'next-auth/react'

// Fallback if imported types are not available
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
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';

    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Note | null>(null);

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch('/api/notes');
                if (res.ok) {
                    const allNotes = await res.json();
                    const found = allNotes.find((n: any) => n.id === params.id);
                    setNote(found || null);
                    setEditData(found || null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [params.id]);

    const handleSave = async () => {
        if (!editData) return;

        if (role === 'admin') {
            await fetch('/api/notes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            setNote(editData);
            setIsEditing(false);
        } else {
            await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editData, originalId: editData.id })
            });
            alert('Suggestion submitted!');
            setIsEditing(false);
        }
    };

    const handleInsertText = (text: string, cursorOffset = 0) => {
        if (!descriptionRef.current || !editData) return;
        const textarea = descriptionRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = editData.fullDescription || '';
        const newText = currentText.substring(0, start) + text + currentText.substring(end);

        setEditData({ ...editData, fullDescription: newText });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }, 0);
    };

    const updateSolution = (index: number, field: string, value: any) => {
        if (!editData) return;
        const newSolutions = [...editData.solutions];
        // Handle nested complexity
        if (field.startsWith('complexity.')) {
            const compField = field.split('.')[1];
            newSolutions[index] = {
                ...newSolutions[index],
                complexity: { ...newSolutions[index].complexity, [compField]: value }
            };
        } else {
            newSolutions[index] = { ...newSolutions[index], [field]: value };
        }
        setEditData({ ...editData, solutions: newSolutions });
    };

    const copyToClipboard = (code: string, index: number) => {
        navigator.clipboard.writeText(code)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    if (loading) return (
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '20vh' }}>
            <div className="spinner"></div>
        </div>
    );

    if (!note) {
        return (
            <div className={styles.container}>
                <h1>Note not found</h1>
                <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>
            </div>
        )
    }

    const data = isEditing ? editData! : note;

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>
            </motion.div>

            {/* Contribution Mode Banner */}
            <AnimatePresence>
                {isEditing && role !== 'admin' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={styles.contributionBanner}
                    >
                        <span>🤝 You are in <strong>Suggestion Mode</strong>. Your changes will be submitted for review.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Edit Controls */}
            <div className={styles.editControls}>
                {isEditing ? (
                    <>
                        <button className={styles.cancelBtn} onClick={() => { setIsEditing(false); setEditData(note); }}>Cancel</button>
                        <button className={styles.saveBtn} onClick={handleSave}>{role === 'admin' ? 'Save Changes' : 'Submit Suggestion'}</button>
                    </>
                ) : (
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                        {role === 'admin' ? '✎ Edit Page' : '💡 Suggest Improvement'}
                    </button>
                )}
            </div>

            <header className={styles.header}>
                {isEditing ? (
                    <input
                        className={`${styles.input} ${styles.headerInput}`}
                        value={data.title}
                        onChange={e => setEditData({ ...data, title: e.target.value })}
                    />
                ) : (
                    <motion.h1 className={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {data.title}
                    </motion.h1>
                )}

                {isEditing && <RichTextToolbar onInsert={handleInsertText} />}

                {isEditing ? (
                    <textarea
                        ref={descriptionRef}
                        className={styles.textarea}
                        value={data.fullDescription}
                        onChange={e => setEditData({ ...data, fullDescription: e.target.value })}
                    />
                ) : (
                    <motion.div className={styles.description} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <SimpleMarkdown content={data.fullDescription} />
                    </motion.div>
                )}
            </header>

            <div className={styles.grid}>
                {/* Tips Section */}
                {(data.tips?.length ?? 0) > 0 || isEditing ? (
                    <div className={styles.tipsSection}>
                        <h3>🚀 Tips & Tricks</h3>
                        {isEditing ? (
                            <div>
                                {data.tips?.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                        <input
                                            className={styles.smallInput}
                                            value={tip}
                                            onChange={e => {
                                                const newTips = [...(data.tips || [])];
                                                newTips[i] = e.target.value;
                                                setEditData({ ...data, tips: newTips });
                                            }}
                                        />
                                        <button className={styles.deleteBtn} onClick={() => {
                                            const newTips = [...(data.tips || [])];
                                            newTips.splice(i, 1);
                                            setEditData({ ...data, tips: newTips });
                                        }}>X</button>
                                    </div>
                                ))}
                                <button className={styles.addBtn} onClick={() => setEditData({ ...data, tips: [...(data.tips || []), ''] })}>+ Add Tip</button>
                            </div>
                        ) : (
                            <ul>{data.tips?.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                        )}
                    </div>
                ) : null}
            </div>

            <div className={styles.solutions}>
                {data.solutions.map((solution, index) => (
                    <motion.div key={index} className={styles.solutionBlock} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.solutionHeader}>
                            {isEditing ? (
                                <input
                                    className={`${styles.input}`}
                                    style={{ fontSize: '1.5rem', color: 'var(--primary)', width: 'auto' }}
                                    value={solution.title}
                                    onChange={e => updateSolution(index, 'title', e.target.value)}
                                />
                            ) : (
                                <h3 className={styles.solutionTitle}>{solution.title}</h3>
                            )}

                            {!isEditing && solution.isPseudo && <span className={styles.pseudoBadge}>Pseudo/Partial</span>}
                            {!isEditing && (
                                <button onClick={() => copyToClipboard(solution.code, index)} className={styles.copyButton}>
                                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {/* Complexity per Solution */}
                        <div className={`${styles.card} ${styles.complexity}`} style={{ marginBottom: '1rem' }}>
                            {isEditing ? (
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
                                    <textarea
                                        className={styles.smallInput}
                                        style={{ minHeight: '60px', width: '100%' }}
                                        value={solution.complexity?.analysis || ''}
                                        onChange={e => updateSolution(index, 'complexity.analysis', e.target.value)}
                                        placeholder="Analysis notes..."
                                    />
                                </div>
                            ) : (
                                <>
                                    {(solution.complexity?.time || solution.complexity?.space) && (
                                        <div className={styles.complexityGrid}>
                                            {solution.complexity.time && <div className={styles.stat}><span>Time</span><strong>{solution.complexity.time}</strong></div>}
                                            {solution.complexity.space && <div className={styles.stat}><span>Space</span><strong>{solution.complexity.space}</strong></div>}
                                        </div>
                                    )}
                                    {solution.complexity?.analysis && <p className={styles.analysis}>{solution.complexity.analysis}</p>}
                                </>
                            )}
                        </div>

                        <div className={styles.codeWindow}>
                            <div className={styles.codeBar}>
                                <div className={styles.dots}>
                                    <span className={styles.dot}></span><span className={styles.dot}></span><span className={styles.dot}></span>
                                </div>
                                {isEditing ? (
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
                                ) : (
                                    <span className={styles.lang}>{solution.language}</span>
                                )}
                            </div>
                            {isEditing ? (
                                <textarea
                                    className={`${styles.textarea} ${styles.codeEditor}`}
                                    value={solution.code}
                                    onChange={e => updateSolution(index, 'code', e.target.value)}
                                    spellCheck={false}
                                />
                            ) : (
                                <SyntaxHighlighter
                                    language={solution.language}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', background: 'transparent' }}
                                >
                                    {solution.code}
                                </SyntaxHighlighter>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isEditing && (
                    <button className={styles.addBtn} onClick={() => setEditData({ ...data, solutions: [...data.solutions, { title: 'New Solution', language: 'python', code: '', complexity: {} }] })}>
                        + Add Solution
                    </button>
                )}
            </div>
        </div>
    )
}
