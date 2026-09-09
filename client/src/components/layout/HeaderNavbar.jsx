import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../../contexts/ThemeContext';
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
  Sun,
  Moon,
  Settings
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
  const { theme, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Roommate Finder', path: '/roommates' },
    { label: 'Nearby PGs', path: '/pgs' },
    { label: 'Messages', path: '/messages' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-card)]/80 dark:bg-[#0A0D14]/80 border-b border-[var(--border-light)] backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo with Gradient & Glow */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all duration-200">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-[var(--text-main)] tracking-tight font-heading flex items-center">
            Student<span className="text-gradient-primary">Nest</span>
          </span>
        </Link>

        {/* Center: Main Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-card-subtle)]/60 dark:bg-slate-900/60 border border-[var(--border-light)] backdrop-blur-md">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={idx}
                to={link.path}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 relative',
                  isActive
                    ? 'bg-white dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 shadow-sm border border-slate-200/60 dark:border-orange-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/40 dark:hover:bg-slate-800/40'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl border border-transparent hover:border-[var(--border-light)] transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
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
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-card-subtle)] transition-all border border-transparent hover:border-[var(--border-light)]"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-orange-500/25">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[var(--text-main)] line-clamp-1">{user?.name}</div>
                  <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  <div className="p-3 border-b border-[var(--border-light)] space-y-0.5">
                    <div className="text-xs font-bold text-[var(--text-main)]">{user?.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">{user?.email}</div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Student Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>My Profile &amp; Listings</span>
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Messages &amp; Chats</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[var(--border-light)]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl text-left transition-colors"
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
            className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)] md:hidden border border-transparent hover:border-[var(--border-light)] transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-light)] bg-[var(--bg-card)] p-4 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]"
              >
                {link.label}
              </Link>
            ))}
            
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 mt-2"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
