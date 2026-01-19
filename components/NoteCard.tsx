'use client'

import Link from 'next/link'
import styles from './NoteCard.module.css'
import { Note } from '@/data/notes'
import { motion } from 'framer-motion'

export default function NoteCard({ note }: { note: Note }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/notes/${note.id}`} className={styles.card}>
                <h3 className={styles.title}>{note.title}</h3>
                <p className={styles.description}>{note.description}</p>
                <div className={styles.footer}>
                    <span>View Solutions &rarr;</span>
                </div>
            </Link>
        </motion.div>
    )
}
