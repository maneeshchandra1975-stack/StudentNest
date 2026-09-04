import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, setOtpEmail } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, ShieldAlert, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
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
      const res = await dispatch(forgotPassword(data.email)).unwrap();
      dispatch(setOtpEmail(data.email));
      toast.success(res.message || 'Password reset OTP sent to your email!');
      navigate('/reset-password');
    } catch (err) {
      toast.error(err || 'Failed to send reset email.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
          Enter your registered college email and we'll send you a 6-digit OTP to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500 dark:text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-main)] opacity-80 uppercase tracking-wider mb-1.5">
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
              className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-main)] placeholder:text-[var(--input-placeholder)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white dark:text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Reset OTP...</span>
            </>
          ) : (
            <>
              <span>Send Password Reset OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs">
        <Link to="/login" className="text-[var(--text-muted)] hover:text-emerald-600 dark:text-emerald-400 transition-colors">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
