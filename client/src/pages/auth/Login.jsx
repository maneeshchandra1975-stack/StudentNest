import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student Portal Access</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight font-heading">
          Welcome Back
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
          Log in with your verified VIT-AP student account to continue.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-start gap-3 text-red-600 dark:text-red-400 text-xs shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] opacity-80 uppercase tracking-wider mb-1.5">
            College Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="yourname@vitapstudent.ac.in"
              {...register('email', {
                required: 'College Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)] font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[var(--text-main)] opacity-80 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" /> Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="input-field w-full rounded-xl pl-10 pr-10 py-2.5 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white dark:text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to CampusNest</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Register now
        </Link>
      </div>
    </div>
  );
}
