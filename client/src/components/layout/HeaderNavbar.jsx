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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/Sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

export default function HeaderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 border-b border-border backdrop-blur-xl transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25 group-hover:scale-105 transition-all duration-200">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center">
            Student<span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* Center: Main Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border backdrop-blur-md">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={idx}
                to={link.path}
                className={cn(
                  'px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 relative',
                  isActive
                    ? 'bg-background text-primary shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
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
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          
          <NotificationDropdown />

          <Button
            variant="default"
            size="sm"
            icon={Plus}
            onClick={() => navigate(isAuthenticated ? '/housing' : '/login')}
            className="hidden sm:inline-flex rounded-full px-4 shadow-sm"
          >
            Post
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-all border border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background">
                  <Avatar className="w-8 h-8 rounded-full border border-border/50 shadow-sm shadow-primary/10">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                      {user?.name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block mr-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="p-2.5">
                  <div className="text-sm font-bold text-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{user?.email}</div>
                  <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Student
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm font-bold text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 dark:text-emerald-500 dark:focus:bg-emerald-500/10">
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="rounded-full">
                Sign In
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/register')} className="rounded-full shadow-sm">
                Register
              </Button>
            </div>
          )}

          {/* Mobile Menu via Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-xl text-muted-foreground hover:bg-muted md:hidden border border-transparent transition-all">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-6 bg-background/95 backdrop-blur-xl border-r-border/50">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-extrabold text-foreground tracking-tight font-heading">
                    Student<span className="text-primary">Nest</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                  return (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" className="w-full justify-center rounded-xl" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                      Sign In
                    </Button>
                    <Button variant="default" className="w-full justify-center rounded-xl" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
