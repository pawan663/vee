import React, { useState } from 'react';
import { X, ArrowLeft, ExternalLink, Share2, Copy, CheckCircle2, ShieldCheck, Globe, BookOpen, Smartphone, FileText, Download, Building, Users, Calendar, Award, DollarSign, Send, Printer } from 'lucide-react';

export default function InAppReaderModal({ isOpen, item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'webview'
  const [iframeError, setIframeError] = useState(false);

  if (!isOpen || !item) return null;

  const isPdf = item.isPdf || (item.url && item.url.toLowerCase().includes('.pdf'));
  const iframeSrc = isPdf
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(item.url)}`
    : item.url;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `*${item.title}*\n\n${isPdf ? 'Official PDF Notification' : 'Recruitment Notice'}: ${item.source || 'VEE App'}\nVEE App me dekhein: ${item.url || ''}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="in-app-reader-overlay">
      {/* Top App Bar */}
      <div className="reader-top-bar flex-between">
        <div className="flex-center gap-2">
          <button className="icon-btn-back" onClick={onClose} title="Back to App">
            <ArrowLeft size={18} />
          </button>
          <div className="reader-title-pill">
            {isPdf ? (
              <FileText size={13} className="text-danger" />
            ) : (
              <Globe size={13} className="text-accent" />
            )}
            <span className="text-2xs font-semibold truncate max-w-180">
              {isPdf ? `PDF: ${item.source || 'Official Notification'}` : (item.source || 'VEE Notice Reader')}
            </span>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          {/* Mode Switcher: Clean Reader vs Web View */}
          <button
            className={`reader-mode-btn ${viewMode === 'reader' ? 'active' : ''}`}
            onClick={() => setViewMode('reader')}
            title="Clean Safe Reader"
          >
            <BookOpen size={14} />
          </button>
          <button
            className={`reader-mode-btn ${viewMode === 'webview' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('webview');
              setIframeError(false);
            }}
            title={isPdf ? "In-App PDF Viewer" : "In-App Web View"}
          >
            <Smartphone size={14} />
          </button>

          <button className="icon-btn-sm" onClick={handlePrintPdf} title="Clean Print / Save as PDF">
            <Printer size={16} />
          </button>
          <button className="icon-btn-sm" onClick={handleCopy} title="Copy Link">
            {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
          </button>
          <button className="icon-btn-sm" onClick={handleShare} title="Share to WhatsApp">
            <Share2 size={16} />
          </button>
          <button className="icon-btn-sm" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Reader Content Body */}
      <div className="reader-viewport">
        {viewMode === 'reader' ? (
          <div className="reader-card p-4">
            <div className="flex-between mb-2">
              <span className={`badge-source-sm text-3xs font-bold ${isPdf ? 'bg-danger text-white' : ''}`}>
                {isPdf ? '📄 Official PDF Document' : `📡 ${item.source || 'Verified Recruitment Notice'}`}
              </span>
              <span className="text-3xs text-muted">{item.timeAgo || 'Live Verified'}</span>
            </div>

            <h2 className="reader-headline text-base font-bold text-primary mb-3 leading-snug">
              {item.title}
            </h2>

            {/* If it's a PDF File */}
            {isPdf ? (
              <>
                <div className="reader-summary-box mb-4 p-3 bg-light rounded border">
                  <div className="flex-center-start gap-1 text-2xs text-danger font-bold mb-1">
                    <FileText size={15} /> Official Govt Notification Document (PDF)
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Ye notification official portal <b>{item.source || 'Govt Board'}</b> dwara verified hai. Isme full syllabus, post-wise category seats aur eligibility guidelines shamil hain.
                  </p>
                </div>

                <div className="reader-actions flex-column gap-2 mt-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center flex-center gap-1.5 text-xs font-bold py-2.5 shadow-md"
                  >
                    <Download size={15} /> ⬇️ Official PDF Kholein / Download Karein
                  </a>

                  <button
                    className="btn-secondary w-full text-center flex-center gap-1.5 text-xs font-semibold py-2"
                    onClick={() => {
                      setViewMode('webview');
                      setIframeError(false);
                    }}
                  >
                    <Smartphone size={14} /> 📄 App Ke Andar PDF Viewer
                  </button>
                </div>
              </>
            ) : (
              /* If it's a News Article / Recruitment Notice Page */
              <>
                <div className="reader-summary-box mb-3 p-3 bg-light rounded">
                  <div className="flex-center-start gap-1 text-2xs text-accent font-bold mb-1">
                    <ShieldCheck size={14} /> VEE 100% In-App Clean Notice Breakdown
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Ye aavedan soochna <b>{item.source || 'Official Recruitment Portal'}</b> se live verified hai. Aspirant bina kisi advertisement ke poori jaankari padh sakein, isliye ise VEE app me clean format me diya gaya hai.
                  </p>
                </div>

                {/* Structured Vacancy Highlights */}
                <div className="reader-details-block mb-4 p-3 border rounded-lg bg-white" style={{ border: '1px solid var(--border)' }}>
                  <h4 className="text-xs font-bold text-primary mb-2.5 flex-center-start gap-1">
                    📌 Bharti Ki Mukhya Jankari (Recruitment Highlights):
                  </h4>
                  <div className="flex-column gap-2 text-xs">
                    {item.dept && (
                      <div className="flex-between py-1 border-bottom">
                        <span className="text-muted font-medium flex-center-start gap-1"><Building size={13} /> Department:</span>
                        <span className="font-bold text-dark text-right">{item.dept}</span>
                      </div>
                    )}
                    {item.posts && (
                      <div className="flex-between py-1 border-bottom">
                        <span className="text-muted font-medium flex-center-start gap-1"><Users size={13} /> Total Posts:</span>
                        <span className="font-bold text-success">{item.posts}</span>
                      </div>
                    )}
                    {item.qualification && (
                      <div className="flex-between py-1 border-bottom">
                        <span className="text-muted font-medium flex-center-start gap-1"><Award size={13} /> Eligibility:</span>
                        <span className="font-semibold text-dark text-right" style={{ maxWidth: '65%' }}>{item.qualification}</span>
                      </div>
                    )}
                    {item.lastDate && (
                      <div className="flex-between py-1 border-bottom">
                        <span className="text-muted font-medium flex-center-start gap-1"><Calendar size={13} /> Last Date:</span>
                        <span className="font-bold text-danger">{item.lastDate}</span>
                      </div>
                    )}
                    {item.salary && (
                      <div className="flex-between py-1 border-bottom">
                        <span className="text-muted font-medium flex-center-start gap-1"><DollarSign size={13} /> Salary / Pay:</span>
                        <span className="font-semibold text-dark text-right">{item.salary}</span>
                      </div>
                    )}
                    {item.fee && (
                      <div className="flex-between py-1">
                        <span className="text-muted font-medium">💳 Application Fee:</span>
                        <span className="font-semibold text-dark">{item.fee}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="reader-actions flex-column gap-2 mt-4">
                  {/* Clean PDF Generator Button */}
                  <button
                    type="button"
                    className="btn-success w-full text-center flex-center justify-center gap-1.5 text-xs font-bold py-2.5 shadow-sm"
                    onClick={handlePrintPdf}
                    style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: '#FFFFFF', border: 'none', borderRadius: '8px' }}
                  >
                    <Printer size={15} /> 🖨️ Is Notice Ka Clean PDF Download / Save Karein
                  </button>

                  {/* Direct Apply or Portal Link */}
                  {item.applyUrl && (
                    <a
                      href={item.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center flex-center gap-1.5 text-xs font-bold py-2.5 shadow-md"
                    >
                      <Send size={15} /> 🌐 Official Aavedan Portal Kholein (Apply Online)
                    </a>
                  )}

                  {/* Original Article Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full text-center flex-center gap-1.5 text-xs font-bold py-2.5"
                  >
                    <ExternalLink size={15} /> 📰 Poori Khabar / Portal Page Kholein ({item.source || 'Publisher'})
                  </a>

                  <button
                    className="btn-secondary w-full text-center flex-center gap-1.5 text-xs font-semibold py-2"
                    onClick={() => {
                      setViewMode('webview');
                      setIframeError(false);
                    }}
                  >
                    <Smartphone size={14} /> 📱 App Ke Andar Browser View Kholein
                  </button>
                </div>
              </>
            )}

            <button className="btn-secondary w-full text-xs font-semibold py-2 mt-3" onClick={onClose}>
              ← Wapas VEE App Me Jayein
            </button>
          </div>
        ) : (
          /* In-App Web View Container */
          <div className="in-app-webview-container">
            {!iframeError ? (
              <iframe
                src={iframeSrc}
                title={item.title}
                className="in-app-iframe"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onError={() => setIframeError(true)}
              />
            ) : null}

            {iframeError && (
              <div className="iframe-fallback-card p-4 text-center">
                <ShieldCheck size={36} className="text-accent inline mb-2" />
                <h4 className="text-xs font-bold text-primary mb-1">
                  Portal Security Protected
                </h4>
                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  Is portal ne direct in-frame display restrict kiya hai. Aap ise Clean Reader me padh sakte hain ya direct khol sakte hain.
                </p>
                <div className="flex-center gap-2 justify-center">
                  <button
                    className="btn-primary-sm"
                    onClick={() => setViewMode('reader')}
                  >
                    <BookOpen size={13} /> Clean Reader
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary-sm"
                  >
                    <ExternalLink size={13} /> Direct Kholein
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
