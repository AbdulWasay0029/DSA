'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import { LinkItem } from '@/lib/storage'
import { useSession } from 'next-auth/react'

export default function LinksPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';

    const [links, setLinks] = useState<LinkItem[]>([]);
    const [isEditing, setIsEditing] = useState(false); // Toggle Edit Mode
    const [isLoading, setIsLoading] = useState(true);

    // Editing State
    const [formData, setFormData] = useState<Partial<LinkItem>>({ category: 'General' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchLinks = async () => {
        const res = await fetch('/api/links');
        if (res.ok) setLinks(await res.json());
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const categories = Array.from(new Set(links.map(l => l.category))).sort().reverse();
    // Basic formatting for sorting dates might be needed if format is DD/MM/YYYY

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this link?')) return;
        await fetch('/api/links', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchLinks();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const payload = editingId ? { ...formData, id: editingId } : formData;

        await fetch('/api/links', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setEditingId(null);
        setFormData({ category: 'General', title: '', url: '', platform: '' });
        fetchLinks();
    };

    const startEdit = (link: LinkItem) => {
        setEditingId(link.id);
        setFormData(link);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Dashboard</Link>
                <div className={styles.titleArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h1 className={styles.title}>Essential Resources</h1>
                        <p className={styles.subtitle}>Curated problems and tools for your mastery.</p>
                    </div>
                    {role === 'admin' && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={styles.backLink} // Reusing style
                            style={{ borderColor: isEditing ? 'var(--primary)' : 'rgba(255,255,255,0.1)', background: isEditing ? 'rgba(138, 63, 252, 0.1)' : 'transparent' }}
                        >
                            {isEditing ? 'Done Editing' : 'Manage Links'}
                        </button>
                    )}
                </div>
            </header>

            {/* Admin Editor Form */}
            {isEditing && (
                <form onSubmit={handleSave} className={styles.categorySection} style={{ background: '#111', border: '1px solid #333', padding: '1.5rem' }}>
                    <h3 style={{ color: '#fff', marginTop: 0 }}>{editingId ? 'Edit Link' : 'Add New Link'}</h3>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <input
                            placeholder="Title"
                            className={styles.linkCard} // reusing styles for input
                            style={{ background: '#222', border: '1px solid #444', color: '#fff', cursor: 'text', minHeight: 'auto', padding: '0.8rem' }}
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="URL"
                            className={styles.linkCard}
                            style={{ background: '#222', border: '1px solid #444', color: '#fff', cursor: 'text', minHeight: 'auto', padding: '0.8rem' }}
                            value={formData.url || ''}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Category (e.g. 15/08/2025)"
                            className={styles.linkCard}
                            style={{ background: '#222', border: '1px solid #444', color: '#fff', cursor: 'text', minHeight: 'auto', padding: '0.8rem' }}
                            value={formData.category || ''}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            placeholder="Platform (e.g. LeetCode)"
                            className={styles.linkCard}
                            style={{ background: '#222', border: '1px solid #444', color: '#fff', cursor: 'text', minHeight: 'auto', padding: '0.8rem' }}
                            value={formData.platform || ''}
                            onChange={e => setFormData({ ...formData, platform: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: 'var(--primary)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                            {editingId ? 'Update' : 'Add Link'}
                        </button>
                        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ category: 'General' }); }} style={{ padding: '0.5rem', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                </form>
            )}

            <div className={styles.content}>
                {isLoading ? <p style={{ textAlign: 'center', color: '#888' }}>Loading resources...</p> : categories.map(category => (
                    <div key={category} className={styles.categorySection}>
                        <h2 className={styles.categoryTitle}>{category}</h2>
                        <div className={styles.linkList}>
                            {links.filter(l => l.category === category).map(link => (
                                <div key={link.id} style={{ position: 'relative' }}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.linkCard}
                                        style={role === 'admin' && isEditing ? { pointerEvents: 'none', opacity: 0.7 } : {}}
                                    >
                                        <div className={styles.linkInfo}>
                                            <span className={styles.linkTitle}>{link.title}</span>
                                            <span className={`${styles.badge} ${styles[link.platform?.toLowerCase() || '']}`}>
                                                {link.platform || 'Link'}
                                            </span>
                                        </div>
                                        <span className={styles.arrow}>↗</span>
                                    </a>

                                    {isEditing && (
                                        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => startEdit(link)}
                                                style={{ background: '#2196f3', border: 'none', borderRadius: '4px', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(link.id)}
                                                style={{ background: '#f44336', border: 'none', borderRadius: '4px', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
