import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { onAuthStateChanged, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { Activity, ChevronRight, Mail } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import LanguageSelector from '../components/LanguageSelector';

export default function Login({ onLogin }) {
    const [loading, setLoading] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    // Get current language context
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAcceptTerms = () => {
        setShowTerms(false);
        setShowLoginOptions(true);
    };

    const executeGuestLogin = async () => {
        setShowLoginOptions(false);
        setIsAuthLoading(true);

        try {
            if (auth.currentUser && auth.currentUser.isAnonymous) {
                onLogin(auth.currentUser);
            } else {
                const result = await signInAnonymously(auth);
                onLogin(result.user);
            }
        } catch (error) {
            console.error("Guest Login Error:", error);
            alert(`Guest Authentication failed (${error.code || error.message})`);
            setIsAuthLoading(false);
        }
    };

    const executeGoogleLogin = async () => {
        setShowLoginOptions(false);
        setIsAuthLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            onLogin(result.user);
        } catch (error) {
            console.error("Google Login Error:", error);
            if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                alert(`Google Authentication failed (${error.code || error.message})`);
            }
            setIsAuthLoading(false);
            setShowLoginOptions(true); // Return to options if failed/cancelled
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
                            <button onClick={handleAcceptTerms} style={{ flex: 1, backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Options Modal */}
            {showLoginOptions && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '8px' }}>Sign In</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>Choose how you want to access the platform</p>

                        <button
                            onClick={executeGoogleLogin}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'white', color: '#333', border: '1px solid #ddd', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                            <span style={{ padding: '0 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                        </div>

                        <button
                            onClick={executeGuestLogin}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            <Activity size={20} color="var(--accent-primary)" />
                            Continue as Guest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
