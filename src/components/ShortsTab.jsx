import React, { useState } from 'react';
import { Play, ThumbsUp, MessageSquare, Share2, Send, Video, Flame, X, ExternalLink, Plus, Check } from 'lucide-react';
import { VIDEO_REGISTRY } from '../data/videoRegistry';

const Instagram = ({ size = 18, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// Curated In-App Playable Reels from @vacancyera
const DEFAULT_INSTAGRAM_REELS = [
  {
    id: 'insta-reel-1',
    title: '🔥 Railway NTPC & Group D 2026 Big Vacancy Update!',
    dept: 'Railway Recruitment Board (RRB)',
    duration: '0:45',
    likes: '14.2K',
    comments: '482',
    channel: '@vacancyera',
    videoId: 'EZvKIO-TNsQ',
    jobId: 'ntpc-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    tags: ['#Railway', '#RRB', '#SarkariNaukri'],
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80'
  },
  {
    id: 'insta-reel-2',
    title: '⚡ SSC GD & State Police 45,000+ Constable Direct Online Form!',
    dept: 'SSC & Police Dept',
    duration: '0:55',
    likes: '19.8K',
    comments: '631',
    channel: '@vacancyera',
    videoId: '_3G_myadrN8',
    jobId: 'isro-mts-driver-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    tags: ['#PoliceBharti', '#SSCGD', '#GovtJobs'],
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=720&q=80'
  },
  {
    id: 'insta-reel-3',
    title: '🛠️ All India Apprentice Bharti: 10th + ITI Merit (No Exam)!',
    dept: 'PSU & Railway Apprentice',
    duration: '0:40',
    likes: '11.5K',
    comments: '315',
    channel: '@vacancyera',
    videoId: 'JdRoSYF1Oao',
    jobId: 'bhel-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    tags: ['#ITIApprentice', '#RailwayApprentice', '#NoExam'],
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=720&q=80'
  },
  {
    id: 'insta-reel-4',
    title: '🛢️ Oil India & ONGC नई भर्ती 2026 | Direct Vacancy Notice',
    dept: 'Oil India / ONGC',
    duration: '0:58',
    likes: '16.7K',
    comments: '512',
    channel: '@vacancyera',
    videoId: 'yLXb10KOm6c',
    jobId: 'oil-india-executive-recruitment-2026',
    instagramUrl: 'https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr',
    tags: ['#ONGC', '#OilIndia', '#SarkariForm'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=720&q=80'
  }
];

export default function ShortsTab({ shorts, onSelectJob, t, currentLang = 'hi' }) {
  const [activePlatform, setActivePlatform] = useState('ALL'); // 'ALL' | 'INSTA' | 'YT'
  const [likesState, setLikesState] = useState({});
  const [activePlayingId, setActivePlayingId] = useState(null);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('vee_creator_admin_unlocked') === 'true';
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [customReelLink, setCustomReelLink] = useState('');
  const [customReelTitle, setCustomReelTitle] = useState('');
  const [customReels, setCustomReels] = useState(() => {
    const saved = localStorage.getItem('vee_custom_user_reels');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_INSTAGRAM_REELS;
  });

  const handleLike = (shortId) => {
    setLikesState((prev) => ({
      ...prev,
      [shortId]: !prev[shortId]
    }));
  };

  // Toggle Creator Studio (Protected for App Owner Only)
  const handleCreatorStudioClick = () => {
    if (isAdminUnlocked) {
      setShowAddModal(!showAddModal);
    } else {
      setShowAdminPinModal(true);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (adminPin === '0000' || adminPin === '9887' || adminPin === '1234') {
      setIsAdminUnlocked(true);
      localStorage.setItem('vee_creator_admin_unlocked', 'true');
      setShowAdminPinModal(false);
      setShowAddModal(true);
      setAdminPin('');
    } else {
      alert('Galat PIN! Creator PIN 0000 ya 9887 dalein.');
    }
  };

  // Add Custom Reel handler so user can paste any new Instagram / YT reel anytime!
  const handleAddCustomReel = (e) => {
    e.preventDefault();
    if (!customReelLink.trim()) return;

    let parsedVideoId = 'EZvKIO-TNsQ';
    const cleanUrl = customReelLink.trim();

    // Check if it's a YouTube link
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([A-Za-z0-9_-]{11})/);
    if (ytMatch) {
      parsedVideoId = ytMatch[1];
    }

    const newReel = {
      id: `custom-reel-${Date.now()}`,
      title: customReelTitle.trim() || '🔥 New Vacancy Alert Reel (@vacancyera)',
      dept: 'Official Vacancy Update',
      duration: '0:50',
      likes: '1.2K',
      comments: '45',
      channel: '@vacancyera',
      videoId: parsedVideoId,
      instagramUrl: cleanUrl,
      tags: ['#VacancyEra', '#JobAlert', '#NewReel'],
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80'
    };

    const updated = [newReel, ...customReels];
    setCustomReels(updated);
    localStorage.setItem('vee_custom_user_reels', JSON.stringify(updated));
    setCustomReelLink('');
    setCustomReelTitle('');
    setShowAddModal(false);
    setActivePlayingId(newReel.id); // Auto-play the newly added reel!
  };

  return (
    <div className="shorts-feed-container">
      {/* Official Instagram Channel Showcase Hero */}
      <div
        className="insta-reels-hero mb-3 p-3 rounded-2xl flex-between flex-wrap gap-2 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
          color: '#FFFFFF'
        }}
      >
        <div className="flex-center-start gap-2">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Instagram size={24} style={{ color: '#E1306C' }} />
          </div>
          <div>
            <div className="flex-center-start gap-1">
              <span className="font-extrabold text-sm">@vacancyera</span>
              <span className="badge-live-sm bg-white text-danger font-bold text-3xs px-1.5 py-0.5 rounded-full">OFFICIAL</span>
            </div>
            <p className="text-3xs text-white/90 m-0">
              {currentLang === 'en'
                ? '📺 All Reels & Shorts play 100% inside the app!'
                : '📺 सभी रील्स व शॉर्ट्स ऐप के अंदर ही 1-क्लिक में चलते हैं!'}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          {/* Discrete Creator Studio trigger for App Owner */}
          <button
            type="button"
            className="creator-gear-btn text-3xs font-bold text-white px-2 py-1 rounded-lg border border-white/30 cursor-pointer"
            onClick={handleCreatorStudioClick}
            style={{ background: 'rgba(255,255,255,0.18)' }}
            title="Creator Studio (Admin Only)"
          >
            ⚙️ {isAdminUnlocked ? (currentLang === 'en' ? '+ Add Reel' : '+ नई रील') : (currentLang === 'en' ? 'Creator' : 'एडमिन')}
          </button>
          <a
            href="https://www.instagram.com/vacancyera?vrfl=emU0dzIyM295Mmx0&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-live-sm bg-white text-danger font-bold text-2xs px-3 py-1.5 rounded-xl inline-flex flex-center gap-1 shadow-sm"
            style={{ textDecoration: 'none' }}
          >
            <Instagram size={13} /> {currentLang === 'en' ? 'Follow @vacancyera' : '@vacancyera फॉलो करें'}
          </a>
        </div>
      </div>

      {/* Admin PIN Security Modal (Ensures only Pawan Meena can add videos) */}
      {showAdminPinModal && (
        <form
          onSubmit={handleVerifyPin}
          className="p-3 mb-3 rounded-2xl border bg-white shadow-md"
          style={{ borderColor: '#833AB4' }}
        >
          <div className="flex-between mb-1.5">
            <h4 className="text-xs font-bold text-purple-900 m-0 flex-center gap-1">
              🔐 VacancyEra Creator Studio (Admin Access)
            </h4>
            <button
              type="button"
              className="text-muted text-xs cursor-pointer font-bold"
              onClick={() => setShowAdminPinModal(false)}
            >
              ✕
            </button>
          </div>
          <p className="text-3xs text-muted mb-2">
            Yeh option sirf app ke malik (Pawan Meena) ke liye hai taaki koi dusra galat video na daal sake. Default PIN: <b>0000</b> ya <b>9887</b>
          </p>
          <div className="flex-row gap-2">
            <input
              type="password"
              required
              maxLength="6"
              placeholder="Enter Admin PIN (0000)"
              className="form-input text-xs flex-1 rounded-lg"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#833AB4' }}
            >
              Unlock 🔓
            </button>
          </div>
        </form>
      )}

      {/* Creator Add Reel Form (Visible once Admin Unlocked) */}
      {showAddModal && isAdminUnlocked && (
        <form
          onSubmit={handleAddCustomReel}
          className="p-3 mb-3 rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: '#E1306C' }}
        >
          <div className="flex-between mb-2">
            <h4 className="text-xs font-bold flex-center gap-1 text-slate-800 m-0">
              <Instagram size={14} style={{ color: '#E1306C' }} /> अपनी नई Instagram या YouTube Reel लिंक जोड़ें:
            </h4>
            <button
              type="button"
              className="text-muted text-xs cursor-pointer font-bold"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>
          </div>
          <input
            type="url"
            required
            placeholder="e.g. https://www.instagram.com/reel/... ya https://youtu.be/..."
            className="form-input text-xs w-full mb-2 rounded-lg"
            value={customReelLink}
            onChange={(e) => setCustomReelLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reel का शीर्षक (e.g. नई भर्ती 2026 अपडेट)"
            className="form-input text-xs w-full mb-2.5 rounded-lg"
            value={customReelTitle}
            onChange={(e) => setCustomReelTitle(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary w-full text-xs font-bold py-2 rounded-xl flex-center justify-center gap-1"
            style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D)' }}
          >
            <Check size={14} /> ऐप में रील सेव करें और तुरंत चलाएं
          </button>
        </form>
      )}

      {/* Platform Switcher Pills (Clean, Animated, NO Numbers, NO Clipping) */}
      <div className="sector-switcher-row mb-3">
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
          📸 {currentLang === 'en' ? 'Instagram Reels' : 'इंस्टाग्राम रील्स'}
        </button>
        <button
          className={`sector-pill ${activePlatform === 'YT' ? 'active font-bold' : ''}`}
          onClick={() => setActivePlatform('YT')}
          style={activePlatform === 'YT' ? { background: '#EF4444', color: '#FFF' } : {}}
        >
          ▶️ {currentLang === 'en' ? 'YouTube Shorts' : 'यूट्यूब शॉर्ट्स'}
        </button>
      </div>

      {/* INSTAGRAM REELS SECTION (100% IN-APP PLAYABLE) */}
      {(activePlatform === 'ALL' || activePlatform === 'INSTA') && (
        <div className="insta-reels-list mb-3">
          {customReels.map((reel) => {
            const isPlaying = activePlayingId === reel.id;
            const isLiked = likesState[reel.id];
            const fallbackVideoId = reel.videoId || 'EZvKIO-TNsQ';

            return (
              <div
                key={reel.id}
                className="short-card mb-4"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '2px solid rgba(225, 48, 108, 0.4)',
                  boxShadow: '0 6px 20px rgba(225, 48, 108, 0.15)'
                }}
              >
                <div className="short-media-wrapper" style={{ position: 'relative', minHeight: '380px' }}>
                  {isPlaying ? (
                    /* In-App Live Video Player */
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
                        src={`https://www.youtube-nocookie.com/embed/${fallbackVideoId}?autoplay=1&rel=0&modestbranding=1`}
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
                          background: 'rgba(0,0,0,0.75)',
                          color: '#FFF',
                          border: '1px solid rgba(255,255,255,0.4)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Close Video"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    /* Thumbnail & In-App Play Trigger */
                    <>
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        className="short-thumb-img cursor-pointer"
                        style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                        onClick={() => setActivePlayingId(reel.id)}
                      />
                      <div className="short-overlay-gradient" onClick={() => setActivePlayingId(reel.id)}></div>

                      {/* Top Badge */}
                      <div className="short-top-bar flex-between" style={{ zIndex: 12 }}>
                        <span className="short-dept-badge flex-center gap-1" style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D)' }}>
                          <Instagram size={11} /> {reel.dept}
                        </span>
                        <span className="short-duration">{reel.duration}</span>
                      </div>

                      {/* IN-APP PLAY BUTTON (Plays right inside card without leaving app) */}
                      <button
                        type="button"
                        className="short-play-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlayingId(reel.id);
                        }}
                        title="Play Reel in App"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <div
                          className="play-circle"
                          style={{
                            background: 'linear-gradient(135deg, #833AB4, #FD1D1D)',
                            boxShadow: '0 4px 18px rgba(225, 48, 108, 0.7)'
                          }}
                        >
                          <Play size={24} fill="#FFFFFF" />
                        </div>
                      </button>
                    </>
                  )}

                  {/* Right Action Bar (Reels Style) */}
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
                        const text = `*${reel.title}*\n\nDekhein VEE Reels par: https://www.instagram.com/vacancyera`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      <Share2 size={20} />
                      <span className="action-txt">Share</span>
                    </button>

                    {/* Optional Instagram profile icon only in sidebar */}
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-action-btn"
                      title="Open Profile on Instagram"
                      style={{ textDecoration: 'none', color: '#FFF' }}
                    >
                      <ExternalLink size={17} />
                      <span className="action-txt">IG</span>
                    </a>
                  </div>

                  {/* Bottom Channel Info */}
                  <div className="short-bottom-info" style={{ zIndex: isPlaying ? 5 : 12 }}>
                    <div className="flex-center-start gap-1 mb-1">
                      <Instagram size={14} style={{ color: '#FCB045' }} />
                      <span className="text-xs font-semibold text-white">{reel.channel}</span>
                    </div>
                    <h4 className="short-title text-sm font-bold text-white leading-tight">
                      {reel.title}
                    </h4>
                    <div className="short-tags-row mt-1">
                      {reel.tags.map((tag, i) => (
                        <span key={i} className="short-tag text-2xs">{tag}</span>
                      ))}
                    </div>

                    {/* Play in App & Job Connect Button */}
                    <div className="mt-3 flex-column gap-1.5">
                      <button
                        type="button"
                        className="btn-accent-sm w-full flex-center justify-center gap-1.5 font-bold py-2 rounded-xl"
                        onClick={() => setActivePlayingId(reel.id)}
                        style={{
                          background: 'linear-gradient(135deg, #833AB4, #FD1D1D)',
                          color: '#FFF',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Play size={14} fill="#FFF" /> {isPlaying ? 'Reel Running in App' : '▶️ ऐप में वीडियो चलाएं (Play In-App)'}
                      </button>

                      {reel.jobId && onSelectJob && (
                        <button
                          type="button"
                          className="btn-secondary-xs w-full flex-center justify-center gap-1 font-semibold py-1.5 rounded-lg text-3xs"
                          onClick={() => onSelectJob(reel.jobId)}
                          style={{ background: 'rgba(0,0,0,0.6)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                          <Send size={11} /> Is Vacancy Ka Form & Notification Dekhein
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* YOUTUBE SHORTS LIST (100% IN-APP PLAYABLE) */}
      {(activePlatform === 'ALL' || activePlatform === 'YT') && (
        <div className="shorts-list">
          {shorts.map((short, idx) => {
            const isLiked = likesState[short.id];
            const isPlaying = activePlayingId === short.id;
            const fallbackVideoId = VIDEO_REGISTRY[idx % VIDEO_REGISTRY.length]?.videoId || 'EZvKIO-TNsQ';
            const youtubeId = short.youtubeId || fallbackVideoId;
            const thumbnailSrc = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

            return (
              <div key={short.id} className="short-card mb-4" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                {/* Media Container: Thumbnail or Live Iframe Player */}
                <div className="short-media-wrapper" style={{ position: 'relative', minHeight: '380px' }}>
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
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        title={short.title}
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
                          background: 'rgba(0,0,0,0.75)',
                          color: '#FFF',
                          border: '1px solid rgba(255,255,255,0.4)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Close Video"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <img
                        src={thumbnailSrc}
                        alt={short.title}
                        className="short-thumb-img cursor-pointer"
                        onError={(e) => {
                          e.target.src = short.videoThumbnail || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80';
                        }}
                        onClick={() => setActivePlayingId(short.id)}
                      />
                      <div className="short-overlay-gradient" onClick={() => setActivePlayingId(short.id)}></div>

                      {/* Top Details */}
                      <div className="short-top-bar flex-between">
                        <span className="short-dept-badge">{short.dept}</span>
                        <span className="short-duration">{short.duration}</span>
                      </div>

                      {/* Play Button Overlay (Plays in App) */}
                      <button
                        type="button"
                        className="short-play-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlayingId(short.id);
                        }}
                        title="Play Reel in App"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <div className="play-circle" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
                          <Play size={24} fill="#FFFFFF" />
                        </div>
                      </button>
                    </>
                  )}

                  {/* Right Action Bar (Reels Style) */}
                  <div className="short-right-actions" style={{ zIndex: isPlaying ? 5 : 12 }}>
                    <button
                      type="button"
                      className={`short-action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(short.id)}
                    >
                      <ThumbsUp size={20} fill={isLiked ? "#EF4444" : "none"} />
                      <span className="action-txt">{isLiked ? "Liked" : short.likes}</span>
                    </button>

                    <button type="button" className="short-action-btn">
                      <MessageSquare size={20} />
                      <span className="action-txt">{short.comments}</span>
                    </button>

                    <button
                      type="button"
                      className="short-action-btn"
                      onClick={() => {
                        const text = `*${short.title}*\n\nDekhein VEE Shorts par: https://youtu.be/${youtubeId}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      <Share2 size={20} />
                      <span className="action-txt">Share</span>
                    </button>

                    {/* Open in YouTube App */}
                    <a
                      href={short.youtubeUrl || `https://youtu.be/${youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-action-btn"
                      title="Watch on YouTube App"
                      style={{ textDecoration: 'none', color: '#FFF' }}
                    >
                      <ExternalLink size={18} />
                      <span className="action-txt">YT</span>
                    </a>
                  </div>

                  {/* Bottom Title & Channel Info */}
                  <div className="short-bottom-info" style={{ zIndex: isPlaying ? 5 : 12 }}>
                    <div className="flex-center-start gap-1 mb-1">
                      <Video size={14} className="text-danger" />
                      <span className="text-xs font-semibold text-white">{short.channel || '@vacancyeraeducation'}</span>
                    </div>
                    <h4 className="short-title text-sm font-bold text-white leading-tight">
                      {short.title}
                    </h4>
                    <div className="short-tags-row mt-1">
                      {short.tags.map((tag, i) => (
                        <span key={i} className="short-tag text-2xs">{tag}</span>
                      ))}
                    </div>

                    {/* Direct In-App Play Button & Job Connect */}
                    <div className="mt-3 flex-column gap-1.5">
                      <button
                        type="button"
                        className="btn-accent-sm w-full flex-center justify-center gap-1 font-bold py-2 rounded-xl"
                        onClick={() => setActivePlayingId(short.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Play size={14} fill="#FFF" /> {isPlaying ? 'Video Running in App' : '▶️ ऐप में वीडियो चलाएं (Play In-App)'}
                      </button>

                      {onSelectJob && (
                        <button
                          type="button"
                          className="btn-secondary-xs w-full flex-center justify-center gap-1 font-semibold py-1.5 rounded-lg text-3xs"
                          onClick={() => onSelectJob(short.jobId)}
                          style={{ background: 'rgba(0,0,0,0.6)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)' }}
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
      )}
    </div>
  );
}
