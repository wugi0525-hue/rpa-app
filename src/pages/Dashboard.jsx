import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard({ user }) {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { language, changeLanguage } = useLanguage();
    const t = translations[language] || translations.en;

    const handleDelete = async (e, auditId, companyName) => {
        e.stopPropagation();
        const confirmMessage = language === 'ko'
            ? `정말로 [${companyName}]의 평가 결과를 삭제하시겠습니까?`
            : `Are you sure you want to delete the audit report for [${companyName}]?`;

        if (window.confirm(confirmMessage)) {
            try {
                await deleteDoc(doc(db, "audits", auditId));
                setAudits(audits.filter(a => a.id !== auditId));
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert(language === 'ko' ? "삭제에 실패했습니다." : "Failed to delete.");
            }
        }
    };

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
        <div className="stealth-layout layout-standard">
            {/* Stealthy Header - Looks like a simple news/notes app */}
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="title-large">{t.dash_title}</h1>
                    <p className="text-medium">{t.dash_subtitle}</p>
                </div>
            </header>

            {/* Fake Search Bar to disguise intent */}
            <div className="content-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '24px' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder={t.dash_search}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '16px' }}
                />
            </div>

            {/* Recent Activity / B2B Matchmaking Entry point teaser */}
            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.dash_recent}</h2>
                    <button style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>{t.dash_view_all}</button>
                </div>

                <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
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
                                <div
                                    key={audit.id}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                                    onClick={() => navigate('/audit', { state: { viewAudit: audit } })}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{audit.companyName?.charAt(0) || '?'}</span>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {audit.companyName}
                                                {audit.homepage && (
                                                    <a href={audit.homepage.startsWith('http') ? audit.homepage : `https://${audit.homepage}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }} onClick={(e) => e.stopPropagation()}>
                                                        <Search size={14} />
                                                    </a>
                                                )}
                                            </h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {displayDate} · {audit.products} · 총점: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{audit.totalScore}</span>점
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button
                                            onClick={(e) => handleDelete(e, audit.id, audit.companyName)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', opacity: 0.8 }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                                            title={language === 'ko' ? '삭제' : 'Delete'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <ChevronRight size={20} color="var(--text-muted)" />
                                    </div>
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
