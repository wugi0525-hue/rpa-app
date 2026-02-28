import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Eye, ChevronDown, ChevronUp, Loader, Edit2, RotateCcw, Save, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { rpaCategories } from '../data/categories';
import { rpaQuestionnaire } from '../data/questionnaire';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import GlossaryHighlighter from '../components/GlossaryHighlighter';
import GlossaryModal from '../components/GlossaryModal';
import { glossary } from '../data/glossary';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ExpandableExample = ({ title, detail, type, onTermClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isGood = type === 'good';

    return (
        <div style={{ marginBottom: '8px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isGood ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '12px 16px', borderRadius: isOpen ? '8px 8px 0 0' : '8px',
                    border: 'none', borderLeft: `3px solid ${isGood ? 'var(--success)' : 'var(--danger)'}`,
                    color: 'var(--text-primary)', textAlign: 'left', fontWeight: '500'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isGood ? <CheckCircle2 size={18} color="var(--success)" /> : <AlertTriangle size={18} color="var(--danger)" />}
                    <span style={{ fontSize: '15px' }}>{title}</span>
                </div>
                {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
            </button>
            {isOpen && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px 16px', borderRadius: '0 0 8px 8px',
                    borderLeft: `3px solid ${isGood ? 'var(--success)' : 'var(--danger)'}`,
                    borderBottom: '1px solid var(--glass-border)',
                    borderRight: '1px solid var(--glass-border)',
                    fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6'
                }}>
                    <GlossaryHighlighter text={detail} onTermClick={onTermClick} />
                </div>
            )}
        </div>
    );
};

