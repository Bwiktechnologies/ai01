import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Brain, Target, Compass, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, googleLogin, userProfile, isAdmin, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userProfile) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  }, [userProfile, isAdmin, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLocalError('');
      const profile = await login(email, password);
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setLocalError('');
      const profile = await googleLogin();
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT PANEL - Hidden on mobile */}
      <div className="hidden lg:flex w-[45%] bg-[#1A1A2E] p-12 flex-col justify-center relative">
        <div className="max-w-md mx-auto w-full">
          {/* Brand Header */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-12 h-12 rounded-[14px] bg-[var(--color-accent)] flex items-center justify-center shrink-0">
              <Sparkles className="w-[22px] h-[22px] text-white" />
            </div>
            <div className="flex whitespace-nowrap">
              <span className="text-white font-poppins font-bold text-[28px]">AI&nbsp;</span>
              <span className="text-[var(--color-accent)] font-poppins font-bold text-[28px]">Sajan Shah</span>
            </div>
          </div>
          
          <p className="text-[18px] font-inter font-medium text-white/80 mt-3 whitespace-nowrap">
            Your Personal Mentor, Available 24/7
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col gap-3 mt-10">
            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-[#FF6B35]/20 shrink-0 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-poppins font-semibold text-white">Memory Techniques</h4>
                <p className="text-[12px] font-inter text-white/60 mt-0.5">Scientifically-proven study methods</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/20 shrink-0 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-poppins font-semibold text-white">90-Day Goal Setting</h4>
                <p className="text-[12px] font-inter text-white/60 mt-0.5">Structured transformation framework</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-[14px] bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 shrink-0 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-poppins font-semibold text-white">Career Guidance</h4>
                <p className="text-[12px] font-inter text-white/60 mt-0.5">AI-powered path recommendations</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mt-16 pt-10">
            <div>
              <div className="text-white font-bold text-[14px]">15M+ Lives</div>
              <div className="text-white/50 text-[11px] mt-0.5">Transformed</div>
            </div>
            <div className="h-7 w-px bg-white/15"></div>
            <div>
              <div className="text-white font-bold text-[14px]">3x TEDx</div>
              <div className="text-white/50 text-[11px] mt-0.5">Speaker</div>
            </div>
            <div className="h-7 w-px bg-white/15"></div>
            <div>
              <div className="text-white font-bold text-[14px]">14+ Years</div>
              <div className="text-white/50 text-[11px] mt-0.5">Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[55%] bg-white min-h-screen flex items-center justify-center p-6 lg:p-10 relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--color-accent)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-[18px]">AI Sajan Shah</span>
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="text-center mb-9">
            <h2 className="text-[30px] font-poppins font-bold text-[var(--color-text-primary)]">Welcome Back</h2>
            <p className="text-[14px] font-inter text-text-secondary mt-1.5">Sign in to access your AI mentor</p>
          </div>

          {displayError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {displayError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex flex-col">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="mt-5 relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-3.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
                <span className="text-[13px] text-text-secondary">Remember me</span>
              </label>
              <span className="text-[13px] text-[var(--color-accent)] font-medium hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              className="w-full h-[52px] mt-7"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            <span className="text-[11px] font-inter font-semibold text-text-hint tracking-widest uppercase">OR</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full h-[52px] bg-white border-[1.5px] border-[var(--color-border)] rounded-xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span className="text-[15px] font-inter font-semibold text-[var(--color-text-primary)]">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
