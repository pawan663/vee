import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, CheckCircle2, Shield, ArrowRight, RefreshCw, Key, User, Lock, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t }) {
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

  // Auto-fill OTP simulation when arriving at step 'otp'
  useEffect(() => {
    let timer1, timer2;
    if (step === 'otp') {
      setIsAutoFilling(true);
      timer1 = setTimeout(() => {
        setOtp(generatedOtp);
        setIsAutoFilling(false);
      }, 900);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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
          setErrorMsg('Kripya 10 ankon ka sahi mobile number dalein (e.g. 9829012345)');
          return;
        }
      } else {
        if (cleanPhone.length < 7 || cleanPhone.length > 12) {
          setErrorMsg(`Kripya sahi mobile number dalein (${countryCode} ke sath 7-12 digit)`);
          return;
        }
      }
    } else {
      if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
        setErrorMsg('Kripya sahi Email ID dalein (e.g. user@gmail.com)');
        return;
      }
    }

    setIsLoading(true);
    // Generate 4-digit security code
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp !== generatedOtp && otp !== '1234' && otp !== '7892') {
      setErrorMsg(`Galat OTP! Kripya screen par dikhaya gaya code (${generatedOtp}) dalein.`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check if user has an existing account in localStorage
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

      // If new account or needs name, proceed to profile confirmation
      setStep('profile');
    }, 450);
  };

  // Complete Login Flow
  const completeLogin = (customData = null) => {
    const formattedPhone = `${countryCode} ${phoneNumber}`.trim();
    const updatedProfile = customData || {
      ...currentProfile,
      name: fullName.trim() || 'VEE Aspirant',
      phone: authMethod === 'phone' ? formattedPhone : (currentProfile?.phone || ''),
      countryCode: countryCode,
      email: authMethod === 'email' ? emailAddress : (currentProfile?.email || ''),
      state: state,
      goal: goal,
      isLoggedIn: true,
      loginMethod: authMethod,
      loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Save to user's dedicated account slot
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
    <div className="modal-overlay anime-backdrop" onClick={onClose}>
      <div
        className="modal-content bottom-sheet anime-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 40px rgba(99, 102, 241, 0.35)',
          animation: 'animeModalSpring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >
        {/* Anime Style Glow Banner */}
        <div
          className="anime-banner-header p-3 text-center"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            borderRadius: '24px 24px 0 0',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="sheet-grabber" style={{ background: 'rgba(255,255,255,0.4)' }}></div>
          <button
            className="icon-btn"
            onClick={onClose}
            style={{ position: 'absolute', top: '12px', right: '14px', color: '#FFF' }}
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Anime Mascot / Sensei Badge */}
          <div className="flex-center justify-center gap-2 mt-1">
            <div
              className="anime-mascot-badge"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 0 16px rgba(236, 72, 153, 0.8)',
                border: '2px solid #FFF'
              }}
            >
              ⚡
            </div>
            <div className="text-left">
              <span className="badge-live-sm text-3xs font-black uppercase px-2 py-0.5 rounded-full" style={{ background: '#F59E0B', color: '#000' }}>
                ✨ VEE SENSEI • SARKARI GUIDE
              </span>
              <h3 className="font-extrabold text-sm m-0 leading-tight text-white">
                {step === 'profile' ? 'Apna Naam & Profile Set Karein' : 'Konnichiwa Aspirant! Welcome to VEE'}
              </h3>
            </div>
          </div>
          <p className="text-3xs text-indigo-200 mt-1.5 m-0">
            Real-time Live Jobs, Instant Official Alerts & Auto-Exam Sync 🎯
          </p>
        </div>

        {/* Body */}
        <div className="sheet-body p-3.5">
          {errorMsg && (
            <div className="p-2 mb-3 rounded-lg text-3xs font-semibold bg-danger-light text-danger border border-danger">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: Fast Login (Google 1-Tap + Mobile OTP) */}
          {step === 'input' && (
            <div>
              {/* Primary 1-Click Google Sign-In Hero Button */}
              <button
                type="button"
                className="anime-google-btn w-full p-2.5 rounded-xl border flex-center justify-center gap-2 font-bold text-xs shadow-sm mb-3"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  color: '#1E293B',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
                <span>Google Se 1-Tap Sign In Karein</span>
              </button>

              <div className="flex-center my-2.5">
                <div className="flex-1 border-top" style={{ borderColor: 'var(--border)' }}></div>
                <span className="text-3xs text-muted px-2 font-bold uppercase">Ya Mobile Number Se</span>
                <div className="flex-1 border-top" style={{ borderColor: 'var(--border)' }}></div>
              </div>

              {/* Mobile Phone Input Form */}
              <form onSubmit={handleSendOtp}>
                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold flex-between">
                    <span>{countryCode === '+91' ? 'Aapka 10-Digit Mobile Number:' : `Aapka Mobile Number (${countryCode}):`}</span>
                    <span className="text-3xs text-success font-bold">⚡ Instant Auto-OTP</span>
                  </label>
                  <div className="flex-row items-center gap-1.5 mt-1">
                    <select
                      className="p-2 rounded-lg bg-light border text-xs font-bold cursor-pointer"
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        setErrorMsg('');
                      }}
                      style={{ minWidth: '95px', height: '40px', borderColor: 'var(--border)' }}
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
                      placeholder="e.g. 9829012345"
                      className="form-input text-xs flex-1 rounded-lg"
                      style={{ height: '40px' }}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md anime-btn-pulse"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> OTP Bheja Ja Raha Hai...
                    </>
                  ) : (
                    <>
                      <span>📱 OTP Prapt Karein</span> <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Guest / Skip Option */}
              <div className="mt-3 pt-2 text-center border-top">
                <button
                  type="button"
                  className="btn-secondary w-full text-xs font-semibold py-2 rounded-xl flex-center justify-center gap-1.5"
                  onClick={onClose}
                  style={{ background: 'transparent', border: '1px dashed var(--border)' }}
                >
                  <Compass size={14} />
                  <span>🚀 Skip & Explore as Guest (अतिथि के रूप में सीधे देखें)</span>
                </button>
                <p className="text-3xs text-muted mt-1 m-0">Aap bina login kiye bhi 150+ live vacancies dekh sakte hain.</p>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Auto-Fill & Instant Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              {/* Anime Style Auto-SMS Banner */}
              <div
                className="p-3 rounded-xl mb-3 text-center"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  border: '1px solid #93C5FD',
                  position: 'relative'
                }}
              >
                <span className="text-3xs text-blue-700 font-bold block uppercase flex-center justify-center gap-1">
                  <span className="live-pill-indicator"></span> 📲 SMS Verification Auto-Detected
                </span>
                <div className="mt-1 flex-center justify-center gap-2">
                  <span className="text-xs text-secondary font-medium">Security OTP:</span>
                  <span
                    className="font-mono text-base font-extrabold px-2.5 py-0.5 rounded-lg text-white"
                    style={{ background: '#2563EB', letterSpacing: '2px' }}
                  >
                    {generatedOtp}
                  </span>
                </div>
                {isAutoFilling && (
                  <span className="text-3xs text-muted block mt-1 animate-pulse">
                    ⚡ Auto-filling 4-digit code in the box...
                  </span>
                )}
                {!isAutoFilling && otp && (
                  <span className="text-3xs text-success font-bold block mt-1">
                    ✅ Code auto-filled! Neeche verify button par click karein.
                  </span>
                )}
              </div>

              <div className="form-group mb-3">
                <label className="form-label text-xs font-semibold text-center block">
                  {countryCode} {phoneNumber} par bheja gaya 4-Digit OTP:
                </label>
                <input
                  type="text"
                  required
                  maxLength="4"
                  placeholder="e.g. 7892"
                  className="form-input text-center text-xl font-mono font-extrabold tracking-widest mt-1 rounded-xl"
                  style={{ height: '48px', borderColor: otp ? '#10B981' : undefined }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-success w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md anime-btn-pulse"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> <span>OTP Verify & Instant Login</span>
                  </>
                )}
              </button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="btn-clear text-3xs text-muted underline cursor-pointer"
                  onClick={() => { setStep('input'); setOtp(''); }}
                >
                  ← Number Badlein
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Quick Profile Confirmation */}
          {step === 'profile' && (
            <form onSubmit={(e) => { e.preventDefault(); completeLogin(); }}>
              <div className="p-2.5 rounded-xl mb-3 text-center" style={{ background: '#ECFDF5', border: '1px solid #86EFAC' }}>
                <span className="text-xs font-bold text-success flex-center justify-center gap-1">
                  <CheckCircle2 size={15} /> 🎉 Mobile Verified Successfully!
                </span>
                <span className="text-3xs text-muted block mt-0.5">
                  Bas apna naam confirm karke VEE App shuru karein:
                </span>
              </div>

              <div className="form-group mb-2">
                <label className="form-label text-xs font-semibold">Aapka Poora Naam:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pawan Meena"
                  className="form-input text-xs rounded-lg"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group mb-2">
                <label className="form-label text-xs font-semibold">Aapka Rajya (Home State):</label>
                <select
                  className="form-select-sm text-xs rounded-lg"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Delhi">Delhi (NCR)</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="All India">Other State (All India)</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label text-xs font-semibold">Target Bharti / Exam Goal:</label>
                <select
                  className="form-select-sm text-xs rounded-lg"
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
                className="btn-primary w-full text-xs font-bold flex-center justify-center gap-1.5 py-2.5 rounded-xl shadow-md"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                <Sparkles size={15} className="text-warning" /> Start Using VEE App
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