export default function AuditForm({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isViewMode = location.state && location.state.viewAudit;
    const viewAuditData = isViewMode ? location.state.viewAudit : null;

    // Init state from local storage or defaults (or viewAuditData if in view mode)
    const savedState = isViewMode ? {} : JSON.parse(localStorage.getItem('rpa_audit_draft')) || {};

    const [auditPhase, setAuditPhase] = useState(isViewMode ? 'result' : (savedState.auditPhase || 'demographics'));
    const [currentIndex, setCurrentIndex] = useState(savedState.currentIndex || 0);
    const [scores, setScores] = useState(isViewMode ? viewAuditData.scores : (savedState.scores || {}));
    const [qAnswers, setQAnswers] = useState(isViewMode ? viewAuditData.questionnaireInfo : (savedState.qAnswers || {}));
    const [ultimateAnswer, setUltimateAnswer] = useState(isViewMode ? viewAuditData.ultimateAnswer : (savedState.ultimateAnswer || null));
    const [companyInfo, setCompanyInfo] = useState({
        name: isViewMode ? viewAuditData.companyName : (savedState.companyInfo?.name || ''),
        products: isViewMode ? viewAuditData.products : (savedState.companyInfo?.products || ''),
        homepage: isViewMode ? viewAuditData.homepage : (savedState.companyInfo?.homepage || ''),
        evaluator: isViewMode ? viewAuditData.evaluator : (savedState.companyInfo?.evaluator || '')
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const pdfRef = useRef(null);
    const [editingItem, setEditingItem] = useState(null);

    const [selectedTermId, setSelectedTermId] = useState(null); // Glossary State
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    // Auto-save effect (only if not in view mode)
    useEffect(() => {
        if (isViewMode) return;
        const stateToSave = {
            auditPhase,
            currentIndex,
            scores,
            qAnswers,
            ultimateAnswer,
            companyInfo
        };
        localStorage.setItem('rpa_audit_draft', JSON.stringify(stateToSave));
    }, [auditPhase, currentIndex, scores, qAnswers, ultimateAnswer, companyInfo, isViewMode]);

    const categoriesList = rpaCategories[language] || rpaCategories.en;
    const questionnaireList = rpaQuestionnaire[language] || rpaQuestionnaire.en;

    const currentCategory = categoriesList[currentIndex];

    const handleScore = (score) => {
        setScores(prev => ({ ...prev, [currentIndex]: score }));

        // Auto-advance after a brief delay if not the last item
        if (currentIndex < categoriesList.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 400); // 400ms delay provides good tactile feedback before moving
        }
    };

    const isComplete = Object.keys(scores).length === categoriesList.length;
    const isQComplete = Object.keys(qAnswers).length === questionnaireList.length;

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = categoriesList.length * 11;
    const yesCount = Object.values(qAnswers).filter(a => a === 'YES').length;

    const getDiagnosis = (score, leanCount, lang) => {
        let type = 'traditional';
        if (score >= 90 && leanCount >= 15) type = 'world_class';
        else if (score >= 90 && leanCount < 15) type = 'fragile';
        else if (score < 90 && score >= 50 && leanCount >= 15) type = 'tool_based';
        else if (score >= 70) type = 'good';
        else if (score >= 50) type = 'average';
        else type = 'traditional';

        const dict = {
            en: {
                world_class: { title: "World-Class Lean", desc: "Excellent integration of lean systems and execution capability.", color: "var(--success)" },
                fragile: { title: "Superficial / Fragile", desc: "High overall score but lacks foundational lean systems. Likely relying on excess labor or inventory.", color: "#f59e0b" },
                tool_based: { title: "Tool-Based Lean", desc: "Has implemented lean tools (Kanban, 5S) but fails to execute or sustain them operationally.", color: "#f59e0b" },
                good: { title: "Good Facility", desc: "Above average operational performance with decent lean integration.", color: "var(--accent-primary)" },
                average: { title: "Average Facility", desc: "Standard industry performance. Significant room for improvement.", color: "var(--text-secondary)" },
                traditional: { title: "Traditional / Poor", desc: "Inefficient mass production system showing low performance across metrics.", color: "var(--danger)" }
            },
            ko: {
                world_class: { title: "월드클래스 린 공장", desc: "린(Lean) 시스템이 현장에 완벽히 녹아들어 있으며, 탁월한 실행 능력을 갖추고 있습니다.", color: "var(--success)" },
                fragile: { title: "무늬만 높은 성과 (사상누각)", desc: "겉보기 점수는 높으나 린(Lean) 체력이 부족합니다. 인해전술이나 과잉 재고로 비효율을 억지로 가리고 있을 확률이 매우 높습니다.", color: "#f59e0b" },
                tool_based: { title: "시스템 코스프레 / 실행력 부족", desc: "분명 도구(간판, 5S 등)는 흉내내고 있으나, 실제 운영에 문화로 적용되지 않거나 제대로 유지하지 못하고 있습니다.", color: "#f59e0b" },
                good: { title: "우수 공장", desc: "평균 이상의 운영 성과를 내며, 린(Lean) 시스템이 준수하게 적용되어 있습니다.", color: "var(--accent-primary)" },
                average: { title: "평균 수준 공장", desc: "업계 평균 수준의 공장입니다. 운영 효율성 및 린 시스템 방면에서 개선의 여지가 많습니다.", color: "var(--text-secondary)" },
                traditional: { title: "전통적 비효율 공장", desc: "모든 지표에서 구시대적이고 비효율적인 대량생산 체제의 모습을 보이고 있습니다.", color: "var(--danger)" }
            }
        };
        return (dict[lang] || dict['en'])[type];
    };

    const handleRestart = () => {
        if (window.confirm(language === 'ko' ? "정말 모든 기록을 지우고 처음부터 다시 시작하시겠습니까?" : "Are you sure you want to discard all progress and start over?")) {
            localStorage.removeItem('rpa_audit_draft');
            window.scrollTo(0, 0);
            setAuditPhase('demographics');
            setCurrentIndex(0);
            setScores({});
            setQAnswers({});
            setUltimateAnswer(null);
            setCompanyInfo({ name: '', products: '', homepage: '', evaluator: '' });
            window.scrollTo(0, 0);
        }
    };

    const submitInlineEditScore = (idx, newScore) => {
        setScores(prev => ({ ...prev, [idx]: newScore }));
        setEditingItem(null);
    };

    const submitInlineEditAnswer = (idx, newAnswer) => {
        if (idx === 19) {
            setUltimateAnswer(newAnswer);
        }
        setQAnswers(prev => ({ ...prev, [idx]: newAnswer }));
        setEditingItem(null);
    };

    const handleFinish = async (answer) => {
        setUltimateAnswer(answer);

        // Update qAnswers with the ultimate answer for Q20 (index 19)
        const updatedQAnswers = { ...qAnswers, 19: answer };
        setQAnswers(updatedQAnswers);

        setAuditPhase('result');
        window.scrollTo(0, 0);
    };

    if (auditPhase === 'ultimate') {
        return (
            <div className="stealth-layout layout-standard" style={{ paddingBottom: '80px', paddingTop: '96px' }}>
                <header className="page-header">
                    <h1 className="title-large">{t.result_ultimate}</h1>
                    <p className="text-medium">
                        {t.result_given} <br />
                        <strong style={{ color: 'var(--danger)', fontSize: '16px' }}>{t.result_buy}</strong>
                    </p>
                </header>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                    <button
                        disabled={isSaving}
                        onClick={() => handleFinish('YES')}
                        style={{ padding: '32px 16px', backgroundColor: 'var(--glass-bg)', color: 'var(--text-primary)', border: '2px solid var(--glass-border)', borderRadius: '16px', fontWeight: 'bold', fontSize: '20px', opacity: isSaving ? 0.5 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-warm)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--success)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--success)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                    >
                        {isSaving ? <Loader className="animate-spin" size={24} /> : t.result_yes}
                    </button>
                    <button
                        disabled={isSaving}
                        onClick={() => handleFinish('NO')}
                        style={{ padding: '32px 16px', backgroundColor: 'var(--glass-bg)', color: 'var(--text-primary)', border: '2px solid var(--glass-border)', borderRadius: '16px', fontWeight: 'bold', fontSize: '20px', opacity: isSaving ? 0.5 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-warm)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                    >
                        {isSaving ? <Loader className="animate-spin" size={24} /> : t.result_no}
                    </button>
                </div>
            </div>
        );
    }

    if (auditPhase === 'result') {
        const diagnosis = getDiagnosis(totalScore, yesCount, language);

        const handleExportPdf = async () => {
            setIsExporting(true);

            // Temporarily make the hidden printable report visible for capture
            const printElement = document.getElementById('printable-audit-report');
            if (!printElement) {
                console.error("Printable element not found");
                setIsExporting(false);
                return;
            }

            // Temporarily pull the element into view for capture
            printElement.style.left = '0px';

            try {
                // Wait a moment for styles to settle and React to re-render
                await new Promise(resolve => setTimeout(resolve, 500));

                const pdfWidth = 210; // A4 width in mm
                const pdfHeight = 297; // A4 height in mm
                const pdf = new jsPDF('p', 'mm', 'a4');

                let heightLeft1 = 0;
                let position1 = 0;

                // 1. Capture Phase 1 (Score Summary + 11 Categories)
                const phase1Element = document.getElementById('pdf-phase1');
                if (phase1Element) {
                    const canvas1 = await html2canvas(phase1Element, { scale: 2, useCORS: true });
                    const imgData1 = canvas1.toDataURL('image/jpeg', 0.98);
                    const canvasHeightInMm1 = (canvas1.height * pdfWidth) / canvas1.width;

                    heightLeft1 = canvasHeightInMm1;

                    pdf.addImage(imgData1, 'JPEG', 0, position1, pdfWidth, canvasHeightInMm1);
                    heightLeft1 -= pdfHeight;

                    while (heightLeft1 > 0) {
                        position1 -= pdfHeight;
                        pdf.addPage();
                        pdf.addImage(imgData1, 'JPEG', 0, position1, pdfWidth, canvasHeightInMm1);
                        heightLeft1 -= pdfHeight;
                    }
                }

                // 2. Capture Phase 2 (20-Item Questionnaire) and put on a NEW page
                const phase2Element = document.getElementById('pdf-phase2');
                if (phase2Element) {
                    // Check how much of the CURRENT page was used by Phase 1
                    const consumedOnCurrentPage = heightLeft1 + pdfHeight;

                    // If Phase 1 used more than 30mm of the current page, we consider it "full" and add a new page.
                    // If it used less than 30mm, it's just a tiny bleed (e.g. margin/padding whitespaces) that created an almost-blank page.
                    // We reuse this almost-blank page for Phase 2, which will overpaint the tiny bleed since Phase 2 has a white background.
                    if (consumedOnCurrentPage > 30) {
                        pdf.addPage();
                    }

                    const canvas2 = await html2canvas(phase2Element, { scale: 2, useCORS: true });
                    const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
                    const canvasHeightInMm2 = (canvas2.height * pdfWidth) / canvas2.width;

                    let heightLeft2 = canvasHeightInMm2;
                    let position2 = 0; // Starts at top of the new page

                    pdf.addImage(imgData2, 'JPEG', 0, position2, pdfWidth, canvasHeightInMm2);
                    heightLeft2 -= pdfHeight;

                    while (heightLeft2 > 0) {
                        position2 -= pdfHeight;
                        pdf.addPage();
                        pdf.addImage(imgData2, 'JPEG', 0, position2, pdfWidth, canvasHeightInMm2);
                        heightLeft2 -= pdfHeight;
                    }
                }

                const fileName = `RPA_Report_${companyInfo.name || 'Facility'}.pdf`;
                const pdfBlob = pdf.output('blob');
                const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'RPA Audit Report',
                            text: `RPA Audit Report for ${companyInfo.name || 'Facility'}`
                        });
                        console.log('Shared successfully');
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error sharing:', error);
                        }
                    }
                } else {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(pdfBlob);
                    link.download = fileName;
                    link.click();
                    alert(language === 'ko' ? "PDF 다운로드가 완료되었습니다." : "PDF downloaded.");
                }
            } catch (err) {
                console.error("PDF generation failed", err);
                alert("Failed to generate PDF.");
            } finally {
                setIsExporting(false);
                if (printElement) printElement.style.left = '-9999px';
            }
        };

        return (
            <div className="stealth-layout layout-standard" ref={pdfRef} style={{ gap: '24px', paddingTop: '64px' }}>
                <div style={{ position: 'relative', height: '40px', marginBottom: '8px' }}>
                    <div id="report-header-buttons" style={{ display: isExporting ? 'none' : 'block' }}>
                        {!isViewMode ? (
                            <button onClick={handleRestart} style={{ position: 'absolute', right: '0px', top: '0px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <RotateCcw size={16} /> <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.btn_restart}</span>
                            </button>
                        ) : (
                            <button onClick={() => navigate('/')} style={{ position: 'absolute', left: '0px', top: '0px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <ChevronLeft size={16} /> <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{language === 'ko' ? '목록으로' : 'Back'}</span>
                            </button>
                        )}
                    </div>
                </div>

                <header className="page-header">
                    <h1 className="title-large">{t.report_title}</h1>
                    <p className="text-medium" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{companyInfo.name || "Unknown Facility"}</p>
                </header>

                <div className="content-card" style={{ textAlign: 'center', padding: '32px 20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{t.result_total}</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>{totalScore}</span>
                                <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ {maxScore}</span>
                            </div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--glass-border)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{t.result_lean}</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '40px', fontWeight: '800', color: 'var(--success)', lineHeight: '1' }}>{yesCount}</span>
                                <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ 20</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-card" style={{ borderLeft: `4px solid ${diagnosis.color}`, marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {language === 'ko' ? '초기 진단 결과 (Diagnosis)' : 'Initial Diagnosis'}
                    </h2>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: diagnosis.color, marginBottom: '8px' }}>
                        {diagnosis.title}
                    </p>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {diagnosis.desc}
                    </p>
                </div>

                {ultimateAnswer && (
                    <div className="content-card" style={{ borderLeft: `4px solid ${ultimateAnswer === 'YES' ? 'var(--success)' : 'var(--danger)'}`, display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{t.result_ultimate}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: ultimateAnswer === 'YES' ? 'var(--success)' : 'var(--danger)' }}>
                                    {ultimateAnswer === 'YES' ? t.result_yes : t.result_no}
                                </span>
                                {!isViewMode && (
                                    <button onClick={() => setEditingItem(editingItem === 'ult' ? null : 'ult')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                                        {editingItem === 'ult' ? <ChevronUp size={16} /> : <Edit2 size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                        {editingItem === 'ult' && (
                            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button onClick={() => submitInlineEditAnswer(19, 'YES')} style={{ padding: '12px', backgroundColor: ultimateAnswer === 'YES' ? 'var(--success)' : 'var(--glass-bg)', color: ultimateAnswer === 'YES' ? 'white' : 'var(--text-primary)', borderRadius: '8px', border: `1px solid ${ultimateAnswer === 'YES' ? 'var(--success)' : 'var(--glass-border)'}`, fontWeight: 'bold', cursor: 'pointer' }}>{t.ans_yes.split(' ')[0]}</button>
                                <button onClick={() => submitInlineEditAnswer(19, 'NO')} style={{ padding: '12px', backgroundColor: ultimateAnswer === 'NO' ? 'var(--danger)' : 'var(--glass-bg)', color: ultimateAnswer === 'NO' ? 'white' : 'var(--text-primary)', borderRadius: '8px', border: `1px solid ${ultimateAnswer === 'NO' ? 'var(--danger)' : 'var(--glass-border)'}`, fontWeight: 'bold', cursor: 'pointer' }}>{t.ans_no.split(' ')[0]}</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="content-card" style={{ marginBottom: '16px', padding: '20px 10px', height: '350px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
                        {language === 'ko' ? '레이더 차트 분석 (Radar Analysis)' : 'Radar Gap Analysis'}
                    </h2>
                    <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height={280}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoriesList.map((cat, idx) => ({
                                subject: cat.subtitle,
                                score: scores[idx] || 0,
                                fullMark: 11,
                            }))}>
                                <PolarGrid stroke="var(--glass-border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 11]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }} />
                                <Radar name="Score" dataKey="score" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="content-card" style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>{language === 'ko' ? '상세 평가 항목 (Category Scores)' : 'Detailed Category Scores'}</h2>
                    {categoriesList.map((cat, idx) => (
                        <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 'bold', flex: 1 }}>{idx + 1}. {cat.title}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        backgroundColor: scores[idx] !== undefined ? `${cat.color}15` : 'transparent',
                                        color: scores[idx] !== undefined ? cat.color : 'var(--text-muted)',
                                        padding: '4px 12px', borderRadius: '12px',
                                        fontWeight: '800', fontSize: '16px'
                                    }}>
                                        {scores[idx] !== undefined ? `${scores[idx]} / 11` : 'Skipped'}
                                    </span>
                                    {!isViewMode && (
                                        <button onClick={() => setEditingItem(editingItem === `cat-${idx}` ? null : `cat-${idx}`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                                            {editingItem === `cat-${idx}` ? <ChevronUp size={16} /> : <Edit2 size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                <strong>Target:</strong> {cat.focus}
                            </p>
                            {editingItem === `cat-${idx}` && (
                                <div style={{ marginTop: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                    {[1, 3, 5, 7, 9, 11].map(num => (
                                        <button key={num} onClick={() => submitInlineEditScore(idx, num)} style={{ flex: '1 0 calc(33% - 8px)', padding: '12px 0', backgroundColor: scores[idx] === num ? cat.color : 'rgba(255,255,255,0.05)', color: scores[idx] === num ? 'white' : 'var(--text-primary)', borderRadius: '8px', border: `1px solid ${scores[idx] === num ? cat.color : 'var(--glass-border)'}`, fontWeight: 'bold', cursor: 'pointer' }}>
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="content-card" style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>{language === 'ko' ? '린 시스템 점검 (Lean System Check)' : 'Lean System Questionnaire'}</h2>
                    {questionnaireList.map((q, idx) => (
                        <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '14px', flex: 1, lineHeight: '1.5' }}>
                                    <strong>Q{idx + 1}.</strong> {q.text}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        backgroundColor: qAnswers[idx] === 'YES' ? 'rgba(16,185,129,0.1)' : (qAnswers[idx] === 'NO' ? 'rgba(239,68,68,0.1)' : 'transparent'),
                                        color: qAnswers[idx] === 'YES' ? 'var(--success)' : (qAnswers[idx] === 'NO' ? 'var(--danger)' : 'var(--text-muted)'),
                                        padding: '6px 12px', borderRadius: '8px',
                                        fontWeight: 'bold', fontSize: '14px', minWidth: '60px', textAlign: 'center'
                                    }}>
                                        {qAnswers[idx] || 'Skipped'}
                                    </span>
                                    {!isViewMode && (
                                        <button onClick={() => setEditingItem(editingItem === `q-${idx}` ? null : `q-${idx}`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                                            {editingItem === `q-${idx}` ? <ChevronUp size={16} /> : <Edit2 size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {editingItem === `q-${idx}` && (
                                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button onClick={() => submitInlineEditAnswer(idx, 'YES')} style={{ padding: '12px', backgroundColor: qAnswers[idx] === 'YES' ? 'var(--success)' : 'var(--glass-bg)', color: qAnswers[idx] === 'YES' ? 'white' : 'var(--text-primary)', borderRadius: '8px', border: `1px solid ${qAnswers[idx] === 'YES' ? 'var(--success)' : 'var(--glass-border)'}`, fontWeight: 'bold', cursor: 'pointer' }}>{t.ans_yes.split(' ')[0]}</button>
                                    <button onClick={() => submitInlineEditAnswer(idx, 'NO')} style={{ padding: '12px', backgroundColor: qAnswers[idx] === 'NO' ? 'var(--danger)' : 'var(--glass-bg)', color: qAnswers[idx] === 'NO' ? 'white' : 'var(--text-primary)', borderRadius: '8px', border: `1px solid ${qAnswers[idx] === 'NO' ? 'var(--danger)' : 'var(--glass-border)'}`, fontWeight: 'bold', cursor: 'pointer' }}>{t.ans_no.split(' ')[0]}</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: isExporting ? 'none' : 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {!isViewMode && (
                        <button
                            disabled={isSaving}
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    await addDoc(collection(db, "audits"), {
                                        userId: user.uid,
                                        companyName: companyInfo.name,
                                        products: companyInfo.products,
                                        homepage: companyInfo.homepage,
                                        evaluator: companyInfo.evaluator,
                                        totalScore: totalScore,
                                        yesCount: yesCount,
                                        ultimateAnswer: ultimateAnswer,
                                        scores: scores,
                                        questionnaireInfo: qAnswers,
                                        createdAt: serverTimestamp()
                                    });
                                    alert(t.alert_saved.replace('{name}', companyInfo.name || 'Unknown Facility'));
                                    window.scrollTo(0, 0);
                                    setAuditPhase('demographics');
                                    setCurrentIndex(0);
                                    setScores({});
                                    setQAnswers({});
                                    setUltimateAnswer(null);
                                    setCompanyInfo({ name: '', products: '', homepage: '', evaluator: '' });
                                } catch (error) {
                                    console.error("Error saving document: ", error);
                                    alert("An error occurred while saving.");
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', opacity: isSaving ? 0.7 : 1 }}
                        >
                            {isSaving ? <Loader className="animate-spin" size={20} /> : null}
                            {isSaving ? 'Saving...' : t.btn_save}
                        </button>
                    )}

                    <div id="report-action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={handleExportPdf}
                            disabled={isExporting}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: 'var(--success)', color: 'white', border: 'none', boxShadow: 'var(--shadow-warm)', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', opacity: isExporting ? 0.7 : 1 }}
                        >
                            {isExporting ? <Loader className="animate-spin" size={20} /> : <Share2 size={20} />}
                            {isExporting ? (language === 'ko' ? '기다려 주세요...' : 'Generating...') : (language === 'ko' ? 'PDF 출력 및 앱으로 공유 🚀' : 'Export PDF & Share')}
                        </button>
                        <button
                            onClick={() => {
                                const subject = `${t.email_subject} ${companyInfo.name || 'Unknown'}`;
                                let fullText = `${t.email_body_results} ${companyInfo.name || 'Unknown'}\n\n`;
                                fullText += `${t.email_body_summary}\n`;
                                fullText += `${t.email_body_total} ${totalScore}/${maxScore}\n`;
                                fullText += `${t.email_body_lean} ${yesCount} / 20\n\n`;
                                fullText += `${t.email_body_diag}\n`;
                                fullText += `- ${diagnosis.title}\n`;
                                fullText += `- ${diagnosis.desc}\n\n`;

                                fullText += `${t.email_body_cat}\n`;
                                categoriesList.forEach((c, i) => {
                                    fullText += `${i + 1}. ${c.title} : ${scores[i] !== undefined ? scores[i] : t.email_body_skipped} / 11\n`;
                                    fullText += `  ${t.email_body_target} ${c.focus}\n`;
                                });
                                fullText += `\n${t.email_body_q}\n`;
                                questionnaireList.forEach((q, i) => {
                                    fullText += `Q${i + 1}. ${q.text}\n`;
                                    const ansLocal = qAnswers[i] === 'YES' ? t.ans_yes.split(' ')[0] : (qAnswers[i] === 'NO' ? t.ans_no.split(' ')[0] : t.email_body_skipped);
                                    fullText += `  ${t.email_body_ans} ${ansLocal}\n`;
                                });
                                fullText += `\n${t.email_body_ult}\n`;
                                if (ultimateAnswer) {
                                    const ultLocal = ultimateAnswer === 'YES' ? t.result_yes : t.result_no;
                                    fullText += `${t.email_body_buy} ${ultLocal}\n\n`;
                                }
                                fullText += `Products: ${companyInfo.products}\n`;
                                fullText += `Evaluator: ${companyInfo.evaluator || 'N/A'}\n`;

                                navigator.clipboard.writeText(`[Subject: ${subject}]\n\n${fullText}`).then(() => {
                                    alert(language === 'ko' ? "전체 리포트가 클립보드에 복사되었습니다. 메일 앱이나 카카오톡 등에 붙여넣기(Ctrl+V) 하세요!" : "Full report copied to clipboard. Paste it in your email or messenger!");
                                }).catch(err => {
                                    console.error("Copy failed", err);
                                    alert("Clipboard copy failed.");
                                });
                            }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', boxShadow: 'var(--shadow-warm)', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}
                        >
                            📋 {language === 'ko' ? '전체 리포트 복사하기 (추천)' : 'Copy Full Report TO Clipboard'}
                        </button>

                        <button
                            onClick={() => {
                                const recipient = window.prompt(t.prompt_email, "");
                                if (recipient === null) return;

                                const subject = encodeURIComponent(`${t.email_subject} ${companyInfo.name || 'Unknown'}`);
                                let summaryText = `${t.email_body_results} ${companyInfo.name || 'Unknown'}\n\n`;
                                summaryText += `${t.email_body_summary}\n`;
                                summaryText += `${t.email_body_total} ${totalScore}/${maxScore}\n`;
                                summaryText += `${t.email_body_lean} ${yesCount} / 20\n\n`;
                                summaryText += `${t.email_body_diag}\n`;
                                summaryText += `- ${diagnosis.title}\n`;
                                summaryText += `- ${diagnosis.desc}\n\n`;
                                summaryText += `* Please use the "Copy Full Report" button in the app for detailed question breakdowns (due to email length limits). *\n`;
                                summaryText += `* 보다 상세한 문항별 점수는 앱에서 [전체 리포트 복사하기]를 통해 확인 가능합니다. *\n\n`;
                                summaryText += `Products: ${companyInfo.products}\n`;
                                summaryText += `Evaluator: ${companyInfo.evaluator || 'N/A'}\n`;

                                window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(summaryText)}`;
                            }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', fontWeight: 'normal', fontSize: '14px' }}
                        >
                            ✉️ {language === 'ko' ? '이메일 띄우기 (요약본만)' : 'Share Summary via Email'}
                        </button>
                    </div>

                    {user?.isAnonymous && (
                        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '12px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 'bold' }}>
                                {language === 'ko' ? '게스트 모드로 작동 중입니다' : 'You are in Guest Mode'}
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                                {language === 'ko' ?
                                    '현재 평가 기록은 브라우저를 닫으면 사라질 수 있습니다. 향후 지속적인 개선 추적과 B2B 매치메이킹 혜택을 위해 정식 계정으로 가입하세요.' :
                                    'Your audit records might be lost if you clear your browser data. Sign up for a permanent account to track improvements and access B2B matchmaking.'}
                            </p>
                            <button
                                onClick={() => {
                                    // Trigger auth flow in App/Profile
                                    alert(language === 'ko' ? "프로필 페이지에서 계정을 등록(업그레이드) 해주세요!" : "Please upgrade your account in the Profile page!");
                                }}
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                            >
                                {language === 'ko' ? '정식 계정으로 가입하기' : 'Sign Up to Save Permanently'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Hidden A4 Print Template for PDF Export */}
                <div id="printable-audit-report" style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                    width: '800px', // Fixed desktop width to simulate A4 horizontally
                    backgroundColor: 'white',
                    color: 'black',
                    zIndex: -1,
                    padding: '40px',
                    boxSizing: 'border-box',
                    fontFamily: 'sans-serif',
                    height: 'max-content',
                    overflow: 'visible'
                }}>

                    {/* PHASE 1 WRAPPER */}
                    <div id="pdf-phase1" style={{ width: '100%', height: 'max-content', paddingBottom: '20px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #334155', paddingBottom: '20px' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0' }}>RPA Suitability Audit Report</h1>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Generated on {new Date().toLocaleDateString()}</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '16px', color: '#334155' }}>
                                Company Info
                            </h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold', width: '25%' }}>Company Name</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', width: '25%' }}>{companyInfo.name || '-'}</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold', width: '25%' }}>Main Products</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', width: '25%' }}>{companyInfo.products || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>Company Homepage</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{companyInfo.homepage || '-'}</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>Evaluator</td>
                                        <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{companyInfo.evaluator || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '16px', color: '#334155' }}>
                                Summary
                            </h2>

                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                {/* Left side: Table */}
                                <div style={{ flex: '1' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', height: '100%' }}>
                                        <tbody>
                                            <tr style={{ height: '40px' }}>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold', width: '40%' }}>Total RPA Score</td>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{Math.round(totalScore)} / 121</td>
                                            </tr>
                                            <tr style={{ height: '40px' }}>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>Lean System</td>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{yesCount} / 20</td>
                                            </tr>
                                            <tr style={{ height: '40px' }}>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>초기 진단 결과</td>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
                                                    {diagnosis.resultText}
                                                </td>
                                            </tr>
                                            <tr style={{ height: '40px' }}>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>최종 질문 (Buy?)</td>
                                                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: ultimateAnswer === 'YES' ? '#16a34a' : (ultimateAnswer === 'NO' ? '#dc2626' : '#64748b') }}>
                                                    {ultimateAnswer || 'Not Answered'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right side: Radar Chart */}
                                <div style={{ width: '350px', height: '220px', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoriesList.map((cat, idx) => ({
                                            subject: cat.subtitle,
                                            score: scores[idx] || 0,
                                            fullMark: 11,
                                        }))}>
                                            <PolarGrid gridType="polygon" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 11]} tick={{ fontSize: 9 }} />
                                            <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '16px', color: '#334155' }}>
                                Phase 1: RPA 11 Categories
                            </h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                        <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'left', width: '10%' }}>No.</th>
                                        <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'left', width: '75%' }}>Category</th>
                                        <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center', width: '15%' }}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriesList.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ padding: '4px', border: '1px solid #cbd5e1' }}>{c.title}</td>
                                            <td style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}>
                                                {scores[i] !== undefined ? scores[i] : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PHASE 2 WRAPPER - rendered but separated via html2canvas calls */}
                    <div id="pdf-phase2" style={{ width: '100%', height: 'max-content', paddingTop: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0' }}>RPA Suitability Audit Report (Cont.)</h1>
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '2mm', marginBottom: '4mm', color: '#334155' }}>
                            Phase 2: 20-Item Lean Questionnaire
                        </h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', pageBreakInside: 'auto' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9' }}>
                                    <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'left', width: '10%' }}>No.</th>
                                    <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'left', width: '75%' }}>Question</th>
                                    <th style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center', width: '15%' }}>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questionnaireList.map((q, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Q{i + 1}</td>
                                        <td style={{ padding: '4px', border: '1px solid #cbd5e1' }}>{q.text}</td>
                                        <td style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold', color: qAnswers[i] === 'YES' ? '#16a34a' : (qAnswers[i] === 'NO' ? '#dc2626' : '#64748b') }}>
                                            {qAnswers[i] || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    if (auditPhase === 'demographics') {
        const isInfoReady = (companyInfo?.name || '').trim().length > 0 && (companyInfo?.products || '').trim().length > 0;

        return (
            <div className="stealth-layout layout-standard">
                <header className="page-header">
                    <h1 className="title-large">New Audit</h1>
                    <p className="text-medium">Enter the basic profile of the target facility.</p>
                </header>

                <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>{t.form_name}</label>
                        <input
                            type="text"
                            placeholder="e.g. A-Tech Factory 1"
                            value={companyInfo?.name || ''}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>{t.form_products}</label>
                        <input
                            type="text"
                            placeholder="e.g. Plastic injection automotive parts"
                            value={companyInfo?.products || ''}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, products: e.target.value })}
                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Company Homepage (Optional)</label>
                        <input
                            type="url"
                            placeholder="e.g. https://www.example.com"
                            value={companyInfo?.homepage || ''}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, homepage: e.target.value })}
                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Evaluator / Remarks (Optional)</label>
                        <input
                            type="text"
                            placeholder="My name or notes"
                            value={companyInfo?.evaluator || ''}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, evaluator: e.target.value })}
                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (!isInfoReady) {
                            alert(t.form_alert_demographics);
                            return;
                        }
                        window.scrollTo(0, 0);
                        setAuditPhase('categories');
                    }}
                    style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', opacity: isInfoReady ? 1 : 0.6 }}
                >
                    {t.form_start} <ChevronRight size={20} />
                </button>
            </div>
        );
    }

    if (auditPhase === 'questionnaire') {
        const currentQ = questionnaireList[currentIndex];

        // We only want to show 19 questions in the standard list, Q20 is the ultimate question
        const standardQLength = Math.min(19, questionnaireList.length);

        const handleQAnswer = (ans) => {
            const newAnswers = { ...qAnswers, [currentIndex]: ans };
            setQAnswers(newAnswers);

            // Advance to the next question, or go to ultimate phase if we just answered Q19
            if (currentIndex < standardQLength - 1) {
                setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
            } else {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    setAuditPhase('ultimate');
                }, 400);
            }
        };

        return (
            <div className="stealth-layout layout-standard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p className="text-medium" style={{ color: 'var(--text-muted)' }}>{t.phase_2}</p>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currentIndex + 1}</span>
                        <span style={{ color: 'var(--text-muted)' }}>/ {standardQLength}</span>
                    </div>
                </div>

                <div key={currentIndex} className="animate-slide-up-fade">
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--glass-bg)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${((currentIndex + 1) / standardQLength) * 100}%`,
                            height: '100%',
                            backgroundColor: 'var(--accent-primary)',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>

                    <div className="content-card" style={{ padding: '40px 24px', marginBottom: '32px', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.5', wordBreak: 'keep-all' }}>
                            <GlossaryHighlighter text={currentQ.text} onTermClick={setSelectedTermId} />
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                        <button
                            onClick={() => handleQAnswer('YES')}
                            style={{
                                height: '80px', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: 'var(--shadow-warm)',
                                backgroundColor: qAnswers[currentIndex] === 'YES' ? 'var(--success)' : 'var(--glass-bg)',
                                color: qAnswers[currentIndex] === 'YES' ? 'white' : 'var(--text-primary)',
                                border: `2px solid ${qAnswers[currentIndex] === 'YES' ? 'var(--success)' : 'var(--glass-border)'}`
                            }}>
                            {t.ans_yes}
                        </button>
                        <button
                            onClick={() => handleQAnswer('NO')}
                            style={{
                                height: '80px', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: 'var(--shadow-warm)',
                                backgroundColor: qAnswers[currentIndex] === 'NO' ? 'var(--danger)' : 'var(--glass-bg)',
                                color: qAnswers[currentIndex] === 'NO' ? 'white' : 'var(--text-primary)',
                                border: `2px solid ${qAnswers[currentIndex] === 'NO' ? 'var(--danger)' : 'var(--glass-border)'}`
                            }}>
                            {t.ans_no}
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                            style={{ opacity: currentIndex === 0 ? 0.3 : 1, pointerEvents: currentIndex === 0 ? 'none' : 'auto', color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)' }}
                        >{t.btn_prev}</button>

                        {currentIndex === standardQLength - 1 && (
                            <button
                                onClick={() => {
                                    if (Object.keys(qAnswers).length < standardQLength) {
                                        const missing = [];
                                        for (let i = 0; i < standardQLength; i++) {
                                            if (qAnswers[i] === undefined) missing.push(i + 1);
                                        }
                                        const confirmSubmit = window.confirm(t.alert_missing_q.replace('{missing}', missing.join(', ')));
                                        if (confirmSubmit) setAuditPhase('ultimate');
                                    } else {
                                        setAuditPhase('ultimate');
                                    }
                                }}
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', border: 'none' }}
                            >{t.btn_submit}</button>
                        )}

                        {currentIndex < standardQLength - 1 && (
                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(standardQLength - 1, prev + 1))}
                                style={{ color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)' }}
                            >{t.btn_skip}</button>
                        )}
                    </div>
                </div>
                <GlossaryModal term={glossary.find(t => t.id === selectedTermId)} isOpen={!!selectedTermId} onClose={() => setSelectedTermId(null)} language={language} />
            </div>
        );
    }

    return (
        <div className="stealth-layout layout-standard">
            {/* Stealthy App Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="text-medium" style={{ color: 'var(--text-muted)' }}>{t.phase_1}</p>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currentIndex + 1}</span>
                    <span style={{ color: 'var(--text-muted)' }}>/ 11</span>
                </div>
            </div>

            <div key={currentIndex} className="animate-slide-up-fade">
                {/* Progress bar */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--glass-bg)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${((currentIndex + 1) / 11) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-primary)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>

                {/* Main Focus Question (What should the user immediately look for?) */}
                <header className="page-header" style={{ marginTop: '16px' }}>
                    <h1 className="title-large">{currentCategory.title}</h1>
                    <p className="text-medium" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{currentCategory.subtitle}</p>
                </header>

                {/* Cheatsheet Card - Beautifully embedded for instant review */}
                <div className="content-card" style={{
                    marginBottom: '32px',
                    borderLeft: `4px solid var(--accent-primary)`,
                    padding: '20px',
                    backgroundColor: 'var(--bg-secondary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                        <Eye size={24} color={'var(--accent-primary)'} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4', wordBreak: 'keep-all' }}>
                            <GlossaryHighlighter text={currentCategory.focus} onTermClick={setSelectedTermId} />
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 'bold', marginBottom: '8px', paddingLeft: '4px' }}>{t.good_examples}</p>
                        {currentCategory.goodExamples.map((ex, idx) => (
                            <ExpandableExample key={`good-${idx}`} title={ex.title} detail={ex.detail} type="good" onTermClick={setSelectedTermId} />
                        ))}

                        <p style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 'bold', marginTop: '16px', marginBottom: '8px', paddingLeft: '4px' }}>{t.bad_examples}</p>
                        {currentCategory.badExamples.map((ex, idx) => (
                            <ExpandableExample key={`bad-${idx}`} title={ex.title} detail={ex.detail} type="bad" onTermClick={setSelectedTermId} />
                        ))}
                    </div>
                </div>

                {/* Responsive Table Layout for Scoring */}
                <div className="score-wrapper">
                    <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold' }}>{t.form_rating}</h3>

                    <div className="score-grid">
                        {[1, 3, 5, 7, 9, 11].map(num => {
                            const isSelected = scores[currentIndex] === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => handleScore(num)}
                                    className="score-btn"
                                    style={{
                                        height: '64px',
                                        borderRadius: '16px',
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: isSelected ? 'white' : 'var(--text-primary)',
                                        backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-bg)',
                                        border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                                        boxShadow: isSelected ? `0 0 20px var(--accent-primary)40` : 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {num}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Navigation Constraints & Submission */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        style={{
                            opacity: currentIndex === 0 ? 0.3 : 1,
                            pointerEvents: currentIndex === 0 ? 'none' : 'auto',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)'
                        }}
                    >
                        <ChevronLeft size={20} /> {t.btn_prev}
                    </button>

                    {currentIndex === 10 && (
                        <button
                            onClick={() => {
                                if (!isComplete) {
                                    const missing = [];
                                    for (let i = 0; i < 11; i++) {
                                        if (scores[i] === undefined) missing.push(i + 1);
                                    }
                                    const confirmSubmit = window.confirm(`[미평가 항목 안내]\n평가하지 않은 항목이 있습니다: ${missing.join(', ')}번\n\n미평가 항목은 0점 처리됩니다. 다음 단계로 넘어가시겠습니까?`);
                                    if (confirmSubmit) {
                                        window.scrollTo(0, 0);
                                        setAuditPhase('questionnaire');
                                        setCurrentIndex(0);
                                    }
                                } else {
                                    window.scrollTo(0, 0);
                                    setAuditPhase('questionnaire');
                                    setCurrentIndex(0);
                                }
                            }}
                            style={{
                                backgroundColor: isComplete ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                                color: isComplete ? 'white' : 'var(--text-muted)',
                                border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold',
                                transition: 'var(--transition)'
                            }}
                        >
                            {t.btn_finish_categories}
                        </button>
                    )}

                    {currentIndex < 10 && (
                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(10, prev + 1))}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)'
                            }}
                        >
                            {t.btn_skip} <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            <GlossaryModal term={glossary.find(t => t.id === selectedTermId)} isOpen={!!selectedTermId} onClose={() => setSelectedTermId(null)} language={language} />
        </div>
    );
}
