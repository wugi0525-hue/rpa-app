import React from 'react';
import { glossary } from '../data/glossary';

export default function GlossaryHighlighter({ text, onTermClick }) {
    if (!text) return null;

    // Flatten keys to track which key belongs to which term ID
    const termMap = {};
    const allKeys = [];

    glossary.forEach(term => {
        term.keys.forEach(key => {
            termMap[key.toLowerCase()] = term.id;
            allKeys.push(key);
        });
    });

    // Sort keys by length descending to match longest terms first
    allKeys.sort((a, b) => b.length - a.length);

    // Create a regex to match any of the glossary keys, case-insensitive
    const regexStr = allKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexStr})`, 'gi');

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                const lowerPart = part?.toLowerCase();
                if (lowerPart && termMap[lowerPart]) {
                    return (
                        <span
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent parent clicks if any
                                onTermClick(termMap[lowerPart]);
                            }}
                            style={{
                                color: 'var(--accent-primary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                borderBottom: '2px dotted var(--accent-light)',
                                paddingBottom: '1px',
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--accent-hover)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--accent-primary)'}
                        >
                            {part}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
