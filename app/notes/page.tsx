import Link from 'next/link'
import styles from './page.module.css'
import NoteCard from '@/components/NoteCard'
import { notes } from '@/data/notes'

export default function NotesPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Dashboard</Link>
                <h1 className={styles.title}>Your Notes</h1>
                <p className={styles.subtitle}>Select a problem to view details and solutions.</p>
            </header>

            <div className={styles.grid}>
                {notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                ))}
            </div>
        </div>
    )
}
