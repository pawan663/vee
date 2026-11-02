import React from 'react';
import { Bell, Search, Globe, Sparkles } from 'lucide-react';

export default function Navbar({ currentLang, onChangeLang, onOpenTools, userProfile, onOpenAuth, onToggleFullscreen, isFullscreen, t }) {
  return (
    <header className="app-navbar">
      <div className="navbar-top-row flex-between">
        {/* Brand Logo & Name */}
        <div className="brand-group flex-center-start gap-2">
          <div className="brand-logo-badge">
            <span className="logo-letter">V</span>
          </div>
          <div>
            <div className="flex-center-start gap-1">
              <h1 className="brand-name">{t.appTitle}</h1>
              <span className="brand-pill">2026</span>
            </div>
            <p className="brand-sub">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Right Action Icons: Login, Tools & Language */}
        <div className="nav-actions flex-center gap-1.5">


          {/* Fullscreen / Hide URL bar button */}
          <button
            className="icon-btn-highlight"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (Hide URL Bar)'}
            style={{ background: isFullscreen ? '#1E3A8A' : 'rgba(30, 58, 138, 0.08)', color: isFullscreen ? '#FFF' : '#1E3A8A' }}
          >
            <span style={{ fontSize: '13px', lineHeight: 1 }}>{isFullscreen ? '🗗' : '⛶'}</span>
            <span className="text-3xs font-bold">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>

          {/* Quick Tools Button */}
          <button
            className="icon-btn-highlight"
            onClick={onOpenTools}
            title={t.tools}
          >
            <Sparkles size={15} className="text-warning" />
            <span className="text-3xs font-bold">Tools</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="lang-switcher-pill flex-center gap-1">
            <Globe size={13} className="text-muted" />
            <select
              className="lang-select"
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value)}
            >
              <option value="hi">हिन्दी</option>
              <option value="hinglish">Hinglish</option>
              <option value="en">English</option>
              <option value="mr">मराठी</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
