import React, { useState } from 'react';
import { Flag, X, Loader2, ShieldAlert } from 'lucide-react';
import Button from './Button';
import { toast } from 'sonner';
import api from '../../services/api';

const REPORT_REASONS = [
  'Scam or Fraud',
  'Fake Information',
  'Inappropriate Content',
  'Harassment or Abusive Behavior',
  'Already Sold / Unavailable',
  'Spam',
  'Other'
];

export default function ReportModal({ isOpen, onClose, targetType, targetId }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reports', {
        targetType,
        targetId,
        reason,
        description
      });
      toast.success('Report submitted successfully to the Trust & Safety team.');
      onClose();
      // Reset form
      setReason('');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl">
        <div className="p-5 border-b border-border flex items-center justify-between bg-destructive/10">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-black font-heading">
              Report this {targetType === 'MarketplaceItem' ? 'Item' : targetType === 'RoommatePost' ? 'Post' : targetType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Reason for Report <span className="text-destructive">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="sn-input w-full text-xs font-medium cursor-pointer"
              required
            >
              <option value="" disabled>Select a reason</option>
              {REPORT_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Additional Details (Optional)
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context to help our admins investigate..."
              className="sn-input w-full text-xs resize-none"
              maxLength={1000}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !reason}
              className="w-full py-3 px-4 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black text-xs shadow-lg shadow-destructive/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  <span>Submit Safety Report</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-3">
              Protected by StudentNest Trust &amp; Safety. False reports may affect campus account standing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
