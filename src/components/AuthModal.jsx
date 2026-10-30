import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Eye, EyeOff, User, Mail, Smartphone, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  // Modes: 'login' (Image 2) | 'signup' | 'forgot_password' | 'profile_setup'
  const [mode, setMode] = useState('login');

  // Login Form States
  const [loginPhone, setLoginPhone] = useState(currentProfile?.phone ? currentProfile.phone.replace('+91', '').trim() : '');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form States
  const [fullName, setFullName] = useState(currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : '');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState(currentProfile?.email || '');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Setup States (Post-signup)
  const [state, setState] = useState(currentProfile?.state || 'Rajasthan');
  const [goal, setGoal] = useState(currentProfile?.goal || 'Railway ALP & Technician (RRB 2026)');
  const [qual, setQual] = useState(currentProfile?.qual || 'ITI Pass');
  const [category, setCategory] = useState(currentProfile?.category || 'OBC');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isHi = currentLang === 'hi';

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      if (currentProfile && currentProfile.isLoggedIn) {
        setMode('profile_setup');
      } else {
        setMode('login');
      }
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  // 1. Handle Login Submit (Image 2)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'VEE Aspirant',
        phone: `+91 ${cleanPhone}`,
        state: currentProfile?.state || 'Rajasthan',
        goal: currentProfile?.goal || 'Railway ALP & Technician (RRB 2026)',
        qual: currentProfile?.qual || 'ITI Pass',
        category: currentProfile?.category || 'OBC'
      });
    }, 450);
  };

  // 2. Handle Sign Up Submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMsg(isHi ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg(isHi ? 'पासवर्ड और कन्फर्म पासवर्ड मैच नहीं हो रहे हैं।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('profile_setup');
    }, 450);
  };

  // 3. Social Login: Google 1-Tap
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const name = fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'Pawan Meena');
      finishAuth({
        name,
        email: 'pkmeena988796@gmail.com',
        phone: loginPhone ? `+91 ${loginPhone}` : '+91 9887960000',
        state,
        goal,
        qual,
        category
      });
    }, 450);
  };

  // 4. Social Login: Apple 1-Tap
  const handleAppleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const name = fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'Apple User');
      finishAuth({
        name,
        email: 'user@apple.com',
        phone: loginPhone ? `+91 ${loginPhone}` : '+91 9887960000',
        state,
        goal,
        qual,
        category
      });
    }, 450);
  };

  // 5. Complete Profile Setup & Finish
  const handleProfileSetupSubmit = (e) => {
    e.preventDefault();
    finishAuth({
      name: fullName.trim() || 'VEE Aspirant',
      phone: signupPhone ? `+91 ${signupPhone}` : (loginPhone ? `+91 ${loginPhone}` : '+91 9887960000'),
      email: signupEmail || '',
      state,
      goal,
      qual,
      category
    });
  };

  const finishAuth = (userData) => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    const updated = {
      ...currentProfile,
      ...userData,
      isLoggedIn: true,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem('vee_user_profile', JSON.stringify(updated));
    onLoginSuccess(updated);
  };

  // Render VEE Logo with Graduation Cap exactly like Image 2
  const renderVeeBrandLogo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '22px' }}>
      <svg width="150" height="88" viewBox="0 0 150 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Navy Blue Graduation Cap (Mortarboard) */}
        <path d="M75 14 L122 28 L75 42 L28 28 Z" fill="#1E3A8A" stroke="#1D4ED8" strokeWidth="1" />
        <path d="M52 38 L52 50 C52 55, 98 55, 98 50 L98 38 Z" fill="#1E3A8A" />
        {/* Golden Button & Tassel */}
        <circle cx="75" cy="28" r="2.5" fill="#F59E0B" />
        <path d="M75 28 C82 32, 86 40, 87 50" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="85" y="50" width="4" height="7" rx="1.5" fill="#F59E0B" />

        {/* 3D Bold "VEE" Typography */}
        <defs>
          <linearGradient id="veeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <filter id="veeDrop" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E3A8A" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#veeDrop)">
          {/* 'V' */}
          <path d="M12 38 L26 78 L38 78 L52 38 L38 38 L32 62 L26 38 Z" fill="url(#veeGrad)" />
          {/* First 'E' */}
          <path d="M57 38 L93 38 L93 47 L69 47 L69 54 L89 54 L89 62 L69 62 L69 69 L94 69 L94 78 L57 78 Z" fill="url(#veeGrad)" />
          {/* Second 'E' */}
          <path d="M99 38 L135 38 L135 47 L111 47 L111 54 L131 54 L131 62 L111 62 L111 69 L136 69 L136 78 L99 78 Z" fill="url(#veeGrad)" />
        </g>
      </svg>

      <h1
        style={{
          fontSize: '22px',
          fontWeight: '900',
          color: '#0F172A',
          margin: '2px 0 3px',
          letterSpacing: '-0.3px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        Vacancy Era Education
      </h1>
      <p
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#64748B',
          margin: 0,
          textAlign: 'center'
        }}
      >
        {mode === 'login' && 'Login to your account'}
        {mode === 'signup' && 'Create your account'}
        {mode === 'forgot_password' && 'Reset your password'}
        {mode === 'profile_setup' && 'Complete your profile'}
      </p>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 22px 32px',
          boxSizing: 'border-box'
        }}
      >
        {/* ===================================================================
            TOP NAVIGATION BAR (Left: Back Arrow, Right: Mode Toggle)
            =================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '44px',
            marginBottom: '10px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (mode === 'signup' || mode === 'forgot_password') setMode('login');
              else onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
          </button>

          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setMode('signup');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '6px 8px'
              }}
            >
              Sign Up
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setMode('login');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '6px 8px'
              }}
            >
              Log In
            </button>
          )}
        </div>

        {/* Brand VEE Logo & Header */}
        {renderVeeBrandLogo()}

        {/* Error Notification Pill */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '12.5px',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Success Notification Pill */}
        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#15803D',
              fontSize: '12.5px',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        {/* ===================================================================
            SCREEN 1: LOGIN (EXACT MATCH TO USER'S IMAGE 2)
            =================================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 1. Mobile Number Box */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '14px',
                boxSizing: 'border-box'
              }}
            >
              <Smartphone size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Mobile Number"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
            </div>

            {/* 2. Password Box with Eye Toggle */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                boxSizing: 'border-box'
              }}
            >
              <Lock size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type={showLoginPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginTop: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('forgot_password');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Log In Button (Exact Blue Height 52px) */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.28)',
                transition: 'opacity 0.2s'
              }}
            >
              {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Log In'}
            </button>

            {/* OR Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '22px 0',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '14.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Continue with Apple */}
            <button
              type="button"
              onClick={handleAppleSignIn}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '14.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.82 1.13-1.96.99-3.12-1.04.05-2.29.7-3.02 1.55-.64.74-1.2 1.9-1.03 3.03 1.16.09 2.37-.62 3.06-1.46z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Bottom: Don't have an account? Sign Up */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ fontSize: '13.5px', color: '#64748B' }}>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('signup');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Guest Mode Link */}
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {isHi ? 'बिना लॉगिन देखे आगे बढ़ें (Guest Mode) →' : 'Explore Jobs as Guest →'}
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================
            SCREEN 2: SIGN UP (EXACT SISTER SCREEN WITH 5 INPUTS)
            =================================================================== */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 1. Full Name */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            >
              <User size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
            </div>

            {/* 2. Mobile Number */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            >
              <Smartphone size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Mobile Number"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
            </div>

            {/* 3. Email Address (Optional) */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            >
              <Mail size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
            </div>

            {/* 4. Password */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            >
              <Lock size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type={showSignupPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* 5. Confirm Password */}
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '20px',
                boxSizing: 'border-box'
              }}
            >
              <Lock size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.28)'
              }}
            >
              {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Sign Up'}
            </button>

            {/* OR Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '22px 0',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '14.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Continue with Apple */}
            <button
              type="button"
              onClick={handleAppleSignIn}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '14.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.82 1.13-1.96.99-3.12-1.04.05-2.29.7-3.02 1.55-.64.74-1.2 1.9-1.03 3.03 1.16.09 2.37-.62 3.06-1.46z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Bottom: Already have an account? Log In */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ fontSize: '13.5px', color: '#64748B' }}>Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================
            SCREEN 3: FORGOT PASSWORD
            =================================================================== */}
        {mode === 'forgot_password' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccessMsg(isHi ? 'पासवर्ड रीसेट लिंक आपके नंबर पर भेज दिया गया है।' : 'Password reset link sent to your registered mobile number.');
              setTimeout(() => setMode('login'), 2200);
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            >
              <Smartphone size={20} color="#64748B" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Registered Mobile Number"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Send Reset Code
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Log In
            </button>
          </form>
        )}

        {/* ===================================================================
            SCREEN 4: PROFILE SETUP (STATE & TARGET EXAM PERSONALIZATION)
            =================================================================== */}
        {mode === 'profile_setup' && (
          <form onSubmit={handleProfileSetupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                {isHi ? 'आपका पूरा नाम:' : 'Full Name:'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Pawan Meena"
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  padding: '0 16px',
                  fontSize: '15px',
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                {isHi ? 'आपका गृह राज्य (State):' : 'Your Home State / UT:'}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  padding: '0 14px',
                  fontSize: '14.5px',
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="Rajasthan">Desert Rajasthan (राजस्थान)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                <option value="Bihar">Bihar (बिहार)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                <option value="Delhi">Delhi NCR (दिल्ली)</option>
                <option value="Haryana">Haryana (हरियाणा)</option>
                <option value="Punjab">Punjab (पंजाब)</option>
                <option value="Jharkhand">Jharkhand (झारखंड)</option>
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Gujarat">Gujarat (गुजरात)</option>
                <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                <option value="Assam">Assam (असम)</option>
                <option value="All India">All India / Central (अखिल भारतीय)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                {isHi ? 'लक्षित भर्ती परीक्षा (Goal):' : 'Target Exam Goal:'}
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  padding: '0 14px',
                  fontSize: '14.5px',
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="Railway ALP & Technician (RRB 2026)">🚆 Railway ALP & Technician (RRB 2026)</option>
                <option value="Railway Group D & NTPC 2026">🚆 Railway Group D & NTPC 2026</option>
                <option value="SSC GD Constable 2026">👮 SSC GD Constable (39,481 Posts)</option>
                <option value="SSC CGL / CHSL / MTS">📝 SSC CGL / CHSL / MTS 2026</option>
                <option value="Police Constable / Sub-Inspector">🚨 Police Constable & Sub-Inspector</option>
                <option value="ITI Fitter / Electrician / Apprentice">⚡ ITI Trade & Railway Apprentice</option>
                <option value="Indian Army / Navy / Air Force">🪖 Defence (Army / Navy / Agniveer)</option>
                <option value="Banking (SBI / IBPS / PO / Clerk)">🏦 Banking (SBI / IBPS PO & Clerk)</option>
                <option value="Teaching (TET / CTET / BPSC Teacher)">👨‍🏫 Teaching & Education (Super TET)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                {isHi ? 'शैक्षणिक योग्यता (Qualification):' : 'Highest Qualification:'}
              </label>
              <select
                value={qual}
                onChange={(e) => setQual(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  padding: '0 14px',
                  fontSize: '14.5px',
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="10th Pass">10th Matric Pass</option>
                <option value="12th Pass">12th Intermediate Pass</option>
                <option value="ITI Pass">⚡ ITI Pass (NCVT / SCVT)</option>
                <option value="Diploma">🛠️ Polytechnic Diploma</option>
                <option value="Graduate">🏛️ Graduate (BA, B.Sc, B.Com)</option>
                <option value="B.Tech">💻 B.Tech / B.E (Engineering)</option>
                <option value="Post Graduate">🎓 Post Graduate (PG / Master)</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.28)'
              }}
            >
              {isHi ? 'शुरू करें और नौकरियां देखें 🚀' : 'Start Preparation & Explore Jobs 🚀'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
