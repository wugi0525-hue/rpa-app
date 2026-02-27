import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth';
import { Activity, Copy, Mail, Lock, User, UserPlus, FileSignature } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../i18n/translations';
import LanguageSelector from '../components/LanguageSelector';

export default function Login({ onLogin }) {
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);

    // Email Auth States
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [authError, setAuthError] = useState('');

    // Get current language context
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => {
        // 인앱 브라우저 체크 및 강제 탈출 로직
        const userAgent = navigator.userAgent.toLowerCase();
        const isKakao = userAgent.match(/kakaotalk/i);
        const isLine = userAgent.match(/line/i);
        const isInApp = userAgent.match(/kakaotalk|line|inapp|naver|snapchat|instagram|facebook|everytime/i);

        if (isInApp) {
            setIsInAppBrowser(true);

            const targetUrl = window.location.href;
            if (isKakao) {
                // 카카오톡 외부 브라우저 호출 인텐트
                window.location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(targetUrl);
            } else if (isLine) {
                // 라인 외부 브라우저 호출 파라미터
                window.location.href = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'openExternalBrowser=1';
            }
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setTimeout(() => {
                setLoading(false);
                if (user) {
                    onLogin(user);
                }
            }, 600);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        setIsAuthLoading(true);
        setAuthError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle the onLogin
        } catch (error) {
            console.error("Login Error:", error);
            if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                setAuthError(error.message);
            }
            setIsAuthLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsAuthLoading(true);
        setAuthError('');
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Guest Login Error:", error);
            setAuthError(language === 'ko' ? '게스트 로그인에 실패했습니다.' : 'Guest login failed.');
            setIsAuthLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsAuthLoading(true);
        setAuthError('');

        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    throw new Error(language === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.');
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (displayName) {
                    await updateProfile(userCredential.user, { displayName });
                }
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error("Email Auth Error:", error);
            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') errorMessage = language === 'ko' ? '이미 사용 중인 이메일입니다.' : 'Email already in use.';
            if (error.code === 'auth/invalid-credential') errorMessage = language === 'ko' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : 'Invalid email or password.';
            setAuthError(errorMessage);
            setIsAuthLoading(false);
        }
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert(t.dash_check || "URL copied! Please open in external browser like Chrome or Safari."))
            .catch(() => alert("Failed to copy URL."));
    };

    const forceExternalBrowser = () => {
        const targetUrl = window.location.href;
        window.location.href = 'intent://' + targetUrl.replace(/https?:\/\//i, '') + '#Intent;scheme=https;package=com.android.chrome;end';
    };

    if (loading) {
        return (
            <div className="stealth-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(217, 119, 87, 0.1)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }}></div>
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
            backgroundColor: 'var(--bg-primary)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
                <LanguageSelector />
            </div>

            <div style={{ zIndex: 10, textAlign: 'center', color: 'var(--text-primary)' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-warm)' }}>
                    <Activity size={40} color="var(--accent-primary)" />
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>RPA Insight</h1>

                <div style={{ margin: '40px auto', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '22px', fontWeight: '300', fontStyle: 'italic', lineHeight: '1.5' }}>
                        "What you measure is what you get.<br />Walk the floor, see the truth."
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>- Lean Manufacturing Principles</p>
                </div>

                <button
                    onClick={() => setShowAuthModal(true)}
                    className="btn-primary"
                    style={{ marginTop: '40px', padding: '16px 40px', borderRadius: '12px', boxShadow: 'var(--shadow-warm)' }}
                >
                    Start
                </button>

                <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Intelligent Plant Assessment Platform
                </p>
            </div>

            {showAuthModal && (
                <div className="modal-backdrop" onClick={(e) => {
                    if (e.target === e.currentTarget && !isAuthLoading) setShowAuthModal(false);
                }}>
                    <div className="login-modal-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                        {isAuthLoading ? (
                            <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'relative', width: '60px', height: '60px', marginBottom: '16px' }}>
                                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(15, 88, 189, 0.1)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }}></div>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Authenticating...</p>
                            </div>
                        ) : (
                            <>
                                {/* Tabs */}
                                <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)' }}>
                                    <button
                                        onClick={() => { setIsSignUp(false); setAuthError(''); }}
                                        style={{
                                            flex: 1, padding: '16px', background: 'none', border: 'none', cursor: 'pointer',
                                            color: !isSignUp ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            fontWeight: !isSignUp ? 'bold' : 'normal',
                                            borderBottom: !isSignUp ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                            transition: 'all 0.2s', fontSize: '15px'
                                        }}
                                    >
                                        {language === 'ko' ? '로그인' : 'Sign In'}
                                    </button>
                                    <button
                                        onClick={() => { setIsSignUp(true); setAuthError(''); }}
                                        style={{
                                            flex: 1, padding: '16px', background: 'none', border: 'none', cursor: 'pointer',
                                            color: isSignUp ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            fontWeight: isSignUp ? 'bold' : 'normal',
                                            borderBottom: isSignUp ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                            transition: 'all 0.2s', fontSize: '15px'
                                        }}
                                    >
                                        {language === 'ko' ? '회원가입' : 'Sign Up'}
                                    </button>
                                </div>

                                <div style={{ padding: '24px' }}>
                                    {isInAppBrowser && (
                                        <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: 'rgba(245, 101, 101, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                                            <p style={{ fontSize: '13px', color: 'var(--danger)', marginBottom: '12px', lineHeight: '1.4' }}>
                                                <strong>⚠️ 인앱 브라우저에서는 구글 로그인이 차단될 수 있습니다.</strong><br />
                                                안전한 이용을 위해 기본 브라우저(크롬, 사파리 등)로 열어주세요.
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={forceExternalBrowser} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    외부 브라우저 열기 (안드로이드)
                                                </button>
                                                <button onClick={copyUrl} style={{ flex: 1, padding: '8px', backgroundColor: 'white', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    <Copy size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> 주소 복사
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {authError && (
                                        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(245, 101, 101, 0.1)', color: 'var(--danger)', borderRadius: '8px', fontSize: '13px', textAlign: 'center' }}>
                                            {authError}
                                        </div>
                                    )}

                                    <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {isSignUp && (
                                            <div className="animate-slide-up-fade">
                                                <div style={{ position: 'relative' }}>
                                                    <FileSignature size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                                    <input
                                                        type="text"
                                                        placeholder={language === 'ko' ? '이름 또는 소속 (선택)' : 'Name or Company (Optional)'}
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                        style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '16px', color: 'var(--text-primary)', outline: 'none' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ position: 'relative' }}>
                                                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '16px', color: 'var(--text-primary)', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    minLength="6"
                                                    style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '16px', color: 'var(--text-primary)', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        {isSignUp && (
                                            <div className="animate-slide-up-fade">
                                                <div style={{ position: 'relative' }}>
                                                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                                    <input
                                                        type="password"
                                                        placeholder={language === 'ko' ? '비밀번호 확인' : 'Confirm Password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        minLength="6"
                                                        style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '16px', color: 'var(--text-primary)', outline: 'none' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            style={{ marginTop: '8px', backgroundColor: 'var(--accent-primary)', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-warm)' }}
                                        >
                                            {isSignUp ? (language === 'ko' ? '회원가입 하기' : 'Sign Up') : (language === 'ko' ? '로그인' : 'Sign In')}
                                        </button>
                                    </form>

                                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                                    </div>

                                    <button
                                        onClick={handleGoogleLogin}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-warm)' }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google 로그인
                                    </button>

                                    <button
                                        onClick={handleGuestLogin}
                                        style={{ marginTop: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        <User size={18} />
                                        {language === 'ko' ? '게스트로 둘러보기' : 'Continue as Guest'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
