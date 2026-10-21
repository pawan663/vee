import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReviewModal({ isOpen, onClose, t }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex-between">
          <h3 className="modal-title font-bold flex-center gap-1">
            <Heart size={18} className="text-danger" fill="#EF4444" /> {t.rateApp}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body text-center p-4">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-muted mb-3">
                Aapko VEE App kaisa laga? Aapka feedback hamare liye bohot keemti hai!
              </p>

              {/* Star Rating Selection */}
              <div className="stars-row flex-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn cursor-pointer"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      className={star <= rating ? "text-warning fill-warning" : "text-muted"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-accent mb-3">
                {rating === 5 ? "⭐⭐⭐⭐⭐ Bahut Shandar! 5 Star" : `${rating} Star Rating`}
              </p>

              <textarea
                className="form-textarea w-full text-sm mb-3"
                rows="3"
                placeholder="Aapko kaun sa feature sabse accha laga? (Optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <button type="submit" className="btn-primary w-full">
                Review Submit Karein
              </button>
            </form>
          ) : (
            <div className="review-thankyou py-4">
              <CheckCircle2 size={42} className="text-success inline mb-2" />
              <h4 className="font-bold text-lg">Thank You So Much!</h4>
              <p className="text-xs text-muted mt-1">
                Aapka review record kar liya gaya hai. VEE par vishwas karne ke liye shukriya!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
