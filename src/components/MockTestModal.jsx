import React, { useState, useEffect } from 'react';
import { X, Clock, Award, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MockTestModal({ isOpen, mock, onClose, t }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => (mock?.durationMinutes ? mock.durationMinutes * 60 : 600));

  useEffect(() => {
    if (mock) {
      setTimeLeft((mock.durationMinutes || 10) * 60);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setCurrentQuestionIndex(0);
    }
  }, [mock]);

  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen || !mock) return null;

  const currentQ = mock.questions[currentQuestionIndex];
  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const userChoice = selectedAnswers[currentQuestionIndex];
  const isCurrentCorrect = hasAnswered && userChoice === currentQ.correctIndex;

  const handleSelectOption = (optIndex) => {
    if (isSubmitted || hasAnswered) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optIndex
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft((mock?.durationMinutes || 10) * 60);
  };

  // Detailed statistics
  let correctCount = 0;
  let wrongCount = 0;
  mock.questions.forEach((q, idx) => {
    const ans = selectedAnswers[idx];
    if (ans !== undefined) {
      if (ans === q.correctIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const attemptedCount = correctCount + wrongCount;
  const totalMarks = Math.max(0, (correctCount * 1.0) - (wrongCount * 0.25)).toFixed(2);
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bottom-sheet full-height-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-grabber"></div>
          <div className="flex-between">
            <div>
              <h3 className="sheet-title text-sm font-bold flex-center-start gap-1">
                📝 {mock.title}
              </h3>
              <span className="text-3xs text-muted">
                {mock.totalQuestions} Questions • Live Instant Evaluation
              </span>
            </div>
            <div className="flex-center gap-2">
              {!isSubmitted && (
                <div
                  className="timer-badge flex-center gap-1 font-bold text-2xs px-2 py-1 rounded"
                  style={{
                    background: timeLeft < 120 ? '#FEE2E2' : '#EFF6FF',
                    color: timeLeft < 120 ? '#DC2626' : '#2563EB',
                    border: `1px solid ${timeLeft < 120 ? '#FCA5A5' : '#BFDBFE'}`
                  }}
                >
                  <Clock size={13} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              <button className="icon-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="sheet-body p-3">
          {!isSubmitted ? (
            <div>
              {/* Question Stepper & Real-time Score Counter */}
              <div className="flex-between text-2xs text-muted mb-2.5 pb-2 border-bottom">
                <span className="font-semibold text-primary">
                  Question {currentQuestionIndex + 1} of {mock.questions.length}
                </span>
                <div className="flex-center gap-2 font-bold">
                  <span className="text-success">✅ {correctCount} Sahi</span>
                  <span className="text-danger">❌ {wrongCount} Galat</span>
                  <span className="text-muted">(+1, -0.25)</span>
                </div>
              </div>

              {/* Question Text */}
              <div
                className="question-box mb-3 p-3 rounded-lg"
                style={{
                  background: 'var(--surface-color, #F8FAFC)',
                  border: '1.5px solid var(--border-color, #E2E8F0)'
                }}
              >
                <div className="flex-start gap-2">
                  <span
                    className="badge-pill bg-primary text-white text-3xs font-bold"
                    style={{ padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}
                  >
                    Q{currentQuestionIndex + 1}
                  </span>
                  <p className="font-bold text-xs leading-relaxed" style={{ color: 'var(--text-color, #1E293B)', margin: 0 }}>
                    {currentQ.question}
                  </p>
                </div>
              </div>

              {/* Options List with Instant Green / Red Evaluation */}
              <div className="options-list mb-3 flex-column gap-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userChoice === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let border = '1.5px solid var(--border-color, #E2E8F0)';
                  let background = 'var(--card-bg, #FFFFFF)';
                  let color = 'var(--text-color, #1E293B)';
                  let badgeBg = '#E2E8F0';
                  let badgeColor = '#1E293B';
                  let opacity = 1;

                  if (hasAnswered) {
                    if (isCorrect) {
                      // Correct option always lights up GREEN
                      border = '2px solid #10B981';
                      background = 'rgba(16, 185, 129, 0.12)';
                      color = '#065F46';
                      badgeBg = '#10B981';
                      badgeColor = '#FFFFFF';
                    } else if (isSelected) {
                      // Student's wrong selection lights up RED
                      border = '2px solid #EF4444';
                      background = 'rgba(239, 68, 68, 0.12)';
                      color = '#991B1B';
                      badgeBg = '#EF4444';
                      badgeColor = '#FFFFFF';
                    } else {
                      // Other unchosen options dimmed
                      border = '1px solid #E2E8F0';
                      opacity = 0.6;
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: border,
                        background: background,
                        color: color,
                        opacity: opacity,
                        cursor: hasAnswered ? 'default' : 'pointer',
                        transition: 'all 0.18s ease',
                        textAlign: 'left',
                        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <div className="flex-center-start gap-2.5 flex-1">
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: badgeBg,
                            color: badgeColor,
                            flexShrink: 0
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs font-semibold leading-snug">{opt}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <span
                          className="badge-pill font-bold text-3xs flex-center gap-1"
                          style={{ background: '#10B981', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}
                        >
                          <Check size={12} /> सही उत्तर
                        </span>
                      )}

                      {hasAnswered && isSelected && !isCorrect && (
                        <span
                          className="badge-pill font-bold text-3xs flex-center gap-1"
                          style={{ background: '#EF4444', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}
                        >
                          <X size={12} /> गलत
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Answer Feedback & Explanation Box */}
              {hasAnswered && (
                <div
                  className="instant-explanation-box p-3 rounded-xl mb-3"
                  style={{
                    background: isCurrentCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1.5px solid ${isCurrentCorrect ? '#86EFAC' : '#FCA5A5'}`,
                    animation: 'fadeIn 0.25s ease'
                  }}
                >
                  <div className="flex-between mb-1">
                    <span
                      className="font-bold text-xs flex-center gap-1"
                      style={{ color: isCurrentCorrect ? '#15803D' : '#B91C1C' }}
                    >
                      {isCurrentCorrect ? (
                        <>🎉 बिल्कुल सही उत्तर! (+1 Mark)</>
                      ) : (
                        <>
                          ❌ गलत उत्तर! (-0.25 Mark) • सही उत्तर विकल्प ({String.fromCharCode(65 + currentQ.correctIndex)}) है
                        </>
                      )}
                    </span>
                    <span className="badge-pill text-3xs font-semibold" style={{ background: '#FFFFFF', color: '#475569' }}>
                      Instant Solution
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mt-1 mb-0" style={{ color: '#334155' }}>
                    <b>💡 व्याख्या (Explanation):</b> {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex-between pt-2 border-top">
                <button
                  className="btn-secondary-sm text-xs font-semibold px-3 py-1.5 rounded"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                >
                  ← पिछला सवाल
                </button>

                {currentQuestionIndex < mock.questions.length - 1 ? (
                  <button
                    className="btn-primary-sm text-xs font-bold px-3.5 py-1.5 rounded inline-flex flex-center gap-1"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    style={{ background: '#2563EB', color: '#FFFFFF' }}
                  >
                    अगला सवाल <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    className="btn-accent text-xs font-bold px-4 py-1.5 rounded inline-flex flex-center gap-1"
                    onClick={handleSubmit}
                    style={{ background: '#10B981', color: '#FFFFFF' }}
                  >
                    🏆 टेस्ट सबमिट करें
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="score-report text-center p-2">
              <Award size={48} className="text-warning inline mb-1" />
              <h3 className="font-bold text-lg m-0" style={{ color: 'var(--text-color, #1E293B)' }}>
                टेस्ट रिजल्ट तैयार है! 🎉
              </h3>
              <p className="text-muted text-2xs mt-1 mb-3">
                {mock.title} • All-India Instant Assessment
              </p>

              {/* Scorecard Grid */}
              <div className="scorecard-grid grid grid-cols-4 gap-2 mb-3">
                <div className="stat-card p-2 rounded-lg text-center" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <span className="block text-base font-bold text-primary">{totalMarks}</span>
                  <span className="text-3xs text-muted">कुल प्राप्तांक</span>
                </div>
                <div className="stat-card p-2 rounded-lg text-center" style={{ background: '#ECFDF5', border: '1px solid #86EFAC' }}>
                  <span className="block text-base font-bold text-success">{correctCount}</span>
                  <span className="text-3xs text-muted">सही (+1)</span>
                </div>
                <div className="stat-card p-2 rounded-lg text-center" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                  <span className="block text-base font-bold text-danger">{wrongCount}</span>
                  <span className="text-3xs text-muted">गलत (-0.25)</span>
                </div>
                <div className="stat-card p-2 rounded-lg text-center" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                  <span className="block text-base font-bold text-warning">{accuracy}%</span>
                  <span className="text-3xs text-muted">सटीकता</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="answers-review mt-3 text-left">
                <h4 className="font-bold text-xs mb-2">📋 सभी प्रश्नों का संपूर्ण हिंदी हल व उत्तर कुंजी:</h4>
                <div className="flex-column gap-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {mock.questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctIndex;
                    return (
                      <div
                        key={q.id || idx}
                        className="review-card p-2.5 rounded-lg border"
                        style={{
                          background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : (userAns !== undefined ? 'rgba(239, 68, 68, 0.05)' : 'var(--surface-color, #F8FAFC)'),
                          borderColor: isCorrect ? '#86EFAC' : (userAns !== undefined ? '#FCA5A5' : '#E2E8F0')
                        }}
                      >
                        <div className="flex-start gap-2">
                          {isCorrect ? (
                            <CheckCircle size={15} className="text-success mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle size={15} className="text-danger mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-semibold mb-1">{q.question}</p>
                            <p className="text-3xs text-success m-0">
                              ✅ सही उत्तर: <b>({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}</b>
                            </p>
                            {userAns !== undefined && userAns !== q.correctIndex && (
                              <p className="text-3xs text-danger mt-0.5 m-0">
                                ❌ आपका उत्तर: ({String.fromCharCode(65 + userAns)}) {q.options[userAns]}
                              </p>
                            )}
                            {userAns === undefined && (
                              <p className="text-3xs text-muted mt-0.5 m-0">
                                ⚪ अनुत्तरित (Unattempted)
                              </p>
                            )}
                            <p className="text-3xs text-muted mt-1 mb-0 italic">
                              💡 <b>व्याख्या:</b> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex-center gap-2 pt-2 border-top">
                <button
                  className="btn-secondary-sm text-xs font-semibold px-3 py-1.5 rounded inline-flex flex-center gap-1"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} /> दोबारा टेस्ट दें
                </button>
                <button
                  className="btn-primary-sm text-xs font-bold px-4 py-1.5 rounded"
                  onClick={onClose}
                  style={{ background: '#2563EB', color: '#FFFFFF' }}
                >
                  Done (समाप्त)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
