'use client';

import React from 'react';
import styles from './RichTextToolbar.module.css';

interface ToolbarProps {
    onInsert: (text: string, cursorOffset?: number) => void;
}

export default function RichTextToolbar({ onInsert }: ToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <button className={styles.btn} onClick={() => onInsert('**bold**', 2)} title="Bold"><b>B</b></button>
            <button className={styles.btn} onClick={() => onInsert('_italic_', 1)} title="Italic"><i>I</i></button>
            <span className={styles.separator}>|</span>
            <button className={styles.btn} onClick={() => onInsert('# ', 0)} title="Heading 1">H1</button>
            <button className={styles.btn} onClick={() => onInsert('## ', 0)} title="Heading 2">H2</button>
            <button className={styles.btn} onClick={() => onInsert('### ', 0)} title="Heading 3">H3</button>
            <span className={styles.separator}>|</span>
            <button className={styles.btn} onClick={() => onInsert('- ', 0)} title="Bullet List">• List</button>
            <button className={styles.btn} onClick={() => onInsert('1. ', 0)} title="Numbered List">1. List</button>
            <span className={styles.separator}>|</span>
            <button className={styles.btn} onClick={() => onInsert('`code`', 1)} title="Inline Code">{'< >'}</button>
            <button className={styles.btn} onClick={() => onInsert('\n```\ncode block\n```\n', 5)} title="Code Block">{'```'}</button>
            <button className={styles.btn} onClick={() => onInsert('> ', 0)} title="Quote">""</button>
            <span className={styles.separator}>|</span>
            <button className={styles.btn} onClick={() => onInsert('==text==', 2)} title="Highlight">A</button>
            <button className={styles.btn} onClick={() => onInsert('[Link Text](url)', 11)} title="Link">🔗</button>
        </div>
    );
}
