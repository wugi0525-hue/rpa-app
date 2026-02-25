import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function GlossaryModal({ term, isOpen, onClose, language }) {
    // Prevent body scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    if (!isOpen || !term) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(45, 55, 72, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'var(--bg-secondary)',
                    position: 'relative',
                    boxShadow: '0 24px 64px rgba(45, 55, 72, 0.15)',
                    animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: '32px 24px'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '50%',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <X size={20} />
                </button>
                <h3 className="title-large" style={{ color: 'var(--accent-primary)', marginBottom: '16px', paddingRight: '24px', fontSize: '22px' }}>
                    {term.title[language] || term.title.en}
                </h3>
                <p className="text-medium" style={{ lineHeight: '1.7', color: 'var(--text-primary)', wordBreak: 'keep-all' }}>
                    {term.desc[language] || term.desc.en}
                </p>
            </div>
            <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
