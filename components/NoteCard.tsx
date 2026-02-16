'use client';

import Link from 'next/link';
import styles from './NoteCard.module.css';
import { Note } from '@/data/notes';

export default function NoteCard({ note }: { note: Note }) {
    // Determine difficulty/status (Mock logic for now)
    const difficulty = note.tags?.find(t => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Medium';
    const isCompleted = false; // TODO: Hook up to user progress

    return (
        <Link href={`/notes/${note.id}`} className={styles.card}>
            {/* Status Checkbox Visual */}
            <div className={`${styles.statusIndicator} ${isCompleted ? styles.completed : ''}`}>
                {isCompleted && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{note.title}</h3>
                </div>

                <div className={styles.metaRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`${styles.difficultyDot} ${styles['diff' + difficulty]}`}></span>
                        <span>{difficulty}</span>
                    </div>
                    <span>•</span>
                    <span>{note.solutions?.length || 0} Solutions</span>
                </div>
            </div>

            <div className={styles.arrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
        </Link>
    );
}
