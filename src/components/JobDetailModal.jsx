import React from 'react';
import { X, FileText, Send, Video, Share2, Bookmark, Calendar, Building, DollarSign, Users, Award, ExternalLink, Globe, Play, Printer } from 'lucide-react';
import { getJobVideo } from '../data/videoRegistry';
import { cleanJobTitle, formatSafeQualification } from '../utils/textUtils';

export default function JobDetailModal({ isOpen, job, onClose, onOpenApply, onOpenReader, isSaved, onToggleSave, t }) {
  if (!isOpen || !job) return null;

  const displayTitle = cleanJobTitle(job.title);
  const isDirectPdf = job.pdfUrl && job.pdfUrl.toLowerCase().includes('.pdf');

  const formatQualification = (q) => {
    const safeQ = formatSafeQualification(q, job.title, job.type);
    const clean = String(safeQ).trim();
    if (/^12th$/i.test(clean)) return '12th Pass (Intermediate / 10+2) in any stream from a recognized Board';
    if (/^10th$/i.test(clean)) return '10th Pass (Matriculation) from a recognized Board';
    if (/^iti$/i.test(clean)) return 'ITI Pass in relevant Trade (NCVT / SCVT recognized)';
    if (/^diploma$/i.test(clean)) return 'Polytechnic Diploma in relevant Engineering / Technical branch';
    if (/^graduate$/i.test(clean)) return 'Graduation / Bachelor\'s Degree in any discipline from a recognized University';
    if (/^b\.?tech$/i.test(clean)) return 'B.Tech / B.E Degree in relevant Engineering discipline';
    return clean;
  };

  // Valid official apply URL fallback logic
  const validApplyUrl = (job.applyUrl && job.applyUrl.startsWith('http'))
    ? job.applyUrl
    : (job.pdfUrl && job.pdfUrl.startsWith('http'))
      ? job.pdfUrl
      : `https://www.google.com/search?q=${encodeURIComponent((job.dept || '') + ' ' + displayTitle + ' official apply online')}`;

  const handleOpenPdfOrArticle = (e) => {
    e.preventDefault();
    const targetUrl = job.pdfUrl || job.applyUrl || validApplyUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
    if (onOpenReader) {
      onOpenReader({
        id: job.id,
        title: job.title,
        dept: job.dept,
        posts: job.posts,
        qualification: job.qualification,
        salary: job.salary,
        lastDate: job.lastDate,
        fee: job.fee,
        ageLimit: job.ageLimit,
        source: job.source || job.dept,
        url: targetUrl,
        applyUrl: validApplyUrl,
        isPdf: isDirectPdf,
        timeAgo: isDirectPdf ? (t.officialPdf || 'Official PDF Notification') : (t.newsAndNotice || 'Official Portal Notice')
      });
    }
  };

  const handleApplyClick = () => {
    // 1. Direct open official recruitment link in browser immediately
    window.open(validApplyUrl, '_blank', 'noopener,noreferrer');
    // 2. Open in-app tracker modal for application ID saving
    if (onOpenApply) {
      onOpenApply(job);
    }
  };

  const matchedVideo = getJobVideo(job);

  // Channel video link logic: verified video or direct Vacancy Era Education channel search
  const getYoutubeUrl = () => {
    if (matchedVideo?.videoUrl) return matchedVideo.videoUrl;
    if (matchedVideo?.videoId) return `https://youtu.be/${matchedVideo.videoId}`;
    const cleanTopic = displayTitle
      .replace(/2026|Recruitment|Bharti|Online Form|\d+[\s,]*Posts|\d+[\s,]*Vacanc(y|ies)/gi, '')
      .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join(' ');
    return `https://www.youtube.com/@vacancyeraeducation/search?query=${encodeURIComponent(cleanTopic || displayTitle)}`;
  };

  const handleShareWhatsApp = () => {
    const text = `*${displayTitle}*\n🏢 ${t.tabJobs || 'Dept'}: ${job.dept}\n👥 ${t.totalPosts || 'Posts'}: ${job.posts}\n🎓 ${t.qualification || 'Qualification'}: ${job.qualification}\n⏳ ${t.lastDate || 'Last Date'}: ${job.lastDate}\n\n📲 Official PDF & Apply Online ke liye download karein *VEE App*!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bottom-sheet full-height-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-grabber"></div>
          <div className="flex-between">
            <div className="flex-center gap-1.5">
              <span className={`badge-pill ${job.category === 'Govt' ? 'badge-govt' : 'badge-private'}`}>
                {job.category === 'Govt' ? (t.govtJobBadge || '🏛️ Sarkari Job') : (t.privateJobBadge || '🏢 Private MNC')}
              </span>
              {job.isComingSoon ? (
                <span className="badge-coming-soon flex-center gap-0.5">
                  ⏳ {t.comingSoon || 'Coming Soon'}
                </span>
              ) : (
                <span className="badge-active-form flex-center gap-0.5">
                  🟢 {t.activeForm || 'Apply Live'}
                </span>
              )}
            </div>
            <div className="flex-center gap-2">
              <button
                className={`icon-btn ${isSaved ? 'text-warning' : ''}`}
                onClick={() => onToggleSave(job.id)}
                title="Save Job"
              >
                <Bookmark size={20} fill={isSaved ? "#F59E0B" : "none"} />
              </button>
              <button className="icon-btn" onClick={onClose} title="Close">
                <X size={20} />
              </button>
            </div>
          </div>
          <h2 className="sheet-title mt-2 text-lg font-bold">{displayTitle}</h2>
          <p className="text-xs text-muted flex-center-start gap-1 mt-1">
            <Building size={13} /> {job.dept}
          </p>
        </div>

        {/* Body */}
        <div className="sheet-body scrollable-body">
          {/* If Coming Soon / News Announcement, show clear alert banner */}
          {job.isComingSoon && (
            <div className="coming-soon-banner p-2.5 mb-3 rounded flex-center-start gap-2">
              <span className="text-lg">⏳</span>
              <div className="text-2xs leading-snug">
                <span className="font-bold text-warning">{t.comingSoonBannerTitle || 'Upcoming Vacancy / News Alert'}:</span>{' '}
                {t.comingSoonBannerDesc || 'Is vacancy ka official aavedan jald shuru hoga. Official update aur report padhne ke liye neeche Notice/Article par click karein.'}
              </div>
            </div>
          )}

          {/* Quick Highlight Cards (Colorful & Vibrant) */}
          <div className="stats-2x2-grid mb-3">
            <div className="mini-stat-card stat-card-posts">
              <span className="mini-lbl"><Users size={12} /> {t.totalPosts || 'Total Posts'}</span>
              <span className="mini-val">{job.posts || 'Check Notice'}</span>
            </div>
            <div className="mini-stat-card stat-card-date">
              <span className="mini-lbl"><Calendar size={12} /> {t.lastDate || 'Last Date'}</span>
              <span className="mini-val font-bold">{job.lastDate || 'Soon'}</span>
            </div>
            <div className="mini-stat-card stat-card-salary">
              <span className="mini-lbl"><DollarSign size={12} /> {t.salaryPay || 'Salary / Pay'}</span>
              <span className="mini-val">{job.salary || "As per Rules"}</span>
            </div>
            <div className="mini-stat-card stat-card-age">
              <span className="mini-lbl"><Award size={12} /> {t.ageLimit || 'Age Limit'}</span>
              <span className="mini-val">{job.ageLimit || '18 - 35 Years'}</span>
            </div>
          </div>

          {/* Section: Eligibility / Qualification */}
          <div className="detail-section mb-3">
            <div className="flex-between mb-1.5">
              <h4 className="detail-heading flex-center gap-1.5" style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                <span>🎓</span> {t.eduQualification || 'Educational Qualification'}
              </h4>
              <span className="badge-live-sm text-3xs font-bold px-2 py-0.5 rounded" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                {job.type ? `${job.type} Pass` : 'Eligibility'}
              </span>
            </div>
            <div className="detail-box detail-box-qual p-3 rounded-lg" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
              <p className="text-xs font-semibold m-0 leading-relaxed" style={{ color: '#5B21B6' }}>
                {formatQualification(job.qualification)}
              </p>
            </div>
          </div>

          {/* Section: Selection Process */}
          <div className="detail-section mb-3">
            <h4 className="detail-heading">📋 {t.selectionProcess || 'Selection Process'}</h4>
            <div className="detail-box detail-box-process">
              <p className="text-sm">{job.selectionProcess || "Written Exam / CBT + Document Verification"}</p>
            </div>
          </div>

          {/* Section: Application Fee */}
          <div className="detail-section mb-3">
            <h4 className="detail-heading">💳 {t.applicationFee || 'Application Fee'}</h4>
            <div className="detail-box detail-box-fee">
              <p className="text-sm">{job.fee || "General/OBC: ₹100, SC/ST: ₹0"}</p>
            </div>
          </div>

          {/* Section: Official Links Card (Adapts to Govt or Private) */}
          <div className="detail-section official-links-card mb-3 p-3 rounded-lg" style={{ background: 'var(--surface-color, #F8FAFC)', border: '1px solid var(--border-color, #E2E8F0)' }}>
            <div className="flex-between mb-2">
              <h4 className="detail-heading flex-center gap-1.5 text-primary" style={{ margin: 0 }}>
                <FileText size={16} /> {job.category === 'Private' ? '🏢 Verified Job Application Links' : (t.importantLinksHeading || 'Official Notification & Apply Links')}
              </h4>
              <span className="badge-live-sm bg-success text-white text-3xs font-bold px-1.5 py-0.5 rounded">
                {job.category === 'Private' ? 'VERIFIED OPENING' : '100% VERIFIED'}
              </span>
            </div>

            <div className="flex-column gap-2">
              {/* 1. Official PDF or Job Description */}
              <a
                href={job.pdfUrl || validApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="official-link-row flex-between p-2.5 rounded"
                style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color, #CBD5E1)', textDecoration: 'none' }}
              >
                <div className="flex-center gap-2">
                  <span className="text-base">{job.category === 'Private' ? '📋' : '📄'}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                      {job.category === 'Private' ? 'Job Description & Role Requirements' : (isDirectPdf ? (t.officialPdf || 'Official PDF Notification') : (t.newsAndNotice || 'Official Recruitment Notice'))}
                    </p>
                    <p className="text-3xs text-muted" style={{ margin: 0 }}>
                      {job.category === 'Private' ? `${job.source || 'Portal'} Official Listing` : 'Direct Government / Portal Notice File'}
                    </p>
                  </div>
                </div>
                <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#EF4444', color: '#FFFFFF' }}>
                  {job.category === 'Private' ? 'View Details' : (isDirectPdf ? 'Open PDF' : 'Notice')} <ExternalLink size={10} />
                </span>
              </a>

              {/* Clean Official PDF / Print Generator */}
              <button
                type="button"
                className="official-link-row flex-between p-2.5 rounded w-full cursor-pointer text-left"
                style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color, #CBD5E1)' }}
                onClick={() => {
                  if (onOpenReader) {
                    onOpenReader({
                      id: job.id,
                      title: job.title,
                      dept: job.dept,
                      posts: job.posts,
                      qualification: job.qualification,
                      salary: job.salary,
                      lastDate: job.lastDate,
                      fee: job.fee,
                      ageLimit: job.ageLimit,
                      source: job.source || job.dept,
                      url: job.pdfUrl || validApplyUrl,
                      applyUrl: validApplyUrl,
                      isPdf: isDirectPdf,
                      timeAgo: isDirectPdf ? 'Official PDF Notification' : 'Official Portal Notice'
                    });
                  }
                }}
              >
                <div className="flex-center gap-2">
                  <span className="text-base">🖨️</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                      Clean Official Notice & PDF Generator
                    </p>
                    <p className="text-3xs text-muted" style={{ margin: 0 }}>
                      Bina advertisement ke poori soochna dekhein aur 1-tap Clean PDF save karein
                    </p>
                  </div>
                </div>
                <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#059669', color: '#FFFFFF' }}>
                  Generate PDF <Printer size={10} />
                </span>
              </button>

              {/* 2. Official Apply Portal */}
              <a
                href={validApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="official-link-row flex-between p-2.5 rounded"
                style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color, #CBD5E1)', textDecoration: 'none' }}
              >
                <div className="flex-center gap-2">
                  <span className="text-base">🌐</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                      {job.category === 'Private' ? `Apply on ${job.source || 'Company Portal'}` : (t.applyNow || 'Official Apply Online Portal')}
                    </p>
                    <p className="text-3xs text-muted" style={{ margin: 0 }}>{job.dept || 'Direct Online Application'}</p>
                  </div>
                </div>
                <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#2563EB', color: '#FFFFFF' }}>
                  Apply Now <ExternalLink size={10} />
                </span>
              </a>

              {/* 3. Official Department / Company Website */}
              <a
                href={job.website || job.fallbackUrl || `https://www.google.com/search?q=${encodeURIComponent((job.dept || '') + ' official portal website')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="official-link-row flex-between p-2.5 rounded"
                style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color, #CBD5E1)', textDecoration: 'none' }}
              >
                <div className="flex-center gap-2">
                  <span className="text-base">{job.category === 'Private' ? '🏢' : '🏛️'}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                      {job.category === 'Private' ? `${job.source || 'Company'} Career Website` : 'Department Official Website'}
                    </p>
                    <p className="text-3xs text-muted" style={{ margin: 0 }}>
                      {job.category === 'Private' ? 'Explore more jobs & company profile' : `${job.dept} Recruitment / Career Section`}
                    </p>
                  </div>
                </div>
                <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#475569', color: '#FFFFFF' }}>
                  Visit Site <ExternalLink size={10} />
                </span>
              </a>
            </div>

            {/* If Private job, suggest the other top private portals */}
            {job.category === 'Private' && (
              <div className="mt-3 pt-2.5 border-top">
                <p className="text-3xs font-bold text-muted mb-1.5">🚀 Aur Private / Remote Jobs chahiye? In portals par apply karein:</p>
                <div className="flex-row gap-1.5 flex-wrap">
                  <a href="https://weworkremotely.com/" target="_blank" rel="noopener noreferrer" className="badge-live-sm bg-white text-slate-800 border text-3xs p-1 rounded inline-flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                    🌐 WeWorkRemotely <ExternalLink size={8} />
                  </a>
                  <a href="https://wellfound.com/" target="_blank" rel="noopener noreferrer" className="badge-live-sm bg-white text-slate-800 border text-3xs p-1 rounded inline-flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                    🚀 Wellfound <ExternalLink size={8} />
                  </a>
                  <a href="https://remoteok.com/" target="_blank" rel="noopener noreferrer" className="badge-live-sm bg-white text-slate-800 border text-3xs p-1 rounded inline-flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                    💻 RemoteOK <ExternalLink size={8} />
                  </a>
                  <a href="https://www.naukri.com/plaza-jobs" target="_blank" rel="noopener noreferrer" className="badge-live-sm bg-white text-slate-800 border text-3xs p-1 rounded inline-flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                    🏢 Naukri Plaza <ExternalLink size={8} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* In-App YouTube Video Guide Section (Vacancy Era Education Official) */}
          <div className="detail-section video-section-card mb-4">
            <div className="flex-between mb-2">
              <h4 className="detail-heading flex-center gap-1 text-danger" style={{ margin: 0 }}>
                <Video size={18} /> {t.videoGuideHeading || 'Video Guide (Vacancy Era Education)'}
              </h4>
              <span
                className="badge-live-sm"
                style={{
                  background: matchedVideo?.videoId ? '#DC2626' : undefined,
                  color: matchedVideo?.videoId ? '#FFFFFF' : undefined,
                  fontWeight: 'bold'
                }}
              >
                {matchedVideo?.videoId ? '🎬 OFFICIAL VIDEO' : 'GUIDE'}
              </span>
            </div>

            {matchedVideo && matchedVideo.videoId ? (
              <div
                className="video-embed-container p-2.5 rounded-lg"
                style={{
                  background: '#0F172A',
                  border: '1px solid #1E293B',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                    height: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000'
                  }}
                >
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    src={`https://www.youtube-nocookie.com/embed/${matchedVideo.videoId}?rel=0&modestbranding=1`}
                    title={matchedVideo.title || "Vacancy Era Video Guide"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="mt-2.5 pt-1">
                  <p className="text-xs font-bold leading-snug mb-1.5" style={{ color: '#F8FAFC' }}>
                    {matchedVideo.title}
                  </p>
                  <div className="flex-between flex-wrap gap-2">
                    <span className="text-3xs text-slate-300 font-semibold flex-center gap-1">
                      📺 Channel: <span className="text-danger font-bold">@vacancyeraeducation</span>
                    </span>
                    <a
                      href={matchedVideo.videoUrl || `https://youtu.be/${matchedVideo.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-1 px-3 py-1.5 rounded"
                      style={{ background: '#DC2626', color: '#FFFFFF', textDecoration: 'none' }}
                    >
                      ▶️ Watch on YouTube <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="video-channel-guide-card p-3 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                  border: '1px solid #312E81',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                }}
              >
                <div className="flex-center-start gap-2.5 mb-2">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontSize: '18px',
                      flexShrink: 0
                    }}
                  >
                    ▶
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white m-0">Vacancy Era Education Official Guide</h5>
                    <p className="text-3xs text-slate-300 m-0">चैनल पर भर्ती का विश्लेषण, सिलेबस व फॉर्म भरने का तरीका देखें</p>
                  </div>
                </div>

                <p className="text-2xs text-slate-300 leading-relaxed mb-3">
                  इस भर्ती ({displayTitle.slice(0, 50)}...) का संपूर्ण ऑफिशियल वीडियो गाइड और नोटिफिकेशन अपडेट सीधे यूट्यूब चैनल पर उपलब्ध है।
                </p>

                <div className="flex-center gap-2 flex-wrap">
                  <a
                    href={getYoutubeUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-danger-sm font-bold text-2xs inline-flex flex-center gap-1.5 px-3 py-1.5 rounded flex-1"
                    style={{ background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    🔍 यूट्यूब पर सर्च करें <ExternalLink size={11} />
                  </a>
                  <a
                    href="https://www.youtube.com/@vacancyeraeducation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary font-bold text-2xs inline-flex flex-center gap-1.5 px-3 py-1.5 rounded"
                    style={{ background: '#334155', color: '#FFFFFF', textDecoration: 'none', border: '1px solid #475569' }}
                  >
                    📺 चैनल देखें
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Official Google Disclaimer Note */}
          <div className="disclaimer-mini mb-3 text-2xs text-muted bg-light p-2 rounded">
            ℹ️ {t.disclaimer}
          </div>
        </div>

        {/* Fixed Sticky Action Bar at Bottom */}
        <div className="sticky-action-bar flex-between gap-2">
          {/* Official PDF or News Article */}
          <button
            type="button"
            className="btn-secondary flex-1 flex-center gap-1 text-xs"
            onClick={handleOpenPdfOrArticle}
          >
            <FileText size={15} /> {isDirectPdf ? (t.officialPdf || 'Official PDF') : (job.isComingSoon ? (t.readNewsReport || '📰 News & Report') : (t.newsAndNotice || 'Notice / Details'))}
          </button>

          {/* Action button: Direct Apply Online if active, or Read Full Notice if coming soon */}
          {job.isComingSoon ? (
            <button
              className="btn-warning flex-1 flex-center gap-1 text-xs font-bold"
              onClick={handleOpenPdfOrArticle}
              title="Aavedan jald shuru hoga - Poori khabar / notification padhein"
            >
              <FileText size={15} /> {t.readFullNotice || 'पूरी सूचना पढ़ें'}
            </button>
          ) : (
            <button
              className="btn-primary flex-1 flex-center gap-1 text-xs font-bold"
              onClick={handleApplyClick}
            >
              <Send size={15} /> {t.applyNow || 'Apply Online'}
            </button>
          )}

          {/* Share to WhatsApp */}
          <button
            className="btn-whatsapp icon-only-btn"
            onClick={handleShareWhatsApp}
            title={t.shareOnWhatsApp || 'Share on WhatsApp'}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
