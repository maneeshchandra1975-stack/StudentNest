import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { KeyRound, RotateCw, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function VerifyOtp() {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpEmail, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit OTP code.');
      return;
    }
    const digits = pastedData.split('');
    setOtpValues(digits);
    inputRefs.current[5].focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP.');
      return;
    }

    const emailToUse = otpEmail || sessionStorage.getItem('otpEmail');
    if (!emailToUse) {
      toast.error('Session expired. Please register again.');
      navigate('/register');
      return;
    }

    try {
      const res = await dispatch(verifyOtp({ email: emailToUse, otp: fullOtp })).unwrap();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
      });

      toast.success(res.message || 'Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err || 'Verification failed. Invalid OTP.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const emailToUse = otpEmail || sessionStorage.getItem('otpEmail');
    if (!emailToUse) {
      toast.error('No email found to resend OTP.');
      return;
    }

    try {
      const res = await dispatch(resendOtp(emailToUse)).unwrap();
      toast.success(res.message || 'New OTP sent to your email.');
      setTimer(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      toast.error(err || 'Failed to resend OTP.');
    }
  };

  const displayEmail = otpEmail || sessionStorage.getItem('otpEmail') || 'your email';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <KeyRound className="w-7 h-7" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Step 2 of 2
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Verify Your Email
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            We sent a 6-digit OTP code to <br />
            <strong className="text-emerald-400 font-mono text-xs">{displayEmail}</strong>
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Box Grid */}
        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otpValues.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 sm:w-13 sm:h-15 bg-slate-950/90 border border-slate-800 rounded-2xl text-center text-2xl font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner font-mono"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otpValues.join('').length !== 6}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify &amp; Activate Account</span>
            </>
          )}
        </button>
      </form>

      {/* Resend Timer */}
      <div className="pt-2 text-center text-xs text-slate-400 space-y-2">
        <p>Didn't receive the email? Check spam folder or resend.</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline disabled:text-slate-600 disabled:no-underline transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {canResend ? 'Resend New OTP' : `Resend OTP in ${timer}s`}
        </button>
      </div>

      <div className="text-center pt-2 text-xs">
        <Link to="/register" className="text-slate-500 hover:text-slate-300 transition-colors">
          &larr; Wrong email? Register again
        </Link>
      </div>
    </div>
  );
}
