import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceListings, deleteMarketplaceListing } from '../../redux/slices/adminSlice';
import { Search, Trash2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminMarketplace() {
  const dispatch = useDispatch();
  const { listings, pagination, isLoading, error } = useSelector((state) => state.admin);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchMarketplaceListings({ page, search }));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [dispatch, page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await dispatch(deleteMarketplaceListing(id)).unwrap();
      toast.success('Listing deleted successfully');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
          Marketplace Moderation
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Monitor and remove inappropriate marketplace listings.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search listings by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)]"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="sn-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[var(--text-muted)] uppercase text-[10px] font-bold tracking-wider border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4">Listing</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {isLoading && listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)]">
                    No listings found.
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {item.images?.length > 0 ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--text-main)]">{item.seller?.name || 'Unknown'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.seller?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        item.status === 'Sold' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/marketplace/${item._id}`} 
                          target="_blank"
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
