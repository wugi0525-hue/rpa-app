import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = true }) {
    const containerStyle = fullScreen ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-main)'
    } : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        height: '100%'
    };

    return (
        <div style={containerStyle}>
            {/* Sleek animated visual replacement for 'Loading...' text */}
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    border: '4px solid var(--glass-border)',
                    borderRadius: '50%',
                    opacity: 0.3
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    border: '4px solid transparent',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '12px', left: '12px', right: '12px', bottom: '12px',
                    border: '4px solid transparent',
                    borderBottomColor: 'var(--accent-secondary, #60a5fa)',
                    borderRadius: '50%',
                    animation: 'spin 1.5s cubic-bezier(0.2, 0.4, 0.8, 0.6) infinite reverse'
                }}></div>
            </div>

            {/* Added a subtle skeleton-like bar to replace text visually */}
            <div style={{
                marginTop: '32px',
                width: '120px',
                height: '6px',
                backgroundColor: 'var(--glass-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    height: '100%',
                    width: '40%',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '8px',
                    animation: 'shimmer 1.5s infinite ease-in-out',
                    transform: 'translateX(-100%)'
                }}></div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(350%); }
                }
            `}</style>
        </div>
    );
}
