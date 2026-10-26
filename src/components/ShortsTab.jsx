import React, { useState } from 'react';
import { Play, ThumbsUp, MessageSquare, Share2, Send, Video, Flame, X, ExternalLink, Plus, Check, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VIDEO_REGISTRY } from '../data/videoRegistry';

const Instagram = ({ size = 18, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// Real Official Instagram & YouTube Reels strictly from @vacancyera and @vacancyeraeducation
const DEFAULT_OFFICIAL_REELS = [
  {
    id: 'insta-reel-1',
    youtubeId: 'EZvKIO-TNsQ',
    platform: 'INSTAGRAM',
    title: '🔥 NTPC नई भर्ती 2026 | Special Drive ऑफिशियल नोटिस (@vacancyera)',
    dept: 'NTPC / Power Sector',
    duration: '0:50',
    likes: '14.8K',
    comments: '392',
    channel: '@vacancyera',
    jobId: 'ntpc-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    youtubeUrl: 'https://youtu.be/EZvKIO-TNsQ',
    tags: ['#VacancyEra', '#NTPC', '#SarkariNaukri'],
    thumbnail: 'https://img.youtube.com/vi/EZvKIO-TNsQ/hqdefault.jpg'
  },
  {
    id: 'insta-reel-2',
    youtubeId: '_3G_myadrN8',
    platform: 'INSTAGRAM',
    title: '⚡ ISRO New Vacancy 2026 | MTS & Driver | 10वीं, ITI पास भर्ती',
    dept: 'ISRO / Space Dept',
    duration: '0:45',
    likes: '21.5K',
    comments: '614',
    channel: '@vacancyera',
    jobId: 'isro-mts-driver-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    youtubeUrl: 'https://youtu.be/_3G_myadrN8',
    tags: ['#ISRO', '#10thPassJobs', '#GovtJobs'],
    thumbnail: 'https://img.youtube.com/vi/_3G_myadrN8/hqdefault.jpg'
  },
  {
    id: 'insta-reel-3',
    youtubeId: 'NmmE_hfX97Q',
    platform: 'INSTAGRAM',
    title: '🛢️ ONGC Recruitment 2026 | ONGC नई भर्ती | Free Form Apply Online',
    dept: 'ONGC / PSU',
    duration: '0:58',
    likes: '18.9K',
    comments: '445',
    channel: '@vacancyera',
    jobId: 'oil-india-executive-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    youtubeUrl: 'https://youtu.be/NmmE_hfX97Q',
    tags: ['#ONGC', '#OilIndia', '#SarkariForm'],
    thumbnail: 'https://img.youtube.com/vi/NmmE_hfX97Q/hqdefault.jpg'
  },
  {
    id: 'insta-reel-4',
    youtubeId: 'dSWQFQwSBXQ',
    platform: 'INSTAGRAM',
    title: '🚇 DMRC नई भर्ती 2026 | दिल्ली मेट्रो Non-Executive पदों पर भर्ती',
    dept: 'Delhi Metro (DMRC)',
    duration: '0:48',
    likes: '16.2K',
    comments: '318',
    channel: '@vacancyera',
    jobId: 'delhi-metro-dmrc-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    youtubeUrl: 'https://youtu.be/dSWQFQwSBXQ',
    tags: ['#MetroJobs', '#DMRC', '#ITIApprentice'],
    thumbnail: 'https://img.youtube.com/vi/dSWQFQwSBXQ/hqdefault.jpg'
  },
  {
    id: 'insta-reel-5',
    youtubeId: 'pgtC9BT744I',
    platform: 'INSTAGRAM',
    title: '🛠️ EIL Recruitment 2026 | Diploma व ITI के लिए Navratna PSU भर्ती',
    dept: 'EIL / Navratna PSU',
    duration: '0:42',
    likes: '12.4K',
    comments: '274',
    channel: '@vacancyera',
    jobId: 'bhel-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    youtubeUrl: 'https://youtu.be/pgtC9BT744I',
    tags: ['#EIL', '#DiplomaJobs', '#VacancyEra'],
    thumbnail: 'https://img.youtube.com/vi/pgtC9BT744I/hqdefault.jpg'
  }
];

export default function ShortsTab({ shorts, userProfile, onOpenAuth, onSelectJob, t, currentLang = 'hi' }) {
  const [activePlatform, setActivePlatform] = useState('ALL'); // 'ALL' | 'INSTA' | 'YT'
  const [likesState, setLikesState] = useState({});
  const [activePlayingId, setActivePlayingId] = useState(null);

  // Creator Verification & Upload States
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('vee_creator_admin_unlocked') === 'true';
  });

  // Upload Form State
  const [uploadPlatform, setUploadPlatform] = useState('INSTA');
  const [uploadLink, setUploadLink] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDept, setUploadDept] = useState('Railway & SSC');
  const [uploadApplyUrl, setUploadApplyUrl] = useState('');

  // Loaded Reels (persisted in localStorage)
  const [customReels, setCustomReels] = useState(() => {
    const saved = localStorage.getItem('vee_custom_user_reels_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_OFFICIAL_REELS;
  });

  // Calculate user follower count
  const followerCount = React.useMemo(() => {
    if (!userProfile) return 0;
    const str = String(userProfile.followers || '0').replace(/[^\d]/g, '');
    const num = parseInt(str, 10);
    return isNaN(num) ? 0 : num;
  }, [userProfile]);

  const isEligibleToPost = isAdminUnlocked || followerCount >= 1000;

  const handleLike = (shortId) => {
    setLikesState((prev) => ({
      ...prev,
      [shortId]: !prev[shortId]
    }));
  };

  // Click on "Upload Video / Reel" button
  const handleUploadButtonClick = () => {
    if (!userProfile || !userProfile.isLoggedIn) {
      if (onOpenAuth) {
        onOpenAuth();
      } else {
        alert(currentLang === 'en' ? 'Please log in to your account first.' : 'कृपया पहले अपना अकाउंट लॉगिन करें।');
      }
      return;
    }

    if (isEligibleToPost) {
      setShowUploadModal(true);
    } else {
      setShowEligibilityModal(true);
    }
  };

  // Admin PIN bypass verification
  const handleVerifyAdminPin = (e) => {
    e.preventDefault();
    if (adminPinInput === '0000' || adminPinInput === '9887' || adminPinInput === '1234') {
      setIsAdminUnlocked(true);
      localStorage.setItem('vee_creator_admin_unlocked', 'true');
      setShowEligibilityModal(false);
      setShowUploadModal(true);
      setAdminPinInput('');
    } else {
      alert(currentLang === 'en' ? 'Incorrect PIN! Enter 0000 or 9887.' : 'गलत पिन! सही एडमिन पिन 0000 या 9887 दर्ज करें।');
    }
  };

  // Submit and Publish new Reel/Video
  const handlePublishReel = (e) => {
    e.preventDefault();
    if (!uploadLink.trim()) return;

    const cleanUrl = uploadLink.trim();
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([A-Za-z0-9_-]{11})/i);
    const igMatch = cleanUrl.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/i);

    let ytId = 'EZvKIO-TNsQ';
    if (ytMatch) {
      ytId = ytMatch[1];
    }

    const newReel = {
      id: `reel-${Date.now()}`,
      youtubeId: ytId,
      platform: uploadPlatform === 'INSTA' ? 'INSTAGRAM' : 'YOUTUBE',
      title: uploadTitle.trim() || '🔥 New Vacancy Alert Reel (@vacancyera)',
      dept: uploadDept || 'Govt Jobs',
      duration: '0:50',
      likes: '1.2K',
      comments: '34',
      channel: uploadPlatform === 'INSTA' ? '@vacancyera' : '@vacancyeraeducation',
      instagramUrl: igMatch ? `https://www.instagram.com/p/${igMatch[1]}/` : 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
      youtubeUrl: ytMatch ? `https://youtu.be/${ytId}` : 'https://www.youtube.com/@vacancyeraeducation',
      tags: ['#VacancyEra', '#SarkariNaukri', '#GovtJobs'],
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      applyUrl: uploadApplyUrl.trim() || null
    };

    const updated = [newReel, ...customReels];
    setCustomReels(updated);
    localStorage.setItem('vee_custom_user_reels_v4', JSON.stringify(updated));

    setShowUploadModal(false);
    setUploadLink('');
    setUploadTitle('');
    setActivePlayingId(newReel.id);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } catch (err) {}
  };

  return (
    <div className="shorts-tab-container">
      {/* ===================================================================
          1. CLEAN OFFICIAL INSTAGRAM BANNER (No ugly buttons)
          =================================================================== */}
      <div
        className="insta-official-hero-card mb-3 p-3 rounded-2xl text-white flex-between items-center"
        style={{
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
          boxShadow: '0 4px 16px rgba(225, 48, 108, 0.35)'
        }}
      >
        <div className="flex-center-start gap-2.5">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Instagram size={24} color="#E1306C" />
          </div>
          <div>
            <div className="flex-center-start gap-1">
              <span className="font-extrabold text-sm">@vacancyera</span>
              <span className="badge-live-sm bg-white text-danger font-bold text-3xs px-1.5 py-0.2 rounded-full">
                OFFICIAL ✓
              </span>
            </div>
            <p className="text-3xs text-white/95 m-0 font-medium">
              {currentLang === 'en'
                ? 'Official Instagram Reels & Fast Recruitment Alerts'
                : 'ऑफिशियल इंस्टाग्राम रील्स व ताज़ा भर्ती वीडियो अपडेट्स'}
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="badge-live-sm bg-white text-danger font-bold text-2xs px-3 py-1.5 rounded-xl inline-flex flex-center gap-1 shadow-sm"
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <Instagram size={13} /> {currentLang === 'en' ? 'Follow @vacancyera' : 'फॉलो करें ↗'}
        </a>
      </div>

      {/* ===================================================================
          2. CREATOR VIDEO POSTING BAR & PLATFORM FILTER PILLS
          =================================================================== */}
      <div className="flex-between items-center mb-3 gap-2 flex-wrap">
        {/* Platform Switcher Pills */}
        <div className="sector-switcher-row flex-1" style={{ marginBottom: 0 }}>
          <button
            className={`sector-pill ${activePlatform === 'ALL' ? 'active font-bold' : ''}`}
            onClick={() => setActivePlatform('ALL')}
          >
            ⚡ {currentLang === 'en' ? 'All Reels' : 'सभी रील्स'}
          </button>
          <button
            className={`sector-pill ${activePlatform === 'INSTA' ? 'active font-bold' : ''}`}
            onClick={() => setActivePlatform('INSTA')}
            style={activePlatform === 'INSTA' ? { background: 'linear-gradient(135deg, #833AB4, #FD1D1D)', color: '#FFF' } : {}}
          >
            📸 Instagram
          </button>
          <button
            className={`sector-pill ${activePlatform === 'YT' ? 'active font-bold' : ''}`}
            onClick={() => setActivePlatform('YT')}
            style={activePlatform === 'YT' ? { background: '#EF4444', color: '#FFF' } : {}}
          >
            ▶️ YouTube
          </button>
        </div>

        {/* ➕ Post Reel Action Button with Creator Guidelines check */}
        <button
          type="button"
          className="btn-accent-sm flex-center gap-1 text-2xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-xs"
          onClick={handleUploadButtonClick}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
            color: '#FFFFFF',
            border: 'none',
            whiteSpace: 'nowrap'
          }}
          title="रील या वीडियो अपलोड करें"
        >
          <Plus size={14} />
          <span>{currentLang === 'en' ? '+ Post Video / Reel' : '+ वीडियो / रील पोस्ट करें'}</span>
        </button>
      </div>

      {/* ===================================================================
          MODAL 1: CREATOR ELIGIBILITY & 1,000 FOLLOWERS GUIDELINES MODAL
          =================================================================== */}
      {showEligibilityModal && (
        <div className="modal-overlay" onClick={() => setShowEligibilityModal(false)}>
          <div
            className="modal-content card-styled p-4"
            style={{ maxWidth: '420px', width: '92%', borderRadius: '20px', margin: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between items-center pb-2 border-bottom mb-3">
              <div className="flex-center-start gap-1.5">
                <span style={{ fontSize: '20px' }}>👑</span>
                <h4 className="font-extrabold text-sm m-0 text-slate-800">
                  {currentLang === 'en' ? 'Creator Verification Required' : 'क्रिएटर वेरिफिकेशन व पोस्टिंग नियम'}
                </h4>
              </div>
              <button
                type="button"
                className="btn-clear text-muted font-bold text-xs"
                onClick={() => setShowEligibilityModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Follower Count Progress Bar */}
            <div
              className="p-3 rounded-xl mb-3"
              style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '1.5px solid #F59E0B' }}
            >
              <div className="flex-between items-center mb-1">
                <span className="text-3xs font-bold text-amber-900">
                  🎯 न्यूनतम फॉलोअर्स आवश्यकता: 1,000
                </span>
                <span className="badge-pill bg-amber-700 text-white font-extrabold text-3xs px-2 py-0.5 rounded-full">
                  {followerCount.toLocaleString()} / 1,000
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', margin: '6px 0' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(5, (followerCount / 1000) * 100))}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                    borderRadius: '4px'
                  }}
                ></div>
              </div>

              <p className="text-3xs text-amber-900 m-0 font-medium">
                ⚠️ वीडियो पोस्ट करने के लिए आपके अकाउंट पर <b>कम से कम 1,000 फॉलोअर्स</b> होना अनिवार्य है।
              </p>
            </div>

            {/* Official Guidelines List */}
            <div className="mb-3">
              <span className="text-3xs font-extrabold text-slate-700 uppercase block mb-1.5">
                📜 वीडियो पोस्टिंग कम्युनिटी गाइडलाइन्स:
              </span>
              <ul className="text-3xs text-slate-600 m-0 pl-4 flex-column gap-1.5" style={{ lineHeight: '1.4' }}>
                <li><b>1. केवल प्रामाणिक कंटेंट:</b> केवल सरकारी भर्ती, परीक्षा तिथि, सिलेबस व करियर मार्गदर्शन से संबंधित वीडियो ही मान्य हैं।</li>
                <li><b>2. कोई फर्जी या भ्रामक भर्ती नहीं:</b> फेक सूचना या क्लिकबेट पाए जाने पर क्रिएटर अकाउंट हमेशा के लिए ब्लॉक कर दिया जाएगा।</li>
                <li><b>3. वीडियो फॉर्मेट:</b> वीडियो वर्टिकल (9:16 Shorts/Reel) फॉर्मेट में 30 से 90 सेकंड तक का होना चाहिए।</li>
              </ul>
            </div>

            {/* Admin PIN Unlock Form (For Pawan Meena / Channel Owner) */}
            <form onSubmit={handleVerifyAdminPin} className="p-2.5 rounded-xl bg-slate-50 border mb-3">
              <span className="text-3xs font-bold text-slate-700 block mb-1">
                🔑 अधिकृत क्रिएटर / एडमिन पिन (Admin Access):
              </span>
              <div className="flex-row gap-1.5">
                <input
                  type="password"
                  placeholder="पिन दर्ज करें (e.g. 0000 या 9887)"
                  className="form-input text-xs flex-1 rounded-lg"
                  style={{ height: '36px' }}
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-primary text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: '#2563EB', color: '#FFF', border: 'none' }}
                >
                  अनलॉक करें
                </button>
              </div>
            </form>

            <button
              type="button"
              className="btn-secondary w-full text-xs font-bold py-2 rounded-xl"
              onClick={() => setShowEligibilityModal(false)}
            >
              ठीक है, समझ गया
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: UPLOAD REEL / SHORT FORM (When eligible or Admin unlocked)
          =================================================================== */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div
            className="modal-content card-styled p-4"
            style={{ maxWidth: '440px', width: '92%', borderRadius: '20px', margin: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between items-center pb-2 border-bottom mb-3">
              <div className="flex-center-start gap-1.5">
                <span style={{ fontSize: '20px' }}>🎬</span>
                <h4 className="font-extrabold text-sm m-0 text-slate-800">
                  {currentLang === 'en' ? 'Post Verified Reel / Short' : 'ऑफिशियल वीडियो / रील पोस्ट करें'}
                </h4>
              </div>
              <button
                type="button"
                className="btn-clear text-muted font-bold text-xs"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishReel}>
              {/* Platform Selector */}
              <div className="form-group mb-2.5">
                <label className="text-3xs font-bold text-muted block mb-1">प्लेटफ़ॉर्म चुनें:</label>
                <div className="flex-row gap-2">
                  <button
                    type="button"
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border flex-center justify-center gap-1 ${uploadPlatform === 'INSTA' ? 'bg-pink-600 text-white' : 'bg-slate-50'}`}
                    onClick={() => setUploadPlatform('INSTA')}
                  >
                    <Instagram size={14} /> Instagram Reel
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border flex-center justify-center gap-1 ${uploadPlatform === 'YT' ? 'bg-red-600 text-white' : 'bg-slate-50'}`}
                    onClick={() => setUploadPlatform('YT')}
                  >
                    <Video size={14} /> YouTube Short
                  </button>
                </div>
              </div>

              {/* Video Link */}
              <div className="form-group mb-2.5">
                <label className="text-3xs font-bold text-muted block mb-1">
                  वीडियो / रील लिंक (YouTube या Instagram URL):
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://youtu.be/EZvKIO-TNsQ या Insta Reel link"
                  className="form-input text-xs rounded-xl"
                  style={{ height: '38px' }}
                  value={uploadLink}
                  onChange={(e) => setUploadLink(e.target.value)}
                />
              </div>

              {/* Video Title */}
              <div className="form-group mb-2.5">
                <label className="text-3xs font-bold text-muted block mb-1">वीडियो शीर्षक (Title):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. रेलवे 12,000 नई भर्ती 2026 फॉर्म शुरू"
                  className="form-input text-xs rounded-xl"
                  style={{ height: '38px' }}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="form-group mb-2.5">
                <label className="text-3xs font-bold text-muted block mb-1">विभाग / श्रेणी (Category):</label>
                <select
                  className="form-select-sm text-xs rounded-xl w-full"
                  style={{ height: '38px' }}
                  value={uploadDept}
                  onChange={(e) => setUploadDept(e.target.value)}
                >
                  <option value="Railway & RRB">Railway & RRB ALP/Technician</option>
                  <option value="SSC & State Police">SSC GD & State Police Bharti</option>
                  <option value="Banking & PO">Banking PO & Clerk</option>
                  <option value="Apprentice Special">All India Apprentice & PSU</option>
                  <option value="State PSC & Board">State PSC (UP, MP, Bihar, Rajasthan)</option>
                </select>
              </div>

              {/* Job Apply Link (Optional) */}
              <div className="form-group mb-3">
                <label className="text-3xs font-bold text-muted block mb-1">आधिकारिक भर्ती / PDF लिंक (वैकल्पिक):</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="form-input text-xs rounded-xl"
                  style={{ height: '38px' }}
                  value={uploadApplyUrl}
                  onChange={(e) => setUploadApplyUrl(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-xs font-bold py-2.5 rounded-xl shadow-md cursor-pointer flex-center justify-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                <Check size={16} />
                <span>🚀 वीडियो तुरंत लाइव पब्लिश करें</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          3. REELS & SHORTS LIST WITH 100% RELIABLE WORKING VIDEO PLAYER
          =================================================================== */}
      <div className="shorts-list">
        {customReels
          .filter((reel) => {
            if (activePlatform === 'INSTA') return reel.platform === 'INSTAGRAM';
            if (activePlatform === 'YT') return reel.platform === 'YOUTUBE';
            return true;
          })
          .map((reel) => {
            const isPlaying = activePlayingId === reel.id;
            const isLiked = likesState[reel.id];
            const youtubeId = reel.youtubeId || 'EZvKIO-TNsQ';
            const thumbnailSrc = reel.thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
            const isInsta = reel.platform === 'INSTAGRAM';

            return (
              <div
                key={reel.id}
                className="short-card mb-4"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '18px',
                  border: isInsta ? '2px solid rgba(225, 48, 108, 0.4)' : '2px solid rgba(239, 68, 68, 0.4)',
                  boxShadow: isInsta ? '0 6px 20px rgba(225, 48, 108, 0.15)' : '0 6px 20px rgba(239, 68, 68, 0.15)'
                }}
              >
                <div className="short-media-wrapper" style={{ position: 'relative', minHeight: '440px' }}>
                  {/* Working In-App Video Player */}
                  {isPlaying ? (
                    <div
                      className="short-video-player-box"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 15,
                        background: '#000'
                      }}
                    >
                      <iframe
                        style={{ width: '100%', height: '100%', border: 0 }}
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&playsinline=1&rel=0&modestbranding=1`}
                        title={reel.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <button
                        type="button"
                        className="close-reel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlayingId(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 25,
                          background: 'rgba(0,0,0,0.85)',
                          color: '#FFF',
                          border: '1.5px solid rgba(255,255,255,0.7)',
                          borderRadius: '50%',
                          width: '34px',
                          height: '34px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Close Video"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    /* High-Res Thumbnail with Play Overlay */
                    <>
                      <img
                        src={thumbnailSrc}
                        alt={reel.title}
                        className="short-thumb-img cursor-pointer"
                        style={{ width: '100%', height: '440px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80';
                        }}
                        onClick={() => setActivePlayingId(reel.id)}
                      />
                      <div className="short-overlay-gradient" onClick={() => setActivePlayingId(reel.id)}></div>

                      {/* Top Badges */}
                      <div className="short-top-bar flex-between" style={{ zIndex: 12 }}>
                        <span
                          className="short-dept-badge flex-center gap-1 font-bold text-3xs"
                          style={{
                            background: isInsta
                              ? 'linear-gradient(135deg, #833AB4, #FD1D1D)'
                              : '#EF4444'
                          }}
                        >
                          {isInsta ? <Instagram size={11} /> : <Video size={11} />}
                          <span>{isInsta ? 'INSTAGRAM REEL' : 'YOUTUBE SHORT'} • {reel.dept}</span>
                        </span>
                        <span className="short-duration">{reel.duration || '0:50'}</span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        type="button"
                        className="short-play-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlayingId(reel.id);
                        }}
                        title="Play Reel"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <div
                          className="play-circle"
                          style={{
                            background: isInsta ? 'linear-gradient(135deg, #833AB4, #FD1D1D)' : '#EF4444',
                            boxShadow: isInsta ? '0 4px 20px rgba(225, 48, 108, 0.8)' : '0 4px 20px rgba(239, 68, 68, 0.8)'
                          }}
                        >
                          <Play size={24} fill="#FFFFFF" />
                        </div>
                      </button>
                    </>
                  )}

                  {/* Right Action Icons (Like, Comment, Share) */}
                  <div className="short-right-actions" style={{ zIndex: isPlaying ? 5 : 12 }}>
                    <button
                      type="button"
                      className={`short-action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(reel.id)}
                    >
                      <ThumbsUp size={20} fill={isLiked ? "#EF4444" : "none"} />
                      <span className="action-txt">{isLiked ? "Liked" : reel.likes}</span>
                    </button>

                    <button type="button" className="short-action-btn">
                      <MessageSquare size={20} />
                      <span className="action-txt">{reel.comments}</span>
                    </button>

                    <button
                      type="button"
                      className="short-action-btn"
                      onClick={() => {
                        const text = `*${reel.title}*\n\nDekhein VEE Reels par: ${reel.instagramUrl || reel.youtubeUrl}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      <Share2 size={20} />
                      <span className="action-txt">Share</span>
                    </button>

                    {/* App Link */}
                    <a
                      href={isInsta ? reel.instagramUrl : (reel.youtubeUrl || `https://youtu.be/${youtubeId}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-action-btn"
                      title={isInsta ? 'Instagram पर देखें' : 'YouTube पर देखें'}
                      style={{ textDecoration: 'none', color: '#FFF' }}
                    >
                      <ExternalLink size={17} />
                      <span className="action-txt">{isInsta ? 'IG' : 'YT'}</span>
                    </a>
                  </div>

                  {/* Bottom Channel Info & Play CTA */}
                  <div className="short-bottom-info" style={{ zIndex: isPlaying ? 5 : 12 }}>
                    <div className="flex-center-start gap-1 mb-1">
                      {isInsta ? <Instagram size={14} style={{ color: '#FCB045' }} /> : <Video size={14} className="text-danger" />}
                      <span className="text-xs font-semibold text-white">{reel.channel}</span>
                      <span className="text-3xs text-yellow-300 font-bold ml-1">✓ Verified Official</span>
                    </div>

                    <h4 className="short-title text-sm font-bold text-white leading-tight">
                      {reel.title}
                    </h4>

                    <div className="short-tags-row mt-1">
                      {reel.tags.map((tag, i) => (
                        <span key={i} className="short-tag text-2xs">{tag}</span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex-column gap-1.5">
                      <div className="flex-row gap-2">
                        <button
                          type="button"
                          className="btn-accent-sm flex-1 flex-center justify-center gap-1.5 font-bold py-2 rounded-xl"
                          onClick={() => setActivePlayingId(reel.id)}
                          style={{
                            background: isInsta
                              ? 'linear-gradient(135deg, #833AB4, #FD1D1D)'
                              : '#EF4444',
                            color: '#FFF',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Play size={14} fill="#FFF" /> {isPlaying ? 'वीडियो चल रहा है (Playing)' : '▶️ वीडियो चलाएं (Play Now)'}
                        </button>

                        <a
                          href={isInsta ? reel.instagramUrl : (reel.youtubeUrl || `https://youtu.be/${youtubeId}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-xs flex-center justify-center gap-1 px-3 py-2 rounded-xl font-bold text-xs"
                          style={{
                            background: 'rgba(255,255,255,0.22)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFF',
                            textDecoration: 'none',
                            border: '1px solid rgba(255,255,255,0.35)'
                          }}
                        >
                          <ExternalLink size={13} /> {isInsta ? 'IG App' : 'YT App'}
                        </a>
                      </div>

                      {reel.jobId && onSelectJob && (
                        <button
                          type="button"
                          className="btn-secondary-xs w-full flex-center justify-center gap-1 font-semibold py-1.5 rounded-lg text-3xs"
                          onClick={() => onSelectJob(reel.jobId)}
                          style={{ background: 'rgba(0,0,0,0.65)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                          <Send size={11} /> Is Job Ka Official PDF & Apply Dekhein
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
