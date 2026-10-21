import React, { useState } from 'react';
import { X, Phone, Mail, CheckCircle2, Shield, ArrowRight, RefreshCw, Key, User, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentProfile, t }) {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'profile'
  
  // Inputs
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4826');
  const [fullName, setFullName] = useState(currentProfile?.name || '');
  const [state, setState] = useState(currentProfile?.state || 'Rajasthan');
  const [goal, setGoal] = useState(currentProfile?.goal || 'ITI Fitter / Railway ALP');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp !== generatedOtp && otp !== '1234') {
      setErrorMsg(`Galat OTP! Kripya upar screen par dikhaya gaya code (${generatedOtp}) dalein.`);
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
    }, 500);
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
        particleCount: 70,
        spread: 60,
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
        email: 'pawan.meena@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isLoggedIn: true,
        loginMethod: 'google',
        loginDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      completeLogin(googleUser);
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-grabber"></div>
          <div className="flex-between">
            <div className="flex-center-start gap-1.5">
              <Shield size={18} className="text-primary" />
              <h3 className="sheet-title font-bold text-sm">
                {step === 'profile' ? 'Apna Naam & Rajya Chunein' : 'VEE Aspirant Account Login'}
              </h3>
            </div>
            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <p className="text-3xs text-muted mt-0.5">
            Apne saved jobs, tracked forms aur CV ko hamesha surakshit rakhne ke liye login karein
          </p>

          {/* Method Switcher Pills (Only in Step 1) */}
          {step === 'input' && (
            <div className="pill-row mt-2.5 flex-row gap-1.5">
              <button
                type="button"
                className={`pill-btn text-2xs flex-1 ${authMethod === 'phone' ? 'active' : ''}`}
                onClick={() => { setAuthMethod('phone'); setErrorMsg(''); }}
              >
                <Phone size={13} /> 📱 Mobile Number (OTP)
              </button>
              <button
                type="button"
                className={`pill-btn text-2xs flex-1 ${authMethod === 'email' ? 'active' : ''}`}
                onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
              >
                <Mail size={13} /> ✉️ Email ID
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="sheet-body">
          {errorMsg && (
            <div className="p-2 mb-3 rounded text-3xs font-semibold bg-danger-light text-danger border border-danger">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: Phone / Email Input */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp}>
              {authMethod === 'phone' ? (
                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold">
                    {countryCode === '+91' ? 'Aapka 10-Digit Mobile Number:' : `Aapka Mobile Number (${countryCode}):`}
                  </label>
                  <div className="flex-row items-center gap-1.5 mt-1">
                    <select
                      className="p-2 rounded bg-light border text-xs font-bold cursor-pointer"
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        setErrorMsg('');
                      }}
                      style={{ minWidth: '95px', height: '38px', borderColor: 'var(--border)' }}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+977">🇳🇵 +977</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <input
                      type="tel"
                      required
                      maxLength={countryCode === '+91' ? 10 : 13}
                      placeholder={countryCode === '+64' ? 'e.g. 21 0234 567' : 'e.g. 9829012345'}
                      className="form-input text-xs flex-1"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                  <p className="text-3xs text-muted mt-1">
                    📲 Is number par 4-digit ka verification security code aayega.
                  </p>
                </div>
              ) : (
                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold">Aapki Email ID:</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. apna.naam@gmail.com"
                    className="form-input text-xs mt-1"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    autoFocus
                  />
                  <p className="text-3xs text-muted mt-1">
                    ✉️ Is email par turant login verification code aayega.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full text-xs font-bold flex-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> OTP Bheja Ja Raha Hai...
                  </>
                ) : (
                  <>
                    OTP Prapt Karein <ArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Google 1-Click Login Option */}
              <div className="mt-3 pt-3 border-top text-center">
                <span className="text-3xs text-muted block mb-2">Ya 1-Click me Google se connect karein:</span>
                <button
                  type="button"
                  className="btn-secondary w-full text-xs font-semibold flex-center gap-2 border p-2 rounded"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Se Sign In Karein</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              {/* Demo Helper Banner so user is never stuck */}
              <div className="demo-otp-banner p-2.5 rounded mb-3 text-center" style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px dashed #2563EB' }}>
                <span className="text-3xs text-muted block">VEE Auto-SMS Simulation:</span>
                <span className="text-xs font-extrabold text-primary">
                  🔑 Aapka Security OTP Code: <b className="text-danger font-mono text-sm">{generatedOtp}</b>
                </span>
                <span className="text-3xs text-muted block mt-0.5">(Neeche box me dalein aur Verify karein)</span>
              </div>

              <div className="form-group mb-3">
                <label className="form-label text-xs font-semibold">
                  {authMethod === 'phone' ? `${countryCode} ${phoneNumber} par bheja gaya OTP:` : `${emailAddress} par bheja gaya OTP:`}
                </label>
                <input
                  type="text"
                  required
                  maxLength="4"
                  placeholder="e.g. 4826"
                  className="form-input text-center text-lg font-mono font-bold tracking-widest mt-1"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-success w-full text-xs font-bold flex-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Verify Ho Raha Hai...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} /> OTP Verify & Login Karein
                  </>
                )}
              </button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="btn-clear text-3xs text-muted underline cursor-pointer"
                  onClick={() => { setStep('input'); setOtp(''); }}
                >
                  Number / Email Badlein
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Quick Profile Confirmation */}
          {step === 'profile' && (
            <form onSubmit={(e) => { e.preventDefault(); completeLogin(); }}>
              <div className="p-2.5 rounded mb-3" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #86EFAC' }}>
                <span className="text-xs font-bold text-success flex-center gap-1">
                  <CheckCircle2 size={14} /> Verification Successful!
                </span>
                <span className="text-3xs text-muted block text-center mt-0.5">
                  Bas 2 seconds me apni details confirm karke continue karein:
                </span>
              </div>

              <div className="form-group mb-2">
                <label className="form-label text-xs font-semibold">Aapka Poora Naam:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pawan Meena"
                  className="form-input text-xs"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group mb-2">
                <label className="form-label text-xs font-semibold">Aapka Rajya (Home State):</label>
                <select
                  className="form-select-sm text-xs"
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
                  <option value="All India">Other State</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label text-xs font-semibold">Target Bharti / Exam Goal:</label>
                <select
                  className="form-select-sm text-xs"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="ITI Fitter / Railway ALP">ITI Fitter / Railway ALP</option>
                  <option value="ITI Electrician / BHEL">ITI Electrician / BHEL & Bijli Vibhag</option>
                  <option value="Railway NTPC & Group D">Railway NTPC & Group D</option>
                  <option value="SSC GD & Police Bharti">SSC GD & State Police Bharti</option>
                  <option value="Banking PO & Clerk">Banking PO & Clerk / Apprentice</option>
                  <option value="Private MNC Apprentice">Private MNC (Tata / Maruti / L&T)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-xs font-bold flex-center gap-1"
              >
                <Sparkles size={14} className="text-warning" /> Start Using VEE App
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
