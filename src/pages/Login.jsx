import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Activity, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import LanguageSelector from '../components/LanguageSelector';

export default function Login({ onLogin }) {
    const [loading, setLoading] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    // Get current language context
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Add a slight delay just to show the pretty loader
            setTimeout(() => {
                setLoading(false);
                if (user) {
                    onLogin(user);
                }
            }, 600);
        });
        return () => unsubscribe();
    }, [onLogin]);

    const executeLogin = async () => {
        setShowTerms(false);
        setIsAuthLoading(true);

        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Login Error:", error);
            alert(`Authentication failed (${error.code || error.message})`);
            setIsAuthLoading(false);
        }
    };

    if (loading || isAuthLoading) {
        return (
            <div className="stealth-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(37, 99, 235, 0.1)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }}></div>
                    <Activity size={32} color="var(--accent-primary)" />
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="stealth-layout" style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '32px',
            backgroundColor: '#111827',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
                <LanguageSelector />
            </div>

            <div style={{ zIndex: 10, textAlign: 'center', color: 'white' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '24px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Activity size={40} color="white" />
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>RPA Insight</h1>

                <div style={{ margin: '40px auto', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '22px', fontWeight: '300', fontStyle: 'italic', lineHeight: '1.5' }}>
                        "What you measure is what you get.<br />Walk the floor, see the truth."
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>- Lean Manufacturing Principles</p>
                </div>

                <button
                    onClick={() => setShowTerms(true)}
                    style={{ marginTop: '40px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '30px', fontWeight: '700', fontSize: '18px', boxShadow: '0 8px 24px rgba(217, 119, 87, 0.4)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                    Start
                </button>

                <p style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    Intelligent Plant Assessment Platform
                </p>
            </div>

            {/* Terms and Conditions Modal */}
            {showTerms && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '80vh', boxShadow: 'var(--shadow-warm)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>Terms of Service & Data Consent</h2>
                        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', border: '1px solid var(--glass-border)' }}>
                            <p style={{ marginBottom: '12px' }}><strong>1. Terms of Service & Privacy Policy</strong></p>
                            <p style={{ marginBottom: '12px' }}>By using this "Rapid Field Inspector" (the App), you agree to these Terms of Use. The App is designed for industrial facility audits.</p>
                            <p style={{ marginBottom: '12px', color: 'var(--text-primary)' }}><strong>2. Data Collection & B2B Analysis (Important)</strong></p>
                            <p style={{ marginBottom: '12px' }}>By proceeding, you acknowledge and agree that <strong style={{ color: 'var(--danger)' }}>any facility data, audit scores, specific observations, and geographical context collected through this App may be securely stored, analyzed, and aggregated by our servers.</strong></p>
                            <p style={{ marginBottom: '12px' }}>This information is utilized not only for your personal record-keeping but also to enhance our global manufacturing database. <strong style={{ color: 'var(--text-primary)' }}>We reserve the right to anonymously utilize this data to identify hidden high-performance manufacturers and facilitate future B2B matchmaking and supply chain consulting services.</strong></p>
                            <p>By clicking "Accept", you grant us a non-exclusive license to use the inputted assessment data for the stated analytical and commercial purposes.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowTerms(false)} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>
                                Cancel
                            </button>
                            <button onClick={executeLogin} style={{ flex: 1, backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>
                                Accept & Start
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
