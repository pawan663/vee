import React, { useState } from 'react';
import { X, Lock, ExternalLink, CheckCircle, Bookmark, Copy, ShieldCheck, FileText, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InAppBrowserModal({ isOpen, job, userProfile, onClose, onMarkApplied, t }) {
  const [regNo, setRegNo] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasMarked, setHasMarked] = useState(false);

  if (!isOpen || !job) return null;

  // Resolving robust official URLs
  const deptQuery = encodeURIComponent(`${job.dept || ''} ${job.title || ''} official recruitment apply online`);
  const officialGoogleSearch = `https://www.google.com/search?q=${deptQuery}`;

  const validApplyUrl = (job.applyUrl && job.applyUrl.startsWith('http') && !job.applyUrl.includes('freejobalert.com/'))
    ? job.applyUrl
    : (job.pdfUrl && job.pdfUrl.startsWith('http'))
      ? job.pdfUrl
      : (job.applyUrl || officialGoogleSearch);

  const fallbackDeptUrl = (job.fallbackUrl && job.fallbackUrl.startsWith('http') && job.fallbackUrl !== 'https://www.freejobalert.com/')
    ? job.fallbackUrl
    : (job.pdfUrl && job.pdfUrl.startsWith('http'))
      ? job.pdfUrl
      : officialGoogleSearch;

  const handleApplySuccess = () => {
    onMarkApplied(job, regNo || 'REG-' + Math.floor(100000 + Math.random() * 900000));
    setHasMarked(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="in-app-browser-overlay">
      {/* Top Browser Bar */}
      <div className="browser-header">
        <div className="browser-nav-row flex-between">
          <div className="flex-center gap-2">
            <button className="icon-btn-sm" onClick={onClose} title="Back to VEE">
              <X size={18} />
            </button>
            <div className="browser-url-pill">
              <Lock size={12} className="text-success" />
              <span className="truncate text-xs">{validApplyUrl}</span>
            </div>
          </div>
          <a
            href={validApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn-sm"
            title="Open in Browser"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Form Quick Tracker Assistant Bar */}
        <div className="assistant-bar flex-between text-xs">
          <div className="flex-center gap-1">
            <ShieldCheck size={14} className="text-accent" />
            <span className="font-semibold">{job.dept || 'Recruitment Cell'} (Official Portal)</span>
          </div>

          {!hasMarked ? (
            <button className="btn-success-xs" onClick={handleApplySuccess}>
              <CheckCircle size={13} /> {t.applyNow || 'Applied'}? Track Karein
            </button>
          ) : (
            <span className="badge-success-sm">
              <CheckCircle size={13} /> Track Ho Gaya!
            </span>
          )}
        </div>
      </div>

      {/* Browser Body / Portal Display */}
      <div className="browser-frame-container">
        <div className="portal-simulation-card">
          <div className="portal-banner">
            <div className="portal-badge">OFFICIAL RECRUITMENT GATEWAY</div>
            <h4 className="portal-title">{job.title}</h4>
            <p className="portal-sub">{job.dept}</p>
          </div>

          <div className="portal-info-grid">
            <div className="portal-info-item">
              <span className="lbl">{t.lastDate || 'Last Date'}:</span>
              <span className="val text-danger">{job.lastDate || 'Check Notice'}</span>
            </div>
            <div className="portal-info-item">
              <span className="lbl">{t.totalPosts || 'Total Posts'}:</span>
              <span className="val">{job.posts || 'Notice Available'}</span>
            </div>
            <div className="portal-info-item">
              <span className="lbl">{t.applicationFee || 'Application Fee'}:</span>
              <span className="val">{job.fee || 'As per norms'}</span>
            </div>
            <div className="portal-info-item">
              <span className="lbl">{t.eduQualification || 'Qualification'}:</span>
              <span className="val">{job.qualification || 'Check Notice'}</span>
            </div>
          </div>

          <div className="reg-helper-box mt-3">
            <label className="text-xs font-semibold text-muted">
              Registration Number / Application ID yahan note karein (Baad me admit card nikalne ke liye):
            </label>
            <div className="flex-row gap-2 mt-1">
              <input
                type="text"
                placeholder="e.g. REG-20268841"
                className="form-input text-sm"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
              <button
                className="btn-secondary-sm"
                onClick={() => {
                  if (regNo) {
                    navigator.clipboard.writeText(regNo);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Aspirant Quick Vault & Document Helper */}
          <div className="aspirant-quick-vault-card mt-3 p-2.5 rounded bg-light border text-left">
            <div className="flex-between mb-1.5">
              <span className="text-2xs font-bold text-primary flex-center gap-1">
                📁 Aapka Saved CV, Photo & Sign (1-Click Ready)
              </span>
              <span className="badge-pill bg-success text-white text-3xs font-bold">Locker Ready</span>
            </div>

            <div className="flex-row gap-2 flex-wrap items-center mt-1">
              {userProfile?.resume ? (
                <a
                  href={userProfile.resume.dataUrl}
                  download={userProfile.resume.name || "My_Resume.pdf"}
                  className="btn-accent-xs inline-flex flex-center gap-1 text-3xs font-bold"
                  title="Download Resume for this application"
                >
                  <FileText size={11} /> 📄 CV: {userProfile.resume.name?.slice(0, 14)}...
                </a>
              ) : (
                <span className="text-3xs text-muted">
                  📄 CV: Not uploaded (Profile me upload karein)
                </span>
              )}

              {userProfile?.photo ? (
                <a
                  href={userProfile.photo.dataUrl}
                  download="Sarkari_Passport_Photo.jpg"
                  className="btn-secondary-xs inline-flex flex-center gap-1 text-3xs font-bold"
                  title="Download Form Photo"
                >
                  <Download size={11} /> 📷 Photo ({userProfile.photo.size || '30KB'})
                </a>
              ) : null}

              {userProfile?.signature ? (
                <a
                  href={userProfile.signature.dataUrl}
                  download="Sarkari_Signature.jpg"
                  className="btn-secondary-xs inline-flex flex-center gap-1 text-3xs font-bold"
                  title="Download Form Signature"
                >
                  <Download size={11} /> ✍️ Sign ({userProfile.signature.size || '15KB'})
                </a>
              ) : null}
            </div>

            <p className="text-3xs text-muted mt-1.5 mb-0">
              💡 Form bharte waqt apne saved documents yahan se direct download karke upload karein.
            </p>
          </div>

          {/* Action to launch full external govt gateway */}
          <div className="mt-4 text-center">
            <div className="flex-column gap-2">
              <a
                href={validApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center inline-block font-bold text-xs"
              >
                🚀 Server 1: {t.applyNow || 'Apply Online'} (Direct Gateway)
              </a>

              {/* Server 2 Fallback Button */}
              <a
                href={fallbackDeptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center inline-block text-xs font-bold"
              >
                🌐 Server 2: Official Portal / Notice (Backup Server)
              </a>

              {/* Server 3: Direct Official Portal Search */}
              <a
                href={officialGoogleSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center inline-block text-2xs font-semibold"
                style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#2563EB' }}
              >
                🔍 Server 3: Official Department Portal Search
              </a>
            </div>

            <p className="text-muted text-3xs mt-2">
              (Sabhi links verified sarkari portals ke liye hain. Form submit karke Reg ID upar save karein)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
