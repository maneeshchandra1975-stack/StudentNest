import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, KeyRound, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
    <div className="space-y-8 w-full max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-sm border border-primary/20">
          <KeyRound className="w-8 h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider mb-4 shadow-sm">
            <span>Credential Recovery</span>
          </div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-heading">
            Reset <span className="text-primary">Password</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed font-medium">
            Enter the 6-digit OTP sent to your student email along with your new password.
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
        {/* Email */}
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
              })}
              className="pl-10 pr-4 py-6 text-sm font-mono tracking-tight bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* OTP Code */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            6-Digit OTP Code
          </Label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="e.g. 482951"
              maxLength={6}
              {...register('otp', {
                required: 'OTP code is required',
                minLength: { value: 6, message: 'OTP must be 6 digits' },
              })}
              className="pl-10 pr-4 py-6 text-sm font-mono tracking-widest text-primary font-bold bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">{errors.otp.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            New Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
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
              className="pl-10 pr-10 py-6 text-sm bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              placeholder="Re-enter your new password"
              {...register('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match',
              })}
              className="pl-10 pr-4 py-6 text-sm bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.confirmNewPassword && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">{errors.confirmNewPassword.message}</p>
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
              Resetting Password...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Password
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
