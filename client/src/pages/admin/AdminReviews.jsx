import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../redux/slices/adminSlice';
import { Trash2, Loader2, AlertCircle, Star, Quote } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { reviews, pagination, isLoading, error } = useSelector((state) => state.admin);
  
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchReviews({ page }));
  }, [dispatch, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await dispatch(deleteReview(id)).unwrap();
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error(err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
          Review Moderation
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Monitor and remove fraudulent or inappropriate user reviews.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading && reviews.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)]">
            <Star className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            No reviews found.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="sn-card p-5 flex flex-col relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(review._id)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[var(--border-light)]">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Reviewer</p>
                  <p className="font-semibold text-[var(--text-main)] truncate">{review.reviewer?.name || 'Unknown'}</p>
                </div>
                <div className="text-slate-300 dark:text-slate-700">→</div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Reviewed</p>
                  <p className="font-semibold text-[var(--text-main)] truncate">{review.reviewee?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                {renderStars(review.rating)}
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="relative">
                <Quote className="w-6 h-6 text-slate-200 dark:text-slate-800 absolute -top-1 -left-1" />
                <p className="text-sm text-[var(--text-main)] leading-relaxed pl-6 italic">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--text-muted)]">
            Page {pagination.currentPage} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-light)] text-[var(--text-main)] bg-[var(--bg-card)] disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              disabled={page === pagination.pages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-light)] text-[var(--text-main)] bg-[var(--bg-card)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
