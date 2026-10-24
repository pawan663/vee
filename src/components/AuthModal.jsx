import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, CheckCircle2, Shield, ArrowRight, RefreshCw, Key, User, Lock, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t, currentLang = 'hi' }) {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'profile'
  
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

  const strings = {
    badge: isHi ? '🛡️ सुरक्षित अभ्यर्थी लॉगिन' : '🛡️ SECURE ASPIRANT LOGIN',
    title: isHi ? 'VEE ऐप में आपका स्वागत है' : 'Welcome to VEE',
    subtitle: isHi 
      ? 'भारत का #1 रियल-टाइम सरकारी व प्राइवेट भर्ती पोर्टल 🎯' 
      : "India's #1 Real-Time Sarkari & Private Jobs Hub 🎯",
    googleBtn: isHi ? 'Google से 1-क्लिक साइन इन करें' : 'Continue with Google',
    orDivider: isHi ? 'या मोबाइल नंबर से जारी रखें' : 'OR CONTINUE WITH MOBILE',
    phoneLabel: isHi ? '10-अंकों का मोबाइल नंबर दर्ज करें:' : 'Enter 10-Digit Mobile Number:',
    autoOtpBadge: isHi ? '⚡ तुरंत ऑटो-ओटीपी' : '⚡ Instant Auto-OTP',
    phonePlaceholder: 'e.g. 9829012345',
    getOtpBtn: isHi ? 'ओटीपी प्राप्त करें' : 'Get Verification Code',
    sendingOtp: isHi ? 'ओटीपी भेजा जा रहा है...' : 'Sending OTP...',
    skipBtn: isHi ? 'अतिथि के रूप में सीधे देखें →' : 'Skip & Explore as Guest →',
    skipNote: isHi 
      ? 'आप बिना लॉगिन किए भी 150+ लाइव भर्तियां देख सकते हैं।' 
      : 'Explore 150+ live verified vacancies without signing in.',
    
    // OTP Step
    otpTitle: isHi ? 'मोबाइल नंबर सत्यापन' : 'Verify Mobile Number',
    otpSub: isHi ? 'दिए गए 4-अंकों के सुरक्षा कोड को दर्ज करें:' : 'Enter the 4-digit code sent to:',
    smsDetected: isHi ? '📲 ऑटो-एसएमएस वेरिफिकेशन डिटेक्टेड' : '📲 SMS Verification Auto-Detected',
    secOtpLabel: isHi ? 'ओटीपी कोड:' : 'Security OTP:',
    autoFilling: isHi ? '⚡ बॉक्स में कोड भरा जा रहा है...' : '⚡ Auto-filling 4-digit code...',
    autoFilled: isHi ? '✅ कोड भर दिया गया! नीचे सत्यापित करें पर क्लिक करें।' : '✅ Code auto-filled! Click verify below.',
    verifyBtn: isHi ? 'ओटीपी सत्यापित करें और लॉगिन करें' : 'Verify OTP & Continue',
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
      name: fullName.trim() || (isHi ? 'अभ्यर्थी (Aspirant)' : 'VEE Aspirant'),
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

    if (onLoginSuccess) {
      onLoginSuccess(updatedProfile);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
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
        isLoggedIn: true,
        loginMethod: 'google',
        loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      completeLogin(googleUser);
    }, 600);
  };

  return (
    <div className="modal-overlay auth-modal-backdrop" onClick={onClose}>
      <div
        className="modal-content bottom-sheet auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -12px 48px rgba(15, 23, 42, 0.35)',
          maxWidth: '460px',
          margin: '0 auto',
          background: 'var(--bg-card, #FFFFFF)'
        }}
      >
        {/* Sleek Professional Header */}
        <div
          className="auth-header-card p-3.5 text-center"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #4F46E5 100%)',
            borderRadius: '24px 24px 0 0',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle grabber */}
          <div className="sheet-grabber" style={{ background: 'rgba(255,255,255,0.45)' }}></div>
          
          <button
            className="icon-btn auth-close-btn"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#FFFFFF',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={18} />
          </button>

          {/* VEE Trust Badge */}
          <div className="flex-center justify-center gap-2 mt-1">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.8)'
              }}
            >
              🚀
            </div>
            <div className="text-left">
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '800',
                  letterSpacing: '0.6px',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-block'
                }}
              >
                {strings.badge}
              </span>
              <h3 className="font-extrabold text-base m-0 leading-tight text-white mt-0.5">
                {step === 'profile' ? strings.profileTitle : (step === 'otp' ? strings.otpTitle : strings.title)}
              </h3>
            </div>
          </div>

          <p
            style={{
              fontSize: '11px',
              color: 'rgba(238, 242, 255, 0.9)',
              margin: '8px 0 0',
              fontWeight: '500'
            }}
          >
            {step === 'profile' ? strings.profileSub : (step === 'otp' ? `${strings.otpSub} ${countryCode} ${phoneNumber}` : strings.subtitle)}
          </p>
        </div>

        {/* Modal Body */}
        <div className="sheet-body p-4" style={{ background: 'var(--bg-card, #FFFFFF)' }}>
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

          {/* STEP 1: Fast Login (Google 1-Tap + Mobile OTP) */}
          {step === 'input' && (
            <div>
              {/* Primary 1-Click Google Sign-In Hero Button */}
              <button
                type="button"
                className="google-auth-btn w-full p-3 rounded-xl flex-center justify-center gap-2.5 font-bold text-xs shadow-sm cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#1E293B',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{strings.googleBtn}</span>
              </button>

              {/* Clean Divider */}
              <div className="flex-center my-3.5">
                <div className="flex-1 border-top" style={{ borderColor: 'var(--border, #E2E8F0)' }}></div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: 'var(--text-muted, #64748B)',
                    padding: '0 10px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {strings.orDivider}
                </span>
                <div className="flex-1 border-top" style={{ borderColor: 'var(--border, #E2E8F0)' }}></div>
              </div>

              {/* Mobile Phone Input Form */}
              <form onSubmit={handleSendOtp}>
                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold flex-between">
                    <span>{strings.phoneLabel}</span>
                    <span
                      style={{
                        fontSize: '9.5px',
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
                  
                  <div className="flex-row items-center gap-2 mt-1.5">
                    <select
                      className="p-2.5 rounded-xl border text-xs font-bold cursor-pointer"
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        setErrorMsg('');
                      }}
                      style={{
                        minWidth: '95px',
                        height: '44px',
                        borderColor: 'var(--border, #CBD5E1)',
                        background: 'var(--bg-app, #F8FAFC)'
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
                        height: '44px',
                        letterSpacing: '0.5px',
                        borderColor: 'var(--border, #CBD5E1)',
                        padding: '0 12px'
                      }}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-3 rounded-xl shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    border: 'none',
                    color: '#FFFFFF'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> {strings.sendingOtp}
                    </>
                  ) : (
                    <>
                      <span>📱 {strings.getOtpBtn}</span> <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Guest / Skip Option */}
              <div className="mt-3.5 pt-2.5 text-center border-top" style={{ borderColor: 'var(--border, #E2E8F0)' }}>
                <button
                  type="button"
                  className="btn-secondary w-full text-xs font-semibold py-2.5 rounded-xl flex-center justify-center gap-1.5 cursor-pointer"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: '1.5px dashed var(--border, #CBD5E1)',
                    color: 'var(--text-secondary, #475569)'
                  }}
                >
                  <Compass size={14} />
                  <span>{strings.skipBtn}</span>
                </button>
                <p className="text-3xs text-muted mt-1.5 m-0">
                  {strings.skipNote}
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Auto-Fill & Instant Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              {/* Verification Auto-Detect Card */}
              <div
                className="p-3.5 rounded-xl mb-3.5 text-center"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  border: '1.5px solid #93C5FD'
                }}
              >
                <span className="text-3xs text-blue-700 font-bold block uppercase flex-center justify-center gap-1">
                  <span className="live-pill-indicator"></span> {strings.smsDetected}
                </span>

                <div className="mt-2 flex-center justify-center gap-2">
                  <span className="text-xs text-secondary font-semibold">{strings.secOtpLabel}</span>
                  <span
                    className="font-mono text-lg font-extrabold px-3 py-1 rounded-lg text-white"
                    style={{ background: '#2563EB', letterSpacing: '3px', boxShadow: '0 2px 6px rgba(37,99,235,0.4)' }}
                  >
                    {generatedOtp}
                  </span>
                </div>

                {isAutoFilling && (
                  <span className="text-3xs text-blue-600 block mt-2 animate-pulse font-medium">
                    {strings.autoFilling}
                  </span>
                )}
                {!isAutoFilling && otp && (
                  <span className="text-3xs text-emerald-700 font-bold block mt-2">
                    {strings.autoFilled}
                  </span>
                )}
              </div>

              <div className="form-group mb-3.5">
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
                    height: '50px',
                    borderColor: otp ? '#10B981' : 'var(--border, #CBD5E1)',
                    background: 'var(--bg-app, #F8FAFC)'
                  }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-success w-full text-xs font-bold flex-center justify-center gap-1.5 py-3 rounded-xl shadow-md cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> {strings.verifying}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> <span>{strings.verifyBtn}</span>
                  </>
                )}
              </button>

              <div className="mt-3 text-center">
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

          {/* STEP 3: Quick Profile Confirmation */}
          {step === 'profile' && (
            <form onSubmit={(e) => { e.preventDefault(); completeLogin(); }}>
              <div
                className="p-3 rounded-xl mb-3.5 text-center"
                style={{ background: '#ECFDF5', border: '1.5px solid #86EFAC' }}
              >
                <span className="text-xs font-bold text-success flex-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> {strings.mobileVerified}
                </span>
                <span className="text-3xs text-muted block mt-1">
                  {strings.profileSub}
                </span>
              </div>

              <div className="form-group mb-2.5">
                <label className="form-label text-xs font-semibold">{strings.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={strings.namePlaceholder}
                  className="form-input text-xs rounded-xl"
                  style={{ height: '42px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group mb-2.5">
                <label className="form-label text-xs font-semibold">{strings.stateLabel}</label>
                <select
                  className="form-select-sm text-xs rounded-xl"
                  style={{ height: '42px', width: '100%' }}
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
                  <option value="All India">Other State / All India (अखिल भारतीय)</option>
                </select>
              </div>

              <div className="form-group mb-3.5">
                <label className="form-label text-xs font-semibold">{strings.goalLabel}</label>
                <select
                  className="form-select-sm text-xs rounded-xl"
                  style={{ height: '42px', width: '100%' }}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="ITI Fitter / Railway ALP">ITI Fitter / Railway ALP & Technician</option>
                  <option value="ITI Electrician / BHEL">ITI Electrician / BHEL & Bijli Vibhag</option>
                  <option value="Railway NTPC & Group D">Railway NTPC & Group D</option>
                  <option value="SSC GD & Police Bharti">SSC GD & State Police Bharti</option>
                  <option value="All India Apprentice">All India PSU & Railway Apprentice</option>
                  <option value="Banking PO & Clerk">Banking PO & Clerk / Apprentice</option>
                  <option value="Private MNC Apprentice">Private MNC (Tata / Maruti / L&T)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-3 rounded-xl shadow-md cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                  border: 'none'
                }}
              >
                <Sparkles size={15} className="text-warning" /> {strings.startBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
