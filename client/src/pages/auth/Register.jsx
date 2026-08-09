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
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight font-heading">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Access verified housing, roommates, and marketplace with your VIT-AP email.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Maneesh Chandra"
              {...register('name', {
                required: 'Full Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-600"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* College Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              College Email
            </label>
            {isVitapEmail && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Valid Domain
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="yourname@vitapstudent.ac.in"
              {...register('email', {
                required: 'College Email is required',
                pattern: {
                  value: /^[^\s@]+@vitapstudent\.ac\.in$/,
                  message: 'Only @vitapstudent.ac.in emails are permitted',
                },
              })}
              className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-600 font-mono text-xs"
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Must end with <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">@vitapstudent.ac.in</code>
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              className="input-field w-full rounded-xl pl-10 pr-10 py-2.5 text-sm placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Requirements Checklist */}
          {passwordValue && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Strength:</span>
                <span className="font-semibold text-emerald-400">{strengthScore}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-teal-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${strengthScore}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 8+ chars
                </div>
                <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Uppercase
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Number
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })}
              className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-600"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
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
      <div className="pt-2 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-400 font-bold hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
