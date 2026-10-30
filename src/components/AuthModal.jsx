import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, CheckCircle2, ArrowRight, RefreshCw, User, Lock, Eye, EyeOff, Sparkles, MapPin, Target, GraduationCap, ChevronLeft, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  // Modes: 'welcome' | 'login' | 'signup' | 'profile' | 'otp'
  const [mode, setMode] = useState('welcome');
  const [slideIndex, setSlideIndex] = useState(0);

  // Form States
  const [fullName, setFullName] = useState(currentProfile?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentProfile?.phone ? currentProfile.phone.replace('+91', '').trim() : '');
  const [emailAddress, setEmailAddress] = useState(currentProfile?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Personalization States (Rich & Detailed)
  const [state, setState] = useState(currentProfile?.state || 'Rajasthan');
  const [goal, setGoal] = useState(currentProfile?.goal || 'Railway ALP & Technician / ITI Fitter');
  const [qual, setQual] = useState(currentProfile?.qual || 'ITI Pass');
  const [category, setCategory] = useState(currentProfile?.category || 'OBC');

  // OTP Simulation
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7892');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isHi = currentLang === 'hi';

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      // If user already logged in, show profile mode
      if (currentProfile && currentProfile.isLoggedIn) {
        setMode('profile');
      } else {
        setMode('welcome');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check saved account or create
      const key = `vee_acc_+91_${clean}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          finalizeLogin(parsed);
          return;
        } catch (err) {}
      }
      // If new, move to profile setup to personalize
      setMode('profile');
    }, 600);
  };

  // Sign up handler
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isHi ? 'पासवर्ड और कन्फर्म पासवर्ड मैच नहीं हो रहे हैं' : 'Password and Confirm Password do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('profile');
    }, 500);
  };

  // Complete profile setup and save
  const finalizeLogin = (customData = null) => {
    const cleanPhone = phoneNumber ? `+91 ${phoneNumber.replace(/\D/g, '')}` : '+91 9829012345';
    const profile = customData || {
      ...currentProfile,
      name: fullName.trim() || 'Pawan Meena',
      phone: cleanPhone,
      email: emailAddress.trim() || 'aspirant@vacancyera.com',
      state: state,
      goal: goal,
      qual: qual,
      category: category,
      isLoggedIn: true,
      loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const key = `vee_acc_${profile.phone.replace(/\s+/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(profile));
    localStorage.setItem('vee_current_account_key', key);
    localStorage.setItem('vee_user_profile', JSON.stringify(profile));

    if (onLoginSuccess) {
      onLoginSuccess(profile);
    }

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch (e) {}

    onClose();
  };

  // 1-Click Google Sign In Simulation
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFullName('Pawan Meena');
      setEmailAddress('pkmeena988796@gmail.com');
      setMode('profile');
    }, 550);
  };

  return (
    <div className="auth-sheet-overlay" onClick={onClose}>
      <div
        className="auth-sheet-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '430px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.45)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'slideUpAuth 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Status Bar Decor */}
        <div className="flex-between items-center px-6 pt-3 pb-1" style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
          <span>9:41</span>
          <div className="flex-center gap-1.5">
            <span>5G 📶</span>
            <span>100% 🔋</span>
          </div>
        </div>

        {/* ===================================================================
            SCREEN 1: WELCOME & ONBOARDING (Image 1 Left Screen)
            =================================================================== */}
        {mode === 'welcome' && (
          <div className="p-6 flex-1 flex-column justify-between overflow-y-auto">
            {/* Header branding */}
            <div className="text-center pt-2">
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  margin: '0 auto 8px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                  position: 'relative'
                }}
              >
                {/* 3D Graduation Cap on V */}
                <span style={{ fontSize: '24px', position: 'absolute', top: '-10px', right: '-4px', transform: 'rotate(15deg)' }}>🎓</span>
                <span style={{ fontSize: '32px', fontWeight: '900', color: '#FEF08A', letterSpacing: '-1px' }}>VEE</span>
              </div>

              <h2 style={{ fontSize: '23px', fontWeight: '900', color: '#0F172A', margin: '4px 0 2px', letterSpacing: '-0.3px' }}>
                Vacancy Era Education
              </h2>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#2563EB', margin: '0 0 10px', letterSpacing: '0.5px' }}>
                — Your Career • Our Priority —
              </p>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 auto', maxWidth: '320px', lineHeight: '1.45' }}>
                {isHi
                  ? 'नवीनतम सरकारी व प्राइवेट भर्तियां, परीक्षा अपडेट्स, स्टडी मटेरियल व करियर मार्गदर्शन – सब एक जगह।'
                  : 'Latest Government & Private Job Vacancies, Exam Updates, Study Material and Career Guidance – All in One Place.'}
              </p>
            </div>

            {/* Center Animated Boy & Road Signs Illustration */}
            <div
              className="illustration-hero-box my-4"
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="340" height="230" viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Soft Pastel Backdrop Dome */}
                <ellipse cx="170" cy="210" rx="150" ry="35" fill="#E2E8F0" opacity="0.6" />
                <path d="M120 180 C120 120, 220 120, 220 180 Z" fill="#DBEAFE" opacity="0.7" />
                <rect x="160" y="90" width="20" height="40" fill="#BFDBFE" />
                <path d="M150 90 L170 65 L190 90 Z" fill="#93C5FD" />
                <line x1="170" y1="65" x2="170" y2="45" stroke="#F59E0B" strokeWidth="2" />
                {/* Indian Tricolor Flag on Dome */}
                <rect x="170" y="45" width="18" height="10" fill="#FF9933" />
                <rect x="170" y="50" width="18" height="5" fill="#138808" />

                {/* Floating Soft Cloud Animations */}
                <g className="anim-cloud-slow">
                  <path d="M40 70 Q55 55 75 70 Q90 60 100 75 Q90 90 40 85 Z" fill="#F1F5F9" opacity="0.85" />
                </g>
                <g className="anim-cloud-fast">
                  <path d="M230 50 Q245 40 260 50 Q275 42 285 55 Q275 68 230 65 Z" fill="#F1F5F9" opacity="0.85" />
                </g>

                {/* Road Signboard Pole */}
                <rect x="235" y="80" width="8" height="130" rx="4" fill="#64748B" />

                {/* Sign 1: Government Jobs (Blue) */}
                <g className="anim-sign-float-1" transform="translate(190, 85)">
                  <path d="M0 0 L100 0 L115 14 L100 28 L0 28 Z" fill="#2563EB" filter="drop-shadow(0 4px 8px rgba(37,99,235,0.3))" />
                  <text x="12" y="18" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
                    🏛️ Govt Jobs
                  </text>
                </g>

                {/* Sign 2: Private Jobs (Green) */}
                <g className="anim-sign-float-2" transform="translate(200, 118)">
                  <path d="M0 0 L90 0 L105 14 L90 28 L0 28 Z" fill="#10B981" filter="drop-shadow(0 4px 8px rgba(16,185,129,0.3))" />
                  <text x="10" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    🏢 Private Jobs
                  </text>
                </g>

                {/* Sign 3: Exam Updates (Orange) */}
                <g className="anim-sign-float-3" transform="translate(190, 150)">
                  <path d="M0 0 L98 0 L112 14 L98 28 L0 28 Z" fill="#F59E0B" filter="drop-shadow(0 4px 8px rgba(245,158,11,0.3))" />
                  <text x="10" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    📢 Exam Updates
                  </text>
                </g>

                {/* Sign 4: Study Material (Purple) */}
                <g className="anim-sign-float-4" transform="translate(195, 182)">
                  <path d="M0 0 L95 0 L108 13 L95 26 L0 26 Z" fill="#8B5CF6" filter="drop-shadow(0 4px 8px rgba(139,92,246,0.3))" />
                  <text x="10" y="17" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    📚 Study Material
                  </text>
                </g>

                {/* Animated Aspirant Boy Character (Looking forward with backpack) */}
                <g className="anim-boy-bob">
                  {/* Shadow */}
                  <ellipse cx="105" cy="216" rx="35" ry="8" fill="#CBD5E1" />

                  {/* Backpack */}
                  <rect x="68" y="145" width="26" height="42" rx="10" fill="#1E293B" />
                  <rect x="64" y="152" width="8" height="30" rx="3" fill="#3B82F6" />
                  <circle cx="78" cy="180" r="3" fill="#F59E0B" />

                  {/* Body / Blue Jacket */}
                  <path d="M85 138 C80 145, 78 175, 80 205 L125 205 C128 175, 126 145, 120 138 Z" fill="#2563EB" />
                  {/* Jacket zipper & collar */}
                  <line x1="102" y1="138" x2="102" y2="205" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M92 138 L102 150 L112 138" stroke="#FFFFFF" strokeWidth="2" fill="none" />

                  {/* Neck */}
                  <rect x="96" y="125" width="14" height="15" fill="#FBBF24" rx="3" />

                  {/* Head */}
                  <circle cx="103" cy="112" r="18" fill="#FDE68A" />

                  {/* Stylish Modern Hair */}
                  <path d="M86 112 C85 96, 115 90, 122 105 C122 105, 110 102, 102 105 C95 107, 88 110, 86 112 Z" fill="#0F172A" />
                  <path d="M84 112 Q82 120 86 126 L90 120 Z" fill="#0F172A" />

                  {/* Smiling Face looking right towards signs */}
                  <ellipse cx="112" cy="110" rx="2.5" ry="3.5" fill="#0F172A" />
                  <path d="M108 118 Q113 124 118 118" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="106" cy="116" r="2.5" fill="#FCA5A5" opacity="0.6" />

                  {/* Arm holding backpack strap */}
                  <path d="M88 145 Q96 160 100 175" stroke="#1D4ED8" strokeWidth="9" strokeLinecap="round" fill="none" />
                  <ellipse cx="100" cy="178" rx="5" ry="6" fill="#FDE68A" />

                  {/* Sparkle star around student */}
                  <g className="anim-star-pulse">
                    <path d="M60 115 L62 110 L64 115 L69 117 L64 119 L62 124 L60 119 L55 117 Z" fill="#F59E0B" />
                    <path d="M145 95 L146 91 L148 95 L152 96 L148 98 L146 102 L145 98 L141 96 Z" fill="#3B82F6" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Carousel Indicators & Actions */}
            <div className="pt-1 pb-2">
              {/* 3 Dots */}
              <div className="flex-center justify-center gap-1.5 mb-5">
                <span style={{ width: '22px', height: '6px', borderRadius: '4px', background: '#2563EB' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }}></span>
              </div>

              {/* Get Started Button */}
              <button
                type="button"
                className="btn-primary w-full text-base font-bold flex-center justify-center gap-2 py-3.5 rounded-2xl cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                  border: 'none'
                }}
                onClick={() => setMode('signup')}
              >
                <span>{isHi ? 'शुरू करें (Get Started)' : 'Get Started'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Already have an account? Log In */}
              <div className="text-center mt-3.5">
                <span style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {isHi ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                </span>
                <button
                  type="button"
                  className="font-bold cursor-pointer"
                  style={{ color: '#2563EB', fontSize: '13px', border: 'none', background: 'none' }}
                  onClick={() => setMode('login')}
                >
                  {isHi ? 'लॉगिन करें (Log In)' : 'Log In'}
                </button>
              </div>

              {/* Guest skip link */}
              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-xs text-muted underline cursor-pointer"
                  style={{ border: 'none', background: 'none' }}
                  onClick={onClose}
                >
                  {isHi ? 'अतिथि (Guest) के रूप में सीधे देखें →' : 'Explore as Guest →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 2: LOGIN TO YOUR ACCOUNT (Image 1 Middle Screen)
            =================================================================== */}
        {mode === 'login' && (
          <div className="p-6 flex-1 flex-column justify-between overflow-y-auto">
            {/* Top Navigation */}
            <div>
              <div className="flex-between items-center mb-2">
                <button
                  type="button"
                  className="icon-btn-ghost cursor-pointer"
                  onClick={() => setMode('welcome')}
                  style={{ border: 'none', background: 'none' }}
                >
                  <ChevronLeft size={24} className="text-slate-800" />
                </button>
                <button
                  type="button"
                  className="font-bold text-xs cursor-pointer"
                  style={{ color: '#2563EB', border: 'none', background: 'none' }}
                  onClick={() => setMode('signup')}
                >
                  Sign Up
                </button>
              </div>

              {/* Branding */}
              <div className="text-center mt-1 mb-5">
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 6px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(37, 99, 235, 0.28)'
                  }}
                >
                  <span style={{ fontSize: '26px', fontWeight: '900', color: '#FEF08A' }}>VEE</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">Vacancy Era Education</h3>
                <p className="text-xs text-muted m-0 mt-0.5">Login to your account</p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="flex-column gap-3">
                {/* Mobile Number Input */}
                <div
                  className="flex-center gap-2.5 px-3.5 py-3 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <Phone size={17} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                    autoFocus
                  />
                </div>

                {/* Password Input */}
                <div
                  className="flex-between items-center px-3.5 py-3 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <div className="flex-center gap-2.5 flex-1">
                    <Lock size={17} className="text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 cursor-pointer"
                    style={{ border: 'none', background: 'none' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-3xs font-semibold cursor-pointer"
                    style={{ color: '#2563EB', border: 'none', background: 'none' }}
                    onClick={() => alert(isHi ? 'आपका पासवर्ड आपके रजिस्टर्ड नंबर पर SMS द्वारा भेजा गया है।' : 'Password reset link sent to your phone.')}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-sm font-bold flex-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer mt-1"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: '0 6px 16px rgba(37,99,235,0.3)'
                  }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Log In'}
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex-center my-4">
                <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
                <span className="px-3 text-3xs font-bold text-slate-400">OR</span>
                <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex-column gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex-center justify-center gap-2.5 w-full py-2.5 rounded-xl border text-xs font-bold text-slate-700 cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setFullName('Apple Aspirant'); setMode('profile'); }}
                  className="flex-center justify-center gap-2.5 w-full py-2.5 rounded-xl border text-xs font-bold text-slate-800 cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  <span style={{ fontSize: '18px' }}></span>
                  <span>Continue with Apple</span>
                </button>
              </div>
            </div>

            {/* Bottom link */}
            <div className="text-center pt-4">
              <span style={{ fontSize: '12px', color: '#64748B' }}>Don't have an account? </span>
              <button
                type="button"
                className="font-bold cursor-pointer"
                style={{ color: '#2563EB', fontSize: '12.5px', border: 'none', background: 'none' }}
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 3: CREATE YOUR ACCOUNT (Image 1 Right Screen)
            =================================================================== */}
        {mode === 'signup' && (
          <div className="p-6 flex-1 flex-column justify-between overflow-y-auto">
            <div>
              <div className="flex-between items-center mb-2">
                <button
                  type="button"
                  className="icon-btn-ghost cursor-pointer"
                  onClick={() => setMode('welcome')}
                  style={{ border: 'none', background: 'none' }}
                >
                  <ChevronLeft size={24} className="text-slate-800" />
                </button>
                <button
                  type="button"
                  className="font-bold text-xs cursor-pointer"
                  style={{ color: '#2563EB', border: 'none', background: 'none' }}
                  onClick={() => setMode('login')}
                >
                  Log In
                </button>
              </div>

              {/* Branding */}
              <div className="text-center mt-1 mb-4">
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    margin: '0 auto 6px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#FEF08A' }}>VEE</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">Vacancy Era Education</h3>
                <p className="text-xs text-muted m-0 mt-0.5">Create your account</p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-3 text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignUpSubmit} className="flex-column gap-2.5">
                {/* Full Name */}
                <div
                  className="flex-center gap-2.5 px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <User size={16} className="text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                    autoFocus
                  />
                </div>

                {/* Mobile Number */}
                <div
                  className="flex-center gap-2.5 px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                  />
                </div>

                {/* Email Address (Optional) */}
                <div
                  className="flex-center gap-2.5 px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <Mail size={16} className="text-slate-400" />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                  />
                </div>

                {/* Password */}
                <div
                  className="flex-between items-center px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <div className="flex-center gap-2.5 flex-1">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 cursor-pointer"
                    style={{ border: 'none', background: 'none' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div
                  className="flex-between items-center px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                >
                  <div className="flex-center gap-2.5 flex-1">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-xs font-medium border-none bg-transparent outline-none text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 cursor-pointer"
                    style={{ border: 'none', background: 'none' }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-sm font-bold flex-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer mt-1"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: '0 6px 16px rgba(37,99,235,0.3)'
                  }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Sign Up'}
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex-center my-3">
                <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
                <span className="px-3 text-3xs font-bold text-slate-400">OR</span>
                <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex-row gap-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-2xs font-bold text-slate-700 cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setFullName('Apple Aspirant'); setMode('profile'); }}
                  className="flex-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-2xs font-bold text-slate-800 cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  <span style={{ fontSize: '15px' }}></span>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Bottom link */}
            <div className="text-center pt-3">
              <span style={{ fontSize: '12px', color: '#64748B' }}>Already have an account? </span>
              <button
                type="button"
                className="font-bold cursor-pointer"
                style={{ color: '#2563EB', fontSize: '12.5px', border: 'none', background: 'none' }}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 4: ENRICHED PROFILE PERSONALIZATION (As requested by user!)
            =================================================================== */}
        {mode === 'profile' && (
          <div className="p-6 flex-1 flex-column justify-between overflow-y-auto">
            <div>
              <div className="flex-between items-center mb-1">
                <span className="badge-pill bg-emerald-100 text-emerald-800 text-3xs font-extrabold px-2.5 py-1 rounded-full flex-center gap-1">
                  <CheckCircle2 size={13} /> {isHi ? 'खाता तैयार!' : 'Account Ready!'}
                </span>
                <button
                  type="button"
                  className="text-xs text-muted cursor-pointer"
                  onClick={onClose}
                  style={{ border: 'none', background: 'none' }}
                >
                  ✕
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 m-0 mt-1">
                🎯 {isHi ? 'अपनी तैयारी व भर्ती लक्ष्य सेट करें' : 'Personalize Your Exam Goal'}
              </h3>
              <p className="text-3xs text-muted m-0 mt-0.5 mb-3">
                {isHi
                  ? 'अपना राज्य, लक्षित परीक्षा व योग्यता चुनें ताकि आपको सिर्फ काम की भर्तियों के अलर्ट मिलें:'
                  : 'Select your home state and dream exam to receive instant relevant vacancies:'}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); finalizeLogin(); }} className="flex-column gap-3">
                {/* Candidate Name */}
                <div className="form-group">
                  <label className="text-2xs font-bold text-slate-700 block mb-1">
                    👤 {isHi ? 'अभ्यर्थी का नाम (Candidate Name):' : 'Candidate Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pawan Meena"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border"
                    style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                  />
                </div>

                {/* Comprehensive State Selection (All 28 States + 8 UTs) */}
                <div className="form-group">
                  <label className="text-2xs font-bold text-slate-700 block mb-1">
                    📍 {isHi ? 'गृह राज्य / क्षेत्र (Home State):' : 'Home State / Region:'}
                  </label>
                  <select
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border cursor-pointer"
                    style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <optgroup label="🌟 मुख्य राज्य (Top States)">
                      <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                      <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                      <option value="Bihar">Bihar (बिहार)</option>
                      <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                      <option value="Haryana">Haryana (हरियाणा)</option>
                      <option value="Delhi">Delhi / NCR (दिल्ली एनसीआर)</option>
                    </optgroup>
                    <optgroup label="🏛️ उत्तरी व मध्य भारत (North & Central)">
                      <option value="Punjab">Punjab (पंजाब)</option>
                      <option value="Uttarakhand">Uttarakhand (उत्तराखंड)</option>
                      <option value="Himachal Pradesh">Himachal Pradesh (हिमाचल प्रदेश)</option>
                      <option value="Jammu & Kashmir">Jammu & Kashmir (जम्मू व कश्मीर)</option>
                      <option value="Chhattisgarh">Chhattisgarh (छत्तीसगढ़)</option>
                      <option value="Jharkhand">Jharkhand (झारखंड)</option>
                    </optgroup>
                    <optgroup label="🌊 पश्चिम व दक्षिण भारत (West & South)">
                      <option value="Gujarat">Gujarat (गुजरात)</option>
                      <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                      <option value="Odisha">Odisha (ओडिशा)</option>
                      <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                      <option value="Telangana">Telangana (तेलंगाना)</option>
                      <option value="Andhra Pradesh">Andhra Pradesh (आंध्र प्रदेश)</option>
                      <option value="Karnataka">Karnataka (कर्नाटक)</option>
                      <option value="Tamil Nadu">Tamil Nadu (तमिलनाडु)</option>
                    </optgroup>
                    <optgroup label="🇮🇳 ऑल इंडिया (Central / All India)">
                      <option value="All India">All India / Central Govt (अखिल भारतीय भर्तियां)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Target Exam Goal (Enriched & Categorized) */}
                <div className="form-group">
                  <label className="text-2xs font-bold text-slate-700 block mb-1">
                    🎯 {isHi ? 'लक्षित भर्ती परीक्षा (Target Exam Goal):' : 'Target Exam Goal:'}
                  </label>
                  <select
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border cursor-pointer"
                    style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <optgroup label="🚆 रेलवे भर्ती (RRB & RRC)">
                      <option value="Railway ALP & Technician / ITI Fitter">Railway ALP & Technician (ITI / Diploma)</option>
                      <option value="Railway NTPC (Graduate & 12th)">Railway NTPC (Station Master / Clerk / Guard)</option>
                      <option value="Railway Group D & Pointsman">Railway Group D (Trackman / Helper / Pointsman)</option>
                      <option value="Railway RPF Constable & SI">Railway RPF Constable & Sub-Inspector</option>
                      <option value="Railway Act Apprentice">Railway Act Apprentice (10th + ITI)</option>
                    </optgroup>
                    <optgroup label="👮 पुलिस व डिफेंस (Police & Defence)">
                      <option value="SSC GD Constable (BSF/CISF/CRPF)">SSC GD Constable (BSF / CISF / CRPF / ITBP)</option>
                      <option value="Delhi Police Constable & SI">Delhi Police Constable (Executive) & SI</option>
                      <option value="State Police Constable & SI">State Police (UP, Rajasthan, Bihar, MP Police)</option>
                      <option value="Army Agniveer & Tradesman">Indian Army Agniveer / Airforce / Navy</option>
                    </optgroup>
                    <optgroup label="⚡ ITI, टेक्निकल व मेट्रो (ITI & Technical)">
                      <option value="ITI Electrician / Bijli Vibhag">ITI Electrician / Lineman / Bijli Vibhag</option>
                      <option value="ITI Fitter / Turner / Welder">ITI Fitter / Turner / Welder PSU Bharti</option>
                      <option value="Metro Rail (NMRC/DMRC) Maintainer">Metro Rail (NMRC / DMRC / UPMRC) Maintainer</option>
                      <option value="Junior Engineer (JE Civil/Mech/Elec)">Junior Engineer (SSC JE / RRB JE / State JE)</option>
                      <option value="PSU Apprentice (BHEL/IOCL/ONGC)">PSU Apprentice (BHEL / IOCL / SAIL / DRDO)</option>
                    </optgroup>
                    <optgroup label="🏛️ एसएससी, यूपीएससी व क्लर्क (SSC & Central)">
                      <option value="SSC CGL & CHSL (10+2)">SSC CGL & CHSL (Inspector, Assistant, LDC, DEO)</option>
                      <option value="SSC MTS & Havaldar">SSC MTS & Havaldar (10th Pass)</option>
                      <option value="Banking PO & Clerk (IBPS/SBI)">Banking PO & Clerk (SBI, IBPS, RRB, RBI)</option>
                      <option value="State PSC (RAS / UPPSC / BPSC)">State PSC (RAS, UPPSC, BPSC, Patwari, VDO)</option>
                      <option value="Teaching Exams (REET/CTET/TGT)">Teaching Exams (REET, CTET, Super TET, KVS)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Educational Qualification */}
                <div className="grid grid-cols-2 gap-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="text-3xs font-bold text-slate-700 block mb-1">
                      🎓 {isHi ? 'उच्चतम योग्यता:' : 'Qualification:'}
                    </label>
                    <select
                      className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl border cursor-pointer"
                      style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                      value={qual}
                      onChange={(e) => setQual(e.target.value)}
                    >
                      <option value="10th Pass">10th Pass (Matric)</option>
                      <option value="12th Pass">12th Pass (Inter)</option>
                      <option value="ITI Pass">⚡ ITI Pass (NCVT/SCVT)</option>
                      <option value="Polytechnic Diploma">🛠️ Polytechnic Diploma</option>
                      <option value="Any Graduate">🎓 Any Graduate (BA/BSc)</option>
                      <option value="B.Tech / B.E">💻 B.Tech / B.E</option>
                      <option value="Post Graduate">📚 Post Graduate</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="text-3xs font-bold text-slate-700 block mb-1">
                      🏷️ {isHi ? 'आरक्षण श्रेणी:' : 'Category:'}
                    </label>
                    <select
                      className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl border cursor-pointer"
                      style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="OBC">OBC (Non-Creamy)</option>
                      <option value="General">General (UR)</option>
                      <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
                      <option value="SC">SC (अनुसूचित जाति)</option>
                      <option value="ST">ST (अनुसूचित जनजाति)</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn-primary w-full text-sm font-bold flex-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: '0 6px 18px rgba(37,99,235,0.35)'
                  }}
                >
                  <Sparkles size={16} className="text-amber-300" />
                  <span>{isHi ? '✨ प्रोफाइल सेव करें व ऐप शुरू करें' : 'Save Profile & Explore VEE App'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
