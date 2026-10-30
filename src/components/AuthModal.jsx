import React, { useState, useEffect } from 'react';
import { ChevronLeft, Smartphone, Lock, Eye, EyeOff, User, Mail, RefreshCw, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  // Modes: 'login' | 'signup' | 'otp_verify' | 'profile_setup'
  const [mode, setMode] = useState('login');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState(
    currentProfile?.phone ? currentProfile.phone.replace('+91', '').trim() : ''
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(
    currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : ''
  );
  const [emailAddress, setEmailAddress] = useState(currentProfile?.email || '');

  // OTP flow states
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpTimer, setOtpTimer] = useState(30);

  // Profile setup states
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

  // Countdown timer for OTP
  useEffect(() => {
    let timer = null;
    if (mode === 'otp_verify' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, otpTimer]);

  if (!isOpen) return null;

  // 1. Password Login
  const handlePasswordLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें (न्यूनतम 4 अक्षर)।' : 'Please enter your password (minimum 4 chars).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'VEE Aspirant'),
        phone: `+91 ${clean}`,
        state,
        goal,
        qual,
        category
      });
    }, 450);
  };

  // 2. Sign Up Submit
  const handleSignUpSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'कृपया पासवर्ड बनाएं (न्यूनतम 4 अक्षर)।' : 'Please enter a password (min 4 chars).');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isHi ? 'पासवर्ड और कन्फर्म पासवर्ड मैच नहीं हो रहे।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: fullName.trim(),
        phone: `+91 ${clean}`,
        email: emailAddress.trim() || '',
        state,
        goal,
        qual,
        category
      });
    }, 450);
  };

  // 3. Fast 1-Click Auto OTP Login (User's Favorite Feature)
  const handleInstantAutoOtpLogin = () => {
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया पहले 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter 10-digit mobile number first.');
      return;
    }

    setIsLoading(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtp(code);
    setSuccessMsg(isHi ? `⚡ OTP: ${code} - ऑटो सत्यापित हो रहा है...` : `⚡ OTP: ${code} - Auto verifying...`);

    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'VEE Aspirant'),
        phone: `+91 ${clean}`,
        state,
        goal,
        qual,
        category
      });
    }, 600);
  };

  // 4. Send Manual OTP flow
  const handleSendManualOtp = () => {
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpTimer(30);
      setMode('otp_verify');
      setSuccessMsg(isHi ? `OTP कोड भेजा गया: ${code}` : `OTP Code sent: ${code}`);
    }, 400);
  };

  // 5. Verify OTP Submit
  const handleVerifyOtpSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!otp || otp.trim().length < 4) {
      setErrorMsg(isHi ? 'कृपया 4 अंकों का OTP कोड दर्ज करें।' : 'Please enter 4-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'VEE Aspirant'),
        phone: `+91 ${phoneNumber}`,
        state,
        goal,
        qual,
        category
      });
    }, 400);
  };

  // 6. Google Sign-In
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const name = fullName || (currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'Pawan Meena');
      finishAuth({
        name,
        email: 'pkmeena988796@gmail.com',
        phone: phoneNumber ? `+91 ${phoneNumber}` : '+91 9887960000',
        state,
        goal,
        qual,
        category
      });
    }, 400);
  };

  // 7. Apple Sign-In
  const handleAppleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishAuth({
        name: fullName || 'Apple User',
        email: 'user@icloud.com',
        phone: phoneNumber ? `+91 ${phoneNumber}` : '+91 9887960000',
        state,
        goal,
        qual,
        category
      });
    }, 400);
  };

  // 8. Profile Setup
  const handleProfileSetup = (e) => {
    if (e) e.preventDefault();
    finishAuth({
      name: fullName.trim() || 'VEE Aspirant',
      phone: phoneNumber ? `+91 ${phoneNumber}` : '+91 9887960000',
      email: emailAddress || '',
      state,
      goal,
      qual,
      category
    });
  };

  const finishAuth = (userData) => {
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.55 } });
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

  // Master 3D VEE Logo with Graduation Cap & Animated Elements
  const renderLogoHero = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 24px' }}>
      <div style={{ position: 'relative', width: '180px', height: '96px', display: 'flex', justifyContent: 'center' }}>
        <svg width="180" height="96" viewBox="0 0 180 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Rich 3D Royal Blue Gradient for VEE Letters */}
            <linearGradient id="veeBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#1D64F2" />
              <stop offset="70%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Cyan Bevel Highlight */}
            <linearGradient id="veeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.1" />
            </linearGradient>

            {/* Glowing Golden Tassel Gradient */}
            <linearGradient id="goldTasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Subtle Drop Shadow */}
            <filter id="veeDropShadow" x="-10%" y="-10%" width="125%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#1E3A8A" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Ambient Glow */}
          <ellipse cx="90" cy="54" rx="72" ry="24" fill="#EFF6FF" />

          {/* 3D VEE Letters (Slanted & Bold matching Image 8) */}
          <g filter="url(#veeDropShadow)" className="vee-floating-letters">
            {/* 'V' with proud wide base */}
            <path
              d="M16 38 L34 84 L50 84 L68 38 L51 38 L42 66 L33 38 Z"
              fill="url(#veeBrandGrad)"
            />
            {/* Bevel highlight on V */}
            <path d="M16 38 L34 84 L38 84 L22 38 Z" fill="url(#veeBevel)" opacity="0.4" />

            {/* First 'E' */}
            <path
              d="M72 38 L108 38 L108 47 L84 47 L84 56 L104 56 L104 64 L84 64 L84 75 L109 75 L109 84 L72 84 Z"
              fill="url(#veeBrandGrad)"
            />

            {/* Second 'E' */}
            <path
              d="M114 38 L150 38 L150 47 L126 47 L126 56 L146 56 L146 64 L126 64 L126 75 L151 75 L151 84 L114 84 Z"
              fill="url(#veeBrandGrad)"
            />
          </g>

          {/* Graduation Cap Sitting Center-Top on VEE */}
          <g className="vee-floating-cap">
            {/* Diamond Mortarboard Top */}
            <path d="M90 12 L144 28 L90 44 L36 28 Z" fill="#0F172A" stroke="#1D4ED8" strokeWidth="1.5" />
            {/* Skull Cap Underneath */}
            <path d="M62 36 L62 50 C62 56, 118 56, 118 50 L118 36 Z" fill="#1E293B" />
            {/* Golden Button on Top */}
            <circle cx="90" cy="28" r="3.5" fill="#F59E0B" />

            {/* Animated Swaying Golden Tassel */}
            <g className="vee-swaying-tassel">
              <path d="M90 28 C98 32, 102 42, 105 54" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <rect x="102" y="53" width="6" height="9" rx="2" fill="url(#goldTasselGrad)" />
            </g>
          </g>
        </svg>
      </div>

      <h1
        style={{
          fontSize: '25px',
          fontWeight: '800',
          color: '#0F172A',
          margin: '4px 0 2px',
          letterSpacing: '-0.4px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        Vacancy Era Education
      </h1>

      <p
        style={{
          fontSize: '14.5px',
          fontWeight: '500',
          color: '#64748B',
          margin: 0,
          textAlign: 'center'
        }}
      >
        {mode === 'signup'
          ? (isHi ? 'नया खाता बनाएं' : 'Create your account')
          : mode === 'otp_verify'
          ? (isHi ? 'OTP सत्यापन करें' : 'Verify Mobile OTP')
          : mode === 'profile_setup'
          ? (isHi ? 'अपनी प्रोफाइल सेट करें' : 'Setup your Career Profile')
          : (isHi ? 'Login to your account' : 'Login to your account')}
      </p>
    </div>
  );

  return (
    <div
      className="vee-native-auth-screen"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#FFFFFF',
        zIndex: 99999,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px env(safe-area-inset-bottom, 24px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Master 430px Mobile Container (100% Full-Screen Experience on Phones) */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: 'calc(100vh - 36px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* ===================================================================
            TOP NAVIGATION BAR: [< Back Arrow] on Left, [Sign Up / Log In] on Right
            =================================================================== */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '44px',
              marginBottom: '4px'
            }}
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={mode === 'otp_verify' || mode === 'signup' ? () => setMode('login') : onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#0F172A',
                marginLeft: '-6px'
              }}
              title={isHi ? 'वापस जाएं' : 'Go back'}
            >
              <ChevronLeft size={28} strokeWidth={2.4} />
            </button>

            {/* Top Right Switcher */}
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
                  color: '#1D64F2',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '6px 8px'
                }}
              >
                Sign Up
              </button>
            ) : mode === 'signup' ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D64F2',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '6px 8px'
                }}
              >
                Log In
              </button>
            ) : null}
          </div>

          {/* 3D VEE Logo & Header */}
          {renderLogoHero()}

          {/* Feedback Messages */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              ✅ {successMsg}
            </div>
          )}

          {/* ===================================================================
              PAGE 1: LOGIN (EXACT 100% MATCH WITH REFERENCE IMAGE 8)
              =================================================================== */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 1. Mobile Number Input Box */}
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
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                >
                  <Smartphone size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748B', marginRight: '6px' }}>+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Mobile Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#0F172A'
                    }}
                    autoFocus
                  />
                </div>

                {/* 2. Password Input Box with Eye Toggle */}
                <div
                  style={{
                    height: '52px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    marginBottom: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  <Lock size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#0F172A'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* Forgot Password Link on Right */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
                  <button
                    type="button"
                    onClick={handleSendManualOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1D64F2',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '2px 0'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Royal Blue Button: Log In */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1D64F2 0%, #2563EB 100%)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(29, 100, 242, 0.32)',
                    transition: 'all 0.2s',
                    marginBottom: '10px'
                  }}
                >
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Log In'}
                </button>

                {/* 1-Click Fast Auto OTP Login (User Requested Feature) */}
                <button
                  type="button"
                  onClick={handleInstantAutoOtpLogin}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC',
                    color: '#15803D',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Zap size={16} color="#16A34A" />
                  <span>{isHi ? '⚡ बिना पासवर्ड 1-क्लिक ऑटो OTP लॉगिन' : '⚡ 1-Click Auto OTP Login (No Password)'}</span>
                </button>
              </form>

              {/* OR Divider Line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '20px 0',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.6px' }}>
                  OR
                </span>
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
                  cursor: 'pointer',
                  marginBottom: '10px'
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
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.08 1.01-2.57.81-4.06-1.1.05-2.43.74-3.13 1.57-.6.7-1.13 1.83-.93 3.27 1.22.09 2.65-.7 3.25-.78z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>
          )}

          {/* ===================================================================
              PAGE 2: SIGN UP (CREATE YOUR ACCOUNT)
              =================================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Full Name */}
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
                <User size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
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
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                  autoFocus
                />
              </div>

              {/* Mobile Number */}
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
                <Smartphone size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748B', marginRight: '6px' }}>+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Email (Optional) */}
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
                <Mail size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Password */}
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
                <Lock size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {/* Confirm Password */}
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
                <Lock size={20} color="#64748B" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Sign Up Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1D64F2 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(29, 100, 242, 0.32)',
                  marginTop: '4px'
                }}
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Sign Up'}
              </button>
            </form>
          )}

          {/* ===================================================================
              PAGE 3: OTP VERIFICATION
              =================================================================== */}
          {mode === 'otp_verify' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 6px' }}>
                  {isHi ? `हमारा 4-अंकों का OTP कोड +91 ${phoneNumber} पर भेजा गया है` : `4-digit verification code sent to +91 ${phoneNumber}`}
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1D64F2',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isHi ? 'नंबर बदलें (Edit Number)' : 'Edit Phone Number'}
                </button>
              </div>

              {/* 1-Click Fast Verification Banner */}
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534', display: 'block' }}>
                    {isHi ? `OTP कोड: ${generatedOtp}` : `Instant OTP: ${generatedOtp}`}
                  </span>
                  <span style={{ fontSize: '11px', color: '#15803D' }}>
                    {isHi ? '1-क्लिक में तुरंत लॉगिन करें' : '1-Tap to auto-fill & login'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleInstantAutoOtpLogin}
                  style={{
                    background: '#16A34A',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '12px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isHi ? 'ऑटो लॉगिन ⚡' : 'Auto Login ⚡'}
                </button>
              </div>

              {/* Manual OTP Form */}
              <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    background: '#F8FAFC',
                    fontSize: '22px',
                    fontWeight: '900',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    outline: 'none',
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    background: otp.length === 4 ? '#1D64F2' : '#94A3B8',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: otp.length === 4 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (isHi ? 'सत्यापित करें और प्रवेश करें' : 'Verify & Continue')}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                {otpTimer > 0 ? (
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {isHi ? `दुबारा OTP भेजें ${otpTimer}s में` : `Resend code in ${otpTimer}s`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendManualOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1D64F2',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 {isHi ? 'नया OTP कोड भेजें' : 'Resend New OTP Code'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 4: PROFILE SETUP (STATE & GOAL)
              =================================================================== */}
          {mode === 'profile_setup' && (
            <form onSubmit={handleProfileSetup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
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
                    height: '48px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    padding: '0 14px',
                    fontSize: '14.5px',
                    fontWeight: '600',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isHi ? 'गृह राज्य (State):' : 'Home State:'}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    padding: '0 12px',
                    fontSize: '14px',
                    fontWeight: '600',
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
                  <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                  <option value="Gujarat">Gujarat (गुजरात)</option>
                  <option value="All India">All India / Central (अखिल भारतीय)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isHi ? 'लक्षित भर्ती परीक्षा (Goal):' : 'Target Exam Goal:'}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    padding: '0 12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Railway ALP & Technician (RRB 2026)">🚆 Railway ALP & Technician (RRB 2026)</option>
                  <option value="Railway Group D & NTPC 2026">🚆 Railway Group D & NTPC 2026</option>
                  <option value="SSC GD Constable 2026">👮 SSC GD Constable (39,481 Posts)</option>
                  <option value="Police Constable / Sub-Inspector">🚨 Police Constable & Sub-Inspector</option>
                  <option value="ITI Fitter / Electrician / Apprentice">⚡ ITI Trade & Railway Apprentice</option>
                  <option value="Indian Army / Navy / Air Force">🪖 Defence (Army / Navy / Agniveer)</option>
                  <option value="Banking (SBI / IBPS / PO / Clerk)">🏦 Banking (SBI / IBPS PO & Clerk)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1D64F2 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '6px'
                }}
              >
                {isHi ? 'शुरू करें और नौकरियां देखें 🚀' : 'Start Preparation 🚀'}
              </button>
            </form>
          )}
        </div>

        {/* ===================================================================
            FOOTER: [Don't have an account? Sign Up] + [Guest Mode Link]
            =================================================================== */}
        <div style={{ marginTop: '24px', paddingBottom: '8px', textAlign: 'center' }}>
          {mode === 'login' ? (
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 10px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('signup');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D64F2',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign Up
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 10px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D64F2',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Log In
              </button>
            </p>
          ) : null}

          {/* Guest Mode Link */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '6px 12px'
            }}
          >
            {isHi ? 'बिना लॉगिन देखे आगे बढ़ें (Guest Mode) →' : 'Explore Jobs as Guest →'}
          </button>
        </div>
      </div>
    </div>
  );
}
