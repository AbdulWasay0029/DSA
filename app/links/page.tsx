'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import { LinkItem } from '@/lib/storage';

export default function LinksPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';

    const [links, setLinks] = useState<LinkItem[]>([]);
    const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Editing State
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [formData, setFormData] = useState<Partial<LinkItem>>({ category: 'General', platform: 'Other' });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial Fetch
    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/links');
            if (res.ok) {
                const data = await res.json();
                setLinks(data);
                setFilteredLinks(data);
            }
        } catch (e) {
            console.error('Failed to fetch links', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    // Filter Logic
    useEffect(() => {
        const lowerQ = searchQuery.toLowerCase();
        const filtered = links.filter(link =>
            link.title.toLowerCase().includes(lowerQ) ||
            link.category.toLowerCase().includes(lowerQ) ||
            link.platform?.toLowerCase().includes(lowerQ)
        );
        setFilteredLinks(filtered);
    }, [searchQuery, links]);

    // Derived Categories
    const categories = Array.from(new Set(filteredLinks.map(l => l.category))).sort().reverse();

    // Helper: Determine platform style
    const getPlatformStyle = (platform?: string) => {
        const p = platform?.toLowerCase() || 'other';
        if (p.includes('leet')) return 'leetcode';
        if (p.includes('geeks')) return 'geeksforgeeks';
        if (p.includes('forces')) return 'codeforces';
        if (p.includes('youtu')) return 'video';
        if (p.includes('blog') || p.includes('article')) return 'article';
        return 'other';
    };

    const getPlatformIcon = (platform?: string) => {
        const p = platform?.toLowerCase() || 'other';
        if (p.includes('leet')) return 'LC';
        if (p.includes('geeks')) return 'GFG';
        if (p.includes('forces')) return 'CF';
        if (p.includes('youtu')) return '▶';
        return '🔗';
    };

    // --- Admin Handlers ---
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this resource?')) return;
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
        setFormData({ category: 'General', platform: 'Other', title: '', url: '' });
        fetchLinks();
    };

    const startEdit = (link: LinkItem) => {
        setEditingId(link.id);
        setFormData(link);
        setIsEditingMode(true);
        // Removed auto-scroll - let user stay where they are
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Resource Library
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    A curated collection of problems, articles, and videos to boost your learning.
                </motion.p>
            </header>

            {/* Search Bar */}
            <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                    className={styles.searchInput}
                    placeholder="Search resources, topics, platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Admin Controls */}
            {role === 'admin' && (
                <div className={styles.controls}>
                    <button
                        className={styles.addBtn}
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ category: '', platform: 'SmartInterviews', title: '', url: '' });
                            setIsEditingMode(true);
                        }}
                    >
                        + Add New Resource
                    </button>
                </div>
            )}

            {/* Admin Editor Panel */}
            <AnimatePresence>
                {isEditingMode && role === 'admin' && (
                    <motion.div
                        className={styles.editorArea}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
                            <button
                                onClick={() => {
                                    setIsEditingMode(false);
                                    setEditingId(null);
                                    setFormData({});
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className={styles.formGrid}>
                                <input className={styles.input} placeholder="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                <input className={styles.input} placeholder="URL" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} required />
                                <input className={styles.input} placeholder="Category (e.g. 13/01/2026)" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                <select className={styles.input} value={formData.platform || 'SmartInterviews'} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                                    <option value="SmartInterviews">SmartInterviews</option>
                                    <option value="LeetCode">LeetCode</option>
                                    <option value="InterviewBit">InterviewBit</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className={styles.actionBtn}>{editingId ? 'Update Resource' : 'Add Resource'}</button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingMode(false);
                                        setEditingId(null);
                                        setFormData({});
                                    }}
                                    style={{ background: 'transparent', color: '#888', border: '1px solid #444', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Grid */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}><span className="spinner"></span></div>
            ) : (
                <div>
                    {categories.map((category) => (
                        <div key={category} className={styles.categorySection}>
                            <h2 className={styles.categoryTitle}>
                                <span style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                                {category}
                            </h2>
                            <div className={styles.grid}>
                                {filteredLinks.filter(l => l.category === category).map((link, i) => (
                                    <motion.div
                                        key={link.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <div className={`${styles.platformIcon} ${styles[getPlatformStyle(link.platform)]}`}>
                                                    {getPlatformIcon(link.platform)}
                                                </div>
                                                <svg className={styles.externalIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                            </div>
                                            <div className={styles.cardTitle}>{link.title}</div>
                                            <div className={styles.cardFooter}>
                                                <span>{link.platform || 'Resource'}</span>
                                            </div>

                                            {/* Admin Overlay */}
                                            {role === 'admin' && (
                                                <div className={styles.editOverlay} onClick={(e) => e.preventDefault()}>
                                                    <button className={styles.iconBtn} onClick={(e) => { e.preventDefault(); startEdit(link); }}>✎</button>
                                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={(e) => { e.preventDefault(); handleDelete(link.id); }}>🗑</button>
                                                </div>
                                            )}
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {filteredLinks.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '4rem' }}>
                            No resources found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
