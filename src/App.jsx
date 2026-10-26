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
      // 1. First fetch real-time from GitHub raw CDN (updates 0s after GitHub Action runs)
      // 2. Fallback to Netlify local endpoint
      let data = null;
      try {
        const ghRes = await fetch(`https://raw.githubusercontent.com/pawan663/vee/main/public/live_data.json?t=${Date.now()}`);
        if (ghRes.ok) {
          data = await ghRes.json();
        }
      } catch (err) {
        // Fallback to local
      }

      if (!data) {
        const localRes = await fetch(`/live_data.json?t=${Date.now()}`);
        if (localRes.ok) {
          data = await localRes.json();
        }
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
      </div>
    </div>
  );
}
