'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminNotesPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || 'visitor';
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch notes on load
    useEffect(() => {
        if (role !== 'admin') return;
        fetch('/api/notes')
            .then(res => res.json())
            .then(data => {
                setNotes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load notes", err);
                setLoading(false);
            });
    }, [role]);

    // Delete handler
    const handleDelete = async (noteId?: string, mongoId?: string) => {
        const idToDelete = (noteId && noteId !== 'undefined' && noteId !== 'null') ? noteId : mongoId;

        if (!confirm(`Are you sure you want to delete note with ID: ${idToDelete}?`)) return;

        try {
            // Include both id and _id in query if possible
            const params = new URLSearchParams();
            if (noteId) params.append('id', noteId);
            if (mongoId) params.append('_id', mongoId);

            const res = await fetch(`/api/notes?${params.toString()}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Remove from local list
                setNotes(prev => prev.filter(n => n.id !== noteId && n._id !== mongoId));
                alert("Note deleted successfully!");
            } else {
                const err = await res.json();
                alert("Failed to delete note: " + (err.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting note.");
        }
    };

    if (role !== 'admin') {
        return <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Access Denied</h1><p>You must be an admin to view this page.</p></div>;
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Notes...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>🗂️ Note Manager (Admin)</h1>
                <Link href="/notes/create" style={{ background: '#8a3ffc', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>+ New Note</Link>
            </div>

            <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                Use this dashboard to troubleshoot broken notes. If a note has a weird ID or shows "Not Found", delete it here.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Title</th>
                        <th style={{ padding: '1rem' }}>Custom ID (Slug)</th>
                        <th style={{ padding: '1rem' }}>Backend _id</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map(note => (
                        <tr key={note._id || note.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem' }}>
                                <Link href={`/notes/${note.id}`} style={{ color: '#4ade80', textDecoration: 'none' }}>
                                    {note.title}
                                </Link>
                            </td>
                            <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#aaa' }}>
                                {note.id}
                            </td>
                            <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}>
                                {note._id}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {(!note.id || note.id === "undefined") ? (
                                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>BROKEN ID!</span>
                                ) : (
                                    <span style={{ color: '#4ade80' }}>OK</span>
                                )}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <button
                                    onClick={() => handleDelete(note.id, note._id)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.5)',
                                        padding: '0.4rem 0.8rem',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
