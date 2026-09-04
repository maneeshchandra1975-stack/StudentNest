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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-lg font-bold font-heading">
              Report this {targetType === 'MarketplaceItem' ? 'Item' : targetType === 'RoommatePost' ? 'Post' : targetType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Why are you reporting this? <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="sn-input w-full text-sm font-medium"
              required
            >
              <option value="" disabled>Select a reason</option>
              {REPORT_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Additional Details (Optional)
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context to help our admins investigate..."
              className="sn-input w-full text-sm resize-none"
              maxLength={1000}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="danger"
              fullWidth
              disabled={loading || !reason}
              icon={loading ? Loader2 : Flag}
              className={loading ? 'animate-pulse' : ''}
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </Button>
            <p className="text-[10px] text-center text-[var(--text-muted)] mt-3">
              False reports may result in account suspension.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
