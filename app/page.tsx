import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>DSA Dashboard</h1>
            <div className={styles.grid}>
                <Link href="/notes" className={styles.card}>
                    <h2>Notes &rarr;</h2>
                    <p>View your handwritten notes and problem solutions.</p>
                </Link>
                <Link href="/links" className={styles.card}>
                    <h2>Links &rarr;</h2>
                    <p>Explore the list of problems and resources.</p>
                </Link>
            </div>
        </main>
    )
}
