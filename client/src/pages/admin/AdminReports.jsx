import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, updateReportStatus } from '../../redux/slices/adminSlice';
import { Filter, Flag, Loader2, AlertCircle, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const dispatch = useDispatch();
  const { reports, pagination, isLoading, error } = useSelector((state) => state.admin);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    dispatch(fetchReports({ page, status: statusFilter }));
  }, [dispatch, page, statusFilter]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updateStatus) return;

    try {
      await dispatch(updateReportStatus({ 
        id: selectedReport._id, 
        status: updateStatus, 
        adminNote 
      })).unwrap();
      toast.success('Report updated successfully');
      setSelectedReport(null);
    } catch (err) {
      toast.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Pending</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Under Review</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Resolved</span>;
      case 'DISMISSED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Dismissed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading flex items-center gap-2">
            Report Management
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Review and resolve user-submitted reports for trust & safety.
          </p>
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] appearance-none"
          >
            <option value="">All Reports</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && reports.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)]">
            <Flag className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            No reports found.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="sn-card p-5 flex flex-col hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  {report.targetType}
                </span>
                {getStatusBadge(report.status)}
              </div>
              
              <h3 className="font-bold text-[var(--text-main)] text-lg mb-1">{report.reason}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-3 flex-1 mb-4">
                "{report.description || 'No description provided'}"
              </p>
              
              <div className="text-xs text-[var(--text-muted)] space-y-1 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p><span className="font-semibold text-[var(--text-main)]">Reporter:</span> {report.reporter?.name || 'Unknown'}</p>
                <p><span className="font-semibold text-[var(--text-main)]">Date:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
                {report.adminNote && (
                  <p className="text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Note: {report.adminNote}</p>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedReport(report);
                  setUpdateStatus(report.status);
                  setAdminNote(report.adminNote || '');
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Manage Report
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
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

      {/* Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
          <div className="relative bg-[var(--bg-body)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[var(--border-light)]">
            <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-card)]">
              <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
                <Flag className="w-4 h-4 text-emerald-500" /> Update Report
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-[var(--text-muted)] hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="input-field w-full rounded-xl px-3 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">Admin Note (Optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Leave a note for internal auditing..."
                  rows="3"
                  className="input-field w-full rounded-xl px-3 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)] resize-none"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setSelectedReport(null)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[var(--text-main)] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white dark:text-slate-950 bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
