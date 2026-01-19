import Link from 'next/link'
import styles from './NoteCard.module.css'
import { Note } from '@/data/notes'

export default function NoteCard({ note }: { note: Note }) {
    return (
        <Link href={`/notes/${note.id}`} className={styles.card}>
            <h3 className={styles.title}>{note.title}</h3>
            <p className={styles.description}>{note.description}</p>
            <div className={styles.footer}>
                <span>View Solutions &rarr;</span>
            </div>
        </Link>
    )
}
