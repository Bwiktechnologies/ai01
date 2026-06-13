import React, { useState } from 'react';
import { Compass, Briefcase, GraduationCap, TrendingUp, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';

const CareerAI = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { userProfile } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    setResult(null);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/career/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze career path');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Career Analysis Error:", err);
      setError("Oops! Sajan's AI had a brief hiccup. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-white flex items-center gap-2">
          <Compass className="w-6 h-6" style={{ color: '#3B82F6' }} />
          Career AI
        </h2>
        <p className="text-[14px] font-inter mt-2 max-w-2xl" style={{ color: '#9ca3af' }}>
          Discover career paths tailored to your unique strengths. Sajan's AI will map out the steps to get there.
        </p>
      </div>

      <div className="rounded-[20px] p-6 mb-8" style={cardStyle}>
        <h3 className="text-[16px] font-poppins font-semibold text-white mb-4">
          What are your interests or dream jobs?
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
            <input 
              type="text"
              placeholder="e.g., I like coding and design... or I want to be a doctor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              className="w-full h-12 rounded-xl pl-12 pr-4 text-[14px] font-inter transition-colors outline-none"
              style={{ background: '#000000', border: '1px solid #1f2937', color: '#fff' }}
              onFocus={e => e.currentTarget.style.borderColor = '#3B82F6'}
              onBlur={e => e.currentTarget.style.borderColor = '#1f2937'}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="h-12 px-6 rounded-xl font-inter font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}
            onMouseEnter={e => { if(!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isSearching ? 'Analyzing...' : 'Analyze Path'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg flex items-center gap-2 text-[13px] font-inter text-red-400 bg-red-400/10 border border-red-400/20">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>

      {result && (
        <div className="rounded-[20px] p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden" style={cardStyle}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
          
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <h3 className="text-[20px] font-poppins font-bold text-white">
                  {result.title}
                </h3>
              </div>
              <p className="text-[14px] font-inter max-w-2xl leading-relaxed" style={{ color: '#9ca3af' }}>
                {result.description}
              </p>
            </div>
            <div className="rounded-xl p-3 flex flex-col items-center justify-center shrink-0 min-w-[80px]"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <span className="text-[20px] font-poppins font-bold" style={{ color: '#3B82F6' }}>{result.match}%</span>
              <span className="text-[10px] font-inter font-semibold uppercase tracking-wider" style={{ color: '#3B82F6' }}>Match</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 relative z-10" style={{ borderTop: '1px solid #1f2937' }}>
            <div>
              <h4 className="text-[15px] font-poppins font-semibold text-white flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4" style={{ color: '#6b7280' }} />
                Action Steps
              </h4>
              <div className="flex flex-col gap-4">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5"
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                      {idx + 1}
                    </div>
                    <p className="text-[14px] font-inter text-white">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[15px] font-poppins font-semibold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: '#6b7280' }} />
                Key Skills Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill, idx) => (
                  <span key={idx} className="rounded-full px-4 py-1.5 text-[13px] font-inter font-medium"
                    style={{ background: '#1f2937', color: '#d1d5db', border: '1px solid #374151' }}>
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-8 rounded-xl p-4" style={{ background: 'rgba(242,101,34,0.06)', border: '1px solid rgba(242,101,34,0.2)' }}>
                <p className="text-[13px] font-inter italic font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  "Your career is a marathon, not a sprint. Focus on building these skills daily, and the results will follow."
                </p>
                <p className="text-[12px] font-poppins font-bold mt-2" style={{ color: '#f26522' }}>
                  — Sajan Shah
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAI;
