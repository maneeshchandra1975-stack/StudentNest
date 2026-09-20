import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceListings, deleteMarketplaceListing } from '../../redux/slices/adminSlice';
import { Search, Trash2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-2">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-heading">
          Marketplace Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Monitor and remove inappropriate marketplace listings.
        </p>
      </div>

      <div className="relative max-w-md bg-card/60 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground absolute left-5 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search listings by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-11 pr-4 py-2.5 text-sm bg-background border border-border/50 focus-visible:ring-primary shadow-inner rounded-xl w-full"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4">Listing</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading && listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-muted-foreground font-medium">
                    No listings found.
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50 shadow-inner">
                          {item.images?.length > 0 ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-muted-foreground font-medium">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{item.seller?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.seller?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-success">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.status === 'Available' ? 'success' : item.status === 'Sold' ? 'warning' : 'outline'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/marketplace/${item._id}`} 
                          target="_blank"
                          className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
