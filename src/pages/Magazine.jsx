import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import { BookOpen, ExternalLink, Clock, User, Plus, X, Save } from 'lucide-react';
import { auth, db, ADMIN_EMAIL } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const defaultArticles = {
    ko: [
        {
            id: 1,
            title: "원가 절감을 넘어선 가치 창출: 구매 실무자의 스마트 팩토리 활용법",
            date: "2024. 11. 15",
            author: "구매/조달 실무 전문가",
            category: "Procurement Strategy",
            excerpt: "단순한 단가 후려치기가 아닌, 협력사의 생산성 향상을 리딩하여 상생하는 구매 전략. RPA 평가를 어떻게 공급망 관리에 녹여낼 것인가?",
            content: "구매 실무자로서 가장 답답한 순간은 협력사의 '단가 인상' 공문에 수동적으로 끌려갈 때입니다. 진정한 원가 절감(Cost Reduction)은 단순히 마진을 깎는 것이 아니라, 협력사의 비효율을 찾아내어 원가를 낮춰주는 데에서 시작합니다. 현장 실사에 RPA(Rapid Plant Assessment) 방법론을 도입하면, 협력사의 재고 관리 흐름, 설비 가동률, 작업자의 동선 낭비 등을 단시간에 파악할 수 있습니다..."
        },
        {
            id: 2,
            title: "린(Lean) 생산 체계가 조달 리드타임(Lead Time)에 미치는 치명적 영향",
            date: "2024. 10. 28",
            author: "공급망 분석 파트",
            category: "Lean Manufacturing",
            excerpt: "리드타임이 길어지는 원인은 납품업체의 '배치(Batch)' 생산 방식 때문일 확률이 높습니다. 린 생산의 '1개 흘리기(One-piece flow)' 원칙이 구매 타이밍을 어떻게 바꾸는지 알아봅니다.",
            content: "주문 후 납기일이 4주가 넘어가는 협력사를 방문해보면 십중팔구 '대량 로트(Lot) 생산'을 하고 있습니다. 한 번 기계를 세팅할 때 왕창 찍어내는 것이 원가를 낮춘다는 착각 때문이죠. 하지만 이는 끝없는 재고를 양산하고 역설적으로 고객이 원하는 소량의 부품은 항상 결품이 나게 만듭니다..."
        },
        {
            id: 3,
            title: "최우수 협력사를 가려내는 11가지 현장 스캐닝 노하우",
            date: "2024. 09. 05",
            author: "협력기업 오딧(Audit) 전문가",
            category: "Supplier Audit",
            excerpt: "공장 바닥만 봐도 수준이 보인다? 구매 담당자가 현장 실사(Audit) 시 반드시 체크해야 할 11가지 핵심 지표와 실무 꿀팁.",
            content: "좋은 협력사는 현장에 들어서는 순간 공기부터 다릅니다. 작업장 바닥에 떨어져 있는 나사못 하나, 구석에 방치된 청소도구함 등은 공장의 관리 수준을 적나라하게 보여주는 지표입니다. 구매 담당자가 현장 실사 빈도를 높이고 RPA 11개 카테고리를 기준으로 평가 데이터베이스를 구축하면..."
        }
    ],
    en: [
        {
            id: 1,
            title: "Beyond Cost Reduction: A Procurement Professional's Guide to Smart Factories",
            date: "Nov 15, 2024",
            author: "Procurement Expert",
            category: "Procurement Strategy",
            excerpt: "Moving beyond simple price negotiation towards collaborative productivity enhancement using RPA assessments in supply chain management.",
            content: "As a procurement professional, the most frustrating moments occur when reacting to a supplier's price increase notice. True cost reduction doesn't mean squeezing margins, but identifying and eliminating inefficiencies on the supplier's floor. By implementing the Rapid Plant Assessment (RPA) methodology during site visits..."
        },
        {
            id: 2,
            title: "How Lean Manufacturing Critically Impacts Procurement Lead Times",
            date: "Oct 28, 2024",
            author: "Supply Chain Analytics",
            category: "Lean Manufacturing",
            excerpt: "Long lead times are often caused by batch production. Read how the transition to one-piece flow transforms purchasing schedules.",
            content: "When visiting a supplier with lead times over 4 weeks, you'll almost always find them utilizing large batch production. The misconception that 'running huge lots saves money' leads to massive inventory while ironically causing stock-outs for the specific parts customers actually need..."
        },
        {
            id: 3,
            title: "11 On-Site Scanning Techniques to Identify Top-Tier Suppliers",
            date: "Sep 05, 2024",
            author: "Supplier Audit Specialist",
            category: "Supplier Audit",
            excerpt: "Can you judge a factory just by looking at its floor? Essential tips for procurement officers conducting on-site audits based on 11 RPA categories.",
            content: "A top-tier supplier feels different the moment you walk onto the floor. A single dropped screw or a neglected cleaning station in the corner are naked indicators of management quality. When procurement officers increase audit frequencies and build a database based on the 11 RPA categories..."
        }
    ]
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

    // Use fetched posts if available, otherwise fallback to language-specific defaults
    const displayArticles = posts.length > 0 ? posts : (defaultArticles[language] || defaultArticles.en);

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
                                    <button style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Read Further <ExternalLink size={14} />
                                    </button>
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
