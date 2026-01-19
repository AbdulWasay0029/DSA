import Link from 'next/link'
import styles from './page.module.css'
import { links } from '@/data/links'

export default function LinksPage() {
    const categories = Array.from(new Set(links.map(l => l.category)))

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Dashboard</Link>
                <h1 className={styles.title}>Problem Links</h1>
                <p className={styles.subtitle}>Curated list of problems to solve.</p>
            </header>

            <div className={styles.content}>
                {categories.map(category => (
                    <div key={category} className={styles.categorySection}>
                        <h2 className={styles.categoryTitle}>{category}</h2>
                        <div className={styles.linkList}>
                            {links.filter(l => l.category === category).map(link => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.linkCard}
                                >
                                    <div className={styles.linkInfo}>
                                        <span className={styles.linkTitle}>{link.title}</span>
                                        <span className={`${styles.badge} ${styles[link.difficulty?.toLowerCase() || 'easy']}`}>
                                            {link.difficulty}
                                        </span>
                                    </div>
                                    <span className={styles.arrow}>↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
