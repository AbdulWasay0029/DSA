'use client';

import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Settings</h1>
                    <p>Please <Link href="/api/auth/signin">sign in</Link> to view your settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>User Settings</h1>
                <div className={styles.section}>
                    <h2>Profile</h2>
                    <div className={styles.field}>
                        <label>Name</label>
                        <input type="text" value={session.user?.name || ''} readOnly />
                    </div>
                    <div className={styles.field}>
                        <label>Email</label>
                        <input type="email" value={session.user?.email || ''} readOnly />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Preferences</h2>
                    <div className={styles.row}>
                        <span>Dark Mode</span>
                        <input type="checkbox" checked readOnly />
                    </div>
                    <div className={styles.row}>
                        <span>Email Notifications</span>
                        <input type="checkbox" />
                    </div>
                </div>

                <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>* These settings are currently read-only in this demo.</p>
            </div>
        </div>
    );
}
