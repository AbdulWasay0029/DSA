'use client'

import Link from 'next/link'
import styles from './page.module.css'
import { notes } from '@/data/notes'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const note = notes.find((n) => n.id === params.id)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    if (!note) {
        return (
            <div className={styles.container}>
                <h1>Note not found</h1>
                <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>
            </div>
        )
    }

    const copyToClipboard = (code: string, index: number) => {
        navigator.clipboard.writeText(code)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/notes" className={styles.backLink}>&larr; Back to Notes</Link>
            </motion.div>

            <header className={styles.header}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {note.title}
                </motion.h1>
                <motion.p
                    className={styles.description}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {note.fullDescription}
                </motion.p>
            </header>

            <div className={styles.solutions}>
                {note.solutions.map((solution, index) => (
                    <motion.div
                        key={index}
                        className={styles.solutionBlock}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.solutionHeader}>
                            <h3 className={styles.solutionTitle}>{solution.title}</h3>
                            <button
                                onClick={() => copyToClipboard(solution.code, index)}
                                className={styles.copyButton}
                            >
                                {copiedIndex === index ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className={styles.codeWindow}>
                            <div className={styles.codeBar}>
                                <div className={styles.dots}>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                </div>
                                <span className={styles.lang}>{solution.language}</span>
                            </div>
                            <SyntaxHighlighter
                                language={solution.language}
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    fontSize: '0.9rem',
                                    background: 'transparent',
                                }}
                            >
                                {solution.code}
                            </SyntaxHighlighter>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
