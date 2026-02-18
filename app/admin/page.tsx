'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for session to load
        if (session === undefined) return;

        if (role === 'admin') {
            fetch('/api/suggestions')
                .then(res => res.json())
                .then(data => {
                    setSuggestions(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load suggestions", err);
                    setLoading(false);
                });
        }
    }, [role, session]);

    // If session is loading, show loading text
    if (session === undefined) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading session...</div>;

    if (role !== 'admin') return <div style={{ padding: '4rem', textAlign: 'center' }}><h1>Access Denied</h1></div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', color: '#fff' }}>
            <h1 style={{ marginBottom: '2rem' }}>🛠️ Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <Link href="/admin/notes" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <h2 style={{ color: '#4ade80', marginTop: 0 }}>🗂️ Note Manager</h2>
                        <p style={{ color: '#aaa' }}>View all notes, inspect IDs, and manually delete broken or duplicate entries.</p>
                    </div>
                </Link>

                <Link href="/notes/create" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <h2 style={{ color: '#f59e0b', marginTop: 0 }}>✏️ Create New Note</h2>
                        <p style={{ color: '#aaa' }}>Add a new problem or article to the curriculum.</p>
                    </div>
                </Link>
            </div>

            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Pending Suggestions ({suggestions.length})
            </h2>

            {loading ? (
                <p>Loading suggestions...</p>
            ) : suggestions.length === 0 ? (
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                    No pending suggestions.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {suggestions.map((suggestion) => (
                        <Link key={suggestion._id} href={`/admin/review/${suggestion.suggestionId}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                borderLeft: '4px solid #f59e0b',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'background 0.2s'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>
                                        {suggestion.title || 'Untitled Suggestion'}
                                        <span style={{ fontSize: '0.8rem', color: '#aaa', marginLeft: '1rem', fontWeight: 'normal' }}>
                                            for {suggestion.targetId || 'New Note'}
                                        </span>
                                    </h3>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                                        Submitted by {suggestion.submittedBy || 'Anonymous'} • {new Date(suggestion.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Review &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
