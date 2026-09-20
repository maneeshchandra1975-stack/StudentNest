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
import { Input } from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
        return <Badge variant="success">Active</Badge>;
      case 'SUSPENDED':
        return <Badge variant="warning">Suspended</Badge>;
      case 'BANNED':
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-2">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-heading">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Search, filter, and moderate student accounts across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 pr-4 py-2.5 text-sm bg-background border-border/50 focus-visible:ring-primary shadow-inner rounded-xl w-full"
          />
        </div>
        <div className="relative w-full sm:w-56">
          <Filter className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-background border border-border/50 text-foreground appearance-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <Card className="overflow-hidden border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-muted-foreground font-medium">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0 border border-primary/20">
                          {u.avatar ? <img src={u.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            {u.name}
                            {u.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'text-accent' : 'text-muted-foreground'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === u._id ? null : u._id)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {activeDropdown === u._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-6 top-10 w-48 bg-card border border-border shadow-md rounded-xl z-20 py-2 overflow-hidden flex flex-col text-left">
                            {u.status !== 'ACTIVE' && (
                              <button onClick={() => handleStatusChange(u._id, 'ACTIVE')} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors">
                                <PlayCircle className="w-4 h-4 text-success" /> Reactivate
                              </button>
                            )}
                            {u.status !== 'SUSPENDED' && (
                              <button onClick={() => handleStatusChange(u._id, 'SUSPENDED')} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors">
                                <PauseCircle className="w-4 h-4 text-warning" /> Suspend
                              </button>
                            )}
                            {u.status !== 'BANNED' && (
                              <button onClick={() => handleStatusChange(u._id, 'BANNED')} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 font-medium transition-colors">
                                <Ban className="w-4 h-4 text-destructive" /> Ban
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
          <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Showing page {pagination.currentPage} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="outline"
                size="sm"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="h-8 px-3 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
