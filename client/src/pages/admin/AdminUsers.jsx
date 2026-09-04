import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserStatus } from '../../redux/slices/adminSlice';
import {
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  Ban,
  PauseCircle,
  PlayCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, pagination, isLoading, error } = useSelector((state) => state.admin);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchUsers({ page, search, status: statusFilter }));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [dispatch, page, search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateUserStatus({ id, status: newStatus })).unwrap();
      toast.success(`User marked as ${newStatus}`);
      setActiveDropdown(null);
    } catch (err) {
      toast.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Active</span>;
      case 'SUSPENDED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Suspended</span>;
      case 'BANNED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Banned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
            User Management
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Search, filter, and moderate student accounts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)]"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Error / Loading */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="sn-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[var(--text-muted)] uppercase text-[10px] font-bold tracking-wider border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold uppercase shrink-0">
                          {u.avatar ? <img src={u.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] flex items-center gap-1">
                            {u.name}
                            {u.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${u.role === 'admin' ? 'text-purple-500' : 'text-[var(--text-muted)]'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === u._id ? null : u._id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {activeDropdown === u._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-6 top-10 w-48 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl shadow-xl z-20 py-2 overflow-hidden flex flex-col text-left">
                            {u.status !== 'ACTIVE' && (
                              <button onClick={() => handleStatusChange(u._id, 'ACTIVE')} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <PlayCircle className="w-4 h-4 text-emerald-500" /> Reactivate User
                              </button>
                            )}
                            {u.status !== 'SUSPENDED' && (
                              <button onClick={() => handleStatusChange(u._id, 'SUSPENDED')} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <PauseCircle className="w-4 h-4 text-amber-500" /> Suspend User
                              </button>
                            )}
                            {u.status !== 'BANNED' && (
                              <button onClick={() => handleStatusChange(u._id, 'BANNED')} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <Ban className="w-4 h-4 text-red-500" /> Ban User
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-[var(--border-light)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              Showing page {pagination.currentPage} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-light)] text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-light)] text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
