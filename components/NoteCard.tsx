'use client'

import Link from 'next/link'
import styles from './NoteCard.module.css'
import { Note } from '@/data/notes'
import { motion } from 'framer-motion'

export default function NoteCard({ note }: { note: Note }) {
    // Get complexity from first solution if available
    const complexity = note.solutions?.[0]?.complexity;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
        >
            <Link href={`/notes/${note.id}`} className={styles.card}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{note.title}</h3>
                    {complexity && (complexity.time || complexity.space) && (
                        <div className={styles.complexityBadge}>
                            {complexity.time || complexity.space}
                        </div>
                    )}
                </div>

                <p className={styles.description}>{note.description}</p>

                {note.tags && note.tags.length > 0 && (
                    <div className={styles.tags}>
                        {note.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}

                <div className={styles.footer}>
                    <span>View Solutions</span>
                    <span className={styles.arrow}>&rarr;</span>
                </div>
            </Link>
        </motion.div>
    )
}
