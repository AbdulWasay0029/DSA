'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Progress', path: '/progress' },
        { name: 'Notes', path: '/notes' },
        { name: 'Links', path: '/links' },
    ];

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link href="/" className={styles.logo}>
                DSA Mastery
            </Link>

            <div className={styles.navGroup}>
                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className={styles.authControl}>
                    {session ? (
                        <div className={styles.userMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {session.user?.image ? (
                                <img src={session.user.image} alt="User" className={styles.avatar} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>{session.user?.name?.[0]}</div>
                            )}

                            {isMenuOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{session.user?.name}</p>
                                        <p className={styles.userEmail}>{session.user?.email}</p>
                                    </div>
                                    <Link href="/settings" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                                        Settings
                                    </Link>
                                    <button onClick={() => signOut()} className={styles.signOutBtn}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => signIn('google')} className={styles.signInBtn}>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
