import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  Phone,
  MoreVertical,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

const mockConversations = [
  {
    id: 1,
    name: 'Suresh Kumar',
    role: 'PG Owner (Gate 2)',
    lastMessage: 'Yes, the 2BHK room is available for immediate move-in.',
    time: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    role: 'CSE 3rd Year',
    lastMessage: 'Can you sell the CLRS Book for ₹600?',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'Priya K.',
    role: 'ECE 4th Year',
    lastMessage: 'The cycle gear has been serviced recently.',
    time: 'Aug 8',
    unread: 0,
    online: true,
  },
];

export default function Chat() {
  const [activeChat, setActiveChat] = useState(mockConversations[0]);
  const [messages, setMessages] = useState([
    { sender: 'them', text: 'Hello Maneesh! Are you still interested in the 2BHK Shared Apartment near Gate 2?', time: '10:30 AM' },
    { sender: 'me', text: 'Hi Suresh! Yes, what is the monthly rent including maintenance?', time: '10:35 AM' },
    { sender: 'them', text: 'Yes, the 2BHK room is available for immediate move-in at ₹8,500/month all included.', time: '10:42 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { sender: 'me', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInput('');
    toast.success('Message sent');
  };

  return (
    <div className="space-y-4 py-2">
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Verified Student Messaging</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#111827] font-heading">
          Student Messages &amp; Inquiries
        </h1>
      </div>

      {/* 2-Column Chat Box */}
      <div className="sn-card h-[600px] grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-4 border-r border-[#E2E8F0] flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="sn-input pl-9 pr-3 py-1.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {mockConversations.map((conv) => {
              const isActive = activeChat.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveChat(conv)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-50/70 border-l-4 border-[#2563EB]' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                      {conv.name.charAt(0)}
                    </div>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#111827] truncate">{conv.name}</h4>
                      <span className="text-[10px] text-slate-400">{conv.time}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate">{conv.role}</div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Thread */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                {activeChat.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111827] flex items-center gap-1">
                  <span>{activeChat.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </h3>
                <div className="text-[10px] text-[#64748B]">{activeChat.role}</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" icon={Phone} onClick={() => toast.info('Initiating secure audio call...')}>
              Call
            </Button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-[#2563EB] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-[#111827] border border-[#E2E8F0] rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="sn-input flex-1 px-4 py-2 text-xs"
            />
            <Button type="submit" variant="primary" size="sm" icon={Send}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
