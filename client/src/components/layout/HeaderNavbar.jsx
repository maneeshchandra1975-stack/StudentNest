import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import NotificationDropdown from './NotificationDropdown';
import {
  Building2,
  Home,
  ShoppingBag,
  MessageSquare,
  Users,
  MapPin,
  Bell,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Grid,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

export default function HeaderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Student Hub (Housing, PGs, Roommates & Market)', path: '/housing' },
    { label: 'Messages', path: '/messages' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 border-b border-[#E2E8F0] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-[#111827] tracking-tight font-heading">
            Student<span className="text-[#2563EB]">Nest</span>
          </span>
        </Link>

        {/* Center: Main Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={idx}
                to={link.path}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate(isAuthenticated ? '/housing' : '/login')}
            className="hidden sm:inline-flex"
          >
            Post Listing
          </Button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#111827] line-clamp-1">{user?.name}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">{user?.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono truncate">{user?.email}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Student Dashboard</span>
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>Messages &amp; Chats</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white p-4 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#111827] hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
