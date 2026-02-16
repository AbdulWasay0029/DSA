'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NoteEditor.module.css';
import { Note } from '@/data/notes';

interface NoteEditorProps {
    initialData?: Partial<Note>;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    role: 'admin' | 'visitor';
}

export default function NoteEditor({ initialData, isOpen, onClose, onSave, role }: NoteEditorProps) {
    const [formData, setFormData] = useState<Partial<Note>>({
        title: '',
        description: '',
        fullDescription: '',
        tags: [],
        complexity: { time: '', space: '', analysis: '' },
        examples: [],
        solutions: [],
        tips: []
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset
            setFormData({
                title: '',
                description: '',
                fullDescription: '',
                tags: [],
                complexity: { time: '', space: '', analysis: '' },
                examples: [],
                solutions: [],
                tips: []
            });
        }
    }, [initialData, isOpen]);

    // Handlers for form updates
    const updateField = (field: keyof Note, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateComplexity = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            complexity: { ...prev.complexity, [field]: value }
        }));
    };

    const addExample = () => {
        setFormData(prev => ({
            ...prev,
            examples: [...(prev.examples || []), { input: '', output: '', explanation: '' }]
        }));
    };

    const updateExample = (index: number, field: string, value: string) => {
        const newExamples = [...(formData.examples || [])];
        newExamples[index] = { ...newExamples[index], [field]: value };
        updateField('examples', newExamples);
    };

    const removeExample = (index: number) => {
        const newExamples = [...(formData.examples || [])];
        newExamples.splice(index, 1);
        updateField('examples', newExamples);
    };

    const addSolution = () => {
        setFormData(prev => ({
            ...prev,
            solutions: [...(prev.solutions || []), { title: '', language: 'python', code: '' }]
        }));
    };

    const updateSolution = (index: number, field: string, value: string) => {
        const newSolutions = [...(formData.solutions || [])];
        newSolutions[index] = { ...newSolutions[index], [field]: value };
        updateField('solutions', newSolutions);
    };

    const removeSolution = (index: number) => {
        const newSolutions = [...(formData.solutions || [])];
        newSolutions.splice(index, 1);
        updateField('solutions', newSolutions);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to save');
        }
        setIsSaving(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                >
                    <div className={styles.header}>
                        <h2>{initialData?.id ? 'Edit Note' : 'Create New Note'}</h2>
                        <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={formData.title}
                                onChange={e => updateField('title', e.target.value)}
                                placeholder="e.g. Valid Triangle"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Short Description</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                placeholder="Brief summary displayed on the card"
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Description (Markdown Supported)</label>
                            <div className={styles.toolbar}>
                                <button className={styles.toolBtn} title="Bold" onClick={() => updateField('fullDescription', formData.fullDescription + '**bold**')}><b>B</b></button>
                                <button className={styles.toolBtn} title="Italic" onClick={() => updateField('fullDescription', formData.fullDescription + '_italic_')}><i>I</i></button>
                                <button className={styles.toolBtn} title="Code Block" onClick={() => updateField('fullDescription', formData.fullDescription + '\n```\ncode\n```\n')}>{'</>'}</button>
                            </div>
                            <textarea
                                className={styles.textarea}
                                value={formData.fullDescription}
                                onChange={e => updateField('fullDescription', e.target.value)}
                                placeholder="Detailed explanation..."
                                style={{ minHeight: '200px' }}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={`${styles.formGroup} ${styles.col}`}>
                                <label className={styles.label}>Tags (comma separated)</label>
                                <input
                                    className={styles.input}
                                    value={formData.tags?.join(', ')}
                                    onChange={e => updateField('tags', e.target.value.split(',').map(s => s.trim()))}
                                    placeholder="Arrays, Math, Logic"
                                />
                            </div>
                        </div>

                        <h3 className={styles.sectionTitle}>Complexity</h3>
                        <div className={styles.row}>
                            <div className={`${styles.formGroup} ${styles.col}`}>
                                <label className={styles.label}>Time</label>
                                <input
                                    className={styles.input}
                                    value={formData.complexity?.time}
                                    onChange={e => updateComplexity('time', e.target.value)}
                                    placeholder="O(N)"
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.col}`}>
                                <label className={styles.label}>Space</label>
                                <input
                                    className={styles.input}
                                    value={formData.complexity?.space}
                                    onChange={e => updateComplexity('space', e.target.value)}
                                    placeholder="O(1)"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Analysis</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.complexity?.analysis}
                                onChange={e => updateComplexity('analysis', e.target.value)}
                                style={{ minHeight: '60px' }}
                            />
                        </div>

                        <div className={styles.sectionTitle}>
                            <span>Examples</span>
                            <button onClick={addExample} className={styles.addItemBtn}>+ Add Example</button>
                        </div>
                        {formData.examples?.map((ex, i) => (
                            <div key={i} className={styles.card}>
                                <button onClick={() => removeExample(i)} className={styles.removeBtn}>Remove</button>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Input</label>
                                    <input className={styles.input} value={ex.input} onChange={e => updateExample(i, 'input', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Output</label>
                                    <input className={styles.input} value={ex.output} onChange={e => updateExample(i, 'output', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Explanation</label>
                                    <input className={styles.input} value={ex.explanation} onChange={e => updateExample(i, 'explanation', e.target.value)} />
                                </div>
                            </div>
                        ))}

                        <div className={styles.sectionTitle}>
                            <span>Solutions</span>
                            <button onClick={addSolution} className={styles.addItemBtn}>+ Add Solution</button>
                        </div>
                        {formData.solutions?.map((sol, i) => (
                            <div key={i} className={styles.card}>
                                <button onClick={() => removeSolution(i)} className={styles.removeBtn}>Remove</button>
                                <div className={styles.row}>
                                    <div className={`${styles.formGroup} ${styles.col}`}>
                                        <label className={styles.label}>Title</label>
                                        <input className={styles.input} value={sol.title} onChange={e => updateSolution(i, 'title', e.target.value)} />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.col}`}>
                                        <label className={styles.label}>Language</label>
                                        <select className={styles.select} value={sol.language} onChange={e => updateSolution(i, 'language', e.target.value)}>
                                            <option value="python">Python</option>
                                            <option value="javascript">JavaScript</option>
                                            <option value="cpp">C++</option>
                                            <option value="java">Java</option>
                                            <option value="c">C</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Code</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={sol.code}
                                        onChange={e => updateSolution(i, 'code', e.target.value)}
                                        style={{ fontFamily: 'monospace', minHeight: '150px', background: '#0d0d0d' }}
                                    />
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className={styles.footer}>
                        <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className={styles.saveBtn}>
                            {isSaving ? 'Saving...' : (role === 'admin' ? 'Publish Changes' : 'Submit for Review')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
