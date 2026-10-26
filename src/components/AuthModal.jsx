import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, CheckCircle2, Shield, ArrowRight, RefreshCw, Key, User, Lock, Sparkles, Compass, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'profile'
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [showNewLogin, setShowNewLogin] = useState(false);
  
  // Inputs
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7892');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [fullName, setFullName] = useState(currentProfile?.name || '');
  const [state, setState] = useState(currentProfile?.state || 'Rajasthan');
  const [goal, setGoal] = useState(currentProfile?.goal || 'ITI Fitter / Railway ALP');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isHi = currentLang === 'hi';

  // Check if there is already saved user data in profile or localStorage
  const existingAccount = React.useMemo(() => {
    try {
      if (currentProfile && currentProfile.name && currentProfile.name !== 'VEE Aspirant' && (currentProfile.phone || currentProfile.email || currentProfile.isLoggedIn)) {
        return currentProfile;
      }
      const savedAccKey = localStorage.getItem('vee_current_account_key');
      if (savedAccKey) {
        const raw = localStorage.getItem(savedAccKey);
        if (raw) return JSON.parse(raw);
      }
      const rawProfile = localStorage.getItem('vee_user_profile');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed && parsed.name && parsed.name !== 'VEE Aspirant' && (parsed.phone || parsed.email || parsed.isLoggedIn)) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }, [currentProfile, isOpen]);

  // Handle 3D Book Flip Opening Animation when modal is triggered
  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsBookOpen(false);
      setShowNewLogin(false);
      // Brief pause to show the luxurious 3D leather & gold book cover, then smoothly swing open!
      timer = setTimeout(() => {
        setIsBookOpen(true);
      }, 400);
    } else {
      setIsBookOpen(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const strings = {
    bookTitle: isHi ? 'रोज़गार भर्ती डायरी 2026' : 'Aspirant Career Passport 2026',
    bookSubtitle: isHi ? 'भारत का #1 रियल-टाइम भर्ती पोर्टल' : "India's #1 Real-Time Jobs Hub",
    badge: isHi ? '🛡️ राष्ट्रीय अभ्यर्थी सेवा' : '🛡️ NATIONAL ASPIRANT PORTAL',
    title: isHi ? 'VEE ऐप में आपका स्वागत है' : 'Welcome to VEE',
    subtitle: isHi 
      ? 'भारत का #1 रियल-टाइम सरकारी व प्राइवेट भर्ती पोर्टल 🎯' 
      : "India's #1 Real-Time Sarkari & Private Jobs Hub 🎯",
    existingTitle: isHi ? '🌟 अभ्यर्थी पहचान पत्र (Welcome Back)' : '🌟 Aspirant Identity Pass',
    existingSub: isHi ? 'आपके पास पहले से सत्यापित प्रोफाइल डेटा मौजूद है:' : 'Verified profile data found on this device:',
    continueExisting: isHi ? 'के रूप में सीधे शुरू करें' : 'Continue as',
    useDifferent: isHi ? '🔄 किसी दूसरे नंबर / Google से लॉगिन करें' : '🔄 Login with Different Account',
    googleBtn: isHi ? 'Google से 1-क्लिक साइन इन करें' : 'Continue with Google',
    orDivider: isHi ? 'या मोबाइल नंबर से जारी रखें' : 'OR CONTINUE WITH MOBILE',
    phoneLabel: isHi ? '10-अंकों का मोबाइल नंबर दर्ज करें:' : 'Enter 10-Digit Mobile Number:',
    autoOtpBadge: isHi ? '⚡ तुरंत ऑटो-ओटीपी' : '⚡ Instant Auto-OTP',
    phonePlaceholder: 'e.g. 9829012345',
    getOtpBtn: isHi ? 'ओटीपी प्राप्त करें' : 'Get Verification Code',
    sendingOtp: isHi ? 'ओटीपी भेजा जा रहा है...' : 'Sending OTP...',
    skipBtn: isHi ? 'अतिथि के रूप में सीधे देखें →' : 'Skip & Explore as Guest →',
    skipNote: isHi 
      ? 'आप बिना लॉगिन किए भी 460+ लाइव भर्तियां देख सकते हैं।' 
      : 'Explore 460+ live verified vacancies without signing in.',
    
    // OTP Step
    otpTitle: isHi ? 'मोबाइल नंबर सत्यापन' : 'Verify Mobile Number',
    otpSub: isHi ? 'दिए गए 4-अंकों के सुरक्षा कोड को दर्ज करें:' : 'Enter the 4-digit code sent to:',
    smsDetected: isHi ? '📲 ऑटो-एसएमएस वेरिफिकेशन डिटेक्टेड' : '📲 SMS Verification Auto-Detected',
    secOtpLabel: isHi ? 'ओटीपी कोड:' : 'Security OTP:',
    autoFilling: isHi ? '⚡ बॉक्स में कोड भरा जा रहा है...' : '⚡ Auto-filling 4-digit code...',
    autoFilled: isHi ? '✅ कोड भर दिया गया! नीचे सत्यापित करें पर क्लिक करें।' : '✅ Code auto-filled! Click verify below.',
    verifyBtn: isHi ? 'ओटीपी सत्यापित करें और डायरी शुरू करें' : 'Verify OTP & Continue',
    verifying: isHi ? 'सत्यापित हो रहा है...' : 'Verifying...',
    changeNumber: isHi ? '← दूसरा नंबर दर्ज करें' : '← Change Mobile Number',

    // Profile Step
    profileTitle: isHi ? 'अपनी प्रोफाइल सेट करें' : 'Personalize Your Feed',
    profileSub: isHi ? 'बस एक कदम! अपनी पसंदीदा भर्तियों के लिए विवरण भरें:' : 'Almost there! Set your details to get tailored job alerts:',
    mobileVerified: isHi ? '🎉 मोबाइल सफलतापूर्वक सत्यापित!' : '🎉 Mobile Verified Successfully!',
    nameLabel: isHi ? 'आपका पूरा नाम:' : 'Full Name:',
    namePlaceholder: 'e.g. Pawan Meena',
    stateLabel: isHi ? 'गृह राज्य (Home State):' : 'Home State:',
    goalLabel: isHi ? 'लक्षित भर्ती / परीक्षा (Goal):' : 'Target Exam / Goal:',
    startBtn: isHi ? '✨ VEE ऐप शुरू करें' : '✨ Start Exploring VEE App',

    // Errors
    errPhone: isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number',
    errPhoneIntl: isHi ? 'कृपया सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid mobile number',
    errEmail: isHi ? 'कृपया सही Email ID दर्ज करें' : 'Please enter a valid email address',
    errOtp: isHi ? 'गलत ओटीपी! कृपया स्क्रीन पर दिखाया गया कोड दर्ज करें।' : 'Invalid OTP! Please enter code shown on screen.'
  };

  // Auto-fill OTP simulation when arriving at step 'otp'
  useEffect(() => {
    let timer1;
    if (step === 'otp') {
      setIsAutoFilling(true);
      timer1 = setTimeout(() => {
        setOtp(generatedOtp);
        setIsAutoFilling(false);
      }, 900);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [step, generatedOtp]);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMethod === 'phone') {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (countryCode === '+91') {
        if (cleanPhone.length !== 10) {
          setErrorMsg(strings.errPhone);
          return;
        }
      } else {
        if (cleanPhone.length < 7 || cleanPhone.length > 12) {
          setErrorMsg(strings.errPhoneIntl);
          return;
        }
      }
    } else {
      if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
        setErrorMsg(strings.errEmail);
        return;
      }
    }

    setIsLoading(true);
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 450);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp !== generatedOtp && otp !== '1234' && otp !== '7892') {
      setErrorMsg(strings.errOtp);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const fullPhoneIdentifier = `${countryCode}_${phoneNumber}`;
      const accountKey = authMethod === 'phone' ? `vee_acc_${fullPhoneIdentifier}` : `vee_acc_${emailAddress}`;
      const savedAccount = localStorage.getItem(accountKey);

      if (savedAccount) {
        try {
          const parsed = JSON.parse(savedAccount);
          completeLogin(parsed);
          return;
        } catch (err) {}
      }

      setStep('profile');
    }, 450);
  };

  // Complete Login Flow
  const completeLogin = (customData = null) => {
    const formattedPhone = `${countryCode} ${phoneNumber}`.trim();
    const updatedProfile = customData || {
      ...currentProfile,
      name: fullName.trim() || (isHi ? 'पवन मीणा (Aspirant)' : 'VEE Aspirant'),
      phone: authMethod === 'phone' ? formattedPhone : (currentProfile?.phone || ''),
      countryCode: countryCode,
      email: authMethod === 'email' ? emailAddress : (currentProfile?.email || ''),
      state: state,
      goal: goal,
      isLoggedIn: true,
      loginMethod: authMethod,
      loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const fullPhoneIdentifier = `${countryCode}_${phoneNumber}`;
    const accountKey = authMethod === 'phone' ? `vee_acc_${fullPhoneIdentifier}` : `vee_acc_${emailAddress}`;
    localStorage.setItem(accountKey, JSON.stringify(updatedProfile));
    localStorage.setItem('vee_current_account_key', accountKey);
    localStorage.setItem('vee_user_profile', JSON.stringify(updatedProfile));

    if (onLoginSuccess) {
      onLoginSuccess(updatedProfile);
    }

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {}

    onClose();
  };

  // Quick 1-Click Google Sign-In Simulation
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const googleUser = {
        ...currentProfile,
        name: 'Pawan Meena',
        email: 'pkmeena988796@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        state: 'Rajasthan',
        goal: 'ITI Fitter / Railway ALP',
        isLoggedIn: true,
        loginMethod: 'google',
        loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      completeLogin(googleUser);
    }, 550);
  };

  return (
    <div className="book-auth-overlay" onClick={onClose}>
      <div className="book-3d-wrapper" onClick={(e) => e.stopPropagation()}>
        
        {/* ===================================================================
            3D FRONT BOOK COVER (Flipping Open Animation)
            =================================================================== */}
        <div
          className={`book-cover-3d ${isBookOpen ? 'book-open' : ''}`}
          onClick={() => setIsBookOpen(true)}
          title="टैप करके डायरी खोलें"
        >
          {/* Leather Spine Ridge */}
          <div className="book-spine-ridge"></div>

          {/* Hanging Ribbon Marker */}
          <div className="book-ribbon-tag"></div>

          {/* Top Filigree Corner */}
          <div className="flex-between items-center text-amber-300" style={{ paddingLeft: '14px' }}>
            <span style={{ fontSize: '18px', opacity: 0.9 }}>⚜️</span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: '900',
                letterSpacing: '1px',
                background: 'rgba(245, 158, 11, 0.25)',
                color: '#FEF08A',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                padding: '2px 8px',
                borderRadius: '8px'
              }}
            >
              VEE 2026 EDITION
            </span>
            <span style={{ fontSize: '18px', opacity: 0.9 }}>⚜️</span>
          </div>

          {/* Center Royal Gold Crest */}
          <div className="text-center" style={{ padding: '20px 10px 10px 24px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #D97706 100%)',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
                margin: '0 auto 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                border: '2px solid #FFFFFF'
              }}
            >
              🚀
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1.2px',
                color: '#FEF08A',
                textTransform: 'uppercase',
                display: 'block'
              }}
            >
              Vacancy Era Education
            </span>

            <h2
              style={{
                fontSize: '22px',
                fontWeight: '900',
                color: '#FFFFFF',
                margin: '6px 0 2px',
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              {strings.bookTitle}
            </h2>

            <p
              style={{
                fontSize: '11px',
                color: '#93C5FD',
                margin: '0 0 16px',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}
            >
              ✦ ASPIRANT CAREER PASSPORT ✦
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.45)',
                border: '1px dashed rgba(245, 158, 11, 0.45)',
                borderRadius: '12px',
                padding: '10px',
                margin: '0 auto 18px',
                maxWidth: '280px'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#E2E8F0', fontWeight: '600' }}>
                ✦ 100% सत्यापित सरकारी व प्राइवेट भर्तियां ✦
              </div>
              <div style={{ fontSize: '9.5px', color: '#FCD34D', fontWeight: 'bold', marginTop: '4px' }}>
                रेलवे • SSC • पुलिस • बैंक • अप्रेंटिस • 14+ राज्य
              </div>
            </div>

            {/* Tap to Open Action Prompt */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.5)',
                animation: 'pulse 1.8s infinite'
              }}
            >
              <BookOpen size={14} />
              <span>📖 डायरी खोलने के लिए टैप करें</span>
            </div>
          </div>

          {/* Bottom Filigree Corner */}
          <div className="flex-between items-center text-amber-300" style={{ paddingLeft: '14px' }}>
            <span style={{ fontSize: '18px', opacity: 0.9 }}>⚜️</span>
            <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>
              TAP ANYWHERE TO OPEN
            </span>
            <span style={{ fontSize: '18px', opacity: 0.9 }}>⚜️</span>
          </div>
        </div>

        {/* ===================================================================
            INTERIOR OPEN BOOK PAGE (Revealed after cover flips open)
            =================================================================== */}
        <div className="book-page-interior">
          {/* Binder Stitch Rings */}
          <div className="book-binder-stitch">
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
            <span className="stitch-dot"></span>
          </div>

          {/* Hanging Ribbon Marker Accent */}
          <div className="book-ribbon-tag"></div>

          {/* Book Header / Passport Identity Banner */}
          <div
            className="p-3.5 relative"
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)',
              color: '#FFFFFF',
              borderBottom: '2.5px solid #F59E0B'
            }}
          >
            {/* Action buttons (Close + Flip Cover) */}
            <div className="flex-between items-center mb-1.5" style={{ paddingLeft: '8px' }}>
              <button
                type="button"
                className="btn-flip-back text-2xs font-bold px-2 py-0.5 rounded cursor-pointer"
                onClick={() => setIsBookOpen(false)}
                title="कवर बंद करें"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  color: '#FEF08A',
                  border: '1px solid rgba(254, 240, 138, 0.4)'
                }}
              >
                📘 कवर बंद करें
              </button>

              <button
                type="button"
                className="icon-btn auth-close-btn"
                onClick={onClose}
                style={{
                  color: '#FFFFFF',
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="बंद करें"
              >
                <X size={16} />
              </button>
            </div>

            {/* Passport Branding */}
            <div className="flex-center-start gap-2.5" style={{ paddingLeft: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                  flexShrink: 0
                }}
              >
                🚀
              </div>
              <div className="min-w-0 flex-1">
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    letterSpacing: '0.6px',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#FEF08A',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}
                >
                  {strings.badge}
                </span>
                <h3 className="font-extrabold text-sm m-0 leading-tight text-white mt-0.5 truncate">
                  {step === 'profile' ? strings.profileTitle : (step === 'otp' ? strings.otpTitle : strings.title)}
                </h3>
              </div>
            </div>

            <p
              style={{
                fontSize: '10.5px',
                color: 'rgba(238, 242, 255, 0.95)',
                margin: '6px 0 0 8px',
                fontWeight: '500'
              }}
            >
              {step === 'profile'
                ? strings.profileSub
                : (step === 'otp'
                  ? `${strings.otpSub} ${countryCode} ${phoneNumber}`
                  : strings.subtitle)}
            </p>
          </div>

          {/* Book Page Body */}
          <div className="sheet-body p-4" style={{ overflowY: 'auto' }}>
            {errorMsg && (
              <div
                className="p-2.5 mb-3 rounded-xl text-xs font-semibold flex-center-start gap-1.5"
                style={{
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}
              >
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ===============================================================
                CASE A: USER HAS EXISTING PROFILE / SAVED DATA
                "kee ke pass data huga es ko acha bna dey"
                =============================================================== */}
            {existingAccount && !showNewLogin && step === 'input' && (
              <div className="aspirant-pass-card mb-3">
                <div className="flex-between items-center mb-2">
                  <span
                    className="text-3xs font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: '#F59E0B', color: '#FFFFFF' }}
                  >
                    ★ प्रमाणित अभ्यर्थी पास (Registered)
                  </span>
                  <span className="text-3xs font-bold text-amber-800">
                    VEE ID: #{Math.abs(existingAccount.name?.length * 4821 || 7842)}
                  </span>
                </div>

                <div className="flex-center-start gap-3 mt-2">
                  <img
                    src={existingAccount.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={existingAccount.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      border: '2.5px solid #F59E0B',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                      objectFit: 'cover'
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-slate-900 m-0 leading-tight">
                      {existingAccount.name}
                    </h4>
                    <span className="text-3xs text-emerald-800 font-bold block mt-0.5">
                      ✓ मोबाइल सत्यापित: {existingAccount.phone || existingAccount.email || '+91 9829012345'}
                    </span>
                    <span className="text-3xs text-slate-600 font-medium block mt-0.5">
                      📍 {existingAccount.state || 'Rajasthan'} • 🎯 {existingAccount.goal || 'Govt Job Aspirant'}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Resume Button */}
                <button
                  type="button"
                  className="w-full mt-3 py-2.5 px-3 rounded-xl font-bold text-xs flex-center justify-center gap-1.5 cursor-pointer shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  }}
                  onClick={() => completeLogin(existingAccount)}
                >
                  <Sparkles size={14} className="text-yellow-200" />
                  <span>🚀 {existingAccount.name} के रूप में सीधे शुरू करें (1-Tap Entry)</span>
                </button>

                {/* Switch to Different Account */}
                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    className="text-3xs font-bold text-blue-700 underline cursor-pointer hover:text-blue-900"
                    onClick={() => setShowNewLogin(true)}
                  >
                    {strings.useDifferent}
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                CASE B: STANDARD / NEW LOGIN FLOW (Google + Mobile OTP)
                =============================================================== */}
            {(!existingAccount || showNewLogin) && step === 'input' && (
              <div>
                {/* 1-Click Google Sign-In Hero Button */}
                <button
                  type="button"
                  className="google-auth-btn w-full p-2.5 rounded-xl flex-center justify-center gap-2.5 font-bold text-xs shadow-xs cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    color: '#1E293B',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{strings.googleBtn}</span>
                </button>

                {/* Divider */}
                <div className="flex-center my-3">
                  <div className="flex-1 border-top" style={{ borderColor: '#E2E8F0' }}></div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '800',
                      color: '#64748B',
                      padding: '0 8px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {strings.orDivider}
                  </span>
                  <div className="flex-1 border-top" style={{ borderColor: '#E2E8F0' }}></div>
                </div>

                {/* Mobile Input Form */}
                <form onSubmit={handleSendOtp}>
                  <div className="form-group mb-2.5">
                    <label className="form-label text-xs font-semibold flex-between">
                      <span>{strings.phoneLabel}</span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          color: '#059669',
                          background: '#ECFDF5',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          border: '1px solid #A7F3D0'
                        }}
                      >
                        {strings.autoOtpBadge}
                      </span>
                    </label>
                    
                    <div className="flex-row items-center gap-1.5 mt-1">
                      <select
                        className="p-2 rounded-xl border text-xs font-bold cursor-pointer"
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          setErrorMsg('');
                        }}
                        style={{
                          minWidth: '90px',
                          height: '42px',
                          borderColor: '#CBD5E1',
                          background: '#F8FAFC'
                        }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+977">🇳🇵 +977</option>
                        <option value="+880">🇧🇩 +880</option>
                      </select>

                      <input
                        type="tel"
                        required
                        maxLength={countryCode === '+91' ? 10 : 13}
                        placeholder={strings.phonePlaceholder}
                        className="form-input text-xs flex-1 rounded-xl font-bold"
                        style={{
                          height: '42px',
                          letterSpacing: '0.5px',
                          borderColor: '#CBD5E1',
                          padding: '0 10px'
                        }}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                      border: 'none',
                      color: '#FFFFFF'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> {strings.sendingOtp}
                      </>
                    ) : (
                      <>
                        <span>📱 {strings.getOtpBtn}</span> <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>

                {/* Return to existing account view if applicable */}
                {existingAccount && showNewLogin && (
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      className="text-3xs text-muted underline cursor-pointer"
                      onClick={() => setShowNewLogin(false)}
                    >
                      ← {existingAccount.name} वाले खाते पर वापस जाएं
                    </button>
                  </div>
                )}

                {/* Guest Explore Option */}
                <div className="mt-3 pt-2 text-center border-top" style={{ borderColor: '#E2E8F0' }}>
                  <button
                    type="button"
                    className="btn-secondary w-full text-xs font-semibold py-2 rounded-xl flex-center justify-center gap-1.5 cursor-pointer"
                    onClick={onClose}
                    style={{
                      background: 'transparent',
                      border: '1.5px dashed #CBD5E1',
                      color: '#475569'
                    }}
                  >
                    <Compass size={13} />
                    <span>{strings.skipBtn}</span>
                  </button>
                  <p className="text-3xs text-muted mt-1 m-0">
                    {strings.skipNote}
                  </p>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 2: OTP AUTO-FILL & INSTANT VERIFICATION
                =============================================================== */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp}>
                <div
                  className="p-3 rounded-xl mb-3 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    border: '1.5px solid #93C5FD'
                  }}
                >
                  <span className="text-3xs text-blue-700 font-bold block uppercase flex-center justify-center gap-1">
                    <span className="live-pill-indicator"></span> {strings.smsDetected}
                  </span>

                  <div className="mt-1.5 flex-center justify-center gap-2">
                    <span className="text-xs text-secondary font-semibold">{strings.secOtpLabel}</span>
                    <span
                      className="font-mono text-base font-extrabold px-2.5 py-0.5 rounded-lg text-white"
                      style={{ background: '#2563EB', letterSpacing: '3px', boxShadow: '0 2px 6px rgba(37,99,235,0.4)' }}
                    >
                      {generatedOtp}
                    </span>
                  </div>

                  {isAutoFilling && (
                    <span className="text-3xs text-blue-600 block mt-1.5 animate-pulse font-medium">
                      {strings.autoFilling}
                    </span>
                  )}
                  {!isAutoFilling && otp && (
                    <span className="text-3xs text-emerald-700 font-bold block mt-1.5">
                      {strings.autoFilled}
                    </span>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold text-center block mb-1">
                    {strings.otpSub} {countryCode} {phoneNumber}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="4"
                    placeholder="e.g. 7892"
                    className="form-input text-center text-xl font-mono font-extrabold tracking-widest rounded-xl"
                    style={{
                      height: '46px',
                      borderColor: otp ? '#10B981' : '#CBD5E1',
                      background: '#F8FAFC'
                    }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn-success w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> {strings.verifying}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} /> <span>{strings.verifyBtn}</span>
                    </>
                  )}
                </button>

                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    className="btn-clear text-xs text-muted underline cursor-pointer"
                    onClick={() => { setStep('input'); setOtp(''); }}
                  >
                    {strings.changeNumber}
                  </button>
                </div>
              </form>
            )}

            {/* ===============================================================
                STEP 3: QUICK PROFILE CONFIRMATION
                =============================================================== */}
            {step === 'profile' && (
              <form onSubmit={(e) => { e.preventDefault(); completeLogin(); }}>
                <div
                  className="p-2.5 rounded-xl mb-3 text-center"
                  style={{ background: '#ECFDF5', border: '1.5px solid #86EFAC' }}
                >
                  <span className="text-xs font-bold text-success flex-center justify-center gap-1.5">
                    <CheckCircle2 size={15} /> {strings.mobileVerified}
                  </span>
                  <span className="text-3xs text-muted block mt-0.5">
                    {strings.profileSub}
                  </span>
                </div>

                <div className="form-group mb-2">
                  <label className="form-label text-xs font-semibold">{strings.nameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={strings.namePlaceholder}
                    className="form-input text-xs rounded-xl"
                    style={{ height: '40px' }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-label text-xs font-semibold">{strings.stateLabel}</label>
                  <select
                    className="form-select-sm text-xs rounded-xl"
                    style={{ height: '40px', width: '100%' }}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                    <option value="Bihar">Bihar (बिहार)</option>
                    <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                    <option value="Haryana">Haryana (हरियाणा)</option>
                    <option value="Delhi">Delhi / NCR (दिल्ली)</option>
                    <option value="Gujarat">Gujarat (गुजरात)</option>
                    <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                    <option value="Jharkhand">Jharkhand (झारखंड)</option>
                    <option value="Chhattisgarh">Chhattisgarh (छत्तीसगढ़)</option>
                    <option value="Punjab">Punjab (पंजाब)</option>
                    <option value="Odisha">Odisha (ओडिशा)</option>
                    <option value="Assam">Assam (असम)</option>
                    <option value="All India">Other State / All India (अखिल भारतीय)</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold">{strings.goalLabel}</label>
                  <select
                    className="form-select-sm text-xs rounded-xl"
                    style={{ height: '40px', width: '100%' }}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="ITI Fitter / Railway ALP">ITI Fitter / Railway ALP & Technician</option>
                    <option value="ITI Electrician / BHEL">ITI Electrician / BHEL & Bijli Vibhag</option>
                    <option value="Railway NTPC & Group D">Railway NTPC & Group D</option>
                    <option value="SSC GD & Police Bharti">SSC GD & State Police Bharti</option>
                    <option value="All India Apprentice">All India PSU & Railway Apprentice</option>
                    <option value="Banking PO & Clerk">Banking PO & Clerk / Apprentice</option>
                    <option value="State PSC / Police">State PSC / Constable / SI</option>
                    <option value="Private MNC Apprentice">Private MNC (Tata / Maruti / L&T)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
                    border: 'none'
                  }}
                >
                  <Sparkles size={14} className="text-warning" /> {strings.startBtn}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
