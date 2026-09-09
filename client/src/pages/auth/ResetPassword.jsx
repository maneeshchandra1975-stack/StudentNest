import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, KeyRound, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpEmail, isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: otpEmail || sessionStorage.getItem('otpEmail') || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      })).unwrap();

      toast.success(res.message || 'Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err || 'Failed to reset password.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
          <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
          <span>Credential Recovery</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight font-heading">
          Reset <span className="text-gradient-primary">Password</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed font-medium">
          Enter the 6-digit OTP sent to your student email (Gmail) along with your new password.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs shadow-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
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
            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono font-semibold lowercase">
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
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-tight"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* OTP Code */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            6-Digit OTP Code
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 482951"
              maxLength={6}
              {...register('otp', {
                required: 'OTP code is required',
                minLength: { value: 6, message: 'OTP must be 6 digits' },
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-widest text-indigo-600 dark:text-cyan-400 font-bold"
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">{errors.otp.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, 1 uppercase & 1 number"
              {...register('newPassword', {
                required: 'New Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])/,
                  message: 'Must contain 1 uppercase letter & 1 number',
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
          {errors.newPassword && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Re-enter your new password"
              {...register('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match',
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs"
            />
          </div>
          {errors.confirmNewPassword && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs">
        <Link to="/login" className="text-[var(--text-muted)] hover:text-indigo-500 dark:hover:text-indigo-400 font-semibold transition-colors">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
