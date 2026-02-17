'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Progress', path: '/progress' },
        { name: 'Curriculum', path: '/notes' },
        { name: 'Library', path: '/links' },
    ];

    const role = (session?.user as any)?.role || 'visitor';

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.navContainer}>
                {/* Logo Area */}
                <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={styles.logoIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M9 3v18" />
                            <path d="m14 9 3 3-3 3" />
                        </svg>
                    </div>
                    <span className={styles.brandName}>AlgoStream</span>
                </Link>

                {/* Desktop Nav */}
                <div className={styles.desktopNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                        >
                            {item.name}
                            {pathname === item.path && (
                                <motion.div layoutId="underline" className={styles.underline} />
                            )}
                        </Link>
                    ))}
                    {role === 'admin' && (
                        <Link
                            href="/admin"
                            className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
                            style={{ color: 'var(--primary)' }}
                        >
                            Admin
                            {pathname === '/admin' && (
                                <motion.div layoutId="underline" className={styles.underline} />
                            )}
                        </Link>
                    )}
                </div>

                {/* Right Controls */}
                <div className={styles.controls}>
                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        )}
                    </button>

                    {session ? (
                        <div className={styles.userMenu} onMouseEnter={() => setIsMenuOpen(true)} onMouseLeave={() => setIsMenuOpen(false)}>
                            <button className={styles.avatarBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="User" className={styles.avatarImg} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>{session.user?.name?.[0]}</div>
                                )}
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        className={styles.dropdown}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <div className={styles.userInfo}>
                                            <p className={styles.userName}>{session.user?.name}</p>
                                            <p className={styles.userEmail}>{session.user?.email}</p>
                                        </div>
                                        <div className={styles.menuDivider} />
                                        <Link href="/profile" className={styles.menuItem}>Profile</Link>
                                        <button onClick={() => signOut()} className={`${styles.menuItem} ${styles.signOut}`}>
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.mobileLinks}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`${styles.mobileLink} ${pathname === item.path ? styles.mobileActive : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{ color: 'var(--primary)' }}
                                >
                                    Admin
                                </Link>
                            )}
                            {!session && (
                                <Link href="/login" className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
