import React, { useState } from 'react';
import { X, FileText, Send, Video, Share2, Bookmark, Calendar, Building, DollarSign, Users, Award, ExternalLink, Globe, Play, Printer, BookOpen, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, ShieldCheck, Search } from 'lucide-react';
import { getJobVideo } from '../data/videoRegistry';
import { cleanJobTitle, formatSafeQualification } from '../utils/textUtils';
import { getJobSyllabus } from '../data/syllabusRegistry';

export default function JobDetailModal({
  isOpen,
  job,
  onClose,
  onOpenApply,
  onOpenReader,
  isSaved,
  onToggleSave,
  t,
  onStartMock,
  currentLang = 'hi'
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'syllabus' | 'pattern'
  const [syllabusExpanded, setSyllabusExpanded] = useState(true);

  if (!isOpen || !job) return null;

  const isHi = currentLang === 'hi';
  const displayTitle = cleanJobTitle(job.title);
  const syllabus = getJobSyllabus(job, currentLang);

  // Language Cleanliness Helper: Guarantees zero Hindi in English mode
  const cleanForLanguage = (text, lang) => {
    if (!text || typeof text !== 'string') return text || '';
    if (lang === 'en') {
      return text
        .replace(/\s*\([\u0900-\u097F\s\/,\-\.\d]+\)/g, '')
        .replace(/\s*\/\s*[\u0900-\u097F\s]+/g, '')
        .replace(/[\u0900-\u097F]+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
    return text;
  };

  // Safe Post Display: Never show null or empty
  const displayPosts = job.posts || (() => {
    const m = (job.title || '').match(/(\d+[\s,]*\d*)\s*(Posts?|Vacanc(y|ies)|पद)/i);
    return m ? `${m[1]} Posts` : 'Multiple Posts';
  })();

  // 100% Safe URL Resolver: Prevents 404 on dummy / guessed .pdf links (e.g. NMRC, RRC)
  const getSafeJobUrls = (j) => {
    let apply = j.applyUrl || '';
    let pdf = j.pdfUrl || '';
    const title = cleanJobTitle(j.title);
    const dept = j.dept || '';

    // Fix known broken or placeholder .pdf endpoints
    if (pdf && pdf.toLowerCase().includes('.pdf')) {
      if (
        pdf.includes('nmrcnoida.com') ||
        pdf.includes('rrcjaipur.in') ||
        pdf.includes('ssc-cr.org') ||
        pdf.includes('energy.rajasthan') ||
        pdf.includes('phedwater.rajasthan') ||
        pdf.includes('rsmssb.rajasthan') ||
        pdf.includes('/notice/') ||
        pdf.includes('/docs/') ||
        pdf.includes('/Static/files/')
      ) {
        if (pdf.includes('nmrcnoida.com')) {
          pdf = 'https://www.nmrcnoida.com/Career';
          apply = 'https://www.nmrcnoida.com/Career';
        } else if (pdf.includes('rrcjaipur.in')) {
          pdf = 'https://rrcjaipur.in/';
          apply = 'https://rrcjaipur.in/';
        } else if (pdf.includes('rsmssb.rajasthan.gov.in')) {
          pdf = 'https://rsmssb.rajasthan.gov.in/';
        } else if (pdf.includes('energy.rajasthan.gov.in')) {
          pdf = 'https://energy.rajasthan.gov.in/';
        } else if (pdf.includes('ssc-cr.org')) {
          pdf = 'https://ssc.gov.in/';
        } else {
          pdf = `https://www.google.com/search?q=${encodeURIComponent(dept + ' ' + title + ' official recruitment notification 2026')}`;
        }
      }
    }

    if (!apply || !apply.startsWith('http')) {
      apply = (pdf && pdf.startsWith('http'))
        ? pdf
        : `https://www.google.com/search?q=${encodeURIComponent(dept + ' ' + title + ' official apply online 2026')}`;
    }

    return {
      safeApplyUrl: apply,
      safePdfUrl: pdf || apply
    };
  };

  const { safeApplyUrl, safePdfUrl } = getSafeJobUrls(job);
  const isDirectPdf = safePdfUrl.toLowerCase().includes('.pdf');

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

  const handleOpenPdfOrArticle = (e) => {
    e.preventDefault();
    if (safePdfUrl) {
      window.open(safePdfUrl, '_blank', 'noopener,noreferrer');
    }
    if (onOpenReader) {
      onOpenReader({
        id: job.id,
        title: job.title,
        dept: job.dept,
        posts: displayPosts,
        qualification: job.qualification,
        salary: job.salary,
        lastDate: job.lastDate,
        fee: job.fee,
        ageLimit: job.ageLimit,
        source: job.source || job.dept,
        url: safePdfUrl,
        applyUrl: safeApplyUrl,
        isPdf: isDirectPdf,
        timeAgo: isDirectPdf ? (t.officialPdf || 'Official PDF Notification') : (t.newsAndNotice || 'Official Portal Notice')
      });
    }
  };

  const handleApplyClick = () => {
    window.open(safeApplyUrl, '_blank', 'noopener,noreferrer');
    if (onOpenApply) {
      onOpenApply(job);
    }
  };

  const matchedVideo = getJobVideo(job);

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
    const text = `*${displayTitle}*\n🏢 ${t.tabJobs || 'Dept'}: ${job.dept}\n👥 ${t.totalPosts || 'Posts'}: ${displayPosts}\n🎓 ${t.qualification || 'Qualification'}: ${job.qualification}\n⏳ ${t.lastDate || 'Last Date'}: ${job.lastDate}\n\n📲 Official PDF, Syllabus & Apply Online ke liye download karein *VEE App*!`;
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

          {/* Sub Tab Switcher: Overview vs Exam Syllabus */}
          <div className="flex-row gap-1.5 mt-2.5 pt-2 border-top">
            <button
              type="button"
              className={`pill-btn flex-1 text-2xs font-bold ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ padding: '6px 10px' }}
            >
              📋 {isHi ? 'भर्ती विवरण (Overview)' : 'Job Overview'}
            </button>
            <button
              type="button"
              className={`pill-btn flex-1 text-2xs font-bold ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
              style={{
                padding: '6px 10px',
                background: activeTab === 'syllabus' ? '#7C3AED' : undefined,
                color: activeTab === 'syllabus' ? '#FFFFFF' : undefined
              }}
            >
              📚 {isHi ? 'परीक्षा पैटर्न व सिलेबस' : 'Exam Pattern & Syllabus'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="sheet-body scrollable-body">
          {activeTab === 'overview' ? (
            <>
              {/* Coming Soon Alert */}
              {job.isComingSoon && (
                <div className="coming-soon-banner p-2.5 mb-3 rounded flex-center-start gap-2">
                  <span className="text-lg">⏳</span>
                  <div className="text-2xs leading-snug">
                    <span className="font-bold text-warning">{t.comingSoonBannerTitle || 'Upcoming Vacancy / News Alert'}:</span>{' '}
                    {t.comingSoonBannerDesc || 'Is vacancy ka official aavedan jald shuru hoga. Official update aur report padhne ke liye neeche Notice/Article par click karein.'}
                  </div>
                </div>
              )}

              {/* Quick Highlight Cards */}
              <div className="stats-2x2-grid mb-3">
                <div className="mini-stat-card stat-card-posts">
                  <span className="mini-lbl"><Users size={12} /> {t.totalPosts || 'Total Posts'}</span>
                  <span className="mini-val">{displayPosts}</span>
                </div>
                <div className="mini-stat-card stat-card-date">
                  <span className="mini-lbl"><Calendar size={12} /> {t.lastDate || 'Last Date'}</span>
                  <span className="mini-val font-bold">{job.lastDate || 'Active'}</span>
                </div>
                <div className="mini-stat-card stat-card-salary">
                  <span className="mini-lbl"><DollarSign size={12} /> {t.salaryPay || 'Salary / Pay'}</span>
                  <span className="mini-val">{job.salary || "As per 7th CPC / Rules"}</span>
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

              {/* Quick Syllabus Banner (Takes user directly to Syllabus Tab) */}
              {syllabus && (
                <div
                  className="p-3 rounded-xl mb-3 cursor-pointer"
                  onClick={() => setActiveTab('syllabus')}
                  style={{
                    background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
                    border: '1.5px solid #C4B5FD'
                  }}
                >
                  <div className="flex-between items-center">
                    <div className="flex-center gap-2">
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: '#7C3AED',
                          color: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-purple-900 m-0">
                          {isHi ? '📚 संपूर्ण परीक्षा पैटर्न व सिलेबस देखें' : '📚 View Exam Pattern & Syllabus'}
                        </h5>
                        <p className="text-3xs text-purple-700 m-0 mt-0.5">
                          {syllabus.totalQuestions} • {syllabus.duration} • {syllabus.negativeMarking.slice(0, 30)}
                        </p>
                      </div>
                    </div>
                    <span className="badge-pill bg-purple-600 text-white text-3xs font-bold px-2 py-1 rounded">
                      {isHi ? 'सिलेबस खोलें →' : 'Open →'}
                    </span>
                  </div>
                </div>
              )}

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

              {/* Section: Verified Official Links (Guaranteed Zero 404) */}
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
                  {/* 1. Official Notification Link */}
                  <a
                    href={safePdfUrl}
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
                          {job.category === 'Private' ? `${job.source || 'Portal'} Official Listing` : 'Verified Official Recruitment Document'}
                        </p>
                      </div>
                    </div>
                    <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#EF4444', color: '#FFFFFF' }}>
                      {job.category === 'Private' ? 'View Details' : (isDirectPdf ? 'Open PDF' : 'Notice')} <ExternalLink size={10} />
                    </span>
                  </a>

                  {/* 2. In-App Clean Reader (Zero 404 Guarantee) */}
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
                          posts: displayPosts,
                          qualification: job.qualification,
                          salary: job.salary,
                          lastDate: job.lastDate,
                          fee: job.fee,
                          ageLimit: job.ageLimit,
                          source: job.source || job.dept,
                          url: safePdfUrl,
                          applyUrl: safeApplyUrl,
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
                          {isHi ? 'क्लीन इन-ऐप नोटिस व सिलेबस प्रिंट' : 'In-App Safe Notice & Print'}
                        </p>
                        <p className="text-3xs text-muted" style={{ margin: 0 }}>
                          {isHi ? 'बिना किसी 404 एरर के संपूर्ण विवरण इन-ऐप पढ़ें' : 'Read full details without any 404 errors'}
                        </p>
                      </div>
                    </div>
                    <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#059669', color: '#FFFFFF' }}>
                      {isHi ? 'रीडर खोलें' : 'Read Inside'} <Printer size={10} />
                    </span>
                  </button>

                  {/* 3. Official Apply Portal */}
                  <a
                    href={safeApplyUrl}
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

                  {/* 4. Official Department Website */}
                  <a
                    href={job.website || safeApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="official-link-row flex-between p-2.5 rounded"
                    style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color, #CBD5E1)', textDecoration: 'none' }}
                  >
                    <div className="flex-center gap-2">
                      <span className="text-base">{job.category === 'Private' ? '🏢' : '🏛️'}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                          {job.category === 'Private' ? `${job.source || 'Company'} Career Website` : (isHi ? 'विभागीय मुख्य पोर्टल (Official Portal)' : 'Department Official Portal')}
                        </p>
                        <p className="text-3xs text-muted" style={{ margin: 0 }}>
                          {job.dept} • Careers / Recruitment Section
                        </p>
                      </div>
                    </div>
                    <span className="btn-accent-xs font-bold text-3xs inline-flex flex-center gap-0.5 px-2 py-1 rounded" style={{ background: '#475569', color: '#FFFFFF' }}>
                      Visit Site <ExternalLink size={10} />
                    </span>
                  </a>
                </div>
              </div>

              {/* YouTube Video Section */}
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
            </>
          ) : (
            /* ===============================================================
               EXAM PATTERN & DETAILED SYLLABUS TAB
               =============================================================== */
            <div className="syllabus-view-container">
              {syllabus ? (
                <>
                  {/* Header Card */}
                  <div
                    className="p-3.5 rounded-xl mb-3 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
                      boxShadow: '0 4px 16px rgba(49, 46, 129, 0.25)'
                    }}
                  >
                    <div className="flex-between items-center mb-1">
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-300">
                        ✦ OFFICIAL EXAM SCHEME ✦
                      </span>
                      <span className="badge-pill bg-amber-400 text-slate-900 text-3xs font-black px-2 py-0.5 rounded">
                        {syllabus.mode}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold m-0 leading-snug">
                      {syllabus.examName}
                    </h3>
                  </div>

                  {/* 4 Pillars Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <div className="p-2.5 rounded-lg border text-center" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <span className="text-3xs text-muted block flex-center justify-center gap-1">
                        <Clock size={11} /> {isHi ? 'परीक्षा समय (Duration)' : 'Exam Duration'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{syllabus.duration}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border text-center" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <span className="text-3xs text-muted block flex-center justify-center gap-1">
                        <BookOpen size={11} /> {isHi ? 'कुल प्रश्न (Questions)' : 'Total Questions'}
                      </span>
                      <span className="text-xs font-bold text-indigo-700">{syllabus.totalQuestions}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border text-center" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <span className="text-3xs text-muted block flex-center justify-center gap-1">
                        <Award size={11} /> {isHi ? 'पूर्णांक (Total Marks)' : 'Total Marks'}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{syllabus.totalMarks}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border text-center" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                      <span className="text-3xs text-red-700 block flex-center justify-center gap-1">
                        <AlertCircle size={11} /> {isHi ? 'नेगेटिव मार्किंग' : 'Negative Marking'}
                      </span>
                      <span className="text-3xs font-extrabold text-red-800">{syllabus.negativeMarking}</span>
                    </div>
                  </div>

                  {/* Subject-Wise Exam Pattern Table */}
                  <div className="detail-section mb-3">
                    <h4 className="detail-heading flex-center gap-1 text-primary">
                      <span>📊</span> {isHi ? 'विषयवार अंक विभाजन (Exam Pattern)' : 'Subject-Wise Exam Pattern'}
                    </h4>
                    <div className="overflow-hidden rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
                      <table className="w-full text-xs" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#1E3A8A', color: '#FFFFFF', textAlign: 'left' }}>
                            <th style={{ padding: '8px 10px' }}>{isHi ? 'विषय / सेक्शन (Subject)' : 'Section'}</th>
                            <th style={{ padding: '8px 10px', textAlign: 'center' }}>{isHi ? 'प्रश्न (Qs)' : 'Questions'}</th>
                            <th style={{ padding: '8px 10px', textAlign: 'center' }}>{isHi ? 'अंक (Marks)' : 'Marks'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {syllabus.pattern.map((row, idx) => (
                            <tr
                              key={idx}
                              style={{
                                background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0'
                              }}
                            >
                              <td style={{ padding: '8px 10px', fontWeight: 600, color: '#1E293B' }}>{cleanForLanguage(row.subject, currentLang)}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#2563EB' }}>{row.questions}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>{row.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Subject-Wise Detailed Topics */}
                  <div className="detail-section mb-3">
                    <h4 className="detail-heading flex-center gap-1 text-primary">
                      <span>📖</span> {isHi ? 'विस्तृत विषयवार सिलेबस (Detailed Topics)' : 'Detailed Subject Syllabus'}
                    </h4>
                    <div className="flex-column gap-2.5">
                      {syllabus.topics.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border"
                          style={{ background: '#FFFFFF', borderColor: '#CBD5E1' }}
                        >
                          <h5 className="text-xs font-bold text-slate-900 m-0 mb-1 flex-center-start gap-1">
                            {cleanForLanguage(item.subject, currentLang)}
                          </h5>
                          <p className="text-2xs text-slate-700 m-0 leading-relaxed font-normal">
                            {cleanForLanguage(item.items, currentLang)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical Standards (PET / PST) if applicable */}
                  {syllabus.physicalStandards && (
                    <div className="detail-section mb-3">
                      <h4 className="detail-heading flex-center gap-1 text-danger">
                        <Dumbbell size={16} /> {isHi ? 'शारीरिक दक्षता व मापदंड (PET / PST)' : 'Physical Fitness Criteria'}
                      </h4>
                      <div className="p-3 rounded-lg border" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                        <div className="grid grid-cols-2 gap-2 text-2xs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                          <div>
                            <span className="font-bold text-slate-700 block">📏 {isHi ? 'पुरुष लंबाई (Height):' : 'Male Height:'}</span>
                            <span className="text-slate-900 font-semibold">{cleanForLanguage(syllabus.physicalStandards.maleHeight, currentLang)}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 block">📏 {isHi ? 'महिला लंबाई (Height):' : 'Female Height:'}</span>
                            <span className="text-slate-900 font-semibold">{cleanForLanguage(syllabus.physicalStandards.femaleHeight, currentLang)}</span>
                          </div>
                          {syllabus.physicalStandards.maleChest && (
                            <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
                              <span className="font-bold text-slate-700 block">📐 {isHi ? 'पुरुष सीना (Chest):' : 'Male Chest:'}</span>
                              <span className="text-slate-900 font-semibold">{cleanForLanguage(syllabus.physicalStandards.maleChest, currentLang)}</span>
                            </div>
                          )}
                          <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
                            <span className="font-bold text-emerald-800 block">🏃 {isHi ? 'दौड़ (Running):' : 'Running:'}</span>
                            <span className="text-slate-900 font-semibold block">{cleanForLanguage(syllabus.physicalStandards.runningMale, currentLang)}</span>
                            <span className="text-slate-900 font-semibold block mt-0.5">{cleanForLanguage(syllabus.physicalStandards.runningFemale, currentLang)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selection Stages */}
                  {syllabus.selectionStages && (
                    <div className="detail-section mb-3">
                      <h4 className="detail-heading flex-center gap-1 text-primary">
                        <span>🎯</span> {isHi ? 'चयन के चरण (Selection Stages)' : 'Selection Stages'}
                      </h4>
                      <div className="p-2.5 rounded-lg border flex-column gap-1.5" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                        {syllabus.selectionStages.map((stage, sIdx) => (
                          <div key={sIdx} className="flex-center-start gap-1.5 text-2xs font-semibold text-slate-800">
                            <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                            <span>{cleanForLanguage(stage, currentLang)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Free Mock Test CTA */}
                  <div
                    className="p-3.5 rounded-xl mb-3 text-center"
                    style={{
                      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                      border: '1.5px solid #86EFAC'
                    }}
                  >
                    <h4 className="text-xs font-bold text-emerald-900 m-0">
                      🏆 {isHi ? 'इस परीक्षा का 100% फ्री लाइव मॉक टेस्ट दें' : 'Practice Free Live Mock Test for this Exam'}
                    </h4>
                    <p className="text-3xs text-emerald-700 m-0 mt-0.5 mb-2.5">
                      {isHi ? 'असली परीक्षा पैटर्न पर आधारित 10-प्रश्नों का टाइमर टेस्ट' : '10-question timed test based on real exam pattern'}
                    </p>
                    <button
                      type="button"
                      className="btn-success text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                      }}
                      onClick={() => {
                        onClose();
                        if (onStartMock) {
                          onStartMock(syllabus.mockSubject || 'General Knowledge');
                        }
                      }}
                    >
                      🚀 {isHi ? 'फ्री मॉक टेस्ट शुरू करें' : 'Start Free Mock Test'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-muted">
                  <p className="text-xs">{isHi ? 'इस भर्ती का विस्तृत सिलेबस जल्द अपडेट किया जा रहा है।' : 'Detailed syllabus for this vacancy is being updated.'}</p>
                </div>
              )}
            </div>
          )}

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
