import React from 'react';
import { Calendar, Users, Bookmark, FileText, Send, Flame, ChevronRight, Building, PlayCircle, Clock } from 'lucide-react';
import { getJobVideo } from '../data/videoRegistry';
import { formatQualification } from '../utils/dateExpiry';

// Helper to determine Department visual identity (Icon, Gradient, Border)
function getDepartmentVisual(job) {
  const text = `${job.title || ''} ${job.dept || ''} ${job.category || ''}`.toLowerCase();

  if (text.includes('railway') || text.includes('rrb') || text.includes('rrc') || text.includes('irctc') || text.includes('metro')) {
    return { icon: '🚆', bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '#93C5FD', color: '#1D4ED8', name: 'Railway' };
  }
  if (text.includes('bank') || text.includes('sbi') || text.includes('ibps') || text.includes('pnb') || text.includes('rbi') || text.includes('canara')) {
    return { icon: '🏦', bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '#6EE7B7', color: '#047857', name: 'Banking' };
  }
  if (text.includes('police') || text.includes('si ') || text.includes('constable') || text.includes('daroga') || text.includes('sub inspector')) {
    return { icon: '👮', bg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', border: '#A5B4FC', color: '#4338CA', name: 'Police' };
  }
  if (text.includes('army') || text.includes('defence') || text.includes('navy') || text.includes('air force') || text.includes('agniveer') || text.includes('nda') || text.includes('cds')) {
    return { icon: '🪖', bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', border: '#86EFAC', color: '#15803D', name: 'Defence' };
  }
  if (text.includes('apprentice') || (job.category && job.category.toLowerCase().includes('apprentice'))) {
    return { icon: '🛠️', bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '#FCD34D', color: '#B45309', name: 'Apprentice' };
  }
  if (text.includes('ssc') || text.includes('upsc') || text.includes('psc') || text.includes('rpsc') || text.includes('uppsc') || text.includes('bpsc') || text.includes('hssc') || text.includes('court') || text.includes('patwari')) {
    return { icon: '📝', bg: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)', border: '#D8B4FE', color: '#7E22CE', name: 'Commission' };
  }
  if (text.includes('aiims') || text.includes('hospital') || text.includes('health') || text.includes('medical') || text.includes('nurse') || text.includes('doctor') || text.includes('pharmacist')) {
    return { icon: '🏥', bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)', border: '#FDA4AF', color: '#BE123C', name: 'Medical' };
  }
  if (text.includes('teacher') || text.includes('teaching') || text.includes('school') || text.includes('tgt') || text.includes('pgt') || text.includes('prt') || text.includes('professor') || text.includes('lecturer')) {
    return { icon: '👨‍🏫', bg: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', border: '#7DD3FC', color: '#0369A1', name: 'Teaching' };
  }
  if (job.category === 'Private' || text.includes('private') || text.includes('tata') || text.includes('maruti') || text.includes('l&t') || text.includes('infosys') || text.includes('tcs') || text.includes('wipro')) {
    return { icon: '🏢', bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', border: '#C4B5FD', color: '#6D28D9', name: 'Private MNC' };
  }
  if (text.includes('bhel') || text.includes('ntpc') || text.includes('ongc') || text.includes('sail') || text.includes('iocl') || text.includes('power grid') || text.includes('engineering') || text.includes('bijli')) {
    return { icon: '⚙️', bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '#FED7AA', color: '#C2410C', name: 'PSU / Engg' };
  }
  return { icon: '🏛️', bg: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', border: '#CBD5E1', color: '#334155', name: 'Govt Dept' };
}

export default function JobCard({ job, onOpenDetail, onOpenApply, isSaved, onToggleSave, t, currentLang = 'hi' }) {
  const matchedVideo = getJobVideo(job);
  const hasVideo = Boolean(matchedVideo && matchedVideo.videoId);
  const deptVisual = getDepartmentVisual(job);

  const isApprentice = job.category === 'Apprentice' || (job.dept && job.dept.toLowerCase().includes('apprentice')) || (job.title && job.title.toLowerCase().includes('apprentice'));
  const sectorClass = isApprentice ? 'job-border-apprentice' : (job.category === 'Private' ? 'job-border-private' : 'job-border-govt');

  const isPdf = job.pdfUrl && job.pdfUrl.toLowerCase().includes('.pdf');

  return (
    <div
      className={`job-card-box ${sectorClass} mb-3.5 cursor-pointer`}
      onClick={() => onOpenDetail(job)}
    >
      {/* Top Header Row with Avatar, Badges & Save */}
      <div className="job-card-top flex-between items-start gap-2.5">
        <div className="flex-start items-start gap-3 flex-1 min-w-0">
          {/* Department 3D Avatar Badge */}
          <div
            className="dept-avatar-badge flex-center justify-center shrink-0"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: deptVisual.bg,
              border: `1.5px solid ${deptVisual.border}`,
              color: deptVisual.color,
              fontSize: '20px',
              boxShadow: '0 3px 8px rgba(0,0,0,0.06)'
            }}
            title={deptVisual.name}
          >
            <span>{deptVisual.icon}</span>
          </div>

          {/* Title & Department Info */}
          <div className="flex-1 min-w-0">
            {/* Badges Strip */}
            <div className="flex-center gap-1.5 flex-wrap mb-1">
              <span className={`badge-sector ${isApprentice ? 'badge-sec-apprentice' : (job.category === 'Govt' ? 'badge-sec-govt' : 'badge-sec-private')}`}>
                {isApprentice ? `🛠️ ${t.filterApprentice || 'Apprentice'}` : (job.category === 'Govt' ? `🏛️ ${t.filterGovt}` : `🏢 ${t.filterPrivate}`)}
              </span>

              {hasVideo && (
                <span className="badge-video-guide flex-center gap-0.5">
                  <PlayCircle size={10} /> Video Guide
                </span>
              )}

              {job.isComingSoon ? (
                <span className="badge-upcoming-form flex-center gap-0.5">
                  ⏳ {t.comingSoon || 'Coming Soon'}
                </span>
              ) : (
                <span className="badge-active-live flex-center gap-1">
                  <span className="live-dot-pulse-sm"></span> {t.activeForm || 'Apply Live'}
                </span>
              )}

              {job.isNew && (
                <span className="badge-new-vibrant">
                  ✨ {t.newBadge || 'NEW'}
                </span>
              )}

              {job.isClosingSoon && (
                <span className="badge-closing-vibrant flex-center gap-0.5">
                  <Flame size={11} /> {t.closingSoon || 'Closing Soon'}
                </span>
              )}
            </div>

            {/* Main Job Title */}
            <h3 className="job-card-heading font-extrabold text-sm leading-snug m-0 text-slate-900">
              {job.title}
            </h3>

            {/* Department Name */}
            <p className="job-card-subdept text-2xs text-muted flex-center-start gap-1 mt-0.5 m-0 font-medium">
              <Building size={12} className="shrink-0 text-slate-400" />
              <span className="truncate">{job.dept}</span>
            </p>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          className="job-save-btn shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          title="Save Job"
        >
          <Bookmark
            size={18}
            fill={isSaved ? "#F59E0B" : "none"}
            className={isSaved ? "text-warning" : "text-slate-400"}
          />
        </button>
      </div>

      {/* Vibrant Colored Meta Chips Row */}
      <div className="job-card-chips-row flex-row gap-1.5 mt-2.5 flex-wrap">
        {/* Posts Chip */}
        <span className="job-chip job-chip-posts">
          <Users size={11} />
          <span>{job.posts || '1+ Posts'}</span>
        </span>

        {/* Qualification Chip */}
        <span className="job-chip job-chip-qual">
          <span>🎓</span>
          <span>{formatQualification(job.qualification)}</span>
        </span>

        {/* State Chip */}
        <span className="job-chip job-chip-state">
          <span>📍</span>
          <span>{job.state || 'All India'}</span>
        </span>

        {/* Source Chip */}
        {job.source && (
          <span className="job-chip job-chip-source" title={job.source}>
            <span>📡</span>
            <span className="truncate max-w-24">{job.source}</span>
          </span>
        )}
      </div>

      {/* Footer: Last Date & Primary Actions */}
      <div className="job-card-bottom flex-between items-center mt-3 pt-2.5 border-top">
        {/* Last Date Deadline */}
        <div className="job-deadline-tag flex-center-start gap-1 text-2xs font-bold text-red-600">
          <Clock size={12} className="text-red-500 shrink-0" />
          <span>{t.lastDate}: {job.lastDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Quick PDF / Notice */}
          <a
            href={job.pdfUrl || job.applyUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-notice flex-center gap-1 cursor-pointer"
            title={job.isComingSoon ? "Notice / Article" : "Official PDF / Notice"}
            onClick={(e) => {
              if (!job.pdfUrl && !job.applyUrl) {
                e.preventDefault();
                onOpenDetail(job);
              }
            }}
          >
            <FileText size={12} />
            <span>{isPdf ? "PDF" : "Notice"}</span>
          </a>

          {/* Quick Apply Button */}
          {job.isComingSoon ? (
            <button
              className="btn-card-coming-soon flex-center gap-1 cursor-pointer"
              onClick={() => onOpenDetail(job)}
              title="Aavedan jald shuru hoga - Notice dekhein"
            >
              <span>⏳</span>
              <span>{t.comingSoon || 'Coming Soon'}</span>
            </button>
          ) : (
            <button
              className="btn-card-apply flex-center gap-1.5 cursor-pointer"
              onClick={() => onOpenApply(job)}
            >
              <Send size={12} />
              <span>{t.applyNow}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
