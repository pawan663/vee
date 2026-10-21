import React, { useState } from 'react';
import { Play, ThumbsUp, MessageSquare, Share2, Send, Video, Flame, X, ExternalLink } from 'lucide-react';

export default function ShortsTab({ shorts, onSelectJob, t }) {
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
      <div className="shorts-header-banner mb-3 flex-between">
        <div>
          <h3 className="font-bold text-sm flex-center gap-1">
            ⚡ 60-Second Job Shorts <span className="badge-live-sm bg-danger text-white">REELS</span>
          </h3>
          <p className="text-2xs text-muted">Vacancy Era Education channel ke short video analysis dekhein</p>
        </div>
        <a
          href="https://www.youtube.com/@vacancyeraeducation/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className="badge-live-sm bg-danger text-white text-3xs font-bold px-2 py-1 rounded inline-flex flex-center gap-1"
          style={{ textDecoration: 'none' }}
        >
          <Video size={12} /> Channel Shorts
        </a>
      </div>

      <div className="shorts-list">
        {shorts.map((short) => {
          const isLiked = likesState[short.id];
          const isPlaying = activePlayingId === short.id;
          const youtubeId = short.youtubeId || 'yLXb10KOm6c';

          return (
            <div key={short.id} className="short-card mb-4" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
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
                    <img src={short.videoThumbnail} alt={short.title} className="short-thumb-img" />
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
                      className="btn-accent-sm w-full flex-center gap-1 font-bold"
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
    </div>
  );
}
