import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { BookOpen, ExternalLink, Clock, User, Plus, X, Save } from 'lucide-react';
import { auth, db, ADMIN_EMAIL } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const defaultArticles = {
    ko: [],
    en: []
};

export default function Magazine() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

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
                author: "Admin Director",
                date: new Date().toLocaleDateString(),
                createdAt: serverTimestamp()
            });
            setShowEditor(false);
            setNewTitle('');
            setNewCategory('');
            setNewExcerpt('');
            setNewContent('');
        } catch (err) {
            console.error("Save Error:", err);
            alert("Error saving post! Make sure your admin email matches.");
        } finally {
            setIsSaving(false);
        }
    };

    const displayArticles = posts.length > 0 ? posts : [];

    return (
        <div className="stealth-layout" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <BookOpen size={24} color="var(--accent-primary)" />
                    <h1 className="title-large" style={{ color: 'var(--text-primary)' }}>{t.nav_magazine}</h1>
                </div>
                <p className="text-medium" style={{ color: 'var(--text-secondary)' }}>
                    B2B Manufacturing & Procurement Insights
                </p>
            </header>

            {loading ? (
                <div style={{ padding: '40px 0' }}>
                    <LoadingSpinner fullScreen={false} message="Loading insights..." />
                </div>
            ) : displayArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <BookOpen size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px' }}>
                        {language === 'ko' ? "아직 등록된 매거진 아티클이 없습니다." : "No magazine articles have been published yet."}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {displayArticles.map((article) => (
                        <article key={article.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {article.category}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                        <Clock size={12} /> {article.date}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                                    {article.title}
                                </h2>

                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                                    {article.excerpt}
                                </p>

                                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                        {article.content}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', marginTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                        <User size={14} /> {article.author}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', border: '1px dashed var(--glass-border)', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
                    Google AdSense Placeholder Area <br />
                    (Articles designed for High-Quality Content SEO Rating)
                </p>
            </div>

            {/* Admin Floating Action Button */}
            {isAdmin && !showEditor && (
                <button
                    onClick={() => setShowEditor(true)}
                    style={{ position: 'fixed', bottom: '100px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(217, 119, 87, 0.4)', border: 'none', cursor: 'pointer', zIndex: 900 }}
                >
                    <Plus size={24} />
                </button>
            )}

            {/* Admin CMS Editor Modal */}
            {isAdmin && showEditor && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>New Admin Post</h2>
                            <button onClick={() => setShowEditor(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Title</label>
                                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Category (e.g., Procurement Strategy)</label>
                                <input required value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Excerpt (Short Summary)</label>
                                <textarea required value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} rows={2} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', resize: 'vertical' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Content body</label>
                                <textarea required value={newContent} onChange={e => setNewContent(e.target.value)} rows={6} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', resize: 'vertical' }} />
                            </div>

                            <button disabled={isSaving} type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', marginTop: '8px', cursor: 'pointer' }}>
                                {isSaving ? 'Publishing...' : <><Save size={18} /> Publish Post</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
