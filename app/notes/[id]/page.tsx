import Link from 'next/link'
import styles from './page.module.css'
import { notes } from '@/data/notes'

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const note = notes.find((n) => n.id === params.id)

    if (!note) {
        return (
            <div className={styles.container}>
                <h1>Note not found</h1>
                <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>

            <header className={styles.header}>
                <h1 className={styles.title}>{note.title}</h1>
                <p className={styles.description}>{note.fullDescription}</p>
            </header>

            <div className={styles.solutions}>
                {note.solutions.map((solution, index) => (
                    <div key={index} className={styles.solutionBlock}>
                        <h3 className={styles.solutionTitle}>{solution.title}</h3>
                        <div className={styles.codeWindow}>
                            <div className={styles.codeHeader}>
                                <span className={styles.dot}></span>
                                <span className={styles.dot}></span>
                                <span className={styles.dot}></span>
                                <span className={styles.lang}>{solution.language}</span>
                            </div>
                            <pre className={styles.codePre}>
                                <code>{solution.code}</code>
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function generateStaticParams() {
    return notes.map((note) => ({
        id: note.id,
    }))
}
