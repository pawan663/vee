import React, { useState, useRef } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Share2,
  Plus,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Flame,
  Clock,
  Search,
  Bookmark,
  X,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
  Building,
  Newspaper,
  HelpCircle,
  Wrench,
  Check,
  CornerDownRight
} from 'lucide-react';

export default function CharchaTab({
  posts,
  onUpvote,
  onDownvote,
  onAddPost,
  onAddComment,
  onCommentUpvote,
  onOpenLink,
  onOpenJob,
  onOpenTools,
  jobs = [],
  currentLang = 'en',
  t
}) {
  const [filter, setFilter] = useState('trending'); // 'trending' | 'latest' | 'discussed'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Sarkari' | 'Private' | 'News' | 'Doubt' | 'Saved'
  const [searchQuery, setSearchQuery] = useState('');

  // Local user interactions: bookmarks & vote tracking
  const [savedPostIds, setSavedPostIds] = useState(() => {
    const saved = localStorage.getItem('vee_saved_charcha_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['post-1', 'post-pvt-1'];
  });

  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem('vee_user_post_votes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeThreadPost, setActiveThreadPost] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Create post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Sarkari');
  const [newLink, setNewLink] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Comment input & replying state
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, author }
  const [commentVotes, setCommentVotes] = useState(() => {
    const saved = localStorage.getItem('vee_user_comment_votes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });
  const [commentReactions, setCommentReactions] = useState(() => {
    const saved = localStorage.getItem('vee_comment_reactions_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'c-1': { '🔥': 14, '💡': 8, '❤️': 5 },
      'c-1-rep-1': { '🎯': 22, '👏': 9 },
      'c-3': { '🙌': 18, '🔥': 7, '💯': 11 }
    };
  });
  const [userCommentReactions, setUserCommentReactions] = useState(() => {
    const saved = localStorage.getItem('vee_user_comment_reactions_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });
  const [openReactionTrayCommentId, setOpenReactionTrayCommentId] = useState(null);
  const commentInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dynamic Time Formatter
  const formatTimeAgo = (timeStr) => {
    if (!timeStr) return '';
    if (currentLang === 'en') {
      return timeStr
        .replace(/(\d+)\s*ghante\s*pehle/i, '$1h ago')
        .replace(/(\d+)\s*ghanta\s*pehle/i, '$1h ago')
        .replace(/(\d+)\s*min\s*pehle/i, '$1m ago')
        .replace(/(\d+)\s*din\s*pehle/i, '$1d ago')
        .replace(/Abhi-abhi/i, 'Just now')
        .replace(/Just now/i, 'Just now');
    }
    if (currentLang === 'hi') {
      return timeStr
        .replace(/(\d+)\s*ghante\s*pehle/i, '$1 घंटे पहले')
        .replace(/(\d+)\s*ghanta\s*pehle/i, '$1 घंटा पहले')
        .replace(/(\d+)\s*min\s*pehle/i, '$1 मिनट पहले')
        .replace(/(\d+)\s*din\s*pehle/i, '$1 दिन पहले')
        .replace(/Abhi-abhi/i, 'अभी-अभी')
        .replace(/Just now/i, 'अभी-अभी');
    }
    if (currentLang === 'mr') {
      return timeStr
        .replace(/(\d+)\s*ghante\s*pehle/i, '$1 तासांपूर्वी')
        .replace(/(\d+)\s*ghanta\s*pehle/i, '$1 तासापूर्वी')
        .replace(/(\d+)\s*min\s*pehle/i, '$1 मिनिटांपूर्वी')
        .replace(/(\d+)\s*din\s*pehle/i, '$1 दिवसांपूर्वी')
        .replace(/Abhi-abhi/i, 'आत्ताच')
        .replace(/Just now/i, 'आत्ताच');
    }
    if (currentLang === 'bn') {
      return timeStr
        .replace(/(\d+)\s*ghante\s*pehle/i, '$1 ঘণ্টা আগে')
        .replace(/(\d+)\s*ghanta\s*pehle/i, '$1 ঘণ্টা আগে')
        .replace(/(\d+)\s*min\s*pehle/i, '$1 মিনিট আগে')
        .replace(/(\d+)\s*din\s*pehle/i, '$1 দিন আগে')
        .replace(/Abhi-abhi/i, 'এইমাত্র')
        .replace(/Just now/i, 'এইমাত্র');
    }
    return timeStr;
  };

  // Localized Category Badge
  const getCategoryBadge = (category) => {
    if (category === 'Sarkari') return t.flairSarkari || '🏛️ Govt Jobs';
    if (category === 'Private') return t.flairPrivate || '🏢 Private MNC';
    if (category === 'News') return t.flairNews || '📰 Live News';
    if (category === 'Doubt') return t.flairDoubts || '❓ Doubts & Help';
    return t.flairSarkari || '🏛️ Govt Jobs';
  };

  const handleToggleSavePost = (postId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (savedPostIds.includes(postId)) {
      updated = savedPostIds.filter((id) => id !== postId);
      showToast(currentLang === 'en' ? 'Post removed from saved list.' : 'Post saved list se hata di gayi.');
    } else {
      updated = [...savedPostIds, postId];
      showToast(currentLang === 'en' ? '🔖 Post saved! Check in "Saved" tab.' : '🔖 Post save ho gayi! "Saved" tab me dekhein.');
    }
    setSavedPostIds(updated);
    localStorage.setItem('vee_saved_charcha_posts', JSON.stringify(updated));
  };

  const handleVote = (postId, direction, e) => {
    if (e) e.stopPropagation();
    const current = userVotes[postId];
    const newVotes = { ...userVotes };

    if (current === direction) {
      delete newVotes[postId];
    } else {
      newVotes[postId] = direction;
      if (direction === 'up') onUpvote(postId);
      if (direction === 'down') onDownvote(postId);
    }

    setUserVotes(newVotes);
    localStorage.setItem('vee_user_post_votes', JSON.stringify(newVotes));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost = {
      id: 'post-' + Date.now(),
      author: 'Pawan Meena',
      handle: 'pawan_admin',
      tag: 'Admin Verified',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      timeAgo: 'Just now',
      badge: getCategoryBadge(newCategory),
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      link: newLink.trim(),
      imageUrl: newImageUrl.trim(),
      upvotes: 1,
      downvotes: 0,
      views: 1,
      commentsCount: 0,
      comments: []
    };

    onAddPost(newPost);
    setNewTitle('');
    setNewContent('');
    setNewLink('');
    setNewImageUrl('');
    setIsCreateOpen(false);
    showToast(currentLang === 'en' ? '✅ Post is now live in Charcha!' : '✅ Post Charcha me live ho gayi!');
  };

  const handleStartReply = (comment) => {
    setReplyingTo({ commentId: comment.id, author: comment.author });
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleToggleCommentVote = (postId, commentId, direction, e) => {
    if (e) e.stopPropagation();
    const currentVote = commentVotes[commentId]; // 'up' | 'down' | undefined
    const newVotes = { ...commentVotes };

    let delta = 0;
    if (currentVote === direction) {
      delete newVotes[commentId];
      delta = direction === 'up' ? -1 : 1;
    } else if (currentVote) {
      newVotes[commentId] = direction;
      delta = direction === 'up' ? 2 : -2;
    } else {
      newVotes[commentId] = direction;
      delta = direction === 'up' ? 1 : -1;
    }

    setCommentVotes(newVotes);
    localStorage.setItem('vee_user_comment_votes', JSON.stringify(newVotes));

    if (onCommentUpvote) {
      onCommentUpvote(postId, commentId, delta);
    }

    if (activeThreadPost && activeThreadPost.id === postId) {
      const updateVotesInTree = (list) => {
        return list.map((item) => {
          if (item.id === commentId) {
            return {
              ...item,
              upvotes: (item.upvotes || 0) + delta
            };
          }
          if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: updateVotesInTree(item.replies)
            };
          }
          return item;
        });
      };
      setActiveThreadPost({
        ...activeThreadPost,
        comments: updateVotesInTree(activeThreadPost.comments || [])
      });
    }
  };

  const handleToggleCommentReaction = (commentId, emoji, e) => {
    if (e) e.stopPropagation();
    const currentReactions = { ...(commentReactions[commentId] || {}) };
    const userReactedKey = `${commentId}_${emoji}`;
    const hasReacted = !!userCommentReactions[userReactedKey];

    const newUserReactions = { ...userCommentReactions };
    if (hasReacted) {
      delete newUserReactions[userReactedKey];
      currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
      if (currentReactions[emoji] === 0) delete currentReactions[emoji];
    } else {
      newUserReactions[userReactedKey] = true;
      currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
    }

    const updatedMap = { ...commentReactions, [commentId]: currentReactions };
    setCommentReactions(updatedMap);
    setUserCommentReactions(newUserReactions);
    localStorage.setItem('vee_comment_reactions_v2', JSON.stringify(updatedMap));
    localStorage.setItem('vee_user_comment_reactions_v2', JSON.stringify(newUserReactions));
    setOpenReactionTrayCommentId(null);
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: 'c-' + Date.now(),
      author: currentLang === 'en' ? 'You (Aspirant)' : 'Aap (Aspirant)',
      text: commentText.trim(),
      timeAgo: 'Just now',
      upvotes: 1,
      replyToAuthor: replyingTo ? replyingTo.author : null,
      replies: []
    };

    // Auto upvote by author
    const newVotes = { ...commentVotes, [newComment.id]: true };
    setCommentVotes(newVotes);
    localStorage.setItem('vee_user_comment_votes', JSON.stringify(newVotes));

    onAddComment(postId, newComment, replyingTo ? replyingTo.commentId : null);

    if (activeThreadPost && activeThreadPost.id === postId) {
      let updatedComments;
      if (replyingTo) {
        const insertReply = (list) => {
          return list.map((item) => {
            if (item.id === replyingTo.commentId) {
              return {
                ...item,
                replies: [...(item.replies || []), newComment]
              };
            }
            if (item.replies && item.replies.length > 0) {
              return {
                ...item,
                replies: insertReply(item.replies)
              };
            }
            return item;
          });
        };
        updatedComments = insertReply(activeThreadPost.comments || []);
      } else {
        updatedComments = [newComment, ...(activeThreadPost.comments || [])];
      }

      setActiveThreadPost({
        ...activeThreadPost,
        comments: updatedComments,
        commentsCount: (activeThreadPost.commentsCount || 0) + 1
      });
    }

    setCommentText('');
    const wasReplying = replyingTo;
    setReplyingTo(null);
    showToast(
      wasReplying
        ? (t.replyPosted || 'Reply posted!')
        : (currentLang === 'en' ? '💬 Comment added successfully!' : '💬 Comment post ho gaya!')
    );
  };

  const resolveJob = (jobId) => {
    if (!jobId || !jobs) return null;
    return jobs.find((j) => j.id === jobId);
  };

  // Filter & Search Logic
  const filteredPosts = posts
    .filter((post) => {
      if (categoryFilter === 'Saved') {
        return savedPostIds.includes(post.id);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (post.title || '').toLowerCase().includes(q);
        const matchBody = (post.content || '').toLowerCase().includes(q);
        const matchAuthor = (post.author || '').toLowerCase().includes(q);
        if (!matchTitle && !matchBody && !matchAuthor) return false;
      }

      if (categoryFilter === 'Sarkari' && post.category !== 'Sarkari' && !post.badge.includes('Sarkari')) return false;
      if (categoryFilter === 'Private' && post.category !== 'Private' && !post.badge.includes('Private')) return false;
      if (categoryFilter === 'News' && post.category !== 'News' && !post.badge.includes('News')) return false;
      if (categoryFilter === 'Doubt' && post.category !== 'Doubt' && !post.badge.includes('Doubt') && !post.badge.includes('Sawal')) return false;

      return true;
    })
    .sort((a, b) => {
      if (filter === 'trending') return ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0));
      if (filter === 'discussed') return (b.commentsCount || 0) - (a.commentsCount || 0);
      return 0;
    });

  const getBadgeClass = (category, badge = '') => {
    if (category === 'Sarkari' || badge.includes('Sarkari')) return 'badge-reddit-red';
    if (category === 'Private' || badge.includes('Private')) return 'badge-reddit-green';
    if (category === 'News' || badge.includes('News')) return 'badge-reddit-amber';
    return 'badge-reddit-blue';
  };

  return (
    <div className="charcha-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="in-app-toast-pill flex-center gap-1.5 animate-fade-in">
          <CheckCircle size={14} className="text-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Community Header Card */}
      <div className="charcha-header-card mb-2.5">
        <div className="flex-between">
          <div>
            <h3 className="font-bold text-sm flex-center gap-1">
              💬 {t.charchaTitle} <span className="badge-reddit">FORUM</span>
            </h3>
            <p className="text-3xs text-muted">{t.charchaSubtitle}</p>
          </div>
          <button
            className="btn-primary-sm flex-center gap-1 font-bold"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={14} /> {t.createPostBtn}
          </button>
        </div>

        {/* Search within Charcha */}
        <div className="charcha-search-row mt-2 flex-center-start">
          <Search size={14} className="text-muted ml-2" />
          <input
            type="text"
            placeholder={t.charchaSearchPlaceholder}
            className="charcha-search-input text-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="text-muted mr-2" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Category Flairs Bar (Vibrant & Colorful Community Pills) */}
        <div className="qualification-scroll-bar mt-2 flex-row gap-1.5 no-scrollbar">
          {[
            { id: 'ALL', label: t.flairAll || 'All Posts', flairClass: 'flair-all', icon: '💬' },
            { id: 'Sarkari', label: t.flairSarkari || 'Govt Jobs', flairClass: 'flair-sarkari', icon: '🏛️' },
            { id: 'Private', label: t.flairPrivate || 'Private MNC', flairClass: 'flair-private', icon: '🏢' },
            { id: 'News', label: t.flairNews || 'Live News', flairClass: 'flair-news', icon: '📰' },
            { id: 'Doubt', label: t.flairDoubts || 'Doubts & Help', flairClass: 'flair-doubt', icon: '❓' },
            { id: 'Saved', label: t.flairSaved || 'Saved Posts', flairClass: 'flair-saved', icon: '🔖' }
          ].map((c) => (
            <button
              key={c.id}
              className={`flair-pill ${c.flairClass} text-2xs ${categoryFilter === c.id ? 'active' : ''}`}
              onClick={() => setCategoryFilter(c.id)}
            >
              {c.label && c.label.includes(c.icon) ? c.label : `${c.icon} ${c.label}`}
            </button>
          ))}
        </div>

        {/* Sub-Filters: Trending vs Latest vs Most Discussed */}
        <div className="pill-row mt-2">
          <button
            className={`pill-sm flex-1 flex-center gap-1 ${filter === 'trending' ? 'active' : ''}`}
            onClick={() => setFilter('trending')}
          >
            <Flame size={12} className="text-danger" /> {t.sortTrending}
          </button>
          <button
            className={`pill-sm flex-1 flex-center gap-1 ${filter === 'latest' ? 'active' : ''}`}
            onClick={() => setFilter('latest')}
          >
            <Clock size={12} /> {t.sortLatest}
          </button>
          <button
            className={`pill-sm flex-1 flex-center gap-1 ${filter === 'discussed' ? 'active' : ''}`}
            onClick={() => setFilter('discussed')}
          >
            <MessageSquare size={12} /> {t.sortDiscussed}
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const netScore = (post.upvotes || 0) - (post.downvotes || 0);
            const myVote = userVotes[post.id];
            const isSaved = savedPostIds.includes(post.id);
            const linkedJob = resolveJob(post.jobId);

            return (
              <div
                key={post.id}
                className={`charcha-post-card charcha-card-${(post.category || 'Sarkari').toLowerCase()} mb-3 cursor-pointer`}
                onClick={() => setActiveThreadPost(post)}
              >
                {/* Author Header */}
                <div className="post-author-row flex-between">
                  <div className="flex-center gap-2">
                    <img src={post.avatar} alt={post.author} className="author-avatar" />
                    <div>
                      <div className="flex-center gap-1">
                        <span className="author-name font-semibold text-xs">{post.author}</span>
                        {post.tag === 'Admin Verified' && (
                          <span className="badge-verified flex-center gap-0.5 text-3xs">
                            <ShieldCheck size={11} /> Admin
                          </span>
                        )}
                        {post.tag === 'Industry Verified' && (
                          <span className="badge-verified-sm flex-center gap-0.5 text-3xs">
                            HR Verified
                          </span>
                        )}
                      </div>
                      <span className="post-time text-3xs text-muted">
                        {formatTimeAgo(post.timeAgo)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-center gap-1.5">
                    <span className={`badge-post-tag text-3xs ${getBadgeClass(post.category, post.badge)}`}>
                      {getCategoryBadge(post.category)}
                    </span>
                    <button
                      className={`icon-btn-bookmark ${isSaved ? 'active text-accent' : 'text-muted'}`}
                      onClick={(e) => handleToggleSavePost(post.id, e)}
                      title={isSaved ? "Saved" : "Save Post"}
                    >
                      <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Post Title & Content */}
                <h4 className="post-title font-bold text-xs mt-2 leading-snug">{post.title}</h4>
                <p className="post-body text-xs text-secondary mt-1 leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                {/* Optional Attached Image / Screenshot */}
                {post.imageUrl && (
                  <div className="post-img-wrapper mt-2">
                    <img src={post.imageUrl} alt="Attached" className="post-attached-img rounded" />
                  </div>
                )}

                {/* IN-APP ACTION PILLS */}
                <div className="in-app-action-bar mt-2 flex-column gap-1">
                  {/* If linked to a Job */}
                  {linkedJob && (
                    <button
                      className="in-app-pill-btn job-pill flex-between text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenJob) onOpenJob(linkedJob);
                      }}
                    >
                      <span className="flex-center gap-1 text-2xs font-semibold">
                        {linkedJob.category === 'Private' ? <Building size={13} /> : <Briefcase size={13} />}
                        {linkedJob.title}
                      </span>
                      <span className="pill-badge-action text-3xs font-bold flex-center gap-0.5">
                        {t.openInApp} <ArrowRight size={10} />
                      </span>
                    </button>
                  )}

                  {/* If News or external link */}
                  {post.link && !linkedJob && (
                    <button
                      className="in-app-pill-btn news-pill flex-between text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenLink) {
                          onOpenLink({
                            title: post.title,
                            url: post.link,
                            source: post.newsSource || 'VEE Charcha'
                          });
                        }
                      }}
                    >
                      <span className="flex-center gap-1 text-2xs font-semibold truncate max-w-220">
                        <Newspaper size={13} />
                        {post.newsSource ? `${post.newsSource}` : 'Official Safe Link'}
                      </span>
                      <span className="pill-badge-action text-3xs font-bold flex-center gap-0.5">
                        {t.readInApp} <ArrowRight size={10} />
                      </span>
                    </button>
                  )}

                  {/* If Tool linked */}
                  {post.toolType === 'resizer' && (
                    <button
                      className="in-app-pill-btn tool-pill flex-between text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenTools) onOpenTools();
                      }}
                    >
                      <span className="flex-center gap-1 text-2xs font-semibold">
                        <Wrench size={13} /> {t.photoResizer || 'Photo & Sign Resizer'}
                      </span>
                      <span className="pill-badge-action text-3xs font-bold flex-center gap-0.5">
                        {t.openToolInApp} <ArrowRight size={10} />
                      </span>
                    </button>
                  )}
                </div>

                {/* Post Action Footer: Reddit Style Net Score & Actions */}
                <div className="post-footer-row flex-between mt-2.5 pt-2 border-top">
                  {/* Reddit Tally */}
                  <div className="vote-pill-group" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`vote-btn upvote ${myVote === 'up' ? 'active-up' : ''}`}
                      onClick={(e) => handleVote(post.id, 'up', e)}
                      title="Upvote"
                    >
                      <ThumbsUp size={13} />
                      <span className="vote-count">{netScore}</span>
                    </button>
                    <div className="vote-divider"></div>
                    <button
                      className={`vote-btn downvote ${myVote === 'down' ? 'active-down' : ''}`}
                      onClick={(e) => handleVote(post.id, 'down', e)}
                      title="Downvote"
                    >
                      <ThumbsDown size={13} />
                    </button>
                  </div>

                  {/* Comments Trigger */}
                  <button
                    className="action-icon-pill text-2xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveThreadPost(post);
                    }}
                  >
                    <MessageSquare size={13} />
                    <span>{post.comments ? post.comments.length : post.commentsCount}</span>
                  </button>

                  {/* Real Post Views */}
                  <div className="action-icon-pill text-2xs text-muted">
                    <Eye size={13} />
                    <span>{post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}</span>
                  </div>

                  {/* WhatsApp Share button */}
                  <button
                    className="action-icon-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      const text = `*${post.title}*\n\n${post.content}\n\nVEE App me charcha karein: https://play.google.com/store/apps/details?id=com.vacancyera.vee`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    title={t.shareWhatsApp}
                  >
                    <Share2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state text-center p-4">
            <HelpCircle size={36} className="text-muted inline mb-2" />
            <p className="text-xs text-muted">{t.emptyComments}</p>
            <button
              className="btn-secondary-sm mt-2 text-xs"
              onClick={() => {
                setCategoryFilter('ALL');
                setSearchQuery('');
              }}
            >
              {t.flairAll}
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
         AUTHENTIC REDDIT FULL-PAGE POST & DISCUSSION SCREEN
         ========================================================================= */}
      {activeThreadPost && (
        <div className="reddit-thread-screen">
          {/* Top Reddit App Bar */}
          <div className="reddit-top-bar flex-between">
            <div className="flex-center gap-2">
              <button
                className="icon-btn-back"
                onClick={() => setActiveThreadPost(null)}
                title={t.backToCharcha}
              >
                <ArrowLeft size={18} />
              </button>
              <span className={`badge-post-tag text-3xs ${getBadgeClass(activeThreadPost.category, activeThreadPost.badge)}`}>
                {getCategoryBadge(activeThreadPost.category)}
              </span>
            </div>

            <div className="flex-center gap-1.5">
              <button
                className="icon-btn-bookmark"
                onClick={() => handleToggleSavePost(activeThreadPost.id)}
                title="Save Post"
              >
                <Bookmark
                  size={16}
                  fill={savedPostIds.includes(activeThreadPost.id) ? "currentColor" : "none"}
                  className={savedPostIds.includes(activeThreadPost.id) ? "text-accent" : "text-muted"}
                />
              </button>
              <button
                className="icon-btn-sm"
                onClick={() => {
                  const text = `*${activeThreadPost.title}*\n\nVEE App Charcha par dekhein: https://play.google.com/store/apps/details?id=com.vacancyera.vee`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                title={t.shareWhatsApp}
              >
                <Share2 size={16} />
              </button>
              <button className="icon-btn-sm" onClick={() => setActiveThreadPost(null)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Reddit Scroll Area */}
          <div className="reddit-scroll-viewport p-3.5">
            {/* Post Author Info */}
            <div className="reddit-author-header flex-center-start gap-2 mb-2.5">
              <img src={activeThreadPost.avatar} alt="Author" className="author-avatar-md" />
              <div>
                <div className="flex-center-start gap-1">
                  <span className="font-bold text-xs text-primary">{activeThreadPost.author}</span>
                  {activeThreadPost.tag === 'Admin Verified' && (
                    <span className="badge-verified flex-center gap-0.5 text-3xs">
                      <ShieldCheck size={11} /> MOD
                    </span>
                  )}
                </div>
                <span className="text-3xs text-muted">
                  u/{activeThreadPost.handle || 'aspirant'} • {formatTimeAgo(activeThreadPost.timeAgo)}
                </span>
              </div>
            </div>

            {/* Post Title */}
            <h2 className="reddit-post-title font-bold text-sm text-primary mb-2 leading-snug">
              {activeThreadPost.title}
            </h2>

            {/* Post Full Body Text */}
            <p className="reddit-post-content text-xs text-secondary leading-relaxed mb-3 whitespace-pre-line">
              {activeThreadPost.content}
            </p>

            {/* Optional Screenshot / Image */}
            {activeThreadPost.imageUrl && (
              <div className="mb-3">
                <img src={activeThreadPost.imageUrl} alt="Attached" className="reddit-attached-img rounded" />
              </div>
            )}

            {/* Direct In-App Action Card */}
            {resolveJob(activeThreadPost.jobId) && (
              <button
                className="btn-primary w-full text-xs font-bold py-2.5 mb-3 flex-center gap-1.5 shadow-sm"
                onClick={() => {
                  const j = resolveJob(activeThreadPost.jobId);
                  setActiveThreadPost(null);
                  if (onOpenJob) onOpenJob(j);
                }}
              >
                <Briefcase size={14} /> {t.openInApp}: {resolveJob(activeThreadPost.jobId)?.title}
              </button>
            )}

            {activeThreadPost.link && !resolveJob(activeThreadPost.jobId) && (
              <button
                className="btn-accent-sm w-full text-xs font-bold py-2.5 mb-3 flex-center gap-1.5"
                onClick={() => {
                  const linkItem = {
                    title: activeThreadPost.title,
                    url: activeThreadPost.link,
                    source: activeThreadPost.newsSource || 'VEE In-App'
                  };
                  setActiveThreadPost(null);
                  if (onOpenLink) onOpenLink(linkItem);
                }}
              >
                <Newspaper size={14} /> {t.readInApp}
              </button>
            )}

            {/* Reddit Post Vote & Engagement Bar */}
            <div className="reddit-post-action-bar flex-between py-2 border-top border-bottom mb-3">
              <div className="vote-pill-group">
                <button
                  className={`vote-btn upvote ${userVotes[activeThreadPost.id] === 'up' ? 'active-up' : ''}`}
                  onClick={(e) => handleVote(activeThreadPost.id, 'up', e)}
                >
                  <ThumbsUp size={14} />
                  <span className="vote-count">{(activeThreadPost.upvotes || 0) - (activeThreadPost.downvotes || 0)}</span>
                </button>
                <div className="vote-divider"></div>
                <button
                  className={`vote-btn downvote ${userVotes[activeThreadPost.id] === 'down' ? 'active-down' : ''}`}
                  onClick={(e) => handleVote(activeThreadPost.id, 'down', e)}
                >
                  <ThumbsDown size={14} />
                </button>
              </div>

              <div className="flex-center gap-3 text-xs text-muted">
                <span className="flex-center gap-1">
                  <MessageSquare size={13} /> {activeThreadPost.comments ? activeThreadPost.comments.length : activeThreadPost.commentsCount} {t.commentsCount}
                </span>
                <span className="flex-center gap-1">
                  <Eye size={13} /> {activeThreadPost.views >= 1000 ? `${(activeThreadPost.views / 1000).toFixed(1)}k` : activeThreadPost.views}
                </span>
              </div>
            </div>

            {/* Reddit Thread Comments Header */}
            <div className="reddit-comments-header flex-between mb-2.5">
              <span className="font-bold text-xs text-primary flex-center gap-1.5">
                <MessageSquare size={14} className="text-accent" />
                {t.discussionThread} ({activeThreadPost.comments ? activeThreadPost.comments.length : activeThreadPost.commentsCount})
              </span>
              <span className="text-3xs text-muted font-semibold">
                {t.aspirantsReplies}
              </span>
            </div>

            {/* Reddit Thread Comments List */}
            {(() => {
              const renderCommentNode = (c, isNested = false) => {
                const myVote = commentVotes[c.id]; // 'up' | 'down' | undefined
                const reactions = commentReactions[c.id] || {};
                const isTrayOpen = openReactionTrayCommentId === c.id;
                const isOp = activeThreadPost && activeThreadPost.author && c.author.toLowerCase() === activeThreadPost.author.toLowerCase();

                return (
                  <div key={c.id} className={`reddit-comment-node ${isNested ? 'reddit-nested-child' : ''}`}>
                    <div className="reddit-comment-card p-3">
                      <div className="flex-between">
                        <div className="flex-center gap-1.5 flex-wrap">
                          <span className="font-bold text-2xs text-primary">{c.author}</span>
                          {isOp && (
                            <span className="badge-op-tag text-3xs font-extrabold">OP</span>
                          )}
                          {c.replyToAuthor && (
                            <span className="text-3xs text-muted flex-center gap-0.5">
                              <CornerDownRight size={10} className="text-accent" /> @{c.replyToAuthor}
                            </span>
                          )}
                          {c.author.includes('Pawan') && (
                            <span className="badge-verified flex-center gap-0.5 text-3xs">
                              <ShieldCheck size={9} /> MOD
                            </span>
                          )}
                          <span className="text-3xs text-muted">• 🎓 Aspirant</span>
                        </div>
                        <span className="text-3xs text-muted">{formatTimeAgo(c.timeAgo)}</span>
                      </div>

                      <p className="reddit-comment-body text-xs text-secondary mt-1.5 leading-relaxed whitespace-pre-line">
                        {c.text}
                      </p>

                      {/* Interactive Emoji Reactions Row */}
                      <div className="reddit-emoji-reactions-row flex-center-start gap-1.5 mt-2 flex-wrap">
                        {Object.entries(reactions).map(([emoji, count]) => {
                          const userKey = `${c.id}_${emoji}`;
                          const isReacted = !!userCommentReactions[userKey];
                          return (
                            <button
                              key={emoji}
                              type="button"
                              className={`reddit-reaction-pill ${isReacted ? 'active-reacted' : ''}`}
                              onClick={(e) => handleToggleCommentReaction(c.id, emoji, e)}
                            >
                              <span>{emoji}</span>
                              <span className="reaction-count">{count}</span>
                            </button>
                          );
                        })}

                        {/* Add Reaction Button with Dropdown Tray */}
                        <div className="relative inline-block">
                          <button
                            type="button"
                            className="reddit-add-reaction-btn text-3xs text-muted flex-center gap-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenReactionTrayCommentId(isTrayOpen ? null : c.id);
                            }}
                            title="Add reaction"
                          >
                            <span>+ 😊</span>
                          </button>

                          {/* Reaction Tray Dropdown */}
                          {isTrayOpen && (
                            <div className="reddit-reaction-tray shadow-md flex-center gap-1.5 p-1 rounded">
                              {['🔥', '❤️', '💡', '👏', '🎯', '😂', '💯', '🙏'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  className="reaction-tray-emoji-btn"
                                  onClick={(e) => handleToggleCommentReaction(c.id, emoji, e)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Comment Actions: Reddit Upvote/Downvote & Reply */}
                      <div className="reddit-comment-footer flex-between mt-2 pt-1 border-top">
                        <div className="reddit-comment-karma-pill flex-center gap-1">
                          <button
                            className={`reddit-vote-mini ${myVote === 'up' ? 'active-up' : ''}`}
                            onClick={(e) => handleToggleCommentVote(activeThreadPost.id, c.id, 'up', e)}
                            title="Upvote"
                          >
                            <ThumbsUp size={11} fill={myVote === 'up' ? 'currentColor' : 'none'} />
                          </button>
                          <span className={`karma-mini-score text-3xs font-bold ${myVote === 'up' ? 'text-upvote' : myVote === 'down' ? 'text-downvote' : 'text-muted'}`}>
                            {c.upvotes || 0}
                          </span>
                          <button
                            className={`reddit-vote-mini ${myVote === 'down' ? 'active-down' : ''}`}
                            onClick={(e) => handleToggleCommentVote(activeThreadPost.id, c.id, 'down', e)}
                            title="Downvote"
                          >
                            <ThumbsDown size={11} fill={myVote === 'down' ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <button
                          className="reddit-comment-reply flex-center gap-1 text-3xs text-muted font-semibold hover-text-primary"
                          onClick={() => handleStartReply(c)}
                        >
                          <CornerDownRight size={11} /> {t.reply || 'Reply'}
                        </button>
                      </div>
                    </div>

                    {/* Nested Replies with Reddit Tree Guide Line */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="reddit-tree-children">
                        {c.replies.map((reply) => renderCommentNode(reply, true))}
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div className="reddit-comments-tree space-y-2.5 mb-6">
                  {activeThreadPost.comments && activeThreadPost.comments.length > 0 ? (
                    activeThreadPost.comments.map((c) => renderCommentNode(c, false))
                  ) : (
                    <div className="empty-comments-box p-4 text-center bg-light rounded">
                      <MessageSquare size={28} className="text-muted inline mb-1" />
                      <p className="text-xs text-muted">{t.emptyComments}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Sticky Reddit Comment Input Bar at Bottom */}
          <div className="reddit-bottom-comment-container">
            {replyingTo && (
              <div className="reddit-replying-banner flex-between px-3 py-1.5">
                <div className="flex-center gap-1.5 text-2xs text-accent font-semibold">
                  <CornerDownRight size={13} />
                  <span>{t.replyingTo || 'Replying to'} <strong>@{replyingTo.author}</strong></span>
                </div>
                <button
                  className="icon-btn-cancel-reply text-muted hover-text-primary flex-center gap-1 text-3xs"
                  onClick={handleCancelReply}
                >
                  <span>{t.cancelReply || 'Cancel'}</span>
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Quick Clickable Emojis Strip */}
            <div className="reddit-quick-emoji-strip flex-center-start gap-1 px-2.5 py-1.5 border-top bg-light no-scrollbar overflow-x-auto">
              <span className="text-3xs text-muted font-bold mr-1">Quick:</span>
              {['🔥', '👏', '💯', '👍', '🎯', '📚', '❤️', '🙏', '🚀', '💡', '😂'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="quick-emoji-btn"
                  onClick={() => {
                    setCommentText((prev) => (prev ? `${prev} ${emoji}` : emoji));
                    if (commentInputRef.current) commentInputRef.current.focus();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="reddit-bottom-comment-bar p-2.5 bg-card flex-row gap-2">
              <input
                ref={commentInputRef}
                type="text"
                placeholder={replyingTo ? (t.replyPlaceholder || `Reply to @${replyingTo.author}...`) : t.commentPlaceholder}
                className="reddit-comment-input form-input text-xs flex-1"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(activeThreadPost.id)}
              />
              <button
                className="btn-primary-sm flex-center gap-1 px-3 font-semibold"
                onClick={() => handleCommentSubmit(activeThreadPost.id)}
              >
                <Send size={13} /> {replyingTo ? (t.reply || 'Reply') : t.send}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         CREATE POST MODAL (Fully Localized & Constrained)
         ========================================================================= */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content bottom-sheet post-modal-contained" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grabber"></div>

            <div className="sheet-header flex-between">
              <h3 className="sheet-title font-bold text-sm">{t.newPostTitle}</h3>
              <button className="icon-btn" onClick={() => setIsCreateOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="sheet-body form-scroll-body p-3">
              {/* Category Dropdown */}
              <div className="form-group mb-2">
                <label className="form-label text-xs">{t.categoryFlairLabel}</label>
                <select
                  className="form-select-sm text-xs w-full"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Sarkari">{t.flairSarkari}</option>
                  <option value="Private">{t.flairPrivate}</option>
                  <option value="News">{t.flairNews}</option>
                  <option value="Doubt">{t.flairDoubts}</option>
                </select>
              </div>

              {/* Title */}
              <div className="form-group mb-2">
                <label className="form-label text-xs">{t.postTitleLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={currentLang === 'en' ? "e.g. Maruti Suzuki CW exam pattern & syllabus guide" : "e.g. Maruti Suzuki CW exam pattern kaisa hota hai?"}
                  className="form-input text-xs w-full"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              {/* Content */}
              <div className="form-group mb-2">
                <label className="form-label text-xs">{t.postContentLabel}</label>
                <textarea
                  className="form-textarea text-xs w-full"
                  rows="3"
                  placeholder={currentLang === 'en' ? "Share your query, analysis or job notification details..." : "Apna sawal ya update detail me samjhayein..."}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
              </div>

              {/* Image URL or Screenshot */}
              <div className="form-group mb-2">
                <label className="form-label text-xs">{t.optionalImage}</label>
                <input
                  type="url"
                  placeholder="https://example.com/admit-card.jpg"
                  className="form-input text-xs w-full"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>

              {/* Website Link */}
              <div className="form-group mb-3">
                <label className="form-label text-xs">{t.optionalLink}</label>
                <input
                  type="url"
                  placeholder="https://official-portal.gov.in"
                  className="form-input text-xs w-full"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
              </div>

              {/* Sticky Submit Button */}
              <div className="modal-sticky-footer mt-2 pt-2 border-top">
                <button type="submit" className="btn-primary w-full text-xs font-bold py-2.5">
                  {t.publishPostBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
