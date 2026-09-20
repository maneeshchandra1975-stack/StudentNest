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
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Alert, AlertDescription } from '../../components/ui/Alert';

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
  const isStudentEmail = emailValue.endsWith('@student.ac.in');

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
    <div className="space-y-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2: Verification</span>
        </div>
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-heading">
          Create Student <span className="text-primary">Account</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">
          Access verified student housing, roommates, and marketplace listings with your university credentials.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-semibold text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Full Name
          </Label>
          <div className="relative">
            <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="e.g. John Doe"
              {...register('name', {
                required: 'Full Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className="pl-10 pr-4 py-6 text-sm bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* College Email */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              College Email
            </Label>
            {isStudentEmail && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                <CheckCircle2 className="w-3 h-3" /> Valid Domain
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="email"
              placeholder="yourname@student.ac.in"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="pl-10 pr-4 py-6 text-sm font-mono tracking-tight bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
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

          {/* Password Requirements Checklist */}
          {passwordValue && (
            <div className="mt-2 p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Strength:</span>
                <span className="font-bold text-primary">{strengthScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${strengthScore}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className={`flex items-center gap-1 font-bold ${hasMinLength ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 8+ chars
                </div>
                <div className={`flex items-center gap-1 font-bold ${hasUppercase ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Uppercase
                </div>
                <div className={`flex items-center gap-1 font-bold ${hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className="w-3 h-3" /> 1 Number
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })}
              className="pl-10 pr-4 py-6 text-sm bg-background/50 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit CTA Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-6 rounded-xl font-bold text-sm shadow-sm"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending OTP to your email...
            </>
          ) : (
            <>
              Create Account &amp; Send OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 text-center text-sm text-muted-foreground font-medium">
        Already registered?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
