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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
          <span>Student Portal Access</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight font-heading">
          Welcome <span className="text-gradient-primary">Back</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed font-medium">
          Log in with your official VIT-AP student email to access campus housing &amp; marketplace listings.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              Student Email (Gmail)
            </label>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-semibold lowercase">
              @vitapstudent.ac.in
            </span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="yourname@vitapstudent.ac.in"
              {...register('email', {
                required: 'Student email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid student email address',
                },
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-tight"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" /> Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="sn-input w-full pl-10 pr-10 py-2.5 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating Student...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to StudentNest</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-[var(--text-muted)] font-medium">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
          Register now
        </Link>
      </div>
    </div>
  );
}
