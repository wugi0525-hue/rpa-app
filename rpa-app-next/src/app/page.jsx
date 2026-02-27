"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/i18n/translations';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard({ user }) {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language, changeLanguage } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const q = query(
                    collection(db, "audits"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetchedAudits = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAudits(fetchedAudits);
            } catch (error) {
                console.error("Error fetching audits:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAudits();
        }
    }, [user]);

    return (
        <div className="dashboard-page">
            {/* Stealthy Header - Looks like a simple news/notes app */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="title-large" style={{ color: 'var(--text-primary)' }}>{t.dash_title}</h1>
                    <p className="text-medium">{t.dash_subtitle}</p>
                </div>
            </header>

            {/* Fake Search Bar to disguise intent */}
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '24px' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder={t.dash_search}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '16px' }}
                />
            </div>

            {/* Recent Activity / B2B Matchmaking Entry point teaser */}
            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.dash_recent}</h2>
                    <button style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>{t.dash_view_all}</button>
                </div>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                    {loading ? (
                        <LoadingSpinner fullScreen={false} message={t.dash_loading} />
                    ) : audits.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{t.dash_no_audits}</p>
                    ) : (
                        audits.map(audit => {
                            // Handle both Firestore Timestamp and regular JS Date string safely
                            let displayDate = "";
                            try {
                                if (audit.createdAt?.toDate) {
                                    displayDate = audit.createdAt.toDate().toLocaleDateString();
                                } else if (typeof audit.createdAt === 'number') {
                                    displayDate = new Date(audit.createdAt).toLocaleDateString();
                                } else if (typeof audit.createdAt === 'string') {
                                    displayDate = new Date(audit.createdAt).toLocaleDateString();
                                } else {
                                    displayDate = "Unknown Date";
                                }
                            } catch (e) {
                                displayDate = "Invalid Date";
                            }

                            return (
                                <div key={audit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{audit.companyName?.charAt(0) || '?'}</span>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {audit.companyName}
                                                {audit.homepage && (
                                                    <a href={audit.homepage.startsWith('http') ? audit.homepage : `https://${audit.homepage}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                                                        <Search size={14} />
                                                    </a>
                                                )}
                                            </h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {displayDate} · {audit.products} · 총점: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{audit.totalScore}</span>점
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} color="var(--text-muted)" />
                                </div>
                            )
                        })
                    )}
                </div>
            </section>

            {/* Ads Container Dummy */}
            <div style={{ width: '100%', height: '100px', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>AdMob Banner Space</p>
            </div>

        </div>
    );
}
