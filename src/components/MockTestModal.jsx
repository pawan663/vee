import React, { useState, useEffect } from 'react';
import { X, Clock, Award, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
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

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optIndex
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
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

  // Calculate score
  const correctCount = mock.questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-grabber"></div>
          <div className="flex-between">
            <div>
              <h3 className="sheet-title">{mock.title}</h3>
              <span className="text-xs text-muted">
                {mock.totalQuestions} Questions • {mock.attempts}
              </span>
            </div>
            <div className="flex-center gap-2">
              {!isSubmitted && (
                <div className="timer-badge">
                  <Clock size={14} />
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
        <div className="sheet-body">
          {!isSubmitted ? (
            <div>
              {/* Question Stepper */}
              <div className="flex-between text-xs text-muted mb-2">
                <span>Question {currentQuestionIndex + 1} of {mock.questions.length}</span>
                <span>Marks: +1, -0.25</span>
              </div>

              {/* Question Text */}
              <div className="question-box mb-3">
                <p className="font-semibold text-base">{currentQ.question}</p>
              </div>

              {/* Options */}
              <div className="options-list mb-4">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(idx)}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex-between">
                <button
                  className="btn-secondary-sm"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Previous
                </button>

                {currentQuestionIndex < mock.questions.length - 1 ? (
                  <button
                    className="btn-primary-sm"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  >
                    Agla Sawal <ArrowRight size={14} />
                  </button>
                ) : (
                  <button className="btn-accent" onClick={handleSubmit}>
                    Test Submit Karein
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="score-report text-center">
              <Award size={48} className="text-warning inline mb-2" />
              <h3 className="font-bold text-xl">Test Result Taiyar Hai!</h3>
              <p className="text-muted text-sm mb-3">
                Aapne {mock.questions.length} me se {correctCount} questions sahi kiye.
              </p>

              <div className="score-stat-circle">
                <span className="score-num">{correctCount * 1}</span>
                <span className="score-denom">/ {mock.questions.length} Marks</span>
              </div>

              {/* Detailed Breakdown */}
              <div className="answers-review mt-4 text-left">
                <h4 className="font-bold text-sm mb-2">Answer Key & Explanation:</h4>
                {mock.questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div key={q.id} className="review-card mb-2">
                      <div className="flex-row gap-2">
                        {isCorrect ? (
                          <CheckCircle size={16} className="text-success mt-1" />
                        ) : (
                          <AlertTriangle size={16} className="text-danger mt-1" />
                        )}
                        <div>
                          <p className="text-xs font-semibold">{q.question}</p>
                          <p className="text-xs text-success mt-1">
                            ✅ Sahi Uttar: <b>{q.options[q.correctIndex]}</b>
                          </p>
                          {userAns !== undefined && userAns !== q.correctIndex && (
                            <p className="text-xs text-danger">
                              ❌ Aapka Uttar: {q.options[userAns]}
                            </p>
                          )}
                          <p className="text-xs text-muted mt-1 italic">
                            💡 {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex-center gap-2">
                <button className="btn-secondary" onClick={handleReset}>
                  <RotateCcw size={16} /> Dobara Test Dein
                </button>
                <button className="btn-primary" onClick={onClose}>
                  Done (Close)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
