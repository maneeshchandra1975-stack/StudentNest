import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Store,
  Home,
  Flag,
  Star,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Marketplace', path: '/admin/marketplace', icon: Store },
    { name: 'Housing', path: '/admin/housing', icon: Home },
    { name: 'Reports', path: '/admin/reports', icon: Flag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-body)] flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-card)] border-b border-[var(--border-light)] sticky top-0 z-20">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
          <ShieldCheck className="w-5 h-5" />
          <span>Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[var(--text-main)]">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:pt-0
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-[var(--border-light)] text-emerald-600 dark:text-emerald-400 font-bold text-xl">
          <ShieldCheck className="w-6 h-6" />
          <span>CampusNest Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-[var(--text-main)]'}
                `}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border-light)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-main)]">{user?.name}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Administrator</span>
            </div>
            <button onClick={toggleTheme} className="hidden md:flex p-2 rounded-lg text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw]">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
