import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <p className={styles.text}>&copy; {new Date().getFullYear()} DSA Mastery. Built for excellence.</p>
                <div className={styles.socials}>
                    <a href="https://github.com/AbdulWasay0029" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
                    <a href="#" className={styles.socialLink}>LinkedIn</a>
                    <a href="#" className={styles.socialLink}>Twitter</a>
                </div>
            </div>
        </footer>
    )
}
