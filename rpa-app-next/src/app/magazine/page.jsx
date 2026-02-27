"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/i18n/translations';
import { BookOpen, Clock, User, Plus, X, Save, ArrowLeft, PenTool, LayoutTemplate } from 'lucide-react';
import { auth, db, ADMIN_EMAIL } from '@/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Magazine() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

    // View state: null means we are showing the list. An object means we are showing a specific post.
    const [selectedPost, setSelectedPost] = useState(null);

    // Editor Form State
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newExcerpt, setNewExcerpt] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const q = query(collection(db, 'magazine_posts'), orderBy('createdAt', 'desc'));
        const unsubscribeDB = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLoading(false);

            // If viewing a post that got updated, we can optionally update selectedPost here,
            // but for simplicity, we focus on the list.
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDB();
        };
    }, []);

    const isAdmin = user && user.email === ADMIN_EMAIL;

    const handleSavePost = async (e) => {
        e.preventDefault();
        if (!newTitle || !newContent || !newCategory) return;

        setIsSaving(true);
        try {
            await addDoc(collection(db, 'magazine_posts'), {
                title: newTitle,
                category: newCategory,
                excerpt: newExcerpt || newContent.substring(0, 100) + '...',
                content: newContent,
                author: "Admin Editor",
                date: new Date().toLocaleDateString(),
                createdAt: serverTimestamp()
            });
            setShowEditor(false);
            setNewTitle('');
            setNewCategory('');
            setNewExcerpt('');
            setNewContent('');
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Save Error:", err);
            alert("Error saving post! Make sure your admin email matches.");
        } finally {
            setIsSaving(false);
        }
    };

    // ----- DETAIL VIEW RENDER -----
    if (selectedPost) {
        return (
            <div className="stealth-layout animate-slide-up-fade" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column' }}>
                <button
                    onClick={() => { setSelectedPost(null); window.scrollTo(0, 0); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: 'bold' }}
                >
                    <ArrowLeft size={20} />
                    {language === 'ko' ? '목록으로 돌아가기' : 'Back to Magazine'}
                </button>

                <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {selectedPost.category}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4', marginTop: '8px' }}>
                        {selectedPost.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '13px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {selectedPost.author}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {selectedPost.date}
                        </span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {selectedPost.content}
                    </div>
                </article>
            </div>
        );
    }

    // ----- LIST VIEW RENDER -----
    return (
        <div className="stealth-layout" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <BookOpen size={24} color="var(--accent-primary)" />
                        <h1 className="title-large" style={{ color: 'var(--text-primary)' }}>{t.nav_magazine}</h1>
                    </div>
                    <p className="text-medium" style={{ color: 'var(--text-secondary)' }}>
                        {language === 'ko' ? '제조업 전문 칼럼 및 인사이트' : 'B2B Manufacturing & Procurement Insights'}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowEditor(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(217, 119, 87, 0.3)' }}
                    >
                        <PenTool size={16} />
                        {language === 'ko' ? '새 글 작성' : 'New Post'}
                    </button>
                )}
            </header>

            {loading ? (
                <div style={{ padding: '40px 0' }}>
                    <LoadingSpinner fullScreen={false} message={language === 'ko' ? "매거진 불러오는 중..." : "Loading magazine..."} />
                </div>
            ) : posts.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                    <LayoutTemplate size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '8px' }}>
                        {language === 'ko' ? '아직 작성된 매거진이 없습니다.' : 'No magazines published yet.'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {language === 'ko' ? '새로운 전문 칼럼과 인사이트가 곧 업데이트될 예정입니다.' : 'New expert columns and insights will be updated soon.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {posts.map((article) => (
                        <article
                            key={article.id}
                            onClick={() => { setSelectedPost(article); window.scrollTo(0, 0); }}
                            className="glass-panel"
                            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-warm)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {article.category}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                    <Clock size={12} /> {article.date}
                                </span>
                            </div>

                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', marginTop: '4px' }}>
                                {article.title}
                            </h2>

                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {article.excerpt}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '12px', marginTop: '4px', borderTop: '1px solid var(--glass-border)' }}>
                                <span style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: '600' }}>
                                    {language === 'ko' ? '칼럼 읽기 →' : 'Read Article →'}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Admin CMS Editor Modal */}
            {isAdmin && showEditor && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div className="glass-panel animate-slide-up-fade" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>{language === 'ko' ? '새 매거진 작성' : 'New Magazine Post'}</h2>
                            <button onClick={() => setShowEditor(false)} style={{ background: 'var(--glass-bg)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '제목' : 'Title'}</label>
                                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={language === 'ko' ? '블로그 포스트 제목' : 'Enter standard post title'} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '카테고리' : 'Category'}</label>
                                <input required value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g. 품질경영 / 원가절감 / 스마트팩토리" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '본문 요약 (목록에 보여질 텍스트)' : 'Excerpt (Listed text)'}</label>
                                <textarea required value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} rows={2} placeholder={language === 'ko' ? '글의 흥미를 끄는 요약본을 작성하세요.' : 'Short summary...'} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', resize: 'vertical', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '전체 본문 내용' : 'Full Content Body'}</label>
                                <textarea required value={newContent} onChange={e => setNewContent(e.target.value)} rows={10} placeholder={language === 'ko' ? '단락과 줄바꿈을 포함하여 본문을 자세히 작성하세요.' : 'Write the full article details here...'} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', resize: 'vertical', outline: 'none', lineHeight: '1.6' }} />
                            </div>

                            <button disabled={isSaving} type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '12px', cursor: 'pointer', transition: 'opacity 0.2s', opacity: isSaving ? 0.7 : 1 }}>
                                {isSaving ? <Loader className="animate-spin" size={20} /> : <><Save size={20} /> {language === 'ko' ? '매거진 발행하기' : 'Publish Magazine Post'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
