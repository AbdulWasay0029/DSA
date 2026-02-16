import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
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
