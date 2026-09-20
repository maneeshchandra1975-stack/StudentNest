import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, setOtpEmail } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, ShieldAlert, Loader2, KeyRound } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
    <div className="space-y-8 w-full max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-sm border border-primary/20">
          <KeyRound className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider mb-4 shadow-sm">
            <span>Password Recovery</span>
          </div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-heading">
            Forgot <span className="text-primary">Password?</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed font-medium">
            Enter your registered student email and we'll send you a 6-digit OTP to reset your password.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <ShieldAlert className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Student Email (Gmail)
            </Label>
            <span className="text-[10px] text-primary font-mono font-semibold lowercase bg-primary/10 px-1.5 py-0.5 rounded">
              @student.ac.in
            </span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="email"
              placeholder="yourname@student.ac.in"
              {...register('email', {
                required: 'Student email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid student email address',
                },
              })}
              className="pl-10 pr-4 py-6 text-sm font-mono tracking-tight bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-6 rounded-xl font-bold text-sm shadow-sm"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Reset OTP...
            </>
          ) : (
            <>
              Send Password Reset OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-4 text-sm font-medium">
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
}
