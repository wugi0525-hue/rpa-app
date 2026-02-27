/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { BookOpen, Clock, User, ArrowLeft, LayoutTemplate, PenTool, X, Save, EyeOff, Calendar, Trash2, Edit } from 'lucide-react';
import { auth, db, ADMIN_EMAIL } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

export default function Magazine() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    // Editor State
    const [showEditor, setShowEditor] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newExcerpt, setNewExcerpt] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newPublishDate, setNewPublishDate] = useState(''); // YYYY-MM-DDTHH:mm format
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

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

    const isAdmin = user && user.email === ADMIN_EMAIL;

    // Filter posts for public view
    const now = new Date();
    const displayPosts = posts.filter(post => {
        if (isAdmin) return true; // Admin sees everything
        if (!post.publishDate) return true; // Legacy posts without date are public

        let pubDate;
        if (post.publishDate instanceof Timestamp) {
            pubDate = post.publishDate.toDate();
        } else if (post.publishDate.toDate) {
            pubDate = post.publishDate.toDate();
        } else {
            pubDate = new Date(post.publishDate);
        }
        return pubDate <= now;
    });

    const isScheduled = (post) => {
        if (!post.publishDate) return false;
        let pubDate;
        if (post.publishDate instanceof Timestamp) {
            pubDate = post.publishDate.toDate();
        } else if (post.publishDate.toDate) {
            pubDate = post.publishDate.toDate();
        } else {
            pubDate = new Date(post.publishDate);
        }
        return pubDate > now;
    };

    const openEditor = (post = null) => {
        if (post) {
            setEditingPostId(post.id);
            setNewTitle(post.title || '');
            setNewCategory(post.tags?.[0] || post.category || '');
            setNewExcerpt(post.excerpt || '');
            setNewContent(post.content_md || post.content || '');

            if (post.publishDate) {
                let pd;
                if (post.publishDate instanceof Timestamp || post.publishDate.toDate) {
                    pd = post.publishDate.toDate();
                } else {
                    pd = new Date(post.publishDate);
                }
                const offset = pd.getTimezoneOffset();
                pd = new Date(pd.getTime() - (offset * 60 * 1000));
                setNewPublishDate(pd.toISOString().slice(0, 16));
            } else {
                setNewPublishDate('');
            }
        } else {
            setEditingPostId(null);
            setNewTitle('');
            setNewCategory('');
            setNewExcerpt('');
            setNewContent('');
            setNewPublishDate('');
        }
        setShowEditor(true);
    };

    const handleSavePost = async (e) => {
        e.preventDefault();
        if (!newTitle || !newContent) return;

        setIsSaving(true);
        try {
            const postData = {
                title: newTitle,
                tags: newCategory ? [newCategory] : ['Article'],
                excerpt: newExcerpt || newContent.substring(0, 100) + '...',
                content_md: newContent,
                author: "Admin Editor",
                updatedAt: serverTimestamp(),
            };

            if (newPublishDate) {
                postData.publishDate = Timestamp.fromDate(new Date(newPublishDate));
            } else {
                postData.publishDate = serverTimestamp();
            }

            if (editingPostId) {
                await updateDoc(doc(db, 'magazines', editingPostId), postData);
            } else {
                postData.createdAt = serverTimestamp();
                postData.slug = newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
                await addDoc(collection(db, 'magazines'), postData);
            }

            setShowEditor(false);
            if (selectedPost && selectedPost.id === editingPostId) {
                setSelectedPost(null); // Close detail view to force refresh from list
            }
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Save Error:", err);
            alert("Error saving post!");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm(language === 'ko' ? "정말 삭제하시겠습니까?" : "Are you sure you want to delete this?")) {
            try {
                await deleteDoc(doc(db, 'magazines', postId));
                if (selectedPost && selectedPost.id === postId) {
                    setSelectedPost(null);
                }
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button
                        onClick={() => { setSelectedPost(null); window.scrollTo(0, 0); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
                    >
                        <ArrowLeft size={20} />
                        {language === 'ko' ? '목록으로 돌아가기' : 'Back to Articles'}
                    </button>

                    {isAdmin && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => openEditor(selectedPost)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                <Edit size={14} /> {language === 'ko' ? '수정' : 'Edit'}
                            </button>
                            <button onClick={() => handleDelete(selectedPost.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', color: '#ef4444', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                <Trash2 size={14} /> {language === 'ko' ? '삭제' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>

                <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isScheduled(selectedPost) && (
                        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', border: '1px dashed #ca8a04', marginBottom: '8px' }}>
                            <EyeOff size={18} />
                            {language === 'ko' ? '이 글은 예약 발행 상태이며 아직 일반 사용자에게 보이지 않습니다.' : 'This post is scheduled and not yet public.'}
                        </div>
                    )}

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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={16} /> {selectedPost.author || 'AI Editor'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={16} />
                            {selectedPost.publishDate ?
                                (selectedPost.publishDate instanceof Timestamp ? selectedPost.publishDate.toDate().toLocaleString() : new Date(selectedPost.publishDate).toLocaleString())
                                :
                                (selectedPost.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString())}
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
                {isAdmin && (
                    <button
                        onClick={() => openEditor()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-warm)' }}
                    >
                        <PenTool size={16} />
                        {language === 'ko' ? '수동 글쓰기' : 'Manual Post'}
                    </button>
                )}
            </header>

            {loading ? (
                <div style={{ padding: '40px 0' }}>
                    <LoadingSpinner fullScreen={false} message={language === 'ko' ? "아티클 불러오는 중..." : "Loading articles..."} />
                </div>
            ) : displayPosts.length === 0 ? (
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
                    {displayPosts.map((article) => {
                        const sched = isScheduled(article);
                        return (
                            <div key={article.id} style={{ position: 'relative' }}>
                                {/* Scheduled Badge */}
                                {sched && isAdmin && (
                                    <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#ca8a04', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        <Calendar size={12} /> 예약됨
                                    </div>
                                )}

                                <article
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
                                        backgroundColor: 'var(--bg-primary)',
                                        height: '100%',
                                        opacity: sched ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-warm)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {article.thumbnail_url && (
                                        <div style={{ height: '160px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--glass-border)' }}>
                                            <img src={article.thumbnail_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                {article.tags?.[0] || article.category || 'Article'}
                                            </span>
                                        </div>

                                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '8px' }}>
                                            {article.title}
                                        </h2>

                                        <div style={{ flex: 1 }}></div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                                            <span style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: 'bold' }}>
                                                {language === 'ko' ? '아티클 읽기 →' : 'Read Article →'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                                <Clock size={12} />
                                                {article.publishDate ?
                                                    (article.publishDate instanceof Timestamp ? article.publishDate.toDate().toLocaleDateString() : new Date(article.publishDate).toLocaleDateString())
                                                    : 'Just now'}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Markdown Editor Modal */}
            {isAdmin && showEditor && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div className="glass-panel animate-slide-up-fade" style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
                                {editingPostId ? (language === 'ko' ? '글 수정' : 'Edit Post') : (language === 'ko' ? '새 마크다운 작성' : 'New Markdown Post')}
                            </h2>
                            <button onClick={() => setShowEditor(false)} style={{ background: 'var(--glass-bg)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '제목' : 'Title'}</label>
                                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '태그/카테고리' : 'Tags'}</label>
                                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g RPA, Process" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '예약 발행 시간 (비워두면 즉시 발행)' : 'Publish Date'}</label>
                                    <input type="datetime-local" value={newPublishDate} onChange={e => setNewPublishDate(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', colorScheme: 'light' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '요약 (검색 엔진 노출용)' : 'Excerpt (SEO)'}</label>
                                <textarea value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} rows={2} placeholder="SEO Description..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', resize: 'vertical', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <span>{language === 'ko' ? '본문 내용 (Markdown 문법 지원)' : 'Content (Markdown)'}</span>
                                    <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>Markdown 가이드</a>
                                </label>
                                <textarea required value={newContent} onChange={e => setNewContent(e.target.value)} rows={15} placeholder="# Hello World&#10;Write content here..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', resize: 'vertical', outline: 'none', lineHeight: '1.6', fontFamily: 'monospace' }} />
                            </div>

                            <button disabled={isSaving} type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '12px', cursor: 'pointer', transition: 'opacity 0.2s', opacity: isSaving ? 0.7 : 1 }}>
                                <Save size={20} /> {language === 'ko' ? '저장하기' : 'Save Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
