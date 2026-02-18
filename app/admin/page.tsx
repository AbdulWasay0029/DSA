'use client';

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', color: '#fff' }}>
            <h1 style={{ marginBottom: '2rem' }}>🛠️ Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
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
        </div>
    );
}
