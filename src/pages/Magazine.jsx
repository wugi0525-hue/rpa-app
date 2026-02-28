/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { BookOpen, Clock, User, ArrowLeft, LayoutTemplate, PenTool, X, Save, EyeOff, Calendar, Trash2, Edit, Loader } from 'lucide-react';
import { auth, db, ADMIN_EMAIL } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Magazine() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

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
        }, (error) => {
            console.error("Magazine snapshot error:", error);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDB();
        };
    }, []);

    useEffect(() => {
        const handlePopState = (event) => {
            if (selectedPost) {
                setSelectedPost(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [selectedPost]);

    const handleSelectPost = (article) => {
        setSelectedPost(article);
        window.history.pushState({ articleId: article.id }, '', window.location.pathname + '?article=' + article.id);
        window.scrollTo(0, 0);
    };

    const handleClosePost = () => {
        setSelectedPost(null);
        if (window.location.search.includes('article=')) {
            window.history.back();
        }
        window.scrollTo(0, 0);
    };

    const isAdmin = user && user.email === ADMIN_EMAIL;

    const now = new Date();
    const displayPosts = posts.filter(post => {
        if (!post.publishDate) return true; // Legacy posts without date are public

        let pubDate;
        if (post.publishDate instanceof Timestamp) {
            pubDate = post.publishDate.toDate();
        } else if (post.publishDate.toDate) {
            pubDate = post.publishDate.toDate();
        } else {
            pubDate = new Date(post.publishDate);
        }

        // If admin, show all posts
        if (isAdmin) return true;

        // If normal user, hide scheduled posts (where pubdate is in the future)
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
                try {
                    let pd;
                    if (post.publishDate && typeof post.publishDate.toDate === 'function') {
                        pd = post.publishDate.toDate();
                    } else {
                        pd = new Date(post.publishDate);
                    }
                    if (!isNaN(pd.getTime())) {
                        const offset = pd.getTimezoneOffset();
                        pd = new Date(pd.getTime() - (offset * 60 * 1000));
                        setNewPublishDate(pd.toISOString().slice(0, 16));
                    } else {
                        setNewPublishDate('');
                    }
                } catch (err) {
                    setNewPublishDate('');
                }
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

    const handleExportPdf = async () => {
        if (!selectedPost) return;
        setIsExporting(true);
        const printElement = document.getElementById('printable-magazine-report');
        if (!printElement) {
            alert("Export template not found.");
            setIsExporting(false);
            return;
        }

        try {
            // Temporarily show the template to capture it.
            printElement.style.left = '0px';

            // Wait a moment for styles to settle and React to re-render
            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(printElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 0.98);

            const pdfWidth = 210;
            const pdfHeight = 297;
            // Calculate total height of the canvas mapped into mm proportional to a width of 210mm
            const canvasHeightInMm = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF('p', 'mm', 'a4');
            let heightLeft = canvasHeightInMm;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInMm);
            heightLeft -= pdfHeight;

            // Manual Multiple Page Slice Loop
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInMm);
                heightLeft -= pdfHeight;
            }

            const fileName = `Magazine_${selectedPost.title.replace(/\s+/g, '_')}.pdf`;
            const pdfBlob = pdf.output('blob');

            // Download using anchor tag
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = fileName;
            link.click();
            alert(language === 'ko' ? "PDF 다운로드가 완료되었습니다." : "PDF downloaded.");
        } catch (err) {
            console.error("PDF generation failed", err);
            alert("Failed to generate PDF.");
        } finally {
            setIsExporting(false);
            if (printElement) printElement.style.left = '-9999px';
        }
    };

    // ----- DETAIL VIEW RENDER -----
    if (selectedPost) {
        return (
            <>
                <div className="stealth-layout layout-standard animate-slide-up-fade">
                    <title>{selectedPost.title} | RPA Insight</title>
                    <meta name="description" content={selectedPost.excerpt || selectedPost.title} />
                    {selectedPost.tags && <meta name="keywords" content={selectedPost.tags.join(', ')} />}
                    <meta property="og:title" content={selectedPost.title} />
                    <meta property="og:description" content={selectedPost.excerpt || selectedPost.title} />
                    {selectedPost.thumbnail_url && <meta property="og:image" content={selectedPost.thumbnail_url} />}

                    <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={handleClosePost}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
                            >
                                <ArrowLeft size={20} />
                                {language === 'ko' ? '목록으로 돌아가기' : 'Back to Articles'}
                            </button>
                        </div>

                        {/* PDF EXPORT BUTTON REMOVED */}

                        {isAdmin && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => { openEditor(selectedPost); window.scrollTo(0, 0); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    <Edit size={14} /> {language === 'ko' ? '수정' : 'Edit'}
                                </button>
                                <button onClick={() => handleDelete(selectedPost.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', color: '#ef4444', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    <Trash2 size={14} /> {language === 'ko' ? '삭제' : 'Delete'}
                                </button>
                            </div>
                        )}
                    </header>

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
                            {selectedPost.tags && selectedPost.tags.filter(tag => tag !== 'AI-Generated' && tag !== 'Magazine').map(tag => (
                                <span key={tag} style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="content-card" style={{ marginBottom: 0 }}>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.3', marginTop: '8px', letterSpacing: '-0.5px' }}>
                                {selectedPost.title}
                            </h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', marginTop: '16px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={16} />
                                    {selectedPost.publishDate ?
                                        (selectedPost.publishDate instanceof Timestamp ? selectedPost.publishDate.toDate().toLocaleString() : new Date(selectedPost.publishDate).toLocaleString())
                                        :
                                        (selectedPost.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString())}
                                </span>
                            </div>
                        </div>

                        <div className="content-card markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: '1.8' }}>
                            <ReactMarkdown>
                                {(selectedPost.content_md || selectedPost.content || '').replace(new RegExp(`^#\\s*${selectedPost.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*\\n+`, 'i'), '')}
                            </ReactMarkdown>
                        </div>
                    </article>

                    {/* ===== HIDDEN A4 PRINT TEMPLATE ===== */}
                    <div id="printable-magazine-report" style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px', height: 'max-content', overflow: 'visible', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif', padding: '40px', boxSizing: 'border-box', zIndex: -1 }}>
                        <div style={{ textAlign: 'center', marginBottom: '10mm', borderBottom: '2px solid #2563eb', paddingBottom: '4mm' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4mm 0', color: '#1e293b', lineHeight: '1.3' }}>{selectedPost.title}</h1>
                            <p style={{ fontSize: '12px', margin: 0, color: '#64748b', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <span><strong>Author:</strong> {selectedPost.author || 'RPA Insight'}</span>
                                <span><strong>Date:</strong> {selectedPost.publishDate ? (selectedPost.publishDate instanceof Timestamp ? selectedPost.publishDate.toDate().toLocaleDateString() : new Date(selectedPost.publishDate).toLocaleDateString()) : new Date().toLocaleDateString()}</span>
                                <span><strong>Category:</strong> {(selectedPost.tags?.filter(t => t !== 'AI-Generated' && t !== 'Magazine')[0]) || selectedPost.category || 'Article'}</span>
                            </p>
                        </div>

                        {selectedPost.thumbnail_url && (
                            <div style={{ width: '100%', marginBottom: '10mm', textAlign: 'center' }}>
                                <img src={selectedPost.thumbnail_url} alt="Cover" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #e2e8f0' }} />
                            </div>
                        )}

                        <div className="markdown-body" style={{ fontSize: '13px', lineHeight: '1.7', color: '#334155', textAlign: 'justify' }}>
                            <ReactMarkdown>
                                {(selectedPost.content_md || selectedPost.content || '').replace(new RegExp(`^#\\s*${selectedPost.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*\\n+`, 'i'), '')}
                            </ReactMarkdown>
                        </div>

                        <div style={{ marginTop: '15mm', paddingTop: '5mm', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                            <p>Generated by wugi0525-hue / RPA Insight Platform</p>
                        </div>
                    </div>

                </div>

                {/* Markdown Editor Modal for Detail View */}
                {
                    isAdmin && showEditor && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                            <div className="content-card animate-slide-up-fade" style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
                                        {language === 'ko' ? '글 수정' : 'Edit Post'}
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
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '발행 일시 (예약)' : 'Publish Date (Schedule)'}</label>
                                            <input
                                                type="datetime-local"
                                                value={newPublishDate}
                                                onChange={e => setNewPublishDate(e.target.value)}
                                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '요약 (목록용)' : 'Excerpt'}</label>
                                        <textarea value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} rows={2} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', resize: 'vertical' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>{language === 'ko' ? '내용 (Markdown 작성 가능)' : 'Content (Markdown)'}</label>
                                        <textarea required value={newContent} onChange={e => setNewContent(e.target.value)} rows={12} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', resize: 'vertical', fontFamily: 'monospace' }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                        <button type="button" onClick={() => setShowEditor(false)} style={{ padding: '14px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: '1px solid var(--glass-border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            {language === 'ko' ? '취소' : 'Cancel'}
                                        </button>
                                        <button type="submit" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', backgroundColor: 'var(--accent-primary)', color: 'white', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                                            {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                            {language === 'ko' ? '저장하기' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </>
        );
    }

    // ----- LIST VIEW RENDER -----
    return (
        <div className="stealth-layout layout-standard">
            <title>{language === 'ko' ? '인사이트 매거진 | RPA Insight' : 'Insight Magazine | RPA Insight'}</title>
            <meta name="description" content={language === 'ko' ? '제조업 전문 칼럼 및 자동화 인사이트' : 'B2B Manufacturing & Procurement Insights'} />

            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={24} color="var(--accent-primary)" />
                        <h1 className="title-large">{t.nav_magazine}</h1>
                    </div>
                    <p className="text-medium" style={{ marginTop: '4px' }}>{language === 'ko' ? '산업 동향 및 인사이트' : 'Industry news & updates'}</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => openEditor()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-warm)' }}
                    >
                        <PenTool size={16} />
                        {language === 'ko' ? '글쓰기' : 'Post'}
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
                    <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                        {language === 'ko' ? '아직 발행된 아티클이 없습니다.' : 'No articles published yet.'}
                    </h3>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {displayPosts.map((article) => {
                        const sched = isScheduled(article);
                        return (
                            <div key={article.id} style={{ position: 'relative' }}>
                                {/* Scheduled Badge */}
                                {sched && isAdmin && (
                                    <div style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#ca8a04', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        <Calendar size={10} /> 예약됨
                                    </div>
                                )}

                                <article
                                    onClick={() => handleSelectPost(article)}
                                    className="content-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        backgroundColor: 'var(--bg-primary)',
                                        opacity: sched ? 0.7 : 1,
                                        padding: '12px',
                                        gap: '16px'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-warm)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {article.thumbnail_url && (
                                        <div style={{ width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={article.thumbnail_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                                                {(article.tags?.filter(t => t !== 'AI-Generated' && t !== 'Magazine')[0]) || article.category || 'Article'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
                                                <Clock size={11} />
                                                {article.publishDate ?
                                                    (article.publishDate instanceof Timestamp ? article.publishDate.toDate().toLocaleDateString() : new Date(article.publishDate).toLocaleDateString())
                                                    : 'Just now'}
                                            </span>
                                        </div>
                                        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                            {article.title}
                                        </h2>
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
                    <div className="content-card animate-slide-up-fade" style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
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
