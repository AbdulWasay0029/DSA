'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        // Wait for session to load
        if (session === undefined) return;

        if (role === 'admin') {
            Promise.all([
                fetch('/api/suggestions').then(res => res.json()),
                fetch('/api/users').then(res => res.json())
            ])
                .then(([suggData, userData]) => {
                    setSuggestions(Array.isArray(suggData) ? suggData : []);
                    setUsers(Array.isArray(userData) ? userData : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load admin data", err);
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <Link href="/admin/notes" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                    }}>
                        <h2 style={{ color: '#4ade80', marginTop: 0 }}>🗂️ Note Manager</h2>
                        <p style={{ color: '#aaa' }}>Manage all curriculum content.</p>
                    </div>
                </Link>

                <Link href="/notes/create" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                    }}>
                        <h2 style={{ color: '#f59e0b', marginTop: 0 }}>✏️ Create New Note</h2>
                        <p style={{ color: '#aaa' }}>Add a new problem or article.</p>
                    </div>
                </Link>

                <div style={{
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                }}>
                    <h2 style={{ color: '#3b82f6', marginTop: 0 }}>👥 Users: {users.length}</h2>
                    <p style={{ color: '#aaa' }}>Total registered users tracked.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                {/* Pending Suggestions Column */}
                <div>
                    <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        Pending Suggestions ({suggestions.length})
                    </h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : suggestions.length === 0 ? (
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                            No pending suggestions.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {suggestions.map((suggestion) => (
                                <Link key={suggestion._id || suggestion.suggestionId} href={`/admin/review/${suggestion.suggestionId}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        padding: '1.2rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        borderLeft: '4px solid #f59e0b',
                                        transition: 'background 0.2s'
                                    }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>
                                            {suggestion.title || 'Untitled'}
                                        </h3>
                                        <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
                                            by {suggestion.submittedBy || 'Anonymous'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* User List Column */}
                <div>
                    <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        Recent Active Users
                    </h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : users.length === 0 ? (
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                            No users tracked yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {users.slice(0, 20).map((user, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '500' }}>{user.email}</div>
                                        <div style={{ color: '#666', fontSize: '0.8rem' }}>
                                            Last Active: {new Date(user.lastActive).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                                </div>
                            ))}
                            {users.length > 20 && (
                                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                                    ...and {users.length - 20} more
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
