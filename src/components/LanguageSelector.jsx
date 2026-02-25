import React from 'react';
import { useLanguage } from '../LanguageContext';

export default function LanguageSelector() {
    const { language, changeLanguage } = useLanguage();

    return (
        <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '6px 12px',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: 'var(--shadow-warm)'
            }}
        >
            <option value="en">Eng</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
            <option value="th">ไทย</option>
        </select>
    );
}
