import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquareText, Target, Brain, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Student';

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-[var(--color-border)] p-8 lg:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">AI Mentor Online</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 text-[var(--color-primary)]">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg lg:text-xl font-sans leading-relaxed mb-10 max-w-2xl">
            Your personal intelligence matrix is ready. Let's continue accelerating your 90-day goals and cognitive expansion.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              className="btn-elegant"
              onClick={() => navigate('/student/chat')}
            >
              <MessageSquareText className="w-5 h-5 mr-2" />
              Resume AI Session
            </button>
            <button 
              className="px-6 h-[46px] rounded-full border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-[15px] font-sans hover:border-[var(--color-primary)] transition-all flex items-center justify-center bg-white"
              onClick={() => navigate('/student/goals')}
            >
              <Target className="w-5 h-5 mr-2" />
              View Objectives
            </button>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1 */}
        <div className="bg-white p-8 border border-[var(--color-border)] flex flex-col">
          <div className="w-12 h-12 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-3">Active Targets</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-8 leading-relaxed flex-1">2 optimization goals currently in progress. Consistency is generating momentum.</p>
          
          <button 
            onClick={() => navigate('/student/goals')}
            className="w-full py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors"
          >
            Manage Timeline <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 2 */}
        <div className="bg-white p-8 border border-[var(--color-border)] flex flex-col">
          <div className="w-12 h-12 flex items-center justify-center mb-6">
            <Brain className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-3">Neural Training</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-8 leading-relaxed flex-1">Daily cognitive enhancement exercises formulated by your AI.</p>
          
          <button 
            onClick={() => navigate('/student/neuroscience')}
            className="w-full py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors"
          >
            Initiate Sequence <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 3 */}
        <div className="bg-white p-8 border border-[var(--color-border)] flex flex-col">
          <div className="w-12 h-12 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-3">Analytics</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-8 leading-relaxed flex-1">Performance telemetry and progression metrics across all active vectors.</p>
          
          <button 
            onClick={() => navigate('/student/progress')}
            className="w-full py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors"
          >
            Access Telemetry <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
