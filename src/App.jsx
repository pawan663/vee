import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import JobsTab from './components/JobsTab';
import ShortsTab from './components/ShortsTab';
import CharchaTab from './components/CharchaTab';
import BooksTab from './components/BooksTab';
import ProfileTab from './components/ProfileTab';

import JobDetailModal from './components/JobDetailModal';
import InAppBrowserModal from './components/InAppBrowserModal';
import InAppReaderModal from './components/InAppReaderModal';
import MockTestModal from './components/MockTestModal';
import ToolsModal from './components/ToolsModal';
import ReviewModal from './components/ReviewModal';
import AuthModal from './components/AuthModal';
import LegalPolicyModal from './components/LegalPolicyModal';

import { translations } from './data/translations';
import { initialJobs } from './data/initialJobs';
import { initialCharcha } from './data/initialCharcha';
import { initialShorts } from './data/initialShorts';
import { initialBooks, initialMocks } from './data/initialBooks';
import liveScrapedData from './data/liveScrapedData.json';
import { deduplicateJobs, deduplicateNews } from './utils/deduplicate';
import { isJobExpired, isValidRecruitmentJob } from './utils/dateExpiry';

export default function App() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('vee_lang') || 'hi';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('vee_dark') === 'true';
  });

  // User Profile with LocalStorage Persistence
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('vee_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'VEE Aspirant',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      state: 'Rajasthan',
      goal: 'ITI Fitter / Railway ALP',
      qual: 'ITI Pass',
      followers: '1,240',
      following: '48',
      karma: '642',
      isLoggedIn: false,
      phone: '',
      email: ''
    };
  });

  // Core Data State: Real scraped live jobs first, followed by curated base jobs (strictly unexpired)
  const [jobs, setJobs] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const liveJobs = (liveScrapedData && Array.isArray(liveScrapedData.jobs)) ? liveScrapedData.jobs : [];
    const allCandidates = [...liveJobs, ...initialJobs].filter((j) => !isJobExpired(j.lastDate, today) && isValidRecruitmentJob(j));
    return deduplicateJobs(allCandidates);
  });

  const [liveNews, setLiveNews] = useState(() => {
    return deduplicateNews(liveScrapedData?.news || []);
  });
  const [posts, setPosts] = useState(() => {
    const ver = localStorage.getItem('vee_charcha_v3');
    if (ver === 'true') {
      const saved = localStorage.getItem('vee_charcha_posts');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    localStorage.setItem('vee_charcha_v3', 'true');
    return initialCharcha;
  });

  const [shorts, setShorts] = useState(initialShorts);
  const [books, setBooks] = useState(initialBooks);
  const [mocks, setMocks] = useState(initialMocks);

  // User State: Bookmarks & Applications Tracker with LocalStorage
  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = localStorage.getItem('vee_saved_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['job-1', 'job-3'];
  });

  const [appliedJobs, setAppliedJobs] = useState(() => {
    const saved = localStorage.getItem('vee_applied_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        job: initialJobs[0], // BHEL
        regNo: 'BHEL20268841',
        date: '12 Oct 2026'
      }
    ];
  });

  // Modals State
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);
  const [applyBrowserJob, setApplyBrowserJob] = useState(null);
  const [readerItem, setReaderItem] = useState(null);
  const [activeMock, setActiveMock] = useState(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [legalPolicyTab, setLegalPolicyTab] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    const saved = localStorage.getItem('vee_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isLoggedIn) return false;
      } catch (e) {}
    }
    const hasSeenWelcome = sessionStorage.getItem('vee_welcome_seen');
    if (!hasSeenWelcome) {
      sessionStorage.setItem('vee_welcome_seen', 'true');
      return true;
    }
    return false;
  });

  // PWA & Standalone Detection (Hides browser URL bar when installed)
  const [isStandalone, setIsStandalone] = useState(() => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  });
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowInstallBanner(false);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setIsStandalone(true);
        setShowInstallBanner(false);
      }
      setDeferredInstallPrompt(null);
    } else {
      setShowInstallGuideModal(true);
    }
  };

  // Authentication Handlers
  const handleLoginSuccess = (updatedUser) => {
    setUserProfile(updatedUser);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Kya aap apna account logout karna chahte hain?")) {
      const guestProfile = {
        name: 'VEE Aspirant',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        state: 'Rajasthan',
        goal: 'ITI Fitter / Railway ALP',
        qual: 'ITI Pass',
        followers: '1,240',
        following: '48',
        karma: '642',
        isLoggedIn: false,
        phone: '',
        email: ''
      };
      setUserProfile(guestProfile);
      localStorage.removeItem('vee_current_account_key');
    }
  };

  const handleClearAllUserData = () => {
    localStorage.removeItem('vee_user_profile');
    localStorage.removeItem('vee_saved_jobs');
    localStorage.removeItem('vee_applied_jobs');
    localStorage.removeItem('vee_current_account_key');
    const guestProfile = {
      name: 'VEE Aspirant',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      state: 'All India',
      goal: 'Govt Job Aspirant',
      qual: '12th / Graduate',
      followers: '0',
      following: '0',
      karma: '0',
      isLoggedIn: false,
      phone: '',
      email: ''
    };
    setUserProfile(guestProfile);
    setSavedJobIds([]);
    setAppliedJobs([]);
  };

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('vee_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('vee_dark', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('vee_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('vee_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('vee_applied_jobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // Real-time Multi-Portal Live Sync State (Zero-lag with content hash check)
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncHashRef = useRef('');

  const syncLiveData = async (isManual = false) => {
    try {
      if (isManual) setIsSyncing(true);

      // Multi-Layer Cloud Live Sync:
      // 1. First fetch real-time from local endpoint (guaranteed fastest, same origin, no CORS)
      // 2. Fallback to GitHub raw CDN
      let data = null;
      try {
        const localRes = await fetch(`/live_data.json?t=${Date.now()}`);
        if (localRes.ok) {
          data = await localRes.json();
        }
      } catch (err) {
        // Fallback to GitHub CDN
      }

      if (!data) {
        try {
          const ghRes = await fetch(`https://raw.githubusercontent.com/pawan663/vee/main/public/live_data.json?t=${Date.now()}`);
          if (ghRes.ok) {
            data = await ghRes.json();
          }
        } catch (err) {}
      }

      if (data && data.jobs && Array.isArray(data.jobs)) {
        const currentHash = `${data.lastUpdated || ''}_${data.jobs?.length || 0}_${data.news?.length || 0}`;

        // Skip heavy deduplication & state updates if data has not changed
        if (currentHash === lastSyncHashRef.current && !isManual) {
          return;
        }
        lastSyncHashRef.current = currentHash;

        const today = new Date().toISOString().split('T')[0];
        const activeIncoming = data.jobs.filter((j) => !isJobExpired(j.lastDate, today) && isValidRecruitmentJob(j));

        if (activeIncoming.length > 0) {
          setJobs((prevJobs) => {
            const unexpiredPrev = prevJobs.filter((j) => !isJobExpired(j.lastDate, today) && isValidRecruitmentJob(j));
            return deduplicateJobs([...activeIncoming, ...unexpiredPrev]);
          });
        }

        if (data.news && Array.isArray(data.news) && data.news.length > 0) {
          setLiveNews((prevNews) => deduplicateNews([...data.news, ...prevNews]));
        }

        setLastSyncedTime(new Date(data.lastUpdated || Date.now()));
      }
    } catch (e) {
      console.warn("Live sync error", e);
    } finally {
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  };

  useEffect(() => {
    syncLiveData();
    const interval = setInterval(() => syncLiveData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const t = translations[currentLang] || translations.hi;

  // Toggle Save / Bookmark
  const handleToggleSave = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
    }
  };

  // Mark Form as Applied
  const handleMarkApplied = (job, regNo) => {
    const exists = appliedJobs.some((item) => item.job.id === job.id);
    if (!exists) {
      setAppliedJobs([
        ...appliedJobs,
        {
          job,
          regNo: regNo || 'REG-' + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toLocaleDateString('en-GB')
        }
      ]);
    }
  };

  // Upvote / Downvote Reddit Charcha
  const handleUpvote = (postId) => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleDownvote = (postId) => {
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p
      )
    );
  };

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId, commentObj, parentCommentId = null) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          let updatedComments;
          if (parentCommentId) {
            const addNested = (list) => {
              return list.map((c) => {
                if (c.id === parentCommentId) {
                  return {
                    ...c,
                    replies: [...(c.replies || []), commentObj]
                  };
                }
                if (c.replies && c.replies.length > 0) {
                  return {
                    ...c,
                    replies: addNested(c.replies)
                  };
                }
                return c;
              });
            };
            updatedComments = addNested(p.comments || []);
          } else {
            updatedComments = [commentObj, ...(p.comments || [])];
          }
          return {
            ...p,
            comments: updatedComments,
            commentsCount: (p.commentsCount || 0) + 1
          };
        }
        return p;
      })
    );
  };

  const handleCommentUpvote = (postId, commentId, delta = 1) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const updateVotes = (list) => {
            return list.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  upvotes: Math.max(0, (c.upvotes || 0) + delta)
                };
              }
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: updateVotes(c.replies)
                };
              }
              return c;
            });
          };
          return {
            ...p,
            comments: updateVotes(p.comments || [])
          };
        }
        return p;
      })
    );
  };

  return (
    <div className={`app-root ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="mobile-shell">
        {/* Top Navbar */}
        <Navbar
          currentLang={currentLang}
          onChangeLang={setCurrentLang}
          onOpenTools={() => setIsToolsOpen(true)}
          userProfile={userProfile}
          onOpenAuth={() => setIsAuthOpen(true)}
          t={t}
        />

        {/* PWA 1-Click Install Banner (Displayed only when opened in mobile browser with URL bar) */}
        {!isStandalone && showInstallBanner && (
          <div
            className="install-app-banner flex-between items-center px-3 py-2"
            style={{
              background: 'linear-gradient(90deg, #1E1B4B 0%, #1E3A8A 50%, #2563EB 100%)',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              position: 'relative',
              zIndex: 30,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex-center gap-2">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '13px',
                  color: '#FACC15',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                  flexShrink: 0
                }}
              >
                VEE
              </div>
              <div>
                <p className="text-xs font-bold leading-none m-0 text-white">
                  {currentLang === 'hi' ? '📲 VEE ऐप इनस्टॉल करें' : '📲 Install VEE Official App'}
                </p>
                <p className="text-3xs text-blue-200 leading-none m-0 mt-1">
                  {currentLang === 'hi' ? 'URL बार हटाएं • असली ऐप की तरह चलाएं' : 'Remove browser URL bar • 100% Full Screen'}
                </p>
              </div>
            </div>
            <div className="flex-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleTriggerInstall}
                className="btn-accent-sm font-bold text-3xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background: '#F59E0B',
                  color: '#0F172A',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)'
                }}
              >
                {currentLang === 'hi' ? 'इनस्टॉल करें ⚡' : 'Install ⚡'}
              </button>
              <button
                type="button"
                onClick={() => setShowInstallBanner(false)}
                className="text-blue-200 hover:text-white p-1 cursor-pointer"
                style={{ background: 'transparent', border: 'none', fontSize: '15px' }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="main-viewport">
          {activeTab === 'jobs' && (
            <JobsTab
              jobs={jobs}
              liveNews={liveNews}
              onOpenDetail={(job) => setSelectedDetailJob(job)}
              onOpenApply={(job) => setApplyBrowserJob(job)}
              onOpenNews={(item) => setReaderItem(item)}
              savedJobIds={savedJobIds}
              onToggleSave={handleToggleSave}
              onOpenTools={() => setIsToolsOpen(true)}
              lastSyncedTime={lastSyncedTime}
              isSyncing={isSyncing}
              onManualSync={syncLiveData}
              currentLang={currentLang}
              t={t}
            />
          )}

          {activeTab === 'shorts' && (
            <ShortsTab
              shorts={shorts}
              userProfile={userProfile}
              onOpenAuth={() => setIsAuthOpen(true)}
              onSelectJob={(jobId) => {
                const targetJob = jobs.find((j) => j.id === jobId);
                if (targetJob) setSelectedDetailJob(targetJob);
              }}
              currentLang={currentLang}
              t={t}
            />
          )}

          {activeTab === 'charcha' && (
            <CharchaTab
              posts={posts}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onAddPost={handleAddPost}
              onAddComment={handleAddComment}
              onCommentUpvote={handleCommentUpvote}
              onOpenLink={(item) => setReaderItem(item)}
              onOpenJob={(job) => setSelectedDetailJob(job)}
              onOpenTools={() => setIsToolsOpen(true)}
              jobs={jobs}
              currentLang={currentLang}
              t={t}
            />
          )}

          {activeTab === 'books' && (
            <BooksTab
              books={books}
              mocks={mocks}
              onStartMock={(mock) => setActiveMock(mock)}
              t={t}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              appliedJobs={appliedJobs}
              onUpdateAppliedJobs={setAppliedJobs}
              savedJobIds={savedJobIds}
              allJobs={jobs}
              liveNews={liveNews}
              onOpenJob={(job) => setSelectedDetailJob(job)}
              onOpenTools={() => setIsToolsOpen(true)}
              onOpenReview={() => setIsReviewOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenLegal={(tab) => setLegalPolicyTab(tab || 'disclaimer')}
              onLogout={handleLogout}
              onClearData={handleClearAllUserData}
              currentLang={currentLang}
              onChangeLang={setCurrentLang}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              lastSyncedTime={lastSyncedTime}
              onManualSync={() => syncLiveData(true)}
              isSyncing={isSyncing}
              t={t}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          t={t}
        />

        {/* Global Modals */}
        <JobDetailModal
          isOpen={!!selectedDetailJob}
          job={selectedDetailJob}
          onClose={() => setSelectedDetailJob(null)}
          onOpenApply={(job) => {
            setSelectedDetailJob(null);
            setApplyBrowserJob(job);
          }}
          onOpenReader={(item) => {
            setSelectedDetailJob(null);
            setReaderItem(item);
          }}
          isSaved={selectedDetailJob ? savedJobIds.includes(selectedDetailJob.id) : false}
          onToggleSave={handleToggleSave}
          t={t}
          currentLang={currentLang}
          onStartMock={(mockSubject) => {
            setSelectedDetailJob(null);
            const targetMock = mocks.find(m => m.category === mockSubject) || mocks[0];
            setActiveMock(targetMock);
          }}
        />

        <InAppBrowserModal
          isOpen={!!applyBrowserJob}
          job={applyBrowserJob}
          userProfile={userProfile}
          onClose={() => setApplyBrowserJob(null)}
          onMarkApplied={handleMarkApplied}
          t={t}
        />

        <InAppReaderModal
          isOpen={!!readerItem}
          item={readerItem}
          onClose={() => setReaderItem(null)}
        />

        <MockTestModal
          isOpen={!!activeMock}
          mock={activeMock}
          onClose={() => setActiveMock(null)}
          t={t}
        />

        <ToolsModal
          isOpen={isToolsOpen}
          onClose={() => setIsToolsOpen(false)}
          onPhotoSaved={(updatedProfile) => setUserProfile(updatedProfile)}
          t={t}
        />

        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          t={t}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          currentProfile={userProfile}
          t={t}
          currentLang={currentLang}
        />

        <LegalPolicyModal
          isOpen={!!legalPolicyTab}
          initialTab={legalPolicyTab || 'disclaimer'}
          onClose={() => setLegalPolicyTab(null)}
          onClearUserData={handleClearAllUserData}
          t={t}
        />

        {/* Fullscreen App Install Guide Modal (For mobile browsers showing top URL bar) */}
        {showInstallGuideModal && (
          <div
            className="modal-overlay flex-center p-3"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              zIndex: 9999,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowInstallGuideModal(false)}
          >
            <div
              className="p-4 rounded-2xl w-full max-w-sm text-center"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative',
                animation: 'slideUp 0.25s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                  color: '#FACC15',
                  fontSize: '22px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
                }}
              >
                VEE
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0 mb-1">
                {currentLang === 'hi' ? 'VEE ऐप बिना URL बार के चलाएं' : 'Run VEE App Full-Screen'}
              </h3>
              <p className="text-2xs text-slate-600 m-0 mb-3.5 leading-relaxed">
                {currentLang === 'hi'
                  ? 'ऐप को अपने फ़ोन की होम स्क्रीन पर जोड़ें ताकि यह असली ऐप की तरह बिना किसी ब्राउज़र बार के खुले:'
                  : 'Add the app to your Home Screen to remove the browser address bar:'}
              </p>

              <div
                className="p-3 rounded-xl text-left flex-column gap-2.5 mb-4 text-xs font-medium text-slate-800"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <div className="flex-center-start gap-2">
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    1
                  </span>
                  <span>
                    {currentLang === 'hi'
                      ? 'Chrome में ऊपर दाईं तरफ 3 डॉट्स (⋮) पर क्लिक करें'
                      : 'Tap the 3 dots (⋮) in your Chrome browser'}
                  </span>
                </div>
                <div className="flex-center-start gap-2">
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    2
                  </span>
                  <span>
                    {currentLang === 'hi'
                      ? '"Install app" या "Add to Home screen" चुनें'
                      : 'Select "Install app" or "Add to Home screen"'}
                  </span>
                </div>
                <div className="flex-center-start gap-2">
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#10B981',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    3
                  </span>
                  <span>
                    {currentLang === 'hi'
                      ? 'होम स्क्रीन से VEE खोलें — URL बार हमेशा के लिए गायब!'
                      : 'Open from Home Screen — Zero URL bar forever!'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInstallGuideModal(false)}
                className="btn-primary w-full py-2.5 font-bold text-xs rounded-xl cursor-pointer"
                style={{ background: '#1E3A8A', color: '#FFFFFF', border: 'none' }}
              >
                {currentLang === 'hi' ? 'समझ गया (Close) ✓' : 'Got it ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
