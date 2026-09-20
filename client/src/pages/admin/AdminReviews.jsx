import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../../redux/slices/adminSlice';
import { Trash2, Loader2, AlertCircle, Star, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
            className={`w-4 h-4 ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-2">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-heading">
          Review Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Monitor and remove fraudulent or inappropriate user reviews.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading && reviews.length === 0 ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-card/40 rounded-3xl border border-border/50 border-dashed">
            <Star className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
            <p className="font-semibold text-base">No reviews found.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="p-6 flex flex-col relative group border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(review._id)}
                  className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors shadow-sm"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-border/50">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Reviewer</p>
                  <p className="font-extrabold text-foreground truncate">{review.reviewer?.name || 'Unknown'}</p>
                </div>
                <div className="text-muted-foreground/50 text-xl font-light">→</div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Reviewed</p>
                  <p className="font-extrabold text-foreground truncate">{review.reviewee?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                {renderStars(review.rating)}
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="relative">
                <Quote className="w-8 h-8 text-muted-foreground/20 absolute -top-2 -left-2" />
                <p className="text-sm text-muted-foreground leading-relaxed pl-6 italic font-medium">
                  "{review.comment}"
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">
            Page {pagination.currentPage} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 px-4 text-xs font-bold"
            >
              Prev
            </Button>
            <Button 
              variant="outline"
              size="sm"
              disabled={page === pagination.pages}
              onClick={() => setPage(page + 1)}
              className="h-8 px-4 text-xs font-bold"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
