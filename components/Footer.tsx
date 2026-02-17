import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.disclaimer}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p className={styles.disclaimerText}>
                        This platform contains study materials from <strong>SmartInterviews</strong> sessions.
                        For educational use by enrolled students only.
                    </p>
                </div>
                <p className={styles.text}>© {new Date().getFullYear()} AlgoStream. Crafted with passion for learning.</p>
                <div className={styles.socials}>
                    <a href="https://github.com/AbdulWasay0029" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
                    <a href="https://www.linkedin.com/in/abdulwasay0029/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
                    <a href="mailto:contact@algostream.dev" className={styles.socialLink}>Contact</a>
                </div>
            </div>
        </footer>
    )
}
