import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Briefcase, ArrowRight, Lightbulb } from 'lucide-react';

const StudyHacks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10 pb-12 pt-4">
      {/* Banner */}
      <div className="relative overflow-hidden bg-white border border-[var(--color-border)] rounded-2xl p-10 lg:p-16 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <span className="text-xs font-sans font-bold text-[var(--color-text-secondary)] tracking-widest uppercase">Cognitive Expansion</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 text-[var(--color-primary)]">
            Study Hacks.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg lg:text-xl font-sans leading-relaxed max-w-2xl">
            Accelerate your learning capabilities. Engage in neural training and navigate your career path with advanced AI intelligence.
          </p>
        </div>
        
        <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
          <Lightbulb className="w-64 h-64 text-[var(--color-accent)]" />
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Brain Gym */}
        <div className="group bg-white rounded-2xl p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-14 h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-8">
            <Brain className="w-6 h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-4">Brain Gym</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-10 leading-relaxed flex-grow">Engage in Memory Palace training and other neuroscience-backed exercises to boost your cognitive retention.</p>
          
          <button 
            onClick={() => navigate('/student/neuroscience')}
            className="w-full py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Enter Training <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Career AI */}
        <div className="group bg-white rounded-2xl p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-14 h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-8">
            <Briefcase className="w-6 h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-4">Career AI</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-10 leading-relaxed flex-grow">Consult with specialized AI systems to discover the ideal career trajectory and academic pathways.</p>
          
          <button 
            onClick={() => navigate('/student/career')}
            className="w-full py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Analyze Career <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudyHacks;
