import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Brain, Target, Compass, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen flex w-full relative overflow-hidden bg-white">
      {/* LEFT PANEL - Login Form (Previously Right) */}
      <div className="w-full lg:w-[50%] min-h-screen flex items-center justify-center p-6 lg:p-16 relative z-10 bg-white">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <span className="font-serif font-bold text-xl text-[var(--color-primary)] uppercase">AI Sajan Shah</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-3">Welcome Back.</h2>
            <p className="text-[15px] font-sans text-[var(--color-text-secondary)]">Sign in to access your intelligence matrix.</p>
          </div>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm font-sans text-red-600 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">Email Address</label>
              <input
                type="email"
                className="w-full h-12 px-4 border border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none font-sans text-[15px] text-[var(--color-primary)] placeholder-[var(--color-text-hint)]"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-12 px-4 border border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none font-sans text-[15px] text-[var(--color-primary)] placeholder-[var(--color-text-hint)]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[36px] text-[var(--color-text-hint)] hover:text-[var(--color-text-secondary)] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-primary)] transition-colors">
                  <div className="w-2 h-2 bg-transparent"></div>
                </div>
                <span className="text-[14px] font-sans text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[13px] font-sans font-bold text-[var(--color-primary)] hover:text-[var(--color-text-secondary)] transition-colors underline underline-offset-4 decoration-[var(--color-border)]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-elegant w-full justify-center mt-4 h-14 text-[15px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            <span className="text-xs font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Or Access With</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full h-14 bg-white border border-[var(--color-border)] flex items-center justify-center gap-3 hover:bg-[var(--color-bg)] transition-all duration-200 disabled:opacity-50 text-[15px] text-[var(--color-primary)] font-sans font-medium"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            <span>Google Subroutine</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - Elegant Graphic (Previously Left) */}
      <div 
        className="hidden lg:flex w-[50%] p-16 flex-col justify-between relative overflow-hidden border-l border-[var(--color-border)]"
        style={{ backgroundImage: "linear-gradient(rgba(249, 248, 246, 0.8), rgba(249, 248, 246, 0.95)), url('/Graffiti (8ft x 8ft).png')", backgroundSize: 'cover' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
            <h1 className="font-serif font-bold text-3xl text-[var(--color-primary)] tracking-tight">AI Sajan Shah</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <h2 className="text-5xl lg:text-6xl font-serif font-bold text-[var(--color-primary)] leading-[1.1] mb-8">
            A Roadmap to True Potential.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] font-sans leading-relaxed mb-12">
            Optimization is a journey. Connect with AI agents specialized in neuroscience, goals, and career paths.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-accent)] flex items-center justify-center shrink-0 bg-white">
                <Brain className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-[var(--color-primary)]">Cognitive Mastery</h4>
                <p className="text-[14px] text-[var(--color-text-secondary)] font-sans mt-1">Unlock scientifically-proven study and memory techniques.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-accent)] flex items-center justify-center shrink-0 bg-white">
                <Target className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-[var(--color-primary)]">Goal Architect</h4>
                <p className="text-[14px] text-[var(--color-text-secondary)] font-sans mt-1">Structure your ambitions into a 90-day actionable framework.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-16 flex justify-end">
           <p className="font-cursive text-3xl text-[var(--color-primary)] -rotate-2">
             The Sajan Shah Family
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
