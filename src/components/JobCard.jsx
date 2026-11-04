import React from 'react';
import { Calendar, Users, Bookmark, FileText, Send, Flame, Building, PlayCircle, Clock } from 'lucide-react';
import { getJobVideo } from '../data/videoRegistry';
import { cleanJobTitle, formatSafeQualification } from '../utils/textUtils';

// Clean, compact qualification label so pills never get bloated or cut off
function formatQualificationShort(q, title = '', type = '') {
  const safe = formatSafeQualification(q, title, type);
  const clean = String(safe).trim();
  const lower = `${clean} ${title} ${type}`.toLowerCase();

  if (/\b(mbbs|bds|medical\s*officer|ayush)\b/i.test(lower)) return '🩺 MBBS / BDS';
  if (/\b(b\.?a\.?\s*ll\.?b|b\.?com\.?\s*ll\.?b|b\.?sc\.?\s*ll\.?b|ll\.?b|ll\.?m|law|advocate|judiciary)\b/i.test(lower)) return '⚖️ Law (LLB)';
  if (/\b(b\.?a\.?\s*b\.?ed|b\.?sc\.?\s*b\.?ed|b\.?ed|d\.?el\.?ed|b\.?tc|teacher|teaching)\b/i.test(lower)) return '📚 B.Ed / Teaching';
  if (/\b(iti|fitter|electrician|welder|turner|ncvt|scvt)\b/i.test(lower)) return '⚡ ITI Pass';
  if (/\b(diploma|polytechnic)\b/i.test(lower)) return '🛠️ Diploma';
  if (/\b10th\b|matric|high\s*school/i.test(lower)) return '🎓 10th Pass';
  if (/\b12th\b|intermediate|10\+2/i.test(lower)) return '🎓 12th Pass';
  if (/b\.?tech|engineering/i.test(lower)) return '💻 B.Tech / Engg';
  if (/post\s*graduate|mba|masters|m\.sc|m\.com|m\.tech/i.test(lower)) return '💼 Post Graduate';
  if (/graduate|graduation|any\s*degree/i.test(lower)) return '🎓 Any Graduate';
  if (clean.length > 20) {
    return clean.slice(0, 18) + '...';
  }
  return clean;
}

export default function JobCard({ job, onOpenDetail, onOpenApply, isSaved, onToggleSave, t, currentLang = 'hi' }) {
  const matchedVideo = getJobVideo(job);
  const hasVideo = Boolean(matchedVideo && matchedVideo.videoId);
  const displayTitle = cleanJobTitle(job.title);

  const isApprentice = job.category === 'Apprentice' || (job.dept && job.dept.toLowerCase().includes('apprentice')) || (job.title && job.title.toLowerCase().includes('apprentice'));
  const sectorBorderClass = isApprentice ? 'job-border-apprentice' : (job.category === 'Private' ? 'job-border-private' : 'job-border-govt');

  const isPdf = job.pdfUrl && job.pdfUrl.toLowerCase().includes('.pdf');

  return (
    <div className={`job-card ${sectorBorderClass} mb-3 cursor-pointer`} onClick={() => onOpenDetail(job)}>
      {/* Top Meta Bar */}
      <div className="job-card-header flex-between mb-2">
        <div className="flex-center gap-1.5 flex-wrap">
          <span className={`badge-pill ${isApprentice ? 'badge-apprentice' : (job.category === 'Govt' ? 'badge-govt' : 'badge-private')}`}>
            {isApprentice ? `🛠️ ${t.filterApprentice || 'Apprentice'}` : (job.category === 'Govt' ? `🏛️ ${t.filterGovt}` : `🏢 ${t.filterPrivate}`)}
          </span>

          {job.isPersonalizedMatch && (
            <span className="badge-pill badge-official-prime flex-center gap-1">
              👑 PRIME VERIFIED
            </span>
          )}

          {hasVideo && (
            <span className="badge-pill badge-video-guide flex-center gap-1">
              <PlayCircle size={11} /> Guide
            </span>
          )}

          {job.isComingSoon ? (
            <span className="badge-pill badge-coming-soon flex-center gap-1">
              ⏳ {t.comingSoon || 'Coming Soon'}
            </span>
          ) : (
            <span className="badge-pill badge-active-form flex-center gap-1">
              <span className="live-pulse-dot"></span> {t.activeForm || 'Apply Live'}
            </span>
          )}

          {job.isNew && <span className="badge-pill badge-new-pulse">🔥 {t.newBadge}</span>}
          {job.isClosingSoon && (
            <span className="badge-pill badge-closing-pulse flex-center gap-1">
              <Flame size={11} /> {t.closingSoon}
            </span>
          )}
        </div>

        <button
          className="icon-btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          title="Save Job"
        >
          <Bookmark size={18} fill={isSaved ? "#F59E0B" : "none"} className={isSaved ? "text-warning" : "text-muted"} />
        </button>
      </div>

      {/* Main Title & Department */}
      <h3 className="job-card-title font-bold text-sm mt-1 leading-snug text-slate-900">{displayTitle}</h3>
      <p className="job-card-dept text-2xs text-muted flex-center-start gap-1 mt-0.5">
        <Building size={12} /> {job.dept}
      </p>

      {/* Highlights Tag Box: Compact, Small, Colorful, Non-Clipping Pills */}
      <div className="job-card-pills-row">
        <span className="job-pill job-pill-posts text-3xs font-bold">
          <Users size={11} /> {job.posts || '1+ Posts'}
        </span>
        <span className="job-pill job-pill-qual text-3xs font-bold">
          {formatQualificationShort(job.qualification, job.title, job.type)}
        </span>
        <span className="job-pill job-pill-state text-3xs font-bold">
          📍 {job.state || 'All India'}
        </span>
        {job.source && (
          <span className="job-pill job-pill-source text-3xs font-semibold" title={job.source}>
            📡 {job.source}
          </span>
        )}
      </div>

      {/* Last Date & Action Buttons */}
      <div className="job-card-footer flex-between mt-2.5 pt-2 border-top">
        <div className="flex-center-start gap-1 text-2xs text-danger font-bold">
          <Clock size={12} />
          <span>{t.lastDate}: {job.lastDate}</span>
        </div>

        <div className="flex-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Quick PDF / Notice link */}
          <a
            href={job.pdfUrl || job.applyUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn-mini-secondary"
            title={job.isComingSoon ? "Notice / Article" : "Download PDF / Notice"}
            onClick={(e) => {
              if (!job.pdfUrl && !job.applyUrl) {
                e.preventDefault();
                onOpenDetail(job);
              }
            }}
          >
            <FileText size={12} /> {isPdf ? "PDF" : "Notice"}
          </a>

          {/* Quick Apply Button OR Coming Soon Notice */}
          {job.isComingSoon ? (
            <button
              className="action-btn-mini-warning flex-center gap-1"
              onClick={() => onOpenDetail(job)}
              title="Aavedan jald shuru hoga - Notice dekhein"
            >
              ⏳ {t.comingSoon || 'Coming Soon'}
            </button>
          ) : (
            <button
              className="action-btn-mini-primary flex-center gap-1"
              onClick={() => onOpenApply(job)}
            >
              <Send size={12} /> {t.applyNow}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
