import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { User, LogOut, ShieldCheck, Database, Award, Mail } from 'lucide-react';
import { auth, signOut, googleProvider, db } from '../firebase';
import { linkWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Profile({ user }) {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [auditCount, setAuditCount] = useState(0);
    const [levelInfo, setLevelInfo] = useState({ level: 1, title: 'Junior Auditor', color: 'var(--text-muted)' });

    useEffect(() => {
        const fetchAuditCount = async () => {
            if (!user || user.isAnonymous) return;
            try {
                const q = query(
                    collection(db, "audits"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const count = querySnapshot.size;
                setAuditCount(count);

                if (count >= 50) setLevelInfo({ level: 4, title: 'Elite Auditor', color: 'var(--success)' });
                else if (count >= 20) setLevelInfo({ level: 3, title: 'Master Auditor', color: 'var(--accent-primary)' });
                else if (count >= 5) setLevelInfo({ level: 2, title: 'Pro Auditor', color: 'var(--warning)' });
                else setLevelInfo({ level: 1, title: 'Junior Auditor', color: 'var(--text-muted)' });

            } catch (error) {
                console.error("Error fetching audit count:", error);
            }
        };
        fetchAuditCount();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="stealth-layout" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px' }}>
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <User size={24} color="var(--accent-primary)" />
                    <h1 className="title-large" style={{ color: 'var(--text-primary)' }}>{t.nav_profile}</h1>
                </div>
                <p className="text-medium" style={{ color: 'var(--text-secondary)' }}>Account Settings & Status</p>
            </header>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>

                {user?.isAnonymous ? (
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '16px', border: '1px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                                <User size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {language === 'ko' ? '게스트 사용자' : 'Guest User'}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Temporary Account</p>
                            </div>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ fontSize: '15px', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 'bold' }}>
                                {language === 'ko' ? '데이터 영구 보관 안내' : 'Save Your Data Permanently'}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                                {language === 'ko' ?
                                    '현재 평가 기록은 브라우저를 닫으면 사라질 수 있습니다. 향후 지속적인 개선 추적과 B2B 매치메이킹 혜택을 위해 구글 계정으로 연동하세요.' :
                                    'Your audit records might be lost if you clear your browser data. Link your Google account to save permanently and track improvements.'}
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        await linkWithPopup(user, googleProvider);
                                        alert(language === 'ko' ? "계정이 성공적으로 연동되었습니다!" : "Account linked successfully!");
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Linking error:", error);
                                        if (error.code === 'auth/credential-already-in-use') {
                                            alert(language === 'ko' ? "이 구글 계정은 이미 가입되어 있습니다. 기존에 기록한 데이터가 병합되지 않을 수 있습니다." : "This Google account is already registered.");
                                        } else {
                                            alert("Error linking account: " + error.message);
                                        }
                                    }
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                <Mail size={16} color="var(--accent-primary)" /> {language === 'ko' ? '구글 계정으로 연동하기' : 'Link Google Account'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                            {user?.email?.charAt(0).toUpperCase() || <User size={32} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                {user?.displayName || 'Expert Auditor'}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.email}</p>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(72, 187, 120, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', marginTop: '6px' }}>
                                <ShieldCheck size={14} /> Verified Evaluator
                            </span>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: '1px solid var(--glass-border)' }}>
                        <Database size={20} color="var(--accent-primary)" />
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.isAnonymous ? '-' : auditCount}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Synched Audits</span>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: '1px solid var(--glass-border)' }}>
                        <Award size={20} color={user?.isAnonymous ? 'var(--text-muted)' : levelInfo.color} />
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Level {user?.isAnonymous ? '1' : levelInfo.level}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.isAnonymous ? 'Guest' : levelInfo.title}</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', marginTop: '12px' }}
                >
                    <LogOut size={18} /> {t.profile_logout || 'Sign Out of Workspace'}
                </button>

            </div>
        </div>
    );
}
