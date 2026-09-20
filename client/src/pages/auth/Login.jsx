import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Alert, AlertDescription } from '../../components/ui/Alert';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await dispatch(loginUser(data)).unwrap();
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-8 w-full max-w-md mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs font-bold text-success uppercase tracking-wider mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student Portal Access</span>
        </div>
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-heading">
          Welcome <span className="text-primary">Back</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">
          Log in with your official university email to access campus housing &amp; marketplace listings.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid student email address',
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
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" /> Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
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
          {errors.password && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-6 rounded-xl font-bold text-sm shadow-sm"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Authenticating Student...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to CampusNest
            </>
          )}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="pt-4 text-center text-sm text-muted-foreground font-medium">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">
          Register now
        </Link>
      </div>
    </div>
  );
}
