import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, updateReportStatus } from '../../redux/slices/adminSlice';
import { Filter, Flag, Loader2, AlertCircle, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
        return <Badge variant="warning">Pending</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="accent">Under Review</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">Resolved</Badge>;
      case 'DISMISSED':
        return <Badge variant="outline">Dismissed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground font-heading flex items-center gap-3">
            Report Management
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Review and resolve user-submitted reports for trust & safety.
          </p>
        </div>
        <div className="relative w-full sm:w-56 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm p-2">
          <Filter className="w-4 h-4 text-muted-foreground absolute left-5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-background border border-border/50 text-foreground appearance-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && reports.length === 0 ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-card/40 rounded-3xl border border-border/50 border-dashed">
            <Flag className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
            <p className="font-semibold text-base">No reports found.</p>
          </div>
        ) : (
          reports.map((report) => (
            <Card key={report._id} className="p-6 flex flex-col hover:border-primary/40 transition-colors shadow-sm bg-card/60 backdrop-blur-sm h-full group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                  {report.targetType}
                </span>
                {getStatusBadge(report.status)}
              </div>
              
              <h3 className="font-extrabold text-foreground text-lg mb-2 leading-tight group-hover:text-primary transition-colors">{report.reason}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-5 font-medium leading-relaxed">
                "{report.description || 'No description provided'}"
              </p>
              
              <div className="text-xs text-muted-foreground space-y-1.5 mb-5 p-3.5 bg-background border border-border/50 rounded-xl shadow-inner">
                <p><span className="font-bold text-foreground">Reporter:</span> {report.reporter?.name || 'Unknown'}</p>
                <p><span className="font-bold text-foreground">Date:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
                {report.adminNote && (
                  <p className="text-success mt-2 font-bold bg-success/10 p-1.5 rounded">Note: {report.adminNote}</p>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full bg-background mt-auto font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                onClick={() => {
                  setSelectedReport(report);
                  setUpdateStatus(report.status);
                  setAdminNote(report.adminNote || '');
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" /> Manage Report
              </Button>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm mt-6">
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

      {/* Action Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-extrabold font-heading">
              <Flag className="w-5 h-5 text-primary" /> Update Report
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Status</Label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm bg-background border border-border/50 text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Admin Note (Optional)</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Leave a note for internal auditing..."
                rows={4}
                className="resize-none bg-background border-border/50 shadow-inner"
              />
            </div>
            <DialogFooter className="gap-3 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setSelectedReport(null)} className="font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="font-bold">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
