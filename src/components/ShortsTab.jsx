import React, { useState } from 'react';
import { Play, ThumbsUp, MessageSquare, Share2, Send, Video, Flame, X, ExternalLink } from 'lucide-react';
import { VIDEO_REGISTRY } from '../data/videoRegistry';

const Instagram = ({ size = 18, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// Curated Instagram Reels from @vacancyeraeducation
const INSTAGRAM_REELS = [
  {
    id: 'insta-reel-1',
    title: '🔥 Railway NTPC & Group D 2026 Big Vacancy Update!',
    dept: 'Railway Recruitment Board',
    duration: '0:45',
    likes: '12.4K',
    comments: '482',
    channel: '@vacancyeraeducation',
    instagramUrl: 'https://www.instagram.com/vacancyeraeducation/',
    tags: ['#Railway', '#RRB', '#SarkariNaukri'],
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80'
  },
  {
    id: 'insta-reel-2',
    title: '⚡ SSC GD & State Police 45,000+ Constable Direct Form!',
    dept: 'SSC & Police Dept',
    duration: '0:55',
    likes: '18.9K',
    comments: '631',
    channel: '@vacancyeraeducation',
    instagramUrl: 'https://www.instagram.com/vacancyeraeducation/',
    tags: ['#PoliceBharti', '#SSCGD', '#GovtJobs'],
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=720&q=80'
  },
  {
    id: 'insta-reel-3',
    title: '🛠️ All India Apprentice Bharti: 10th + ITI Merit (No Exam)!',
    dept: 'PSU & Railway Apprentice',
    duration: '0:40',
    likes: '9.8K',
    comments: '315',
    channel: '@vacancyeraeducation',
    instagramUrl: 'https://www.instagram.com/vacancyeraeducation/',
    tags: ['#ITIApprentice', '#RailwayApprentice', '#NoExam'],
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=720&q=80'
  }
];

export default function ShortsTab({ shorts, onSelectJob, t }) {
  const [activePlatform, setActivePlatform] = useState('ALL'); // 'ALL' | 'INSTA' | 'YT'
  const [likesState, setLikesState] = useState({});
  const [activePlayingId, setActivePlayingId] = useState(null);

  const handleLike = (shortId) => {
    setLikesState((prev) => ({
      ...prev,
      [shortId]: !prev[shortId]
    }));
  };

  return (
    <div className="shorts-feed-container">
      {/* Official Instagram Showcase Banner */}
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
              width: '40px',
              height: '40px',
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
              <span className="font-extrabold text-xs">@vacancyeraeducation</span>
              <span className="badge-live-sm bg-white text-danger font-bold text-3xs px-1.5 py-0.5 rounded-full">OFFICIAL</span>
            </div>
            <p className="text-3xs text-white/90 m-0">Instagram Reels par daily 30-sec vacancy alerts dekhein!</p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/vacancyeraeducation/"
          target="_blank"
          rel="noopener noreferrer"
          className="badge-live-sm bg-white text-danger font-bold text-2xs px-3 py-1.5 rounded-xl inline-flex flex-center gap-1 shadow-sm"
          style={{ textDecoration: 'none' }}
        >
          <Instagram size={13} /> Follow on Instagram
        </a>
      </div>

      {/* Platform Switcher Pills */}
      <div className="sector-switcher-row mb-3">
        <button
          className={`sector-pill ${activePlatform === 'ALL' ? 'active font-bold' : ''}`}
          onClick={() => setActivePlatform('ALL')}
        >
          ⚡ All Reels & Shorts
        </button>
        <button
          className={`sector-pill ${activePlatform === 'INSTA' ? 'active font-bold' : ''}`}
          onClick={() => setActivePlatform('INSTA')}
          style={activePlatform === 'INSTA' ? { background: 'linear-gradient(135deg, #833AB4, #FD1D1D)', color: '#FFF' } : {}}
        >
          📸 Instagram Reels ({INSTAGRAM_REELS.length})
        </button>
        <button
          className={`sector-pill ${activePlatform === 'YT' ? 'active font-bold' : ''}`}
          onClick={() => setActivePlatform('YT')}
          style={activePlatform === 'YT' ? { background: '#EF4444', color: '#FFF' } : {}}
        >
          ▶️ YouTube Shorts ({shorts.length})
        </button>
      </div>

      {/* INSTAGRAM REELS SECTION */}
      {(activePlatform === 'ALL' || activePlatform === 'INSTA') && (
        <div className="insta-reels-list mb-3">
          {INSTAGRAM_REELS.map((reel) => (
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
              <div className="short-media-wrapper" style={{ position: 'relative', minHeight: '360px' }}>
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="short-thumb-img"
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
                <div className="short-overlay-gradient"></div>

                {/* Top Badge */}
                <div className="short-top-bar flex-between" style={{ zIndex: 12 }}>
                  <span className="short-dept-badge flex-center gap-1" style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D)' }}>
                    <Instagram size={11} /> {reel.dept}
                  </span>
                  <span className="short-duration">{reel.duration}</span>
                </div>

                {/* Center Play Button linking to Instagram */}
                <a
                  href={reel.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-play-center"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="play-circle"
                    style={{
                      background: 'linear-gradient(135deg, #833AB4, #FD1D1D)',
                      boxShadow: '0 4px 16px rgba(225, 48, 108, 0.6)'
                    }}
                  >
                    <Play size={24} fill="#FFFFFF" />
                  </div>
                </a>

                {/* Bottom Channel Info */}
                <div className="short-bottom-info" style={{ zIndex: 12 }}>
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

                  <div className="mt-3">
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent-sm w-full flex-center justify-center gap-1.5 font-bold py-2 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #833AB4, #FD1D1D)',
                        color: '#FFF',
                        textDecoration: 'none'
                      }}
                    >
                      <Instagram size={14} /> Instagram Par Ye Reel Dekhein ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YOUTUBE SHORTS LIST */}
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
                    <>
                      <img
                        src={thumbnailSrc}
                        alt={short.title}
                        className="short-thumb-img"
                        onError={(e) => {
                          e.target.src = short.videoThumbnail || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=720&q=80';
                        }}
                      />
                      <div className="short-overlay-gradient"></div>

                      {/* Top Details */}
                      <div className="short-top-bar flex-between">
                        <span className="short-dept-badge">{short.dept}</span>
                        <span className="short-duration">{short.duration}</span>
                      </div>

                      {/* Play Button Overlay (Plays in App) */}
                      <button
                        type="button"
                        className="short-play-center"
                        onClick={() => setActivePlayingId(short.id)}
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
                      className={`short-action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(short.id)}
                    >
                      <ThumbsUp size={20} fill={isLiked ? "#EF4444" : "none"} />
                      <span className="action-txt">{isLiked ? "Liked" : short.likes}</span>
                    </button>

                    <button className="short-action-btn">
                      <MessageSquare size={20} />
                      <span className="action-txt">{short.comments}</span>
                    </button>

                    <button
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

                    {/* Direct Job Connect Button */}
                    <div className="mt-3">
                      <button
                        className="btn-accent-sm w-full flex-center justify-center gap-1 font-bold py-2 rounded-xl"
                        onClick={() => onSelectJob(short.jobId)}
                      >
                        <Send size={14} /> Is Job Ka Official PDF & Apply Dekhein
                      </button>
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
