import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Award,
  Globe,
  Moon,
  Sun,
  Star,
  Share2,
  Shield,
  Lock,
  Wrench,
  ChevronRight,
  Edit3,
  MapPin,
  Target,
  GraduationCap,
  X,
  Check,
  Copy,
  Clock,
  Calendar,
  PlusCircle,
  Trash2,
  FileText,
  Upload,
  Download,
  Eye,
  Image as ImageIcon,
  Camera,
  ExternalLink
} from 'lucide-react';

export default function ProfileTab({
  userProfile,
  onUpdateProfile,
  appliedJobs = [],
  onUpdateAppliedJobs,
  savedJobIds = [],
  allJobs = [],
  liveNews = [],
  onOpenJob,
  onOpenTools,
  onOpenReview,
  onOpenLegal,
  currentLang = 'en',
  onChangeLang,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  onLogout,
  onClearData,
  lastSyncedTime,
  onManualSync,
  isSyncing,
  t
}) {
  const [activeSection, setActiveSection] = useState('applied'); // 'applied' | 'vault' | 'saved' | 'badges'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTrackerOpen, setIsAddTrackerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // New Tracker Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newStage, setNewStage] = useState('applied');

  // Edit form state
  const [editName, setEditName] = useState(userProfile.name);
  const [editState, setEditState] = useState(userProfile.state || 'Rajasthan');
  const [editGoal, setEditGoal] = useState(userProfile.goal || 'Railway ALP & Technician (RRB 2026)');
  const [editQual, setEditQual] = useState(userProfile.qual || 'ITI Pass');
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editCategory, setEditCategory] = useState(userProfile.category || 'OBC');
  const [editPhone, setEditPhone] = useState(userProfile.phone || '');
  const [editDob, setEditDob] = useState(userProfile.dob || '2003-05-15');

  const isEn = currentLang === 'en';
  const isHi = currentLang === 'hi';

  const savedJobsList = allJobs.filter((j) => savedJobIds.includes(j.id));

  const handleUpdateStage = (index, nextStage) => {
    if (!onUpdateAppliedJobs) return;
    const updated = [...appliedJobs];
    updated[index] = { ...updated[index], stage: nextStage };
    onUpdateAppliedJobs(updated);
  };

  const handleRemoveTrackedJob = (index) => {
    if (!onUpdateAppliedJobs) return;
    const msg = isEn ? "Do you want to remove this application from the tracker?" : "क्या आप इस फॉर्म को ट्रैकर से हटाना चाहते हैं?";
    if (window.confirm(msg)) {
      const updated = appliedJobs.filter((_, i) => i !== index);
      onUpdateAppliedJobs(updated);
    }
  };

  const handleConfirmNormalLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) onLogout();
  };

  const handleConfirmDeleteData = () => {
    setIsLogoutModalOpen(false);
    if (onClearData) {
      onClearData();
      alert(isEn ? "All your profile details and saved data have been permanently deleted from this device." : "आपका अकाउंट और सारा डेटा हमेशा के लिए हटा दिया गया है।");
    } else if (onLogout) {
      onLogout();
    }
  };

  const handleCreateTracker = (e) => {
    if (e) e.preventDefault();
    if (!newJobTitle.trim()) {
      alert(isEn ? "Please enter Job / Vacancy title" : "कृपया भर्ती या फॉर्म का नाम दर्ज करें");
      return;
    }
    const newEntry = {
      job: {
        id: 'manual-' + Date.now(),
        title: newJobTitle.trim(),
        dept: newJobDept.trim() || (isEn ? 'Govt Department' : 'सरकारी विभाग'),
        posts: 'Tracked',
        qualification: 'As per Form',
        lastDate: 'Tracked',
        officialLink: 'https://www.sarkariresult.com'
      },
      regNo: newRegNo.trim() || ('REG' + Math.floor(100000 + Math.random() * 900000)),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      stage: newStage
    };
    if (onUpdateAppliedJobs) {
      onUpdateAppliedJobs([newEntry, ...appliedJobs]);
    }
    setNewJobTitle('');
    setNewJobDept('');
    setNewRegNo('');
    setNewStage('applied');
    setIsAddTrackerOpen(false);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name: editName,
      state: editState,
      goal: editGoal,
      qual: editQual,
      avatar: editAvatar,
      category: editCategory,
      phone: editPhone,
      dob: editDob
    });
    setIsEditModalOpen(false);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isEn ? "Resume file size must be less than 5MB!" : "रिज्यूम फ़ाइल का आकार 5MB से कम होना चाहिए!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const updated = {
        ...userProfile,
        resume: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          dataUrl: reader.result
        }
      };
      onUpdateProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    const msg = isEn ? "Do you want to remove your uploaded resume?" : "क्या आप अपना अपलोड किया हुआ रिज्यूम हटाना चाहते हैं?";
    if (window.confirm(msg)) {
      const updated = { ...userProfile };
      delete updated.resume;
      onUpdateProfile(updated);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = {
        ...userProfile,
        photo: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          dataUrl: reader.result
        }
      };
      onUpdateProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = {
        ...userProfile,
        signature: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          dataUrl: reader.result
        }
      };
      onUpdateProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(isEn ? 'Please select a valid image file (JPG / PNG).' : 'कृपया एक मान्य फोटो फ़ाइल (JPG / PNG) चुनें।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetSize = 220;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditAvatar(compressedDataUrl);
        onUpdateProfile({ ...userProfile, avatar: compressedDataUrl });
      };
      img.src = loadEvt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getLangDisplayName = () => {
    switch (currentLang) {
      case 'hi': return 'हिंदी';
      case 'hinglish': return 'Hinglish';
      case 'mr': return 'मराठी';
      case 'bn': return 'বাংলা';
      default: return 'English';
    }
  };

  return (
    <div className="profile-container" style={{ padding: '12px 14px 28px', maxWidth: '440px', margin: '0 auto' }}>
      {/* ===================================================================
          0. MASTER ASPIRANT PROFILE CARD (PHOTO, NAME, TARGET & STATS)
          =================================================================== */}
      <div
        className="profile-header-card profile-vip-card p-3 mb-2.5"
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* VIP Ribbon */}
        <div className="vip-ribbon flex-between mb-2">
          <span className="vip-crown-badge flex-center gap-1 font-bold text-3xs">
            👑 <span>VEE VIP ASPIRANT</span>
          </span>
          <span className="vip-tier-badge text-3xs font-extrabold">⭐ GOLD TIER</span>
        </div>

        <div className="flex-row gap-3 items-center">
          {/* Avatar with Camera Upload Icon */}
          <div className="avatar-wrapper position-relative" style={{ width: '54px', height: '54px', minWidth: '54px', flexShrink: 0 }}>
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="user-profile-avatar vip-avatar"
              style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span className="avatar-level-badge">LVL 12</span>

            <input
              type="file"
              id="direct-avatar-file-input"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="direct-avatar-file-input"
              className="avatar-edit-badge"
              title={isHi ? 'गैलरी या कैमरा से अपनी फोटो लगाएं' : 'Upload photo from gallery/camera'}
              style={{ cursor: 'pointer' }}
            >
              <Camera size={11} />
            </label>
          </div>

          <div className="user-info flex-1">
            <div className="flex-between items-center mb-1">
              <div className="flex-center-start gap-1.5 flex-wrap">
                <h3 className="user-name font-bold text-base leading-none text-white">{userProfile.name}</h3>
                <span className="badge-verified-pill text-3xs font-bold flex-center gap-0.5">
                  <CheckCircle2 size={11} /> {isEn ? 'Verified' : 'सत्यापित'}
                </span>
              </div>
              <button
                className="btn-edit-profile-pill flex-center gap-1 text-2xs"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={11} /> {isEn ? 'Edit' : 'बदलें'}
              </button>
            </div>

            <p className="user-tag text-2xs text-gold flex-center-start gap-1">
              <Target size={11} className="text-warning" /> {userProfile.goal}
            </p>
            <p className="user-location text-3xs text-light-muted flex-center-start gap-1 mt-0.5">
              <MapPin size={10} /> {userProfile.state} • <GraduationCap size={10} /> {userProfile.qual}
            </p>
          </div>
        </div>

        {/* Aspirant 4-Card Analytics Grid (Compact) */}
        <div className="creator-stats-box vip-stats-grid mt-2.5 p-1.5">
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">{isEn ? 'Followers' : 'फॉलोअर्स'}</div>
            <div className="stat-card-value text-accent font-extrabold text-sm mt-0.5">{userProfile.followers || '1,240'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">{isEn ? 'Aspirant Karma' : 'कर्मा'}</div>
            <div className="stat-card-value text-success font-extrabold text-sm mt-0.5">642 🔺</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">{isEn ? 'Community Rank' : 'रैंक'}</div>
            <div className="stat-card-value text-warning font-extrabold text-sm mt-0.5">Top 5% 🏆</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">{isEn ? 'Study Streak' : 'स्ट्रीक'}</div>
            <div className="stat-card-value text-danger font-extrabold text-sm mt-0.5">14 Days 🔥</div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          1. TOP VIP / ACCOUNT STATUS CARD (COMPACT SLEEK SIZING)
          =================================================================== */}
      <div
        className="account-status-banner mb-2.5 p-2.5"
        style={{
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          background: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Blue Shield Icon Box */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
              flexShrink: 0
            }}
          >
            <Shield size={20} color="#FFFFFF" fill="#2563EB" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                Verified VEE Account
              </span>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Active <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              📱 Mobile: <b>{userProfile.phone ? (userProfile.phone.startsWith('+') ? userProfile.phone : `+91 ${userProfile.phone}`) : '+91 6375644914'}</b>
            </div>
          </div>
        </div>

        {/* Logout / Switch Button */}
        {userProfile?.isLoggedIn ? (
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            style={{
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#DC2626',
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>↗</span>
            <span>Logout / Switch</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            style={{
              border: 'none',
              background: '#1D64F2',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {isEn ? 'Login' : 'लॉगिन करें'}
          </button>
        )}
      </div>

      {/* ===================================================================
          2. 4-TAB NAVIGATION GRID (COMPACT BOX SIZES)
          =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '12px'
        }}
      >
        {/* Tab 1: My Applications */}
        <button
          type="button"
          onClick={() => setActiveSection('applied')}
          style={{
            background: activeSection === 'applied' ? '#1D64F2' : '#FFFFFF',
            color: activeSection === 'applied' ? '#FFFFFF' : '#1E293B',
            border: activeSection === 'applied' ? 'none' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '8px 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: activeSection === 'applied' ? '0 3px 10px rgba(29, 100, 242, 0.25)' : 'none',
            transition: 'all 0.18s'
          }}
        >
          <FileText size={18} color={activeSection === 'applied' ? '#FFFFFF' : '#2563EB'} />
          <span style={{ fontSize: '10px', fontWeight: '700', textAlign: 'center', lineHeight: '1.2' }}>
            {isEn ? 'My Applications' : 'मेरे आवेदन'}
            <span style={{ display: 'block', fontSize: '10px', fontWeight: '700' }}>({appliedJobs.length})</span>
          </span>
        </button>

        {/* Tab 2: CV & Vault */}
        <button
          type="button"
          onClick={() => setActiveSection('vault')}
          style={{
            background: activeSection === 'vault' ? '#1D64F2' : '#FFFFFF',
            color: activeSection === 'vault' ? '#FFFFFF' : '#1E293B',
            border: activeSection === 'vault' ? 'none' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '8px 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: activeSection === 'vault' ? '0 3px 10px rgba(29, 100, 242, 0.25)' : 'none',
            transition: 'all 0.18s'
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: '18px' }}>📁</span>
          <span style={{ fontSize: '10px', fontWeight: '700', textAlign: 'center', lineHeight: '1.2' }}>
            CV & Vault
          </span>
        </button>

        {/* Tab 3: Saved */}
        <button
          type="button"
          onClick={() => setActiveSection('saved')}
          style={{
            background: activeSection === 'saved' ? '#1D64F2' : '#FFFFFF',
            color: activeSection === 'saved' ? '#FFFFFF' : '#1E293B',
            border: activeSection === 'saved' ? 'none' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '8px 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: activeSection === 'saved' ? '0 3px 10px rgba(29, 100, 242, 0.25)' : 'none',
            transition: 'all 0.18s'
          }}
        >
          <Bookmark size={18} color={activeSection === 'saved' ? '#FFFFFF' : '#2563EB'} />
          <span style={{ fontSize: '10px', fontWeight: '700', textAlign: 'center', lineHeight: '1.2' }}>
            {isEn ? 'Saved' : 'सेव्ड'}
            <span style={{ display: 'block', fontSize: '10px', fontWeight: '700' }}>({savedJobsList.length})</span>
          </span>
        </button>

        {/* Tab 4: Badges & Level */}
        <button
          type="button"
          onClick={() => setActiveSection('badges')}
          style={{
            background: activeSection === 'badges' ? '#1D64F2' : '#FFFFFF',
            color: activeSection === 'badges' ? '#FFFFFF' : '#1E293B',
            border: activeSection === 'badges' ? 'none' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '8px 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: activeSection === 'badges' ? '0 3px 10px rgba(29, 100, 242, 0.25)' : 'none',
            transition: 'all 0.18s'
          }}
        >
          <Award size={18} color={activeSection === 'badges' ? '#FFFFFF' : '#D97706'} />
          <span style={{ fontSize: '10px', fontWeight: '700', textAlign: 'center', lineHeight: '1.2' }}>
            {isEn ? 'Badges & Level' : 'बैज व लेवल'}
          </span>
        </button>
      </div>

      {/* ===================================================================
          3. SECTION 1: LIVE APPLICATION TRACKER (100% MATCH WITH IMAGE 2)
          =================================================================== */}
      {activeSection === 'applied' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}
        >
          {/* Header Title & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              {isEn ? 'Live Application Tracker' : 'लाइव एप्लीकेशन ट्रैकर'}
            </h3>
            <span
              style={{
                background: '#DBEAFE',
                color: '#1D4ED8',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              {appliedJobs.length}
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 18px' }}>
            {isEn ? 'Track your government job application progress' : 'अपनी सरकारी नौकरी फॉर्म व परीक्षा की प्रगति ट्रैक करें'}
          </p>

          {/* Horizontal 5-Step Stepper (Image 2 Stepper) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
              position: 'relative',
              padding: '0 6px'
            }}
          >
            {/* Background connecting line */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '24px',
                right: '24px',
                height: '2px',
                background: '#E2E8F0',
                zIndex: 0
              }}
            />

            {/* Step 1: Applied */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2.5px solid #1D64F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D64F2' }} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#1D64F2' }}>
                {isEn ? 'Applied' : 'आवेदन'}
              </span>
            </div>

            {/* Step 2: Admit Card */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #CBD5E1'
                }}
              />
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748B' }}>
                {isEn ? 'Admit Card' : 'एडमिट कार्ड'}
              </span>
            </div>

            {/* Step 3: Exam */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #CBD5E1'
                }}
              />
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748B' }}>
                {isEn ? 'Exam' : 'परीक्षा'}
              </span>
            </div>

            {/* Step 4: Result */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #CBD5E1'
                }}
              />
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748B' }}>
                {isEn ? 'Result' : 'रिजल्ट'}
              </span>
            </div>

            {/* Step 5: Complete */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #CBD5E1'
                }}
              />
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748B' }}>
                {isEn ? 'Complete' : 'ज्वाइनिंग'}
              </span>
            </div>
          </div>

          {/* Empty State vs List of Tracked Forms */}
          {appliedJobs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '14px 10px 8px' }}>
              {/* Center Document with Checkmark & Sparkles */}
              <div
                style={{
                  position: 'relative',
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <div style={{ position: 'absolute', top: '4px', left: '-8px', fontSize: '13px', color: '#60A5FA' }}>✨</div>
                <div style={{ position: 'absolute', top: '4px', right: '-8px', fontSize: '13px', color: '#60A5FA' }}>✨</div>
                <FileText size={32} color="#3B82F6" strokeWidth={1.8} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: '#1D64F2',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF'
                  }}
                >
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px' }}>
                {isEn ? 'No applications tracked yet' : 'अभी कोई आवेदन ट्रैक नहीं किया गया'}
              </h4>

              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px', maxWidth: '310px', lineHeight: '1.45' }}>
                {isEn
                  ? 'Apply to any vacancy in the Jobs tab or tap below to track any exam form.'
                  : 'Jobs tab me kisi vacancy ko apply karein ya upar button par click karke koi form track karein.'}
              </p>

              {/* Blue Action Button */}
              <button
                type="button"
                onClick={() => setIsAddTrackerOpen(true)}
                style={{
                  background: '#1D64F2',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(29, 100, 242, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: '800' }}>+</span>
                <span>{isEn ? 'Track Any Form' : 'Track Any Form'}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appliedJobs.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#1D4ED8' }}>{item.job?.dept || 'Govt Department'}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#16A34A' }}>
                      {item.stage === 'result' ? 'Result Declared' : (item.stage === 'exam' ? 'Exam Stage' : (item.stage === 'admit_card' ? 'Admit Card' : 'Applied'))}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', margin: '0 0 6px' }}>{item.job?.title}</h4>
                  <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Reg: <b>{item.regNo}</b></span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrackedJob(idx)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      {isEn ? 'Remove' : 'हटाएं'}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIsAddTrackerOpen(true)}
                style={{
                  background: '#EFF6FF',
                  color: '#1D64F2',
                  border: '1px dashed #BFDBFE',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                + {isEn ? 'Add Another Application' : 'दूसरा फॉर्म जोड़ें'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          SECTION 2: CV & VAULT (ACTIVE ONLY WHEN TAB 2 CLICKED)
          =================================================================== */}
      {activeSection === 'vault' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
            📁 {isEn ? 'Aspirant Document Vault & CV' : 'डॉक्यूमेंट वॉल्ट और सीवी'}
          </h4>

          {/* Resume Upload Box */}
          <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0F172A' }}>📄 Private Job CV / Resume</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: userProfile.resume ? '#16A34A' : '#D97706' }}>
                {userProfile.resume ? 'Active CV ✅' : 'Not Uploaded'}
              </span>
            </div>
            {userProfile.resume ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700' }}>{userProfile.resume.name}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>{userProfile.resume.size}</div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div>
                <input type="file" id="resume-file-input" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                <label
                  htmlFor="resume-file-input"
                  style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <Upload size={18} color="#2563EB" style={{ margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563EB' }}>Upload Resume (PDF/DOC)</span>
                </label>
              </div>
            )}
          </div>

          {/* Photo & Signature Vault */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>📷 Passport Photo</span>
              {userProfile.photo ? (
                <div>
                  <img src={userProfile.photo.dataUrl} alt="Photo" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700' }}>Ready 20-50KB</div>
                </div>
              ) : (
                <div>
                  <input type="file" id="photo-file-input" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <label htmlFor="photo-file-input" style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700', cursor: 'pointer', display: 'block', padding: '8px' }}>
                    + Upload Photo
                  </label>
                </div>
              )}
            </div>

            <div style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>✍️ Signature</span>
              {userProfile.signature ? (
                <div>
                  <img src={userProfile.signature.dataUrl} alt="Sign" style={{ width: '60px', height: '30px', objectFit: 'contain', margin: '9px auto 4px' }} />
                  <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700' }}>Ready 10-20KB</div>
                </div>
              ) : (
                <div>
                  <input type="file" id="sign-file-input" accept="image/*" onChange={handleSignatureUpload} style={{ display: 'none' }} />
                  <label htmlFor="sign-file-input" style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700', cursor: 'pointer', display: 'block', padding: '8px' }}>
                    + Upload Sign
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          SECTION 3: SAVED JOBS (ACTIVE ONLY WHEN TAB 3 CLICKED)
          =================================================================== */}
      {activeSection === 'saved' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
            🔖 {isEn ? 'Saved Job Vacancies' : 'सेव की गई नौकरियां'}
          </h4>
          {savedJobsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedJobsList.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onOpenJob(job)}
                  style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{job.dept}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', margin: '2px 0' }}>{job.title}</div>
                  <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600' }}>Last Date: {job.lastDate}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748B', fontSize: '12.5px' }}>
              {isEn ? 'No saved jobs yet.' : 'अभी तक कोई नौकरी सेव नहीं की गई है।'}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          SECTION 4: BADGES & LEVEL (ACTIVE ONLY WHEN TAB 4 CLICKED)
          =================================================================== */}
      {activeSection === 'badges' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '14px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
            🏆 {isEn ? 'Aspirant Badges & Rewards' : 'बैज और स्तर'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ padding: '10px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', background: '#F8FAFC' }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '2px' }}>First Apply</div>
              <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700' }}>Active ✅</div>
            </div>
            <div style={{ padding: '10px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', background: '#F8FAFC' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '2px' }}>14-Day Streak</div>
              <div style={{ fontSize: '10px', color: '#D97706', fontWeight: '700' }}>Gold Aspirant</div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          4. APP SETTINGS & UTILITIES (100% MATCH WITH IMAGE 2)
          =================================================================== */}
      <h4
        style={{
          fontSize: '11.5px',
          fontWeight: '800',
          color: '#475569',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          margin: '0 0 10px 4px'
        }}
      >
        {isEn ? 'APP SETTINGS & UTILITIES' : (isHi ? 'ऐप सेटिंग्स और यूटिलिटीज' : 'APP SETTINGS & UTILITIES')}
      </h4>

      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          padding: '0 14px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}
      >
        {/* Item 1: Student Utilities */}
        <div
          onClick={onOpenTools}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Wrench size={18} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Student Utilities' : (isHi ? 'विद्यार्थी टूल्स' : 'Student Utilities')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Resizer & Age Calculator
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>

        {/* Item 2: Language (100% Pure Language Switcher matching Image 2) */}
        <div
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#FEF9C3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Globe size={18} color="#CA8A04" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Language' : (isHi ? 'भाषा (Language)' : 'Language')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                {isEn ? 'Choose your app language' : (isHi ? 'अपनी पसंदीदा भाषा चुनें' : 'Choose your app language')}
              </div>
            </div>
          </div>

          {/* Clean Blue Language Picker matching Image 2 */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1D64F2' }}>
              {getLangDisplayName()}
            </span>
            <ChevronRight size={16} color="#1D64F2" />
            <select
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value)}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="hinglish">Hinglish</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        {/* Item 3: Dark Mode */}
        <div
          onClick={onToggleDarkMode}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Moon size={18} color="#9333EA" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Dark Mode' : (isHi ? 'डार्क मोड' : 'Dark Mode')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Night reading mode (Dark / Light)
              </div>
            </div>
          </div>

          {/* Smooth iOS-style Switch */}
          <div
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '999px',
              background: darkMode ? '#1D64F2' : '#CBD5E1',
              padding: '2px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: darkMode ? 'flex-end' : 'flex-start',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </div>

        {/* Item 4: Rate This App */}
        <div
          onClick={onOpenReview}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Star size={18} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Rate This App' : (isHi ? 'ऐप को 5 स्टार रेटिंग दें' : 'Rate This App')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Share your feedback
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>

        {/* Item 5: Share with Friends */}
        <div
          onClick={() => {
            const shareText = `Sarkari & Private Jobs, Instant PDF, Mock Tests aur Study Material ke liye download karein *VEE App*!\nhttps://play.google.com/store/apps/details?id=com.pawan.vacancyera`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          }}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Share2 size={18} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Share with Friends' : (isHi ? 'दोस्तों के साथ शेयर करें' : 'Share with Friends')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Invite others to VEE
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>

        {/* Item 6: Government Disclaimer & Official Sources (ZERO HINDI IN ENGLISH!) */}
        <div
          onClick={() => onOpenLegal && onOpenLegal('disclaimer')}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield size={18} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Government Disclaimer & Official Sources' : (isHi ? 'सरकारी डिस्क्लेमर व स्रोत' : 'Government Disclaimer & Official Sources')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                {isEn ? 'Non-government educational & career alert entity' : 'गैर-सरकारी शैक्षणिक व अलर्ट ऐप'}
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>

        {/* Item 7: Privacy Policy (ZERO HINDI IN ENGLISH!) */}
        <div
          onClick={() => onOpenLegal && onOpenLegal('privacy')}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#E0E7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Lock size={18} color="#4F46E5" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Privacy Policy' : (isHi ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Google Play Policy & Data Protection
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>

        {/* Item 8: Copyright, Fair Use & DMCA */}
        <div
          onClick={() => onOpenLegal && onOpenLegal('fairuse')}
          style={{
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileText size={18} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>
                {isEn ? 'Copyright, Fair Use & DMCA' : (isHi ? 'कॉपीराइट, फेयर यूज़ व DMCA' : 'Copyright, Fair Use & DMCA')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Fair dealing & content takedown notice
              </div>
            </div>
          </div>
          <ChevronRight size={17} color="#94A3B8" />
        </div>
      </div>

      {/* ===================================================================
          5. OFFICIAL DISCLAIMER COMPLIANCE CARD (100% MATCH WITH IMAGE 2)
          =================================================================== */}
      <div
        onClick={() => onOpenLegal && onOpenLegal('disclaimer')}
        style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          marginTop: '16px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
        title="View Government Sources"
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#1D64F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '900', fontStyle: 'italic', fontFamily: 'serif' }}>i</span>
        </div>

        <p style={{ fontSize: '11px', color: '#1E3A8A', lineHeight: '1.5', margin: 0 }}>
          <b>Official Disclaimer:</b> VEE is an educational and career alert app operated by Vacancy Era Education. We do not represent or claim affiliation with any government entity. All job notifications and exam links are sourced from official public websites (e.g. ssc.gov.in, rrbapply.gov.in, bhel.com).{' '}
          <span style={{ color: '#1D64F2', fontWeight: '700', textDecoration: 'underline' }}>
            {isEn ? 'Read full disclaimer >' : 'अधिक जानकारी के लिए यहाँ देखें >'}
          </span>
        </p>
      </div>

      {/* ===================================================================
          6. MODALS: EDIT PROFILE & MANUAL FORM TRACKER & LOGOUT/DELETE
          =================================================================== */}
      {/* Smart Logout vs Permanent Data Deletion Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsLogoutModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '390px',
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '22px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.28)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Icon + Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={22} color="#1D64F2" />
              </div>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px' }}>
              {isEn ? 'Account & Session Options' : 'अकाउंट से बाहर जाएं'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: '1.45' }}>
              {isEn
                ? 'What would you like to do with your account on this device?'
                : 'आप VEE ऐप से बाहर जाने के लिए कौन सा विकल्प चुनना चाहते हैं?'}
            </p>

            {/* Option 1: Log Out Only (Keeps Data Safe) */}
            <div
              onClick={handleConfirmNormalLogout}
              style={{
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.18s'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px'
                }}
              >
                🚪
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                  {isEn ? 'Log Out Only' : 'सिर्फ लॉगआउट करें'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', lineHeight: '1.4' }}>
                  {isEn
                    ? 'Your saved jobs, tracked forms, and profile remain safe. You can log back in anytime with your mobile number.'
                    : 'आपकी सेव की गई नौकरियां और फॉर्म सुरक्षित रहेंगे। आप कभी भी अपने मोबाइल नंबर से दोबारा लॉगिन कर सकते हैं।'}
                </div>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', fontWeight: '700', color: '#1D64F2' }}>
                  {isEn ? 'Log Out (Keep My Data) →' : 'लॉगआउट करें (डेटा सुरक्षित रखें) →'}
                </span>
              </div>
            </div>

            {/* Option 2: Permanently Delete Data & Account */}
            <div
              onClick={handleConfirmDeleteData}
              style={{
                border: '1.5px solid #FECACA',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: '#FEF2F2',
                transition: 'all 0.18s'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Trash2 size={18} color="#DC2626" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626' }}>
                  {isEn ? 'Permanently Delete Data & Account' : 'हमेशा के लिए अकाउंट व डेटा हटाएं'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#991B1B', marginTop: '3px', lineHeight: '1.4' }}>
                  {isEn
                    ? 'Completely purges your mobile number, profile, bookmarks, and application tracking history from this device.'
                    : 'फोन से आपका मोबाइल नंबर, प्रोफाइल, सेव्ड नौकरियां और पूरी हिस्ट्री हमेशा के लिए मिटा दी जाएगी।'}
                </div>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', fontWeight: '700', color: '#DC2626' }}>
                  {isEn ? 'Delete Permanently ⚠️' : 'हमेशा के लिए डेटा हटाएं ⚠️'}
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isEn ? 'Cancel (Stay in App)' : 'रद्द करें (ऐप में बने रहें)'}
            </button>
          </div>
        </div>
      )}

      {isAddTrackerOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTrackerOpen(false)}>
          <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header flex-between">
              <h3 className="sheet-title font-bold text-sm">
                {isEn ? 'Track Any Govt Form / Roll Number' : 'कोई भी फॉर्म या रोल नंबर ट्रैक करें'}
              </h3>
              <button className="icon-btn" onClick={() => setIsAddTrackerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTracker} className="sheet-body space-y-3">
              <div>
                <label className="form-label text-xs font-bold mb-1 block">
                  {isEn ? 'Exam / Vacancy Title:' : 'भर्ती या परीक्षा का नाम:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "e.g. SSC GD Constable 2026" : "जैसे: UP Police Constable"}
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold mb-1 block">
                  {isEn ? 'Application / Registration / Roll No:' : 'आवेदन या रोल नंबर:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2401889412"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#1D64F2',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                {isEn ? 'Save to Tracker 🚀' : 'ट्रैकर में जोड़ें 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header flex-between">
              <h3 className="sheet-title font-bold text-sm">
                {isEn ? 'Update Aspirant Profile' : 'अपनी प्रोफाइल अपडेट करें'}
              </h3>
              <button className="icon-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="sheet-body space-y-3">
              {/* Photo Upload Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <img
                  src={editAvatar || userProfile.avatar}
                  alt="Avatar"
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                />
                <div>
                  <input
                    type="file"
                    id="edit-modal-avatar-input"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="edit-modal-avatar-input"
                    style={{ background: '#1D64F2', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-block' }}
                  >
                    📸 {isEn ? 'Change Photo' : 'फोटो बदलें'}
                  </label>
                  <p style={{ fontSize: '10.5px', color: '#64748B', margin: '4px 0 0' }}>JPG, PNG (Auto cropped)</p>
                </div>
              </div>

              <div>
                <label className="form-label text-xs font-bold mb-1 block">
                  {isEn ? 'Full Name:' : 'पूरा नाम:'}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold mb-1 block">
                  {isEn ? 'Target Exam / Goal:' : 'लक्षित भर्ती परीक्षा:'}
                </label>
                <input
                  type="text"
                  required
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label text-xs font-bold mb-1 block">
                    {isEn ? 'Home State:' : 'गृह राज्य:'}
                  </label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs font-bold mb-1 block">
                    {isEn ? 'Qualification:' : 'योग्यता:'}
                  </label>
                  <input
                    type="text"
                    value={editQual}
                    onChange={(e) => setEditQual(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#1D64F2',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                {isEn ? 'Save Profile Changes 💾' : 'प्रोफाइल सेव करें 💾'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
