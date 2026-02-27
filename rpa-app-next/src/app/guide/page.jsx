"use client";
import React, { useState } from 'react';
import { rpaCategories } from '@/data/categories';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/i18n/translations';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import GlossaryHighlighter from '@/components/GlossaryHighlighter';
import GlossaryModal from '@/components/GlossaryModal';
import { glossary } from '@/data/glossary';

const ExpandableExample = ({ title, detail, type, onTermClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isGood = type === 'good';

    return (
        <div style={{ marginBottom: '8px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isGood ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    padding: '12px 16px', borderRadius: isOpen ? '8px 8px 0 0' : '8px',
                    border: 'none', borderLeft: `3px solid ${isGood ? 'var(--success)' : 'var(--danger)'}`,
                    color: 'var(--text-primary)', textAlign: 'left', fontWeight: '500'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isGood ? <CheckCircle2 size={16} color="var(--success)" /> : <AlertTriangle size={16} color="var(--danger)" />}
                    <span style={{ fontSize: '14px' }}>{title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
            </button>
            {isOpen && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px 16px', borderRadius: '0 0 8px 8px',
                    borderRight: '1px solid var(--glass-border)',
                    fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6'
                }}>
                    <GlossaryHighlighter text={detail} onTermClick={onTermClick} />
                </div>
            )}
        </div>
    );
};

export default function CheatSheet() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;
    const categoriesList = rpaCategories[language] || rpaCategories.en;
    const [selectedTermId, setSelectedTermId] = useState(null);

    return (
        <div className="stealth-layout" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '120px' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="title-large" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{t.guide_title}</h1>
                <p className="text-medium">{t.guide_subtitle}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {categoriesList.map(cat => (
                    <div key={cat.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{
                            padding: '16px 20px',
                            background: 'var(--accent-primary)',
                            display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                            }}>
                                {String(cat.id).padStart(2, '0')}
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'white', lineHeight: '1.2' }}>{cat.title}</h2>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.5', wordBreak: 'keep-all' }}>
                                Q. <GlossaryHighlighter text={cat.focus} onTermClick={setSelectedTermId} />
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--success)', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>{t.good_examples}</span>
                                {cat.goodExamples.map((ex, idx) => (
                                    <ExpandableExample key={`good-${cat.id}-${idx}`} title={ex.title} detail={ex.detail} type="good" onTermClick={setSelectedTermId} />
                                ))}

                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--danger)', display: 'block', marginTop: '16px', marginBottom: '8px', paddingLeft: '4px' }}>{t.bad_examples}</span>
                                {cat.badExamples.map((ex, idx) => (
                                    <ExpandableExample key={`bad-${cat.id}-${idx}`} title={ex.title} detail={ex.detail} type="bad" onTermClick={setSelectedTermId} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <GlossaryModal term={glossary.find(t => t.id === selectedTermId)} isOpen={!!selectedTermId} onClose={() => setSelectedTermId(null)} language={language} />
        </div>
    );
}
