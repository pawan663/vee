import React, { useState, useMemo } from 'react';
import { BookOpen, Award, Star, ShoppingBag, Clock, Users, ArrowRight, ExternalLink, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export default function BooksTab({ books = [], mocks = [], onStartMock, t }) {
  const [subTab, setSubTab] = useState('books'); // 'books' | 'mocks'
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'सभी पुस्तकें' },
    { id: 'Current Affairs 2026', label: '🔥 करेंट अफेयर्स 2026' },
    { id: 'General Knowledge (GK/GS)', label: '🏛️ सामान्य ज्ञान (GK/GS)' },
    { id: 'Technical / ITI', label: '🛠️ ITI व टेक्निकल' },
    { id: 'Railways', label: '🚆 रेलवे स्पेशल' },
    { id: 'Math & Aptitude', label: '📐 गणित व रीजनिंग' }
  ];

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'ALL') return books;
    return books.filter((b) => b.category === selectedCategory);
  }, [books, selectedCategory]);

  return (
    <div className="books-tab-container">
      {/* Sub Tabs Pill Row */}
      <div className="pill-row mb-3">
        <button
          className={`pill-btn flex-1 ${subTab === 'books' ? 'active' : ''}`}
          onClick={() => setSubTab('books')}
        >
          <BookOpen size={15} /> 📚 Best Books (Amazon & Flipkart)
        </button>
        <button
          className={`pill-btn flex-1 ${subTab === 'mocks' ? 'active' : ''}`}
          onClick={() => setSubTab('mocks')}
        >
          <Award size={15} /> 📝 100% Free Mock Tests ({mocks.length})
        </button>
      </div>

      {subTab === 'books' ? (
        <div className="books-grid">
          {/* Top Banner */}
          <div className="store-banner-card mb-3 p-3" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #93C5FD', borderRadius: '12px' }}>
            <div className="flex-between">
              <div>
                <h4 className="font-bold text-xs flex-center-start gap-1" style={{ color: '#1D4ED8' }}>
                  <Sparkles size={14} className="text-warning" /> टॉप-रेटेड प्रतियोगी पुस्तकें (Amazon & Flipkart)
                </h4>
                <p className="text-3xs text-muted mt-0.5">
                  स्पीड, ल्यूसेंट, एडुटिरिया, पिनेकल और आर.एस. अग्रवाल की सबसे प्रामाणिक किताबें व फ्री सैंपल
                </p>
              </div>
              <span className="badge-pill bg-primary text-white text-3xs font-bold" style={{ padding: '3px 7px' }}>
                {books.length} Books
              </span>
            </div>
          </div>

          {/* Category Filter Scroll */}
          <div className="qualification-scroll-bar mb-3 flex-row gap-1.5 no-scrollbar" style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`qual-pill-btn text-3xs ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontWeight: selectedCategory === cat.id ? 'bold' : '600',
                  background: selectedCategory === cat.id ? '#1E3A8A' : 'var(--bg-card)',
                  color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Books Cards List */}
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card mb-3 card-styled p-3" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="flex-row gap-3">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="book-cover-img"
                  style={{ width: '85px', height: '115px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1', flexShrink: 0 }}
                />
                <div className="book-info flex-1">
                  <div className="flex-between">
                    <span className="badge-category text-3xs font-semibold" style={{ color: '#4F46E5', background: 'rgba(79, 70, 229, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {book.category}
                    </span>
                    {book.badge && (
                      <span className="badge-pill text-3xs font-bold" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '1px 5px', borderRadius: '4px' }}>
                        {book.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="book-title font-bold text-xs mt-1.5 leading-snug">{book.title}</h4>
                  <p className="text-3xs text-muted mt-0.5">लेखक / पब्लिशर: {book.author}</p>

                  <div className="flex-center-start gap-1 mt-1 text-2xs">
                    <Star size={11} className="text-warning fill-warning" />
                    <span className="font-bold">{book.rating}</span>
                    <span className="text-3xs text-muted">({book.reviewsCount?.toLocaleString()} रेटिंग्स)</span>
                  </div>

                  {/* Price & Discount */}
                  {book.price && (
                    <div className="flex-center-start gap-2 mt-1.5">
                      <span className="font-extrabold text-sm text-success">{book.price}</span>
                      {book.originalPrice && (
                        <span className="text-3xs text-muted" style={{ textDecoration: 'line-through' }}>{book.originalPrice}</span>
                      )}
                      {book.discount && (
                        <span className="text-3xs font-bold text-danger bg-danger-light" style={{ padding: '1px 4px', borderRadius: '3px' }}>
                          {book.discount}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-3xs text-muted mt-1 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Buy on Amazon, Flipkart & Free Sample Buttons */}
                  <div className="mt-2.5 pt-2 border-top flex-row gap-1.5 flex-wrap">
                    {book.amazonUrl && (
                      <a
                        href={book.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent-xs inline-flex flex-center gap-1 font-bold text-3xs"
                        style={{ background: '#FF9900', color: '#111111', border: 'none', padding: '4px 8px', borderRadius: '6px' }}
                      >
                        🛒 Amazon पर देखें <ExternalLink size={10} />
                      </a>
                    )}
                    {book.flipkartUrl && (
                      <a
                        href={book.flipkartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent-xs inline-flex flex-center gap-1 font-bold text-3xs"
                        style={{ background: '#2874F0', color: '#FFFFFF', border: 'none', padding: '4px 8px', borderRadius: '6px' }}
                      >
                        🛍️ Flipkart पर देखें <ExternalLink size={10} />
                      </a>
                    )}
                    {book.readUrl && (
                      <a
                        href={book.readUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary-xs inline-flex flex-center gap-1 font-semibold text-3xs"
                        style={{ padding: '4px 8px', borderRadius: '6px' }}
                      >
                        📖 Free Sample / PDF <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mocks-grid">
          {/* Mocks Banner */}
          <div className="store-banner-card mb-3 p-3" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid #86EFAC', borderRadius: '12px' }}>
            <div className="flex-between">
              <div>
                <h4 className="font-bold text-xs text-success flex-center-start gap-1">
                  🏆 100% Free All-India Live Mock Tests
                </h4>
                <p className="text-3xs text-muted mt-0.5">
                  असली परीक्षा पैटर्न पर 10-प्रश्नों के लाइव मॉक टेस्ट। टाइमर, स्कोरकार्ड व संपूर्ण हिंदी हल।
                </p>
              </div>
              <span className="badge-pill bg-success text-white text-3xs font-bold" style={{ padding: '3px 7px' }}>
                100% FREE
              </span>
            </div>
          </div>

          {mocks.map((mock) => (
            <div key={mock.id} className="mock-card mb-3 p-3 card-styled" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="flex-between">
                <span className="badge-pill text-3xs font-bold" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '2px 6px', borderRadius: '4px' }}>
                  🟢 LIVE FREE TEST
                </span>
                <span className="text-3xs font-semibold text-warning">
                  ⭐ {mock.difficulty}
                </span>
              </div>

              <h4 className="mock-title font-bold text-xs mt-2 leading-snug">{mock.title}</h4>

              <div className="flex-row gap-3 mt-2 text-3xs text-muted">
                <span className="flex-center gap-1">
                  <Clock size={12} className="text-primary" /> {mock.durationMinutes} मिनट
                </span>
                <span className="flex-center gap-1">
                  <BookOpen size={12} className="text-accent" /> {mock.totalQuestions} प्रश्न
                </span>
                <span className="flex-center gap-1">
                  <Users size={12} className="text-success" /> {mock.attempts}
                </span>
              </div>

              <div className="mt-3">
                <button
                  className="btn-primary w-full flex-center gap-1 text-xs font-bold"
                  style={{ padding: '8px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                  onClick={() => onStartMock(mock)}
                >
                  🚀 Free Test Start Karein <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
