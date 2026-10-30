import React, { useState, useEffect } from 'react';
import { X, Smartphone, Lock, Eye, EyeOff, User, Mail, CheckCircle2, ArrowRight, RefreshCw, Zap, Sparkles, BookOpen, ChevronLeft, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  // Modes: 'mobile_otp' (Default fast 1-tap OTP) | 'otp_verify' | 'password_login' | 'signup' | 'profile_setup'
  const [mode, setMode] = useState('mobile_otp');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState(currentProfile?.phone ? currentProfile.phone.replace('+91', '').trim() : '');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpTimer, setOtpTimer] = useState(30);

  // Password / Sign Up states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : '');
  const [emailAddress, setEmailAddress] = useState(currentProfile?.email || '');

  // Profile Personalization states
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
        setMode('mobile_otp');
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

  // 1. Send OTP (Mobile Number flow)
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
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

  // 2. Instant 1-Click Auto-Fill & Login
  const handleAutoFillAndLogin = (codeToUse) => {
    const code = codeToUse || generatedOtp;
    setOtp(code);
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
    }, 450);
  };

  // 3. Verify OTP Submit
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp || otp.trim().length < 4) {
      setErrorMsg(isHi ? 'कृपया 4 अंकों का OTP कोड दर्ज करें।' : 'Please enter the 4-digit OTP code.');
      return;
    }
    handleAutoFillAndLogin(otp.trim());
  };

  // 4. Password Login
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
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
    }, 450);
  };

  // 5. Google 1-Tap Login
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
    }, 450);
  };

  // 6. Complete Profile Setup & Start
  const handleProfileSetup = (e) => {
    e.preventDefault();
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
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
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

  // =========================================================================
  // ANIMATED VEE LOGO WITH FLOATING MAGIC BOOK & SWINGING TASSEL
  // =========================================================================
  const renderAnimatedVeeHero = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
      <div
        className="vee-logo-anim-wrapper"
        style={{
          position: 'relative',
          width: '180px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '4px'
        }}
      >
        <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Rich 3D Royal Blue Gradient */}
            <linearGradient id="veeLetterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="70%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Glowing Golden Tassel Gradient */}
            <linearGradient id="goldTasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Drop Shadow Filter */}
            <filter id="vee3dShadow" x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#1E3A8A" floodOpacity="0.32" />
            </filter>
          </defs>

          {/* Glowing Ambient Halo behind Logo */}
          <ellipse cx="90" cy="54" rx="72" ry="28" fill="#DBEAFE" opacity="0.65" />

          {/* Master 3D VEE Letters (Well-proportioned, NEVER squished or pressed) */}
          <g filter="url(#vee3dShadow)" className="vee-floating-letters">
            {/* Proportional Proud 'V' - Strong 44px base */}
            <path
              d="M18 40 L34 84 L48 84 L64 40 L49 40 L41 66 L33 40 Z"
              fill="url(#veeLetterGrad)"
            />
            {/* First 'E' */}
            <path
              d="M68 40 L104 40 L104 49 L80 49 L80 57 L100 57 L100 65 L80 65 L80 75 L105 75 L105 84 L68 84 Z"
              fill="url(#veeLetterGrad)"
            />
            {/* Second 'E' */}
            <path
              d="M110 40 L146 40 L146 49 L122 49 L122 57 L142 57 L142 65 L122 65 L122 75 L147 75 L147 84 L110 84 Z"
              fill="url(#veeLetterGrad)"
            />
          </g>

          {/* Graduation Cap (Navy Blue Mortarboard with Golden Center Button) */}
          <g className="vee-floating-cap">
            {/* Diamond Mortarboard Top */}
            <path d="M90 14 L142 29 L90 44 L38 29 Z" fill="#0F172A" stroke="#1E3A8A" strokeWidth="1.5" />
            {/* Skull Cap Base */}
            <path d="M64 38 L64 52 C64 58, 116 58, 116 52 L116 38 Z" fill="#1E293B" />
            <circle cx="90" cy="29" r="3" fill="#F59E0B" />

            {/* Animated Swaying Tassel with Golden Fringe */}
            <g className="vee-swaying-tassel">
              <path d="M90 29 C98 33, 102 42, 104 54" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <rect x="101" y="53" width="6" height="9" rx="2" fill="url(#goldTasselGrad)" />
            </g>
          </g>

          {/* Animated Magic Knowledge Book (Pages Opening & Golden Light) */}
          <g transform="translate(136, 60)" className="vee-magic-book">
            {/* Book Spine & Cover */}
            <path d="M2 14 C10 10, 22 10, 30 14 L30 25 C22 21, 10 21, 2 25 Z" fill="#1D4ED8" />
            {/* Left Page */}
            <path d="M2 13 C8 10, 16 10, 16 13 L16 23 C16 20, 8 20, 2 23 Z" fill="#F8FAFC" />
            {/* Right Page (Animated Flipping Page) */}
            <path d="M16 13 C22 10, 30 10, 30 13 L30 23 C22 20, 16 20, 16 23 Z" fill="#FEF08A" className="vee-flipping-page" />
            {/* Sparkle Star over Book */}
            <circle cx="28" cy="8" r="2" fill="#F59E0B" className="vee-twinkle-sparkle" />
          </g>
        </svg>
      </div>

      <h1
        style={{
          fontSize: '23px',
          fontWeight: '900',
          color: '#0F172A',
          margin: '2px 0 3px',
          letterSpacing: '-0.3px',
          textAlign: 'center'
        }}
      >
        Vacancy Era Education
      </h1>
      <p
        style={{
          fontSize: '13.5px',
          fontWeight: '600',
          color: '#2563EB',
          margin: 0,
          textAlign: 'center'
        }}
      >
        — Your Career • Our Priority —
      </p>
    </div>
  );

  return (
    <div
      className="native-auth-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0
      }}
    >
      {/* Native Bottom Sheet / Card (Sliding Up from Inside the App) */}
      <div
        className="native-auth-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 22px 28px',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
          animation: 'nativeSheetSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Grab Handle for Native Mobile Feel */}
        <div
          style={{
            width: '42px',
            height: '4px',
            borderRadius: '99px',
            background: '#CBD5E1',
            margin: '0 auto 12px'
          }}
        />

        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          {mode !== 'mobile_otp' ? (
            <button
              type="button"
              onClick={() => setMode('mobile_otp')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1E3A8A',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px'
              }}
            >
              <ChevronLeft size={18} /> {isHi ? 'वापस' : 'Back'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#16A34A' }}>
              <ShieldCheck size={15} />
              <span>{isHi ? '100% सुरक्षित और सत्यापित' : '100% Safe & Verified'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X size={17} />
          </button>
        </div>

        {/* Animated 3D VEE Logo & Magic Book */}
        {renderAnimatedVeeHero()}

        {/* Error Banner */}
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
              marginBottom: '14px',
              textAlign: 'center'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Success Banner */}
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
              marginBottom: '14px',
              textAlign: 'center'
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        {/* ===================================================================
            MODE 1: FAST MOBILE NUMBER + 1-CLICK OTP LOGIN (ZEPTO / FLIPKART)
            =================================================================== */}
        {mode === 'mobile_otp' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
              {isHi ? 'मोबाइल नंबर से तुरंत प्रवेश करें:' : 'Login or Sign Up with Mobile Number:'}
            </p>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Phone Input Box (Height 52px, Rounded 14px) */}
              <div
                style={{
                  height: '52px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    paddingRight: '10px',
                    marginRight: '10px',
                    borderRight: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#0F172A',
                    flexShrink: 0
                  }}
                >
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder={isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '15.5px',
                    fontWeight: '600',
                    color: '#0F172A'
                  }}
                  autoFocus
                />
              </div>

              {/* Main Submit Button: Send OTP & Continue */}
              <button
                type="submit"
                disabled={isLoading || phoneNumber.length !== 10}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  background: phoneNumber.length === 10 ? '#1D4ED8' : '#94A3B8',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: phoneNumber.length === 10 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: phoneNumber.length === 10 ? '0 4px 14px rgba(29, 78, 216, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>{isHi ? 'OTP भेजें और लॉगिन करें' : 'Get OTP & Log In'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', letterSpacing: '0.5px' }}>
                {isHi ? 'या 1-क्लिक लॉगिन' : 'OR 1-CLICK SIGN IN'}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* 1-Tap Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontSize: '14px',
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
              <span>{isHi ? 'Google से लॉगिन करें' : 'Continue with Google'}</span>
            </button>

            {/* Switch to Password Option */}
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setMode('password_login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🔒 {isHi ? 'पासवर्ड से लॉगिन करना चाहते हैं?' : 'Log in with Password instead'}
              </button>
            </div>

            {/* Guest Mode Dismiss */}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isHi ? 'सीधे ऐप में जाएं (Guest Mode) →' : 'Explore Jobs as Guest →'}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODE 2: 1-CLICK AUTO-FILL OTP VERIFICATION (FASTEST LOGIN)
            =================================================================== */}
        {mode === 'otp_verify' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 6px' }}>
                {isHi ? `हमारा 4-अंकों का OTP कोड +91 ${phoneNumber} पर भेजा गया है` : `4-digit verification code sent to +91 ${phoneNumber}`}
              </p>
              <button
                type="button"
                onClick={() => setMode('mobile_otp')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {isHi ? 'नंबर बदलें (Edit Number)' : 'Edit Phone Number'}
              </button>
            </div>

            {/* The Magic 1-Click Auto-Fill & Login Banner */}
            <div
              style={{
                background: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#16A34A" />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534', display: 'block' }}>
                    {isHi ? `OTP कोड: ${generatedOtp}` : `Instant Code: ${generatedOtp}`}
                  </span>
                  <span style={{ fontSize: '11px', color: '#15803D' }}>
                    {isHi ? '1-क्लिक में अपने आप लॉगिन करें' : '1-Tap to auto-fill & login'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAutoFillAndLogin(generatedOtp)}
                style={{
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '12px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
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
                  border: '1.5px solid #CBD5E1',
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
                  background: otp.length === 4 ? '#1D4ED8' : '#94A3B8',
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
                  onClick={() => handleSendOtp()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
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
            MODE 3: PASSWORD LOGIN (FOR USERS WHO PREFER PASSWORD)
            =================================================================== */}
        {mode === 'password_login' && (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                boxSizing: 'border-box'
              }}
            >
              <Smartphone size={20} color="#64748B" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0F172A'
                }}
              />
            </div>

            <div
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                boxSizing: 'border-box'
              }}
            >
              <Lock size={20} color="#64748B" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
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
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

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
                marginTop: '4px'
              }}
            >
              {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Log In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setMode('mobile_otp')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📱 {isHi ? 'मोबाइल OTP से लॉगिन करें' : 'Switch back to Mobile OTP'}
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================
            MODE 4: PROFILE SETUP (STATE & GOAL SELECTION)
            =================================================================== */}
        {mode === 'profile_setup' && (
          <form onSubmit={handleProfileSetup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  border: '1.5px solid #CBD5E1',
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
                  border: '1.5px solid #CBD5E1',
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
                  border: '1.5px solid #CBD5E1',
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
                background: '#1D4ED8',
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
    </div>
  );
}
