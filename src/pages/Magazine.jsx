/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { BookOpen, Clock, User, ArrowLeft, LayoutTemplate } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

export default function Magazine() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, () => { });

        // Fetch from 'magazines' collection which automation script targets
        const q = query(collection(db, 'magazines'), orderBy('createdAt', 'desc'));
        const unsubscribeDB = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDB();
        };
    }, []);

    // ----- DETAIL VIEW RENDER -----
    if (selectedPost) {
        return (
            <div className="stealth-layout animate-slide-up-fade" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column' }}>
                <Helmet>
                    <title>{selectedPost.title} | RPA Insight</title>
                    <meta name="description" content={selectedPost.excerpt || selectedPost.title} />
                    {selectedPost.tags && <meta name="keywords" content={selectedPost.tags.join(', ')} />}
                    <meta property="og:title" content={selectedPost.title} />
                    <meta property="og:description" content={selectedPost.excerpt || selectedPost.title} />
                    {selectedPost.thumbnail_url && <meta property="og:image" content={selectedPost.thumbnail_url} />}
                </Helmet>

                <button
                    onClick={() => { setSelectedPost(null); window.scrollTo(0, 0); }}
                    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: 'bold' }}
                >
                    <ArrowLeft size={20} />
                    {language === 'ko' ? '목록으로 돌아가기' : 'Back to Articles'}
                </button>

                <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedPost.thumbnail_url && (
                        <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: 'var(--shadow-warm)' }}>
                            <img src={selectedPost.thumbnail_url} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedPost.tags && selectedPost.tags.map(tag => (
                            <span key={tag} style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.3', marginTop: '8px', letterSpacing: '-0.5px' }}>
                        {selectedPost.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={16} /> {selectedPost.author || 'AI Editor'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={16} /> {selectedPost.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: '1.8' }}>
                        <ReactMarkdown>
                            {selectedPost.content_md || selectedPost.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
        );
    }

    // ----- LIST VIEW RENDER -----
    return (
        <div className="stealth-layout" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column' }}>
            <Helmet>
                <title>{language === 'ko' ? '인사이트 매거진 | RPA Insight' : 'Insight Magazine | RPA Insight'}</title>
                <meta name="description" content={language === 'ko' ? '제조업 전문 칼럼 및 자동화 인사이트' : 'B2B Manufacturing & Procurement Insights'} />
            </Helmet>

            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <BookOpen size={24} color="var(--accent-primary)" />
                        <h1 className="title-large" style={{ color: 'var(--text-primary)' }}>{t.nav_magazine}</h1>
                    </div>
                    <p className="text-medium" style={{ color: 'var(--text-secondary)' }}>
                        {language === 'ko' ? '제조업 자동화 칼럼 및 인사이트' : 'Automation & AI Integration Insights'}
                    </p>
                </div>
            </header>

            {loading ? (
                <div style={{ padding: '40px 0' }}>
                    <LoadingSpinner fullScreen={false} message={language === 'ko' ? "아티클 불러오는 중..." : "Loading articles..."} />
                </div>
            ) : posts.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                    <LayoutTemplate size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '8px' }}>
                        {language === 'ko' ? '아직 발행된 아티클이 없습니다.' : 'No articles published yet.'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {language === 'ko' ? 'AI 편집자가 새로운 인사이트를 선별 중입니다.' : 'Our AI editor is curating new insights.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {posts.map((article) => (
                        <article
                            key={article.id}
                            onClick={() => { setSelectedPost(article); window.scrollTo(0, 0); }}
                            className="glass-panel"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                backgroundColor: 'var(--bg-primary)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-warm)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {article.thumbnail_url && (
                                <div style={{ height: '180px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--glass-border)' }}>
                                    <img src={article.thumbnail_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {article.tags?.[0] || 'Article'}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                        <Clock size={12} /> {article.readTime ? `${article.readTime} min read` : article.date}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '8px' }}>
                                    {article.title}
                                </h2>

                                <div style={{ flex: 1 }}></div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                                    <span style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: 'bold' }}>
                                        {language === 'ko' ? '아티클 읽기 →' : 'Read Article →'}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
