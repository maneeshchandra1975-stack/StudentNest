import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const emailValue = watch('email', '');
  const passwordValue = watch('password', '');

  // Domain Check
  const isVitapEmail = emailValue.endsWith('@vitapstudent.ac.in');

  // Password Requirement Checks
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  // Strength score
  const getStrength = () => {
    let score = 0;
    if (hasMinLength) score += 33;
    if (hasUppercase) score += 33;
    if (hasNumber) score += 34;
    return score;
  };

  const strengthScore = getStrength();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })).unwrap();

      toast.success(res.message || 'OTP sent to your college email!');
      navigate('/verify-otp');
    } catch (err) {
      toast.error(err || 'Registration failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2: Verification</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight font-heading">
          Create Student <span className="text-gradient-primary">Account</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
          Access verified student housing, roommates, and marketplace listings with your university credentials.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Maneesh Chandra"
              {...register('name', {
                required: 'Full Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* College Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              College Email
            </label>
            {isVitapEmail && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Valid Domain
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="yourname@vitapstudent.ac.in"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
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
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])/,
                  message: 'Must include 1 uppercase letter & 1 number',
                },
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

          {/* Password Requirements Checklist */}
          {passwordValue && (
            <div className="mt-2.5 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-light)] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Strength:</span>
                <span className="font-bold text-orange-500">{strengthScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--border-light)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${strengthScore}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className={`flex items-center gap-1 font-semibold ${hasMinLength ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 8+ chars
                </div>
                <div className={`flex items-center gap-1 font-semibold ${hasUppercase ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Uppercase
                </div>
                <div className={`flex items-center gap-1 font-semibold ${hasNumber ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Number
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending OTP to your email...</span>
            </>
          ) : (
            <>
              <span>Create Account &amp; Send OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-[var(--text-muted)] font-medium">
        Already registered?{' '}
        <Link to="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
