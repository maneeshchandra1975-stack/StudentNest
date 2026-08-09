import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { KeyRound, ArrowRight, RotateCw, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

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

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1); // Only keep last digit
    setOtpValues(newOtp);

    // Move to next input
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
      toast.error('Session expired. Please register or login again.');
      navigate('/register');
      return;
    }

    try {
      const res = await dispatch(verifyOtp({ email: emailToUse, otp: fullOtp })).unwrap();

      // Launch Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
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
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          We sent a 6-digit OTP code to <br />
          <strong className="text-emerald-400 font-mono">{displayEmail}</strong>
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Input Boxes */}
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
              className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-950/90 border border-slate-800 rounded-xl text-center text-xl font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otpValues.join('').length !== 6}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
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

      {/* Resend OTP Section */}
      <div className="pt-2 text-center text-xs text-slate-400 space-y-2">
        <p>
          Didn't receive the email? Check spam folder or resend.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline disabled:text-slate-600 disabled:no-underline transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {canResend ? 'Resend New OTP' : `Resend OTP in ${timer}s`}
        </button>
      </div>

      <div className="text-center pt-2 text-xs">
        <Link to="/register" className="text-slate-500 hover:text-slate-300 transition-colors">
          ← Wrong email? Register again
        </Link>
      </div>
    </div>
  );
}
