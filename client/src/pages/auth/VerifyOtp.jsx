import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { KeyRound, RotateCw, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../../components/ui/InputOTP';

export default function VerifyOtp() {
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
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
      const res = await dispatch(verifyOtp({ email: emailToUse, otp: otpValue })).unwrap();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3F7D5A', '#E27D5F', '#496B8A', '#F5F3EA'],
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
      setOtpValue('');
    } catch (err) {
      toast.error(err || 'Failed to resend OTP.');
    }
  };

  const displayEmail = otpEmail || sessionStorage.getItem('otpEmail') || 'your email';

  return (
    <div className="space-y-8 w-full max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-sm border border-primary/20">
          <KeyRound className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Step 2 of 2: OTP Verification
          </div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-heading">
            Verify Your <span className="text-primary">Email</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
            We sent a 6-digit verification code to <br />
            <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-sm font-bold">
              {displayEmail}
            </span>
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleVerify} className="space-y-8">
        {/* 6 Digit Box Grid Using InputOTP */}
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={setOtpValue}
            containerClassName="gap-2"
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              <InputOTPSlot index={0} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
              <InputOTPSlot index={1} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
              <InputOTPSlot index={2} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
              <InputOTPSlot index={3} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
              <InputOTPSlot index={4} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
              <InputOTPSlot index={5} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-black bg-background/50 border-border/50 shadow-inner rounded-xl ring-primary focus:ring-primary focus-visible:ring-primary" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otpValue.length !== 6}
          className="w-full py-6 rounded-xl font-bold text-sm shadow-sm"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying Code...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify &amp; Activate Account
            </>
          )}
        </Button>
      </form>

      {/* Resend Timer */}
      <div className="pt-4 text-center text-sm text-muted-foreground space-y-3 font-medium">
        <p>Didn't receive the email? Check spam folder or resend.</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline underline-offset-4 disabled:text-muted disabled:no-underline transition-colors cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {canResend ? 'Resend New OTP' : `Resend OTP in ${timer}s`}
        </button>
      </div>

      <div className="text-center pt-2 text-sm font-medium">
        <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
          &larr; Wrong email? Register again
        </Link>
      </div>
    </div>
  );
}
