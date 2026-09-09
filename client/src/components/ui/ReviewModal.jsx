import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import Button from './Button';
import { toast } from 'sonner';
import api from '../../services/api';

export default function ReviewModal({ isOpen, onClose, interestRequestId, revieweeName, onReviewSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reviews', {
        interestRequestId,
        rating,
        comment
      });
      toast.success('Review submitted successfully!');
      if (onReviewSuccess) onReviewSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-[var(--bg-card)]/95 border border-[var(--border-light)] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl">
        <div className="p-5 border-b border-[var(--border-light)] flex items-center justify-between">
          <h2 className="text-base font-black font-heading text-[var(--text-main)]">
            Leave a <span className="text-gradient-primary">Review</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              How was your campus transaction experience with <br />
              <span className="font-bold text-[var(--text-main)] text-sm">{revieweeName || 'this student'}</span>?
            </p>
            
            <div className="flex items-center justify-center gap-1.5 pt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'fill-transparent text-[var(--border-light)]'
                    } transition-all`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs font-black text-amber-500 pt-1">
                {['Disappointing', 'Subpar', 'Satisfactory', 'Great Experience', 'Exceptional Peer!'][rating - 1]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Written Feedback (Optional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe punctuality, item condition as described, friendly communication..."
              className="sn-input w-full text-xs resize-none"
              maxLength={1000}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Verified Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
