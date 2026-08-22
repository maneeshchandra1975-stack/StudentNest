import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Clock, ShieldCheck, User, MessageSquare } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { toast } from 'sonner';

export default function InterestRequestsModal({ isOpen, onClose, onSelectChat }) {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([
    {
      id: 'req_1',
      sender: { name: 'Priya Verma', email: 'priya@vitapstudent.ac.in' },
      itemTitle: 'CLRS Introduction to Algorithms',
      type: 'Marketplace',
      status: 'Pending',
      time: '15 mins ago',
    },
    {
      id: 'req_2',
      sender: { name: 'Kavya M.', email: 'kavya@vitapstudent.ac.in' },
      itemTitle: '2BHK Shared Flatmate Vacancy',
      type: 'Roommate',
      status: 'Accepted',
      time: '2 hours ago',
    },
  ]);

  const [sentRequests, setSentRequests] = useState([
    {
      id: 'req_3',
      recipient: { name: 'Suresh Kumar', email: 'suresh@vitapstudent.ac.in' },
      itemTitle: 'Hero Sprint Gear Bicycle',
      type: 'Marketplace',
      status: 'Pending',
      time: '1 hour ago',
    },
  ]);

  if (!isOpen) return null;

  const handleRespond = (id, action) => {
    setReceivedRequests(
      receivedRequests.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
    toast.success(`Request ${action.toLowerCase()} successfully`);
  };

  const handleCancelSent = (id) => {
    setSentRequests(sentRequests.filter((req) => req.id !== id));
    toast.info('Interest request cancelled');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-[#111827] font-heading">
              Interest Requests Manager
            </h3>
            <p className="text-xs text-[#64748B]">
              Accept requests to reserve items and unlock direct messaging.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8F0] bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === 'received'
                ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Received Requests ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === 'sent'
                ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sent Requests ({sentRequests.length})
          </button>
        </div>

        {/* Content Feed */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
          {activeTab === 'received' ? (
            receivedRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No received interest requests.
              </div>
            ) : (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB]">
                          {req.type}
                        </span>
                        <Badge
                          variant={
                            req.status === 'Accepted'
                              ? 'active'
                              : req.status === 'Rejected'
                              ? 'overdue'
                              : 'pending'
                          }
                          label={req.status}
                        />
                      </div>
                      <h4 className="text-xs font-bold text-[#111827]">{req.itemTitle}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{req.time}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                        {req.sender.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#111827] flex items-center gap-1">
                          <span>{req.sender.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.sender.email}</div>
                      </div>
                    </div>

                    {req.status === 'Accepted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => {
                          onClose();
                          if (onSelectChat) onSelectChat(req.sender.name);
                        }}
                      >
                        Chat Now
                      </Button>
                    )}
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        icon={CheckCircle2}
                        onClick={() => handleRespond(req.id, 'Accepted')}
                      >
                        Accept &amp; Unlock Chat
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        icon={XCircle}
                        onClick={() => handleRespond(req.id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )
          ) : sentRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No sent interest requests.
            </div>
          ) : (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB]">
                      {req.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#111827] mt-1">{req.itemTitle}</h4>
                    <div className="text-xs text-slate-500">
                      Seller: <span className="font-bold text-slate-700">{req.recipient.name}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      req.status === 'Accepted'
                        ? 'active'
                        : req.status === 'Rejected'
                        ? 'overdue'
                        : 'pending'
                    }
                    label={req.status}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">{req.time}</span>
                  {req.status === 'Pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleCancelSent(req.id)}
                    >
                      Cancel Interest
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
