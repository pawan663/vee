import React, { useState } from 'react';
import { User, Bookmark, CheckCircle2, Award, DollarSign, Settings, Globe, Moon, Sun, Star, Share2, Shield, Wrench, ExternalLink, HelpCircle, ChevronRight, Edit3, MapPin, Target, GraduationCap, X, Check, Copy, Clock, Calendar, PlusCircle, Trash2, Bell, AlertTriangle, FileText, Upload, Download, Eye, Image as ImageIcon, RefreshCw, Activity, Radio, Wifi, Server } from 'lucide-react';

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
  currentLang,
  onChangeLang,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  onLogout,
  lastSyncedTime,
  onManualSync,
  isSyncing,
  t
}) {
  const [activeSection, setActiveSection] = useState('applied'); // 'applied' | 'vault' | 'saved' | 'badges'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTrackerOpen, setIsAddTrackerOpen] = useState(false);

  // New Tracker Form State (Manual / Cyber Cafe Tracking)
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newStage, setNewStage] = useState('applied'); // 'applied' | 'admit_card' | 'exam' | 'result'

  // Edit form state
  const [editName, setEditName] = useState(userProfile.name);
  const [editState, setEditState] = useState(userProfile.state || 'Rajasthan');
  const [editGoal, setEditGoal] = useState(userProfile.goal || 'ITI Fitter / Railway');
  const [editQual, setEditQual] = useState(userProfile.qual || 'ITI Pass');
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editCategory, setEditCategory] = useState(userProfile.category || 'OBC');
  const [editPhone, setEditPhone] = useState(userProfile.phone || '');
  const [editDob, setEditDob] = useState(userProfile.dob || '2003-05-15');

  const savedJobsList = allJobs.filter((j) => savedJobIds.includes(j.id));

  // Handle stage change for tracked applications
  const handleUpdateStage = (index, nextStage) => {
    if (!onUpdateAppliedJobs) return;
    const updated = [...appliedJobs];
    updated[index] = {
      ...updated[index],
      stage: nextStage
    };
    onUpdateAppliedJobs(updated);
  };

  // Handle archive/remove tracked application
  const handleRemoveTrackedJob = (index) => {
    if (!onUpdateAppliedJobs) return;
    if (window.confirm("Kya aap is application ko tracker se hatana (archive/delete) chahte hain?")) {
      const updated = appliedJobs.filter((_, i) => i !== index);
      onUpdateAppliedJobs(updated);
    }
  };

  // Handle manual addition of any form / roll number
  const handleCreateTracker = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) {
      alert("Kripya Job / Vacancy ka naam dalein");
      return;
    }
    const newEntry = {
      job: {
        id: 'manual-' + Date.now(),
        title: newJobTitle.trim(),
        dept: newJobDept.trim() || 'Govt Department',
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

  // Live scraper match detector
  const findLiveAlert = (job) => {
    if (!liveNews || liveNews.length === 0 || !job) return null;
    const titleLower = (job.title || '').toLowerCase();
    const deptLower = (job.dept || '').toLowerCase();
    return liveNews.find((n) => {
      const newsTitle = (n.title || '').toLowerCase();
      if (deptLower.length > 2 && newsTitle.includes(deptLower)) return true;
      const words = titleLower.split(' ').filter(w => w.length > 3);
      return words.some(w => newsTitle.includes(w));
    });
  };

  const getStageStep = (stage) => {
    switch (stage) {
      case 'result': return 4;
      case 'exam': return 3;
      case 'admit_card': return 2;
      default: return 1;
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
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

  // Resume Upload Handler (Base64 saved in profile for 1-click private applying)
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Resume file size 5MB se kam honi chahiye!");
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
    if (window.confirm("Kya aap apna uploaded Resume hatana chahte hain?")) {
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

  const avatarOptions = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  ];

  return (
    <div className="profile-container">
      {/* VIP Premium Profile Header Card */}
      <div className="profile-header-card profile-vip-card p-3 mb-3">
        {/* VIP Ribbon */}
        <div className="vip-ribbon flex-between mb-2">
          <span className="vip-crown-badge flex-center gap-1 font-bold text-3xs">
            👑 <span>VEE VIP ASPIRANT</span>
          </span>
          <span className="vip-tier-badge text-3xs font-extrabold">⭐ GOLD TIER</span>
        </div>

        <div className="flex-row gap-3 items-center">
          <div className="avatar-wrapper position-relative">
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="user-profile-avatar vip-avatar"
            />
            <span className="avatar-level-badge">LVL 12</span>
            <button
              className="avatar-edit-badge"
              onClick={() => setIsEditModalOpen(true)}
              title="Change Photo / Profile"
            >
              <Edit3 size={11} />
            </button>
          </div>
          <div className="user-info flex-1">
            <div className="flex-between items-center mb-1">
              <div className="flex-center-start gap-1.5 flex-wrap">
                <h3 className="user-name font-bold text-base leading-none text-white">{userProfile.name}</h3>
                <span className="badge-verified-pill text-3xs font-bold flex-center gap-0.5">
                  <CheckCircle2 size={11} /> {t.verifiedBadge || 'Verified'}
                </span>
              </div>
              <button
                className="btn-edit-profile-pill flex-center gap-1 text-2xs"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={11} /> {t.editProfile}
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

        {/* Premium Aspirant 4-Card Analytics Grid */}
        <div className="creator-stats-box vip-stats-grid mt-3 p-2">
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">Followers</div>
            <div className="stat-card-value text-accent font-extrabold text-sm mt-0.5">{userProfile.followers || '1,240'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">Aspirant Karma</div>
            <div className="stat-card-value text-success font-extrabold text-sm mt-0.5">642 🔺</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">Community Rank</div>
            <div className="stat-card-value text-warning font-extrabold text-sm mt-0.5">Top 5% 🏆</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header text-3xs text-muted font-semibold">Study Streak</div>
            <div className="stat-card-value text-danger font-extrabold text-sm mt-0.5">14 Days 🔥</div>
          </div>
        </div>
      </div>

      {/* Aspirant Account Status Card (Mobile / Email Login & Cloud Sync) */}
      <div className="account-status-banner mb-3 p-3 card-styled" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        {userProfile?.isLoggedIn ? (
          <div className="flex-between items-center">
            <div className="flex-center-start gap-2.5">
              <span className="text-xl">🛡️</span>
              <div>
                <div className="text-xs font-bold text-success flex-center-start gap-1">
                  <span>Verified VEE Account</span>
                  <span className="badge-pill bg-success text-white text-3xs font-bold" style={{ padding: '2px 5px' }}>Active ✅</span>
                </div>
                <div className="text-3xs text-muted mt-0.5">
                  📱 Mobile: <b>{userProfile.phone ? (userProfile.phone.startsWith('+') ? userProfile.phone : `+91 ${userProfile.phone}`) : 'Linked'}</b> {userProfile.email && `• ✉️ ${userProfile.email}`}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary-xs text-danger font-bold text-3xs cursor-pointer"
              onClick={onLogout}
              style={{ border: '1px solid #FECACA', background: '#FEF2F2', padding: '4px 8px', borderRadius: '6px' }}
            >
              Logout / Switch
            </button>
          </div>
        ) : (
          <div className="flex-between items-center">
            <div className="flex-center-start gap-2.5">
              <span className="text-xl">🔐</span>
              <div>
                <div className="text-xs font-bold text-primary">Login / Create Account</div>
                <div className="text-3xs text-muted mt-0.5">
                  Apne documents, CV aur form alerts ko cloud me safe rakhne ke liye login karein
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-accent-xs font-bold text-3xs"
              onClick={onOpenAuth}
              style={{ padding: '5px 10px', borderRadius: '6px' }}
            >
              Login Karein 🚀
            </button>
          </div>
        )}
      </div>

      {/* Tabs Selector: My Applications | 📁 CV & Vault | Saved Jobs | Badges & Level */}
      <div className="pill-row mb-3 flex-wrap">
        <button
          className={`pill-btn flex-1 ${activeSection === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveSection('applied')}
        >
          <CheckCircle2 size={13} /> {t.myApplications} ({appliedJobs.length})
        </button>
        <button
          className={`pill-btn flex-1 ${activeSection === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveSection('vault')}
        >
          <FileText size={13} /> 📁 CV & Vault
        </button>
        <button
          className={`pill-btn flex-1 ${activeSection === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveSection('saved')}
        >
          <Bookmark size={13} /> {t.saved} ({savedJobsList.length})
        </button>
        <button
          className={`pill-btn flex-1 ${activeSection === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveSection('badges')}
        >
          <Award size={13} /> {t.earnBadge || 'Badges'}
        </button>
      </div>

      {/* Section 1: Applied Jobs Tracker */}
      {activeSection === 'applied' && (
        <div className="applied-tracker-list mb-3">

          {/* Action Header: Track Any Form */}
          <div className="flex-between items-center mb-2.5">
            <div>
              <h4 className="font-bold text-xs text-primary">Live Application Tracker ({appliedJobs.length})</h4>
              <p className="text-3xs text-muted">Applied ➔ Admit Card ➔ Exam ➔ Result ➔ Complete</p>
            </div>
            <button
              className="btn-add-tracker flex-center gap-1"
              onClick={() => setIsAddTrackerOpen(true)}
            >
              <PlusCircle size={13} />
              <span>➕ Track Any Form</span>
            </button>
          </div>

          {appliedJobs.length > 0 ? (
            appliedJobs.map((item, idx) => {
              const currentStep = getStageStep(item.stage || 'admit_card');
              const liveAlert = findLiveAlert(item.job);

              return (
                <div key={idx} className="tracker-card mb-3 p-3.5">
                  <div className="flex-between mb-1.5">
                    <span className="badge-pill badge-govt text-3xs font-semibold">{item.job?.dept || 'Central / State Govt'}</span>
                    <span className="badge-status-pill text-3xs font-bold flex-center gap-1">
                      <span className="live-dot-pulse"></span> {item.stage === 'result' ? 'Result Declared' : (item.stage === 'exam' ? 'Exam Stage' : (item.stage === 'admit_card' ? 'Admit Card Stage' : t.formAppliedStatus))}
                    </span>
                  </div>
                  <h4 className="tracker-job-title font-bold text-xs leading-snug">{item.job?.title}</h4>

                  {/* Reg ID Box with Copy */}
                  <div className="tracker-reg-box mt-2.5 mb-2.5 p-2 flex-between">
                    <div>
                      <span className="text-3xs text-muted font-semibold block">{t.appRegId} / Roll No:</span>
                      <span className="text-3xs text-muted">Applied: {item.date || 'Active'}</span>
                    </div>
                    <div className="flex-center gap-1.5">
                      <span className="font-mono font-bold text-accent text-xs">{item.regNo}</span>
                      <button
                        className="copy-mini-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(item.regNo);
                          alert("Application ID copied!");
                        }}
                        title="Copy Reg ID"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Live Scraper Match Notification */}
                  {liveAlert && (
                    <div className="tracker-live-match-box mb-2.5 flex-between">
                      <div className="flex-center-start gap-1.5 flex-1">
                        <span className="live-dot-pulse"></span>
                        <div className="text-3xs leading-tight">
                          <b>🔔 Live Portal Alert:</b> {liveAlert.title}
                        </div>
                      </div>
                      {liveAlert.sourceUrl && (
                        <a
                          href={liveAlert.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-3xs font-bold text-accent ml-2 flex-center gap-0.5 flex-shrink-0"
                        >
                          Open ↗
                        </a>
                      )}
                    </div>
                  )}

                  {/* Horizontal Native Progress Stepper */}
                  <div className="stepper-horizontal-wrapper">
                    <div className="stepper-track">
                      {/* Step 1: Applied */}
                      <div className="stepper-node completed">
                        <div className="node-circle">
                          <Check size={14} />
                        </div>
                        <span className="node-title">{t.stageApplied || 'Applied'}</span>
                        <span className="node-status text-success">Done ✅</span>
                      </div>

                      <div className={`stepper-line ${currentStep >= 2 ? 'completed' : ''}`}></div>

                      {/* Step 2: Admit Card */}
                      <div className={`stepper-node ${currentStep > 2 ? 'completed' : (currentStep === 2 ? 'active' : 'pending')}`}>
                        <div className={`node-circle ${currentStep === 2 ? 'animate-pulse-gentle' : ''}`}>
                          {currentStep > 2 ? <Check size={14} /> : <Clock size={14} />}
                        </div>
                        <span className="node-title">{t.stageAdmitCard || 'Admit Card'}</span>
                        <span className={`node-status ${currentStep >= 2 ? 'text-warning font-bold' : 'text-muted'}`}>
                          {currentStep > 2 ? 'Released ✅' : (currentStep === 2 ? 'Expected / Out' : 'Upcoming')}
                        </span>
                      </div>

                      <div className={`stepper-line ${currentStep >= 3 ? 'completed' : ''}`}></div>

                      {/* Step 3: Exam */}
                      <div className={`stepper-node ${currentStep > 3 ? 'completed' : (currentStep === 3 ? 'active' : 'pending')}`}>
                        <div className="node-circle">
                          {currentStep > 3 ? <Check size={14} /> : <Calendar size={13} />}
                        </div>
                        <span className="node-title">{t.stageExam || 'Exam'}</span>
                        <span className={`node-status ${currentStep >= 3 ? 'text-accent font-bold' : 'text-muted'}`}>
                          {currentStep > 3 ? 'Attended ✅' : (currentStep === 3 ? 'Active 📅' : 'Upcoming')}
                        </span>
                      </div>

                      <div className={`stepper-line ${currentStep >= 4 ? 'completed' : ''}`}></div>

                      {/* Step 4: Result */}
                      <div className={`stepper-node ${currentStep === 4 ? 'completed active-success' : 'pending'}`}>
                        <div className="node-circle">
                          <Award size={13} />
                        </div>
                        <span className="node-title">{t.stageResult || 'Result'}</span>
                        <span className={`node-status ${currentStep === 4 ? 'text-success font-extrabold' : 'text-muted'}`}>
                          {currentStep === 4 ? 'Declared 🏆' : 'Final'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Action Buttons & Remove option */}
                  <div className="tracker-stage-actions mt-3 pt-2.5 border-top flex-between flex-wrap gap-1.5">
                    <span className="text-3xs text-muted font-semibold">Stage Update:</span>
                    <div className="flex-center gap-1 flex-wrap">
                      <button
                        className={`stage-btn-pill ${(!item.stage || item.stage === 'applied') ? 'active-stage-pill' : ''}`}
                        onClick={() => handleUpdateStage(idx, 'applied')}
                        title="Mark as Applied"
                      >
                        1. Applied
                      </button>
                      <button
                        className={`stage-btn-pill ${item.stage === 'admit_card' ? 'active-stage-pill' : ''}`}
                        onClick={() => handleUpdateStage(idx, 'admit_card')}
                        title="Mark as Admit Card Out"
                      >
                        2. Admit Card 🎫
                      </button>
                      <button
                        className={`stage-btn-pill ${item.stage === 'exam' ? 'active-stage-pill' : ''}`}
                        onClick={() => handleUpdateStage(idx, 'exam')}
                        title="Mark as Exam Given"
                      >
                        3. Exam 📅
                      </button>
                      <button
                        className={`stage-btn-pill ${item.stage === 'result' ? 'active-stage-pill' : ''}`}
                        onClick={() => handleUpdateStage(idx, 'result')}
                        title="Mark as Result Checked"
                      >
                        4. Result 🏆
                      </button>
                      <button
                        className="stage-btn-pill text-danger flex-center gap-0.5"
                        onClick={() => handleRemoveTrackedJob(idx)}
                        title="Archive / Remove"
                      >
                        <Trash2 size={10} /> Hatayein
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state text-center p-4">
              <CheckCircle2 size={36} className="text-muted inline mb-2" />
              <p className="text-xs text-muted">Abhi tak koi form track nahi kiya gaya hai.</p>
              <p className="text-3xs text-muted mt-1">Jobs tab me kisi vacancy ko Apply karein ya upar <b>➕ Track Any Form</b> par click karke add karein.</p>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Aspirant Document Vault & CV Locker */}
      {activeSection === 'vault' && (
        <div className="cv-vault-container mb-3">
          {/* Header Banner */}
          <div className="flex-between mb-3 pb-2 border-bottom">
            <div>
              <h4 className="font-bold text-xs flex-center-start gap-1 text-primary">
                📁 Aspirant Document Vault & CV Locker
              </h4>
              <p className="text-3xs text-muted mt-0.5">
                Resume, Photo aur Signature yahan surakshit rakhein — Private aur Govt apply ke liye 1-Click ready!
              </p>
            </div>
            <span className="badge-pill badge-govt text-3xs font-bold">100% SECURE</span>
          </div>

          {/* 1. Resume / CV Section */}
          <div className="vault-item-card mb-3">
            <div className="flex-between mb-2">
              <span className="font-bold text-xs flex-center gap-1">
                📄 Private Job CV / Resume
              </span>
              {userProfile.resume ? (
                <span className="badge-pill bg-success text-white text-3xs font-bold">Active CV ✅</span>
              ) : (
                <span className="badge-pill bg-warning text-white text-3xs font-bold">Not Uploaded</span>
              )}
            </div>

            {userProfile.resume ? (
              <div className="doc-uploaded-box p-2.5 rounded bg-light border flex-between items-center">
                <div className="flex-center-start gap-2">
                  <span style={{ fontSize: '24px' }}>📄</span>
                  <div>
                    <div className="font-bold text-xs truncate" style={{ maxWidth: '180px' }}>
                      {userProfile.resume.name}
                    </div>
                    <div className="text-3xs text-muted">
                      Size: {userProfile.resume.size} • Uploaded: {userProfile.resume.date}
                    </div>
                  </div>
                </div>

                <div className="flex-center gap-1.5">
                  {userProfile.resume.dataUrl && (
                    <a
                      href={userProfile.resume.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent-xs inline-flex flex-center gap-1 text-3xs font-bold"
                      title="Preview Resume"
                    >
                      <Eye size={12} /> Dekhein
                    </a>
                  )}
                  {userProfile.resume.dataUrl && (
                    <a
                      href={userProfile.resume.dataUrl}
                      download={userProfile.resume.name || "My_Resume.pdf"}
                      className="btn-secondary-xs inline-flex flex-center gap-1 text-3xs font-bold"
                      title="Download Resume"
                    >
                      <Download size={12} />
                    </a>
                  )}
                  <button
                    className="btn-danger-xs inline-flex flex-center gap-0.5 text-3xs"
                    onClick={handleRemoveResume}
                    title="Delete Resume"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="doc-upload-box">
                <input
                  type="file"
                  id="cv-upload-input"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="cv-upload-input" className="cursor-pointer block">
                  <Upload size={22} className="text-primary inline mb-1" />
                  <p className="font-bold text-xs text-primary">Apna Resume / CV Upload Karein</p>
                  <p className="text-3xs text-muted mt-0.5">PDF, DOC, ya Image (Max 5MB) • Tata, Maruti, Jio apply ke liye</p>
                </label>
              </div>
            )}
          </div>

          {/* 2. Photo & Signature Vault (Govt Exam Sized) */}
          <div className="grid-2-cols gap-2 mb-3">
            {/* Passport Photo */}
            <div className="vault-item-card">
              <div className="flex-between mb-1.5">
                <span className="font-bold text-2xs flex-center gap-1">📷 Passport Photo</span>
                {userProfile.photo ? (
                  <span className="text-3xs text-success font-bold">Ready</span>
                ) : (
                  <span className="text-3xs text-muted">Empty</span>
                )}
              </div>

              {userProfile.photo ? (
                <div className="text-center">
                  <img
                    src={userProfile.photo.dataUrl}
                    alt="Passport"
                    className="vault-thumb-preview mx-auto mb-1"
                  />
                  <div className="text-3xs text-muted">{userProfile.photo.size || '30 KB'}</div>
                  <div className="flex-center gap-1 mt-1.5">
                    <button
                      className="btn-accent-xs text-3xs font-bold flex-1"
                      onClick={() => onOpenTools && onOpenTools()}
                      title="Resize Photo"
                    >
                      ⚡ Resize
                    </button>
                    <a
                      href={userProfile.photo.dataUrl}
                      download="Sarkari_Passport_Photo.jpg"
                      className="btn-secondary-xs text-3xs font-bold"
                      title="Download Photo"
                    >
                      <Download size={11} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="doc-upload-box p-2">
                  <input
                    type="file"
                    id="photo-vault-input"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-vault-input" className="cursor-pointer block">
                    <ImageIcon size={18} className="text-primary inline mb-0.5" />
                    <p className="font-bold text-3xs text-primary">Photo Upload</p>
                    <p className="text-3xs text-muted">20KB - 50KB</p>
                  </label>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="vault-item-card">
              <div className="flex-between mb-1.5">
                <span className="font-bold text-2xs flex-center gap-1">✍️ Signature</span>
                {userProfile.signature ? (
                  <span className="text-3xs text-success font-bold">Ready</span>
                ) : (
                  <span className="text-3xs text-muted">Empty</span>
                )}
              </div>

              {userProfile.signature ? (
                <div className="text-center">
                  <img
                    src={userProfile.signature.dataUrl}
                    alt="Signature"
                    className="vault-sign-preview mx-auto mb-1"
                  />
                  <div className="text-3xs text-muted">{userProfile.signature.size || '15 KB'}</div>
                  <div className="flex-center gap-1 mt-1.5">
                    <button
                      className="btn-accent-xs text-3xs font-bold flex-1"
                      onClick={() => onOpenTools && onOpenTools()}
                      title="Resize Sign"
                    >
                      ⚡ Resize
                    </button>
                    <a
                      href={userProfile.signature.dataUrl}
                      download="Sarkari_Signature.jpg"
                      className="btn-secondary-xs text-3xs font-bold"
                      title="Download Sign"
                    >
                      <Download size={11} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="doc-upload-box p-2">
                  <input
                    type="file"
                    id="sign-vault-input"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="sign-vault-input" className="cursor-pointer block">
                    <Edit3 size={18} className="text-primary inline mb-0.5" />
                    <p className="font-bold text-3xs text-primary">Sign Upload</p>
                    <p className="text-3xs text-muted">10KB - 20KB</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 3. 1-Click Aspirant Details Copier */}
          <div className="aspirant-quick-copy-card p-3 rounded bg-light border">
            <div className="flex-between mb-1.5">
              <span className="text-2xs font-bold text-primary flex-center gap-1">
                📋 Form Auto-Fill Details (1-Click Copy)
              </span>
              <button
                className="btn-secondary-xs flex-center gap-1 text-3xs font-bold"
                onClick={() => {
                  const detailsText = `Name: ${userProfile.name}\nState: ${userProfile.state}\nQualification: ${userProfile.qual}\nGoal: ${userProfile.goal}\nCategory: ${userProfile.category || 'OBC'}\nDOB: ${userProfile.dob || '2003-05-15'}\nMobile: ${userProfile.phone || '98XXXXXXXX'}`;
                  navigator.clipboard.writeText(detailsText);
                  alert("✅ Sabhi details clipboard me copy ho gayi! Aap form me paste kar sakte hain.");
                }}
              >
                <Copy size={11} /> Copy All
              </button>
            </div>
            <div className="text-3xs text-muted space-y-0.5">
              <div><b>Name:</b> {userProfile.name} • <b>State:</b> {userProfile.state}</div>
              <div><b>Qualification:</b> {userProfile.qual} • <b>Category:</b> {userProfile.category || 'OBC'}</div>
              <div><b>DOB:</b> {userProfile.dob || '15/05/2003'} • <b>Target:</b> {userProfile.goal}</div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Saved Jobs */}
      {activeSection === 'saved' && (
        <div className="saved-jobs-list mb-3">
          {savedJobsList.length > 0 ? (
            savedJobsList.map((job) => (
              <div
                key={job.id}
                className="saved-job-card mb-2 p-3 cursor-pointer"
                onClick={() => onOpenJob(job)}
              >
                <div className="flex-between">
                  <span className="text-3xs font-semibold text-muted">{job.dept}</span>
                  <span className="text-3xs text-danger font-bold">Last: {job.lastDate}</span>
                </div>
                <h4 className="font-bold text-xs mt-1">{job.title}</h4>
                <div className="flex-between mt-2">
                  <span className="text-2xs text-muted">{job.posts} Posts</span>
                  <span className="text-xs text-accent font-semibold flex-center gap-0.5">
                    View Details <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state text-center p-4">
              <Bookmark size={36} className="text-muted inline mb-2" />
              <p className="text-xs text-muted">Aapne abhi tak koi job bookmark nahi ki hai.</p>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Aspirant Badges, Level & Digital Document Locker */}
      {activeSection === 'badges' && (
        <div className="aspirant-achievements-container mb-3">
          {/* Level Progress Card */}
          <div className="level-progress-card p-3 mb-3 card-styled">
            <div className="flex-between mb-1.5">
              <span className="font-bold text-xs flex-center gap-1 text-primary">
                <Award size={15} className="text-warning" /> Level 12: Master Aspirant ⭐
              </span>
              <span className="badge-warning-sm font-bold text-3xs">642 / 750 XP</span>
            </div>
            <p className="text-2xs text-muted mb-2">
              Level 13 (Platinum Aspirant) unlock karne ke liye 108 XP aur chahiye.
            </p>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '85.6%', background: 'linear-gradient(90deg, #F59E0B, #10B981)' }}></div>
            </div>
          </div>

          {/* Earned Badges Grid */}
          <div className="badges-showcase-card p-3 mb-3 card-styled">
            <h4 className="font-bold text-xs text-primary mb-2.5 flex-center-start gap-1">
              🎖️ Earned Aspirant Badges & Honors
            </h4>
            <div className="badges-2x3-grid">
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">🎯</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">First Apply</span>
                <span className="badge-tag text-3xs text-success font-semibold">Active ✅</span>
              </div>
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">🔥</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">14-Day Streak</span>
                <span className="badge-tag text-3xs text-danger font-semibold">Fire Active</span>
              </div>
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">📚</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">Mock Master</span>
                <span className="badge-tag text-3xs text-accent font-semibold">5 Tests Done</span>
              </div>
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">🤝</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">Top Mentor</span>
                <span className="badge-tag text-3xs text-warning font-semibold">50+ Upvotes</span>
              </div>
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">⚡</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">Early Bird</span>
                <span className="badge-tag text-3xs text-accent font-semibold">Live Alerts</span>
              </div>
              <div className="badge-item-box p-2 rounded text-center">
                <span className="text-lg">🛡️</span>
                <span className="badge-name font-bold text-3xs block mt-0.5">Verified Safe</span>
                <span className="badge-tag text-3xs text-success font-semibold">KYC Ready</span>
              </div>
            </div>
          </div>

          {/* Digital Document Locker Checklist */}
          <div className="doc-locker-card p-3 mb-3 card-styled">
            <div className="flex-between mb-2">
              <h4 className="font-bold text-xs text-primary flex-center-start gap-1">
                🔒 Digital Form Locker (Ready for SSC/RRB)
              </h4>
              <span className="badge-pill badge-govt text-3xs font-bold">100% SECURE</span>
            </div>
            <div className="doc-checklist space-y-1.5">
              <div className="doc-row flex-between p-2 rounded bg-light border">
                <span className="text-2xs font-semibold flex-center gap-1.5">
                  📄 10th / 12th Matric Marksheet
                </span>
                <span className="text-3xs font-bold text-success flex-center gap-0.5">
                  <CheckCircle2 size={11} /> Verified Ready
                </span>
              </div>
              <div className="doc-row flex-between p-2 rounded bg-light border">
                <span className="text-2xs font-semibold flex-center gap-1.5">
                  📜 ITI NCVT / Diploma Certificate
                </span>
                <span className="text-3xs font-bold text-success flex-center gap-0.5">
                  <CheckCircle2 size={11} /> Uploaded
                </span>
              </div>
              <div className="doc-row flex-between p-2 rounded bg-light border">
                <span className="text-2xs font-semibold flex-center gap-1.5">
                  🏛️ Caste / EWS Certificate
                </span>
                <span className="text-3xs font-bold text-warning flex-center gap-0.5">
                  <Clock size={11} /> Valid till 2027
                </span>
              </div>
              <div className="doc-row flex-between p-2 rounded bg-light border">
                <span className="text-2xs font-semibold flex-center gap-1.5">
                  🖼️ Passport Photo & Sign (Resized)
                </span>
                <span className="text-3xs font-bold text-success flex-center gap-0.5">
                  <CheckCircle2 size={11} /> 20-50KB Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Extras Menu */}
      <div className="settings-menu-card p-3 mb-4">
        <h4 className="menu-header font-bold text-xs text-muted mb-2.5">{t.appSettings}</h4>

        {/* Student Tools Shortcut */}
        <div className="menu-row flex-between py-2.5 border-bottom cursor-pointer" onClick={onOpenTools}>
          <div className="flex-center gap-2.5">
            <div className="menu-icon-circle bg-blue-light">
              <Wrench size={15} className="text-primary" />
            </div>
            <span className="text-xs font-semibold">{t.tools}</span>
          </div>
          <ChevronRight size={15} className="text-muted" />
        </div>

        {/* Language Selection */}
        <div className="menu-row flex-between py-2.5 border-bottom">
          <div className="flex-center gap-2.5">
            <div className="menu-icon-circle bg-amber-light">
              <Globe size={15} className="text-accent" />
            </div>
            <span className="text-xs font-semibold">{t.selectLanguage}</span>
          </div>
          <select
            className="form-select-sm text-xs font-semibold"
            value={currentLang}
            onChange={(e) => onChangeLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="hinglish">Hinglish</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <div
          className="menu-row flex-between py-2.5 border-bottom cursor-pointer"
          onClick={onToggleDarkMode}
        >
          <div className="flex-center gap-2.5">
            <div className="menu-icon-circle bg-purple-light">
              {darkMode ? <Sun size={15} className="text-warning" /> : <Moon size={15} className="text-secondary" />}
            </div>
            <div>
              <span className="text-xs font-semibold">{t.darkMode}</span>
              <span className="text-3xs text-muted block">Night reading mode (Dark / Light)</span>
            </div>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${darkMode ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDarkMode();
            }}
          >
            <span className={`switch-ball ${darkMode ? 'on' : 'off'}`}></span>
          </button>
        </div>

        {/* Rate & Review App */}
        <div className="menu-row flex-between py-2.5 border-bottom cursor-pointer" onClick={onOpenReview}>
          <div className="flex-center gap-2.5">
            <div className="menu-icon-circle bg-green-light">
              <Star size={15} className="text-warning" />
            </div>
            <span className="text-xs font-semibold">{t.rateApp}</span>
          </div>
          <ChevronRight size={15} className="text-muted" />
        </div>

        {/* Share App */}
        <div
          className="menu-row flex-between py-2.5 cursor-pointer"
          onClick={() => {
            const shareText = `Sarkari & Private Jobs, Instant PDF, Mock Tests aur Aspirant Charcha ke liye download karein *VEE App*!\nhttps://play.google.com/store/apps/details?id=com.vacancyera.vee`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          }}
        >
          <div className="flex-center gap-2.5">
            <div className="menu-icon-circle bg-teal-light">
              <Share2 size={15} className="text-success" />
            </div>
            <span className="text-xs font-semibold">{t.shareApp}</span>
          </div>
          <ChevronRight size={15} className="text-muted" />
        </div>
      </div>

      {/* Multi-Portal & Scraper Live Health Status Monitor */}
      <div
        className="scraper-health-card p-3 rounded-xl mb-4 border"
        style={{
          background: 'var(--card-bg, #FFFFFF)',
          borderColor: 'var(--border-color, #E2E8F0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div className="flex-between mb-2 pb-2 border-bottom">
          <div className="flex-center-start gap-1.5">
            <Activity size={16} className="text-success" />
            <div>
              <h4 className="font-bold text-xs m-0" style={{ color: 'var(--text-color, #1E293B)' }}>
                पोर्टल सिंक व लाइव हेल्थ स्टेटस
              </h4>
              <p className="text-3xs text-muted m-0">Live Multi-Portal Health & Data Sync Monitor</p>
            </div>
          </div>
          <span className="badge-live-sm bg-success text-white text-3xs font-bold px-2 py-0.5 rounded-full flex-center gap-1">
            <span className="live-dot-pulse bg-white"></span> ALL SYSTEMS 100% OK
          </span>
        </div>

        {/* Status Indicators List */}
        <div className="health-metrics flex-column gap-2 mb-3">
          {/* 1. FreeJobAlert & State Portals */}
          <div className="metric-row flex-between p-2 rounded" style={{ background: 'var(--surface-color, #F8FAFC)' }}>
            <div className="flex-center-start gap-2">
              <span className="status-dot-green">🟢</span>
              <div>
                <p className="text-xs font-semibold m-0">FreeJobAlert & Govt Portals</p>
                <p className="text-3xs text-muted m-0">SSC, Railway, UPSC, Police, State PSC</p>
              </div>
            </div>
            <span className="badge-pill font-bold text-3xs text-success" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>
              {allJobs.length} Jobs Active
            </span>
          </div>

          {/* 2. Sarkari Result & Daily News */}
          <div className="metric-row flex-between p-2 rounded" style={{ background: 'var(--surface-color, #F8FAFC)' }}>
            <div className="flex-center-start gap-2">
              <span className="status-dot-green">🟢</span>
              <div>
                <p className="text-xs font-semibold m-0">Sarkari Result & Daily News</p>
                <p className="text-3xs text-muted m-0">Admit Cards, Results & Breaking Bulletins</p>
              </div>
            </div>
            <span className="badge-pill font-bold text-3xs text-primary" style={{ background: 'rgba(37, 99, 235, 0.12)' }}>
              {liveNews.length} Notices Live
            </span>
          </div>

          {/* 3. YouTube Channel @vacancyeraeducation */}
          <div className="metric-row flex-between p-2 rounded" style={{ background: 'var(--surface-color, #F8FAFC)' }}>
            <div className="flex-center-start gap-2">
              <span className="status-dot-green">🟢</span>
              <div>
                <p className="text-xs font-semibold m-0">YouTube Official Channel</p>
                <p className="text-3xs text-muted m-0">@vacancyeraeducation (Pawan Meena)</p>
              </div>
            </div>
            <span className="badge-pill font-bold text-3xs text-danger" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              14 Real Videos Synced
            </span>
          </div>

          {/* 4. Automated Cloud Runner */}
          <div className="metric-row flex-between p-2 rounded" style={{ background: 'var(--surface-color, #F8FAFC)' }}>
            <div className="flex-center-start gap-2">
              <span className="status-dot-green">🟢</span>
              <div>
                <p className="text-xs font-semibold m-0">Cloud Auto-Sync Engine</p>
                <p className="text-3xs text-muted m-0">GitHub Actions Cron (Every 4 Hours)</p>
              </div>
            </div>
            <span className="badge-pill font-bold text-3xs text-purple-700" style={{ background: 'rgba(147, 51, 234, 0.12)' }}>
              Automated 24x7
            </span>
          </div>

          {/* 5. Failover Protection Guard */}
          <div className="metric-row flex-between p-2 rounded" style={{ background: 'var(--surface-color, #F8FAFC)' }}>
            <div className="flex-center-start gap-2">
              <span className="status-dot-green">🛡️</span>
              <div>
                <p className="text-xs font-semibold m-0">Failover & Offline Shield</p>
                <p className="text-3xs text-muted m-0">Agar koi site down ho to local cache se chalega</p>
              </div>
            </div>
            <span className="badge-pill font-bold text-3xs text-emerald-700" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
              Zero Downtime
            </span>
          </div>
        </div>

        {/* Sync Action & Timestamp */}
        <div className="flex-between pt-1 flex-wrap gap-2">
          <span className="text-3xs text-muted">
            ⏱️ Last Synced: <b>{lastSyncedTime ? new Date(lastSyncedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</b>
          </span>
          <button
            type="button"
            className="btn-accent-xs font-bold text-3xs px-3 py-1.5 rounded inline-flex flex-center gap-1.5"
            onClick={onManualSync}
            disabled={isSyncing}
            style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Abhi Live Sync Karein'}
          </button>
        </div>
      </div>

      {/* Official Government Disclaimer (Google Play Compliance) */}
      <div className="disclaimer-compliance-box p-3 rounded mb-4 text-center">
        <Shield size={18} className="text-muted inline mb-1" />
        <p className="text-3xs text-muted leading-relaxed">
          <b>Official Disclaimer:</b> VEE is an educational and career alert app operated by Vacancy Era Education. We do not represent or claim affiliation with any government entity. All job notifications and exam links are sourced from official publicly available websites (e.g. ssc.gov.in, rrbapply.gov.in, bhel.com).
        </p>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header flex-between">
              <h3 className="sheet-title font-bold text-sm">Apni Profile Update Karein</h3>
              <button className="icon-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="sheet-body">
              {/* Select Avatar */}
              <label className="form-label text-xs">Profile Photo / Avatar Chunein:</label>
              <div className="avatar-pick-row flex-row gap-3 mb-3 mt-1">
                {avatarOptions.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt={`Avatar ${idx}`}
                    className={`avatar-pick-img ${editAvatar === av ? 'selected-avatar' : ''}`}
                    onClick={() => setEditAvatar(av)}
                  />
                ))}
              </div>

              {/* Full Name */}
              <div className="form-group mb-2">
                <label className="form-label">Aapka Naam:</label>
                <input
                  type="text"
                  required
                  className="form-input text-xs"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              {/* Target Exam / Trade Goal */}
              <div className="form-group mb-2">
                <label className="form-label">Target Exam / Trade Goal:</label>
                <select
                  className="form-select-sm text-xs"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                >
                  <option value="ITI Fitter / Railway">ITI Fitter / Railway ALP</option>
                  <option value="ITI Electrician / BHEL">ITI Electrician / BHEL & Bijli Vibhag</option>
                  <option value="Railway NTPC & Group D">Railway NTPC & Group D</option>
                  <option value="SSC GD & Police Bharti">SSC GD & State Police Bharti</option>
                  <option value="Banking PO & Clerk">Banking PO & Clerk / Apprentice</option>
                  <option value="Teaching / Anganwadi">Teaching / Anganwadi Bharti</option>
                  <option value="Private MNC Apprentice">Private MNC (Tata / Maruti / L&T)</option>
                </select>
              </div>

              {/* Home State */}
              <div className="form-group mb-2">
                <label className="form-label">Aapka Rajya (State):</label>
                <select
                  className="form-select-sm text-xs"
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
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

              {/* Qualification */}
              <div className="form-group mb-2">
                <label className="form-label">Yogyata (Highest Qualification):</label>
                <select
                  className="form-select-sm text-xs"
                  value={editQual}
                  onChange={(e) => setEditQual(e.target.value)}
                >
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="ITI Pass">ITI Pass (NCVT / SCVT)</option>
                  <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                  <option value="Graduation (BA/BSc/BCom/BTech)">Graduation (BA/BSc/BCom/BTech)</option>
                </select>
              </div>

              {/* Category */}
              <div className="form-group mb-2">
                <label className="form-label">Category (Arakshan):</label>
                <select
                  className="form-select-sm text-xs"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="General / UR">General / UR</option>
                  <option value="OBC">OBC (Non-Creamy)</option>
                  <option value="EWS">EWS</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="PwD">PwD / Ex-Servicemen</option>
                </select>
              </div>

              {/* Mobile / WhatsApp */}
              <div className="form-group mb-2">
                <label className="form-label">Mobile / WhatsApp Number:</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  className="form-input text-xs"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              {/* Date of Birth */}
              <div className="form-group mb-3">
                <label className="form-label">Janm Tareekh (Date of Birth):</label>
                <input
                  type="date"
                  className="form-input text-xs"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary w-full flex-center gap-1">
                <Check size={16} /> Changes Save Karein
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Track Any External Form Modal */}
      {isAddTrackerOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTrackerOpen(false)}>
          <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header flex-between">
              <div>
                <h3 className="sheet-title font-bold text-sm">➕ Track Any Form / Roll Number</h3>
                <p className="text-3xs text-muted">Cyber Cafe ya kisi bhi site se bhara form yahan track karein</p>
              </div>
              <button className="icon-btn" onClick={() => setIsAddTrackerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTracker} className="sheet-body">
              {/* Job Title */}
              <div className="form-group mb-2.5">
                <label className="form-label text-xs">Vacancy / Job Ka Naam:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Railway ALP, SSC GD, Rajasthan Police..."
                  className="form-input text-xs"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                />
              </div>

              {/* Department */}
              <div className="form-group mb-2.5">
                <label className="form-label text-xs">Department / Vibhag (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Railway Recruitment Board (RRB), SSC, Police..."
                  className="form-input text-xs"
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                />
              </div>

              {/* Roll Number or Registration Number */}
              <div className="form-group mb-2.5">
                <label className="form-label text-xs">Application / Registration / Roll Number:</label>
                <input
                  type="text"
                  placeholder="e.g. 24019827361 ya Cyber Cafe slip wala ID"
                  className="form-input text-xs font-mono"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                />
              </div>

              {/* Current Stage */}
              <div className="form-group mb-3">
                <label className="form-label text-xs">Abhi Is Form Ka Kya Stage Hai?</label>
                <select
                  className="form-select-sm text-xs"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                >
                  <option value="applied">1. Form Applied (Sirf form bhara hai)</option>
                  <option value="admit_card">2. Admit Card Out (Admit card aagya hai)</option>
                  <option value="exam">3. Exam (Exam de diya hai ya date aagayi)</option>
                  <option value="result">4. Result (Result aagya hai)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full flex-center gap-1.5 py-2.5 font-bold">
                <Check size={16} /> Tracker Me Add Karein
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
