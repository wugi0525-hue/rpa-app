"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/i18n/translations';
import LanguageSelector from '@/components/LanguageSelector';
import Login from '@/components/Login';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FileText, Compass, HelpCircle, BookOpen, User } from 'lucide-react';

export default function ClientLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setAuthLoading(false);
        });
        return () => unsub();
    }, []);

    const getNavClass = (path) => {
        return pathname === path ? 'nav-item active' : 'nav-item';
    };

    const handleLogin = useCallback((user) => {
        setCurrentUser(user);
        router.push('/');
    }, [router]);

    if (authLoading) return <LoadingSpinner message={t.dash_loading || 'Loading...'} />;

    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="stealth-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ padding: '16px 24px 0 24px', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
                <LanguageSelector />
            </div>

            {/* Pages will read auth.currentUser directly since they are Client Components now */}
            {children}

            {/* Persistent Stealth Bottom Navigation */}
            <nav className="bottom-nav">
                <button className={getNavClass('/')} onClick={() => router.push('/')}>
                    <Compass size={24} />
                    <span>{t.nav_audits}</span>
                </button>
                <button className={getNavClass('/magazine')} onClick={() => router.push('/magazine')}>
                    <BookOpen size={24} />
                    <span>{t.nav_magazine}</span>
                </button>
                <button className={getNavClass('/guide')} onClick={() => router.push('/guide')}>
                    <HelpCircle size={24} />
                    <span>{t.nav_guide}</span>
                </button>
                <button className={getNavClass('/audit')} onClick={() => router.push('/audit')}>
                    <FileText size={24} />
                    <span>{t.nav_record}</span>
                </button>
                <button className={getNavClass('/profile')} onClick={() => router.push('/profile')}>
                    <User size={24} />
                    <span>{t.nav_profile}</span>
                </button>
            </nav>
        </div>
    );
}
