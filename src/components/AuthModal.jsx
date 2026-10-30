import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, CheckCircle2, ArrowRight, RefreshCw, User, Lock, Eye, EyeOff, Sparkles, MapPin, Target, GraduationCap, ChevronLeft, ShieldCheck, Award, Zap, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  // Modes: 'login' (default Zepto/Flipkart mobile + Google screen) | 'otp' | 'password_login' | 'profile_setup'
  const [mode, setMode] = useState('login');

  // Input States
  const [phoneNumber, setPhoneNumber] = useState(currentProfile?.phone ? currentProfile.phone.replace('+91', '').trim() : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7892');
  const [otpTimer, setOtpTimer] = useState(30);

  // Profile Personalization States
  const [fullName, setFullName] = useState(currentProfile?.name || 'VEE Aspirant');
  const [state, setState] = useState(currentProfile?.state || 'Rajasthan');
  const [goal, setGoal] = useState(currentProfile?.goal || 'Railway ALP & Technician (RRB 2026)');
  const [qual, setQual] = useState(currentProfile?.qual || 'ITI Pass');
  const [category, setCategory] = useState(currentProfile?.category || 'OBC');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isHi = currentLang === 'hi';

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (currentProfile && currentProfile.isLoggedIn) {
        setMode('profile_setup');
      } else {
        setMode('login');
      }
    }
  }, [isOpen, currentProfile]);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (mode === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  if (!isOpen) return null;

  // 1. Submit Mobile Number to request OTP (Zepto / Flipkart Style)
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpTimer(30);
      setMode('otp');
    }, 450);
  };

  // 2. Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp || otp.trim().length < 4) {
      setErrorMsg(isHi ? 'कृपया 4 अंकों का OTP कोड दर्ज करें' : 'Please enter the 4-digit OTP code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // If user profile is not configured yet, direct them to profile setup, else complete
      if (!currentProfile?.name || currentProfile.name === 'Aspirant' || !currentProfile.state) {
        setMode('profile_setup');
      } else {
        finishLogin({
          name: fullName || 'VEE Aspirant',
          phone: `+91 ${phoneNumber}`,
          state,
          goal,
          qual,
          category
        });
      }
    }, 400);
  };

  // 3. One-Tap Google Sign-In (Flipkart / Zepto 1-Tap Experience)
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const defaultName = currentProfile?.name && currentProfile.name !== 'Aspirant' ? currentProfile.name : 'Pawan Meena';
      setFullName(defaultName);
      if (!currentProfile?.state) {
        setMode('profile_setup');
      } else {
        finishLogin({
          name: defaultName,
          email: 'pkmeena988796@gmail.com',
          phone: phoneNumber ? `+91 ${phoneNumber}` : '+91 9887960000',
          state,
          goal,
          qual,
          category
        });
      }
    }, 500);
  };

  // 4. Password Login Handler (Alternative)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      finishLogin({
        name: fullName || 'VEE Aspirant',
        phone: `+91 ${phoneNumber}`,
        state,
        goal,
        qual,
        category
      });
    }, 450);
  };

  // 5. Complete Profile Setup & Start
  const handleSaveProfileSetup = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    finishLogin({
      name: fullName.trim(),
      phone: phoneNumber ? `+91 ${phoneNumber}` : (currentProfile?.phone || ''),
      state,
      goal,
      qual,
      category
    });
  };

  const finishLogin = (userData) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
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

  return (
    <div
      className="auth-sheet-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div
        className="auth-sheet-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.35)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'slideUpAuth 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#0F172A',
          border: '1px solid #E2E8F0'
        }}
      >
        {/* Top Header Bar */}
        <div
          className="flex-between items-center px-5 pt-4 pb-2"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}
        >
          {mode !== 'login' ? (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="flex-center gap-1 text-xs font-bold"
              style={{ background: 'none', border: 'none', color: '#1E3A8A', cursor: 'pointer', padding: '4px' }}
            >
              <ChevronLeft size={18} /> {isHi ? 'वापस' : 'Back'}
            </button>
          ) : (
            <div className="flex-center gap-1.5 text-3xs font-bold text-slate-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>{isHi ? '100% सुरक्षित और निःशुल्क' : '100% Safe & Free'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer'
            }}
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X size={17} />
          </button>
        </div>

        {/* ===================================================================
            SCREEN 1: ZEPTO / FLIPKART STYLE FAST MOBILE NUMBER LOGIN
            =================================================================== */}
        {mode === 'login' && (
          <div className="p-5 flex-1 flex-column justify-between overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div>
              {/* Brand Emblem */}
              <div className="text-center pt-1 mb-4">
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 10px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '20px', position: 'absolute', top: '-8px', right: '-4px', transform: 'rotate(15deg)' }}>🎓</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#FEF08A', letterSpacing: '-0.5px' }}>VEE</span>
                </div>

                <h2 style={{ fontSize: '21px', fontWeight: '900', color: '#0F172A', margin: '0 0 3px', letterSpacing: '-0.3px' }}>
                  Vacancy Era Education
                </h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <Sparkles size={11} className="text-blue-600" />
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#1D4ED8' }}>
                    {isHi ? 'भारत का #1 भर्ती व परीक्षा तैयारी ऐप' : "India's #1 Govt Jobs & Exam App"}
                  </span>
                </div>
              </div>

              {/* Zepto/Flipkart Style Feature Highlights */}
              <div className="flex-column gap-2 mb-4 p-3 rounded-2xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex-center-start gap-2.5 text-xs text-slate-700">
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={13} className="text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{isHi ? 'दैनिक 100% सटीक नौकरियां' : 'Daily 100% Verified Vacancies'}</span>
                    <p className="text-3xs text-slate-500 m-0">{isHi ? 'FreeJobAlert और SarkariResult के लाइव अपडेट्स' : 'Live updates from verified official portals'}</p>
                  </div>
                </div>

                <div className="flex-center-start gap-2.5 text-xs text-slate-700">
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={13} className="text-amber-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{isHi ? 'फ्री ऑल-इंडिया लाइव मॉक टेस्ट्स' : '100% Free Live CBT Mock Tests'}</span>
                    <p className="text-3xs text-slate-500 m-0">{isHi ? 'असली CBT परीक्षा पैटर्न, टाइमर और विस्तृत हल' : 'Real CBT pattern with timer, scorecard & rank'}</p>
                  </div>
                </div>

                <div className="flex-center-start gap-2.5 text-xs text-slate-700">
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={13} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{isHi ? 'ऑफिशियल सिलेबस व परीक्षा स्कीम' : 'Official Syllabus & CBT Scheme'}</span>
                    <p className="text-3xs text-slate-500 m-0">{isHi ? 'विषय-वार अंक, निगेटिव मार्किंग और फिजिकल टेस्ट' : 'Subject weightage, marks & physical criteria'}</p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Mobile Number Input Form */}
              <form onSubmit={handleMobileSubmit} className="flex-column gap-3">
                <label className="text-xs font-bold text-slate-800 block m-0">
                  {isHi ? 'मोबाइल नंबर से लॉगिन / साइन अप करें:' : 'Log in or Sign up with Mobile Number:'}
                </label>

                {/* Country Code + Phone Field */}
                <div
                  className="flex-center items-center rounded-xl"
                  style={{
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                    height: '50px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div
                    className="flex-center gap-1 px-3"
                    style={{
                      background: '#F1F5F9',
                      height: '100%',
                      borderRight: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: '800',
                      color: '#1E293B'
                    }}
                  >
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder={isHi ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter 10-digit mobile number'}
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 text-sm font-semibold outline-none"
                    style={{ border: 'none', background: 'transparent', color: '#0F172A' }}
                    autoFocus
                  />
                </div>

                {/* Big Zepto Style CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length !== 10}
                  className="w-full flex-center gap-2 font-bold text-sm text-white"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    background: phoneNumber.length === 10 ? 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' : '#94A3B8',
                    border: 'none',
                    cursor: phoneNumber.length === 10 ? 'pointer' : 'not-allowed',
                    boxShadow: phoneNumber.length === 10 ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {isLoading ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <>
                      <span>{isHi ? 'OTP प्राप्त करें व आगे बढ़ें' : 'Get OTP & Continue'}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex-center gap-3 my-3">
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', letterSpacing: '0.8px' }}>
                  {isHi ? 'या अन्य विकल्प' : 'OR CONTINUE WITH'}
                </span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              </div>

              {/* 1-Tap Google Sign-in Button (Native Flipkart/Zepto Style) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex-center gap-2.5 font-bold text-xs"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  color: '#1E293B',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {/* Official Google 4-Color Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isHi ? 'Google से 1-क्लिक लॉगिन' : 'Continue with Google'}</span>
              </button>

              {/* Password option toggle */}
              <div className="text-center mt-2.5">
                <button
                  type="button"
                  onClick={() => setMode('password_login')}
                  className="text-xs font-semibold"
                  style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  🔒 {isHi ? 'पासवर्ड से लॉगिन करना चाहते हैं?' : 'Log in with Password instead'}
                </button>
              </div>
            </div>

            {/* Bottom Guest Option & Terms */}
            <div className="pt-3 text-center border-top mt-3" style={{ borderColor: '#F1F5F9' }}>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold"
                style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isHi ? 'बिना लॉगिन देखे आगे बढ़ें (Guest Mode) →' : 'Explore Jobs as Guest →'}
              </button>
              <p className="text-3xs text-slate-400 mt-1 m-0">
                {isHi ? 'लॉगिन करने पर आप VEE की नियम व गोपनीयता नीति स्वीकार करते हैं।' : 'By continuing, you agree to VEE Terms & Privacy Policy.'}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 2: CLEAN 4-DIGIT OTP VERIFICATION
            =================================================================== */}
        {mode === 'otp' && (
          <div className="p-5 flex-1 flex-column justify-between overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div>
              <div className="text-center mb-4">
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 8px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">
                  {isHi ? 'OTP सत्यापन' : 'Verify Mobile OTP'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 m-0">
                  {isHi ? `हमारा 4-अंकों का कोड +91 ${phoneNumber} पर भेजा गया है` : `4-digit code sent to +91 ${phoneNumber}`}
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-3xs font-bold mt-1 text-blue-600 underline"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {isHi ? 'नंबर बदलें' : 'Edit Number'}
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Instant Test OTP Quick Pill */}
              <div
                className="flex-between items-center p-2.5 rounded-xl mb-4"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
              >
                <div className="flex-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>{isHi ? `टेस्ट कोड: ${generatedOtp}` : `Instant Code: ${generatedOtp}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp)}
                  className="px-2.5 py-1 text-3xs font-bold rounded-lg"
                  style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                >
                  {isHi ? 'ऑटो-भरें (Auto-Fill)' : 'Auto-Fill'}
                </button>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerifyOtp} className="flex-column gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? '4-अंकों का OTP दर्ज करें:' : 'Enter 4-Digit Code:'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="w-full text-center text-xl font-extrabold tracking-widest rounded-xl"
                    style={{
                      height: '52px',
                      border: '1.5px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  className="w-full flex-center gap-2 font-bold text-sm text-white"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    background: otp.length === 4 ? 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' : '#94A3B8',
                    border: 'none',
                    cursor: otp.length === 4 ? 'pointer' : 'not-allowed',
                    boxShadow: otp.length === 4 ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
                  }}
                >
                  {isLoading ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <span>{isHi ? 'सत्यापित करें और प्रवेश करें' : 'Verify & Continue'}</span>
                  )}
                </button>
              </form>

              {/* Resend Timer */}
              <div className="text-center mt-3">
                {otpTimer > 0 ? (
                  <span className="text-3xs text-slate-400">
                    {isHi ? `दुबारा OTP भेजें ${otpTimer}s में` : `Resend code in ${otpTimer}s`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(code);
                      setOtpTimer(30);
                    }}
                    className="text-xs font-bold text-blue-600"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    🔄 {isHi ? 'नया OTP कोड भेजें' : 'Resend New OTP Code'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 3: PASSWORD LOGIN (ALTERNATIVE)
            =================================================================== */}
        {mode === 'password_login' && (
          <div className="p-5 flex-1 flex-column justify-between overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div>
              <div className="text-center mb-4">
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    margin: '0 auto 8px',
                    borderRadius: '14px',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Lock size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">
                  {isHi ? 'पासवर्ड से लॉगिन करें' : 'Password Login'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  {isHi ? 'अपना मोबाइल नंबर और पासवर्ड दर्ज करें' : 'Enter registered mobile & password'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex-column gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'मोबाइल नंबर:' : 'Mobile Number:'}
                  </label>
                  <div
                    className="flex-center items-center rounded-xl"
                    style={{ border: '1.5px solid #CBD5E1', height: '46px', overflow: 'hidden' }}
                  >
                    <div className="px-3 text-xs font-bold text-slate-600 bg-slate-100 h-full flex-center border-r">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 text-xs font-semibold outline-none border-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'पासवर्ड:' : 'Password:'}
                  </label>
                  <div
                    className="flex-between items-center rounded-xl px-3"
                    style={{ border: '1.5px solid #CBD5E1', height: '46px' }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs font-semibold outline-none border-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex-center gap-2 font-bold text-sm text-white mt-1"
                  style={{
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isLoading ? <RefreshCw size={17} className="animate-spin" /> : <span>{isHi ? 'लॉगिन करें' : 'Log In'}</span>}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-blue-600"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  📱 {isHi ? 'मोबाइल OTP से लॉगिन करें' : 'Switch to Mobile OTP Login'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 4: CLEAN ONBOARDING PROFILE SETUP (Zepto Style Simple Steps)
            =================================================================== */}
        {mode === 'profile_setup' && (
          <div className="p-5 flex-1 flex-column justify-between overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div>
              <div className="text-center mb-3">
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    margin: '0 auto 6px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <User size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">
                  {isHi ? 'अपनी प्रोफाइल सेट करें' : 'Personalize Your Profile'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  {isHi ? 'सटीक जॉब अलर्ट और सिलेबस प्राप्त करने के लिए' : 'To get targeted job alerts & mock tests'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfileSetup} className="flex-column gap-2.5">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'आपका पूरा नाम:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Pawan Meena"
                    className="w-full px-3 text-xs font-semibold rounded-xl"
                    style={{ height: '44px', border: '1.5px solid #CBD5E1', outline: 'none' }}
                  />
                </div>

                {/* State Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'आपका गृह राज्य (State):' : 'Your Home State / UT:'}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 text-xs font-semibold rounded-xl"
                    style={{ height: '44px', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}
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

                {/* Target Exam Goal */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'लक्षित भर्ती परीक्षा (Goal):' : 'Target Exam Goal:'}
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 text-xs font-semibold rounded-xl"
                    style={{ height: '44px', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}
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

                {/* Qualification */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'शैक्षणिक योग्यता (Qualification):' : 'Highest Qualification:'}
                  </label>
                  <select
                    value={qual}
                    onChange={(e) => setQual(e.target.value)}
                    className="w-full px-3 text-xs font-semibold rounded-xl"
                    style={{ height: '44px', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}
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
                  className="w-full flex-center gap-2 font-bold text-sm text-white mt-2"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <span>{isHi ? 'शुरू करें और नौकरियां देखें 🚀' : 'Start Preparation & Explore Jobs 🚀'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
