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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/25">
          <KeyRound className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
          <span>Password Recovery</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight font-heading">
          Forgot <span className="text-gradient-primary">Password?</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
          Enter your registered student email (Gmail) and we'll send you a 6-digit OTP to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs shadow-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid student email address',
                },
              })}
              className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-tight"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">{errors.email.message}</p>
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
        <Link to="/login" className="text-[var(--text-muted)] hover:text-indigo-500 dark:hover:text-indigo-400 font-semibold transition-colors">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
