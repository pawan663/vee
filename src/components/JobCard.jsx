import React from 'react';
import { Calendar, Users, Bookmark, FileText, Send, Flame, ChevronRight, Building, PlayCircle } from 'lucide-react';
import { getJobVideo } from '../data/videoRegistry';
import { formatQualification } from '../utils/dateExpiry';

export default function JobCard({ job, onOpenDetail, onOpenApply, isSaved, onToggleSave, t }) {
  const matchedVideo = getJobVideo(job);
  const hasVideo = Boolean(matchedVideo && matchedVideo.videoId);

  return (
    <div className="job-card mb-3 cursor-pointer" onClick={() => onOpenDetail(job)}>
      {/* Top Meta Bar */}
      <div className="job-card-header flex-between">
        <div className="flex-center gap-1.5 flex-wrap">
          <span className={`badge-pill ${job.category === 'Govt' ? 'badge-govt' : 'badge-private'}`}>
            {job.category === 'Govt' ? `🏛️ ${t.filterGovt}` : `🏢 ${t.filterPrivate}`}
          </span>
          {hasVideo && (
            <span
              className="badge-video-guide flex-center gap-0.5 text-3xs font-bold"
              style={{
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              <PlayCircle size={10} /> Video Guide
            </span>
          )}
          {job.isComingSoon ? (
            <span className="badge-coming-soon flex-center gap-0.5">
              ⏳ {t.comingSoon || 'Coming Soon'}
            </span>
          ) : (
            <span className="badge-active-form flex-center gap-0.5">
              🟢 {t.activeForm || 'Apply Live'}
            </span>
          )}
          {job.isNew && <span className="badge-new-pulse">{t.newBadge}</span>}
          {job.isClosingSoon && (
            <span className="badge-closing-pulse flex-center gap-0.5">
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
      <h3 className="job-card-title font-bold text-sm mt-1.5 leading-snug">{job.title}</h3>
      <p className="job-card-dept text-2xs text-muted flex-center-start gap-1 mt-0.5">
        <Building size={12} /> {job.dept}
      </p>

      {/* Highlights Tag Box */}
      <div className="job-card-meta-row flex-row gap-2 mt-2 flex-wrap">
        <span className="meta-pill text-3xs">
          <Users size={11} /> {job.posts}
        </span>
        <span className="meta-pill text-3xs font-semibold">
          🎓 {formatQualification(job.qualification)}
        </span>
        {job.source && (
          <span className="badge-source-card text-3xs font-semibold" title={job.source}>
            📡 {job.source}
          </span>
        )}
      </div>

      {/* Last Date & Salary */}
      <div className="job-card-footer flex-between mt-3 pt-2 border-top">
        <div className="flex-center-start gap-1 text-2xs text-danger font-semibold">
          <Calendar size={12} />
          <span>{t.lastDate}: {job.lastDate}</span>
        </div>

        <div className="flex-center gap-2" onClick={(e) => e.stopPropagation()}>
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
            <FileText size={13} /> {job.pdfUrl && job.pdfUrl.toLowerCase().includes('.pdf') ? "PDF" : "Notice"}
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
