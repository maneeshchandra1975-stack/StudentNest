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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-main)] font-heading">
            Leave a Review
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              How was your experience with <span className="font-bold text-[var(--text-main)]">{revieweeName || 'this user'}</span>?
            </p>
            
            <div className="flex items-center justify-center gap-1 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-100 text-slate-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs font-semibold text-yellow-600 pt-1">
                {['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][rating - 1]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Write a comment (optional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what it was like..."
              className="sn-input w-full text-sm resize-none"
              maxLength={1000}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || rating === 0}
              icon={loading ? Loader2 : null}
              className={loading ? 'animate-pulse' : ''}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
