import React, { useState } from 'react';
import { AlertCircle, ChevronRight, BookOpen, Focus, Shield, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const MentalHealth = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  const moods = [
    { id: 'great',   emoji: '😄', label: 'Great',   borderColor: '#10B981', bgColor: 'rgba(16,185,129,0.08)',  msg: "That's fantastic! Keep this positive energy flowing. Remember what made you feel good today." },
    { id: 'good',    emoji: '🙂', label: 'Good',    borderColor: '#3B82F6', bgColor: 'rgba(59,130,246,0.08)',  msg: "Glad you're doing well. Steady progress is the key to lasting success." },
    { id: 'okay',    emoji: '😐', label: 'Okay',    borderColor: '#9ca3af', bgColor: 'rgba(156,163,175,0.08)', msg: "It's normal to have neutral days. Sajan is here if you want to chat and boost your mood." },
    { id: 'low',     emoji: '😔', label: 'Low',     borderColor: '#8B5CF6', bgColor: 'rgba(139,92,246,0.08)',  msg: "I hear you. It's completely okay to feel low sometimes. Take a deep breath." },
    { id: 'anxious', emoji: '😰', label: 'Anxious', borderColor: '#f26522', bgColor: 'rgba(242,101,34,0.08)',  msg: "Anxiety is tough, but you are tougher. Let's take it one step at a time." },
  ];

  const modules = [
    { id: 1, title: 'Exam Stress',       desc: 'Manage anxiety before exams',     icon: BookOpen,      gradient: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
    { id: 2, title: 'Focus Issues',      desc: 'Beat distractions scientifically', icon: Focus,         gradient: 'linear-gradient(135deg,#10B981,#059669)' },
    { id: 3, title: 'Low Confidence',    desc: 'Build unshakeable self-belief',    icon: Shield,        gradient: 'linear-gradient(135deg,#f26522,#d4541a)' },
    { id: 4, title: 'Parental Pressure', desc: 'Handle expectations with ease',    icon: HeartHandshake, gradient: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
  ];

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">

      {/* Banner */}
      <div className="rounded-[20px] p-6 lg:p-8 relative overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 50%, #0f172a 100%)', border: '1px solid #1f2937' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="relative z-10">
          <h2 className="text-[28px] font-poppins font-bold text-white">Mind Care 🧠</h2>
          <p className="text-[15px] font-inter mt-2 max-w-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
            A safe space for your mental wellness. Taking care of your mind is just as important as studying.
          </p>
          <p className="text-[11px] font-inter mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            * Provides emotional support and AI mentorship, not professional medical advice.
          </p>
        </div>
      </div>

      {/* Mood Check-in */}
      <div className="rounded-[20px] p-6 lg:p-8 text-center mb-6" style={cardStyle}>
        <h3 className="text-[16px] font-poppins font-semibold text-white">How are you feeling today?</h3>
        <div className="flex justify-center gap-3 lg:gap-4 mt-6 flex-wrap">
          {moods.map((mood) => (
            <div key={mood.id} onClick={() => setSelectedMood(mood)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 min-w-[70px]"
              style={{
                border: `2px solid ${selectedMood?.id === mood.id ? mood.borderColor : '#1f2937'}`,
                background: selectedMood?.id === mood.id ? mood.bgColor : 'transparent',
                transform: selectedMood?.id === mood.id ? 'scale(1.05)' : 'scale(1)',
              }}>
              <span className="text-[28px]">{mood.emoji}</span>
              <span className="text-[13px] font-inter font-medium" style={{ color: selectedMood?.id === mood.id ? '#fff' : '#9ca3af' }}>
                {mood.label}
              </span>
            </div>
          ))}
        </div>
        {selectedMood && (
          <div className="mt-6">
            <p className="text-[15px] font-inter font-medium text-white mb-4 max-w-md mx-auto">{selectedMood.msg}</p>
            {['low', 'anxious', 'okay'].includes(selectedMood.id) && (
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => navigate('/student/chat')}
                  className="px-6 py-2.5 rounded-xl font-inter font-bold text-white animated-gradient"
                  style={{ boxShadow: 'var(--shadow-orange)' }}>Talk to Sajan</button>
                {['low', 'anxious'].includes(selectedMood.id) && (
                  <>
                    <button className="px-6 py-2.5 rounded-xl font-inter font-semibold transition-colors"
                      style={{ border: '2px solid #f26522', color: '#f26522', background: 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,101,34,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Breathe with me</button>
                    <button className="px-6 py-2.5 rounded-xl font-inter font-medium transition-colors"
                      style={{ border: '1px solid #1f2937', color: '#9ca3af', background: 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Journal it</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Support Modules */}
      <div className="mb-6">
        <h3 className="text-[18px] font-poppins font-semibold text-white mb-4">Targeted Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {modules.map((mod) => (
            <div key={mod.id} onClick={() => navigate('/student/chat')}
              className="rounded-[16px] p-5 cursor-pointer transition-all duration-200 relative group"
              style={cardStyle}
              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(242,101,34,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1f2937'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-lg" style={{ background: mod.gradient }}>
                <mod.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[15px] font-poppins font-semibold text-white">{mod.title}</h4>
              <p className="text-[13px] font-inter mt-1" style={{ color: '#9ca3af' }}>{mod.desc}</p>
              <div className="absolute bottom-5 right-5 transition-colors" style={{ color: '#374151' }}>
                <ChevronRight className="w-5 h-5 group-hover:text-[#f26522] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="rounded-[20px] p-5 lg:p-6 flex items-start gap-4"
        style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
        <div>
          <h3 className="text-[16px] font-poppins font-bold mb-3" style={{ color: '#EF4444' }}>Need immediate support?</h3>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-inter font-medium text-white">
              iCall India: <a href="tel:9152987821" className="hover:underline" style={{ color: '#3B82F6' }}>9152987821</a>
            </p>
            <p className="text-[14px] font-inter font-medium text-white">
              Vandrevala Foundation: <a href="tel:18602662345" className="hover:underline" style={{ color: '#3B82F6' }}>1860-2662-345</a>
            </p>
          </div>
          <p className="text-[13px] font-inter mt-3" style={{ color: '#6b7280' }}>You are not alone. Real, professional help is available right now.</p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
