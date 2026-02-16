import React from 'react';

interface Props {
    content: string;
}

export default function SimpleMarkdown({ content }: Props) {
    if (!content) return null;

    // Split by newlines to handle blocks
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#ccc' }}>{[...listItems]}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        // Handle Code Blocks
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End block
                inCodeBlock = false;
                elements.push(
                    <div key={`code-${index}`} style={{ background: '#111', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', marginBottom: '1rem', whiteSpace: 'pre-wrap', color: '#eee' }}>
                        {codeBlockContent.join('\n')}
                    </div>
                );
                codeBlockContent = [];
            } else {
                flushList();
                inCodeBlock = true;
            }
            return;
        }
        if (inCodeBlock) {
            codeBlockContent.push(line);
            return;
        }

        // Handle Headers
        if (line.startsWith('# ')) {
            flushList();
            elements.push(<h2 key={index} style={{ fontSize: '1.8rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#fff' }}>{parseInline(line.slice(2))}</h2>);
            return;
        }
        if (line.startsWith('## ')) {
            flushList();
            elements.push(<h3 key={index} style={{ fontSize: '1.4rem', marginTop: '1.2rem', marginBottom: '0.6rem', color: '#eee' }}>{parseInline(line.slice(3))}</h3>);
            return;
        }
        if (line.startsWith('### ')) {
            flushList();
            elements.push(<h4 key={index} style={{ fontSize: '1.2rem', marginTop: '1rem', marginBottom: '0.5rem', color: '#ddd' }}>{parseInline(line.slice(4))}</h4>);
            return;
        }

        // Handle Blockquote
        if (line.startsWith('> ')) {
            flushList();
            elements.push(<blockquote key={index} style={{ borderLeft: '4px solid #555', paddingLeft: '1rem', margin: '1rem 0', color: '#aaa' }}>{parseInline(line.slice(2))}</blockquote>);
            return;
        }

        // Handle Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            listItems.push(<li key={`li-${index}-${listItems.length}`}>{parseInline(line.trim().slice(2))}</li>);
            return;
        }
        // If not a list item but we have pending list items, flush them
        flushList();

        if (line.trim() === '') {
            return; // Skip empty lines
        }

        // Standard Paragraph
        elements.push(<p key={index} style={{ marginBottom: '0.8rem', color: '#ccc', lineHeight: '1.6' }}>{parseInline(line)}</p>);
    });

    flushList(); // Final flush

    return <div className="markdown-body">{elements}</div>;
}

// Simple inline parser for bold, italic, code, link
function parseInline(text: string): React.ReactNode {
    // We'll use a simple regex split approach.
    // Note: This is naive and doesn't handle nested tags perfectly, but sufficient for basic usage.

    // Regex for Bold (**...**), Italic (_..._), Code (`...`), Link ([...](...)), Highlight (==...==)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\)|_.*?_|==.*?==)/g);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} style={{ color: '#fff' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={i} style={{ color: '#ddd' }}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} style={{ background: '#222', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', color: '#fba' }}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return <a key={i} href={match[2]} style={{ color: '#58a6ff', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{match[1]}</a>;
            }
        }
        if (part.startsWith('==') && part.endsWith('==')) {
            return <mark key={i} style={{ background: '#bad80a', color: '#000', padding: '0 0.2rem', borderRadius: '2px' }}>{part.slice(2, -2)}</mark>;
        }
        return part;
    });
}
