import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const Onboarding = () => {
  const { userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  // Form State
  const [name, setName] = useState(userProfile?.name || '');
  const [ageGroup, setAgeGroup] = useState('');
  const [situation, setSituation] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [customChallenge, setCustomChallenge] = useState('');
  const [goal90Day, setGoal90Day] = useState('');
  const [language, setLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    if (!userProfile?.uid) return;
    
    try {
      setIsSubmitting(true);
      const allChallenges = [...challenges];
      if (customChallenge.trim()) {
        allChallenges.push(customChallenge.trim());
      }
      
      const updateData = {
        name,
        onboardingComplete: true,
        onboardingData: {
          ageGroup,
          situation,
          challenges: allChallenges,
          goal90Day,
          language
        }
      };
      
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, updateData);
      
      // Update local context profile
      setUserProfile({ ...userProfile, ...updateData });
      
      navigate('/student');
    } catch (err) {
      console.error("Error saving onboarding data:", err);
      // Handle error gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleChallenge = (val) => {
    setChallenges(prev => 
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  };

  // --- Step Renders ---
  
  const renderStep1 = () => (
    <div className="flex flex-col items-center">
      <h2 className="text-[28px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
        Arre yaar, welcome! 🎉
      </h2>
      <p className="text-[15px] font-inter text-text-secondary text-center mt-3 mb-8">
        I'm Sajan Shah. Before we begin, tell me a little about yourself.
      </p>
      <input
        type="text"
        className="w-full h-[52px] bg-white border-[1.5px] border-[var(--color-border)] rounded-[10px] px-4 text-[15px] focus:border-[var(--color-accent)] focus:ring-[3px] focus:ring-[var(--color-accent)]/12 outline-none transition-all"
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button 
        className="w-full mt-8 h-[52px]" 
        onClick={nextStep}
        disabled={name.length < 2}
      >
        Let's Go! →
      </Button>
    </div>
  );

  const renderStep2 = () => {
    const options = ["Under 15", "15 — 18", "18 — 25", "25 and above"];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
          How old are you?
        </h2>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => { setAgeGroup(opt); setTimeout(nextStep, 300); }}
              className={`relative px-5 py-4 rounded-[14px] border-2 cursor-pointer text-center text-[16px] font-poppins font-semibold transition-all duration-200
                ${ageGroup === opt 
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                  : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50 hover:bg-orange-50/50'
                }`}
            >
              {opt}
              {ageGroup === opt && (
                <div className="absolute top-2 right-2">
                  <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const options = [
      { id: "School Student", icon: "🎒" },
      { id: "College Student", icon: "🎓" },
      { id: "Working Professional", icon: "💼" },
      { id: "Entrepreneur", icon: "🚀" },
      { id: "Parent", icon: "👨‍👩‍👧" },
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
          What best describes you?
        </h2>
        <div className="flex flex-col gap-2.5 mt-6">
          {options.map(opt => (
            <div 
              key={opt.id}
              onClick={() => { setSituation(opt.id); setTimeout(nextStep, 300); }}
              className={`flex items-center gap-3 px-[18px] py-[14px] rounded-xl border-2 cursor-pointer transition-all duration-200
                ${situation === opt.id 
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                  : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50 hover:bg-orange-50/50'
                }`}
            >
              <span className="text-[20px]">{opt.icon}</span>
              <span className="text-[15px] font-poppins font-semibold">{opt.id}</span>
              {situation === opt.id && (
                <Check className="w-4 h-4 ml-auto text-[var(--color-accent)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const options = [
      "Focus & Concentration", "Exam Stress", "Career Confusion", 
      "Low Confidence", "Phone Addiction", "Parental Pressure", 
      "Time Management", "Self Doubt", "Memory Issues", "Motivation"
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
          What's your biggest struggle right now?
        </h2>
        <p className="text-[14px] text-text-hint text-center mt-2">Select all that apply</p>
        
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {options.map(opt => {
            const isSelected = challenges.includes(opt);
            return (
              <div 
                key={opt}
                onClick={() => toggleChallenge(opt)}
                className={`px-4 py-2 rounded-full border-[1.5px] cursor-pointer text-[14px] transition-all duration-200 font-inter
                  ${isSelected 
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold' 
                    : 'border-[var(--color-border)] text-text-secondary font-medium hover:bg-gray-50'
                  }`}
              >
                {opt}
              </div>
            );
          })}
        </div>
        
        <input
          type="text"
          className="w-full h-[48px] bg-white border-[1.5px] border-[var(--color-border)] rounded-[10px] px-4 mt-4 text-[14px] focus:border-[var(--color-accent)] focus:outline-none"
          placeholder="Anything else? Tell me..."
          value={customChallenge}
          onChange={(e) => setCustomChallenge(e.target.value)}
        />
        
        <Button 
          className="w-full mt-8 h-[52px]" 
          onClick={nextStep}
          disabled={challenges.length === 0 && !customChallenge.trim()}
        >
          Continue
        </Button>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="flex flex-col">
      <h2 className="text-[26px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
        What do you want to achieve in 90 days?
      </h2>
      <p className="text-[15px] text-[var(--color-accent)] italic text-center mt-3 font-medium">
        "Be specific, yaar. Vague goals = vague results. — Sajan Shah"
      </p>
      
      <div className="mt-6 relative">
        <textarea
          className="w-full min-h-[140px] resize-none bg-white border-[1.5px] border-[var(--color-border)] rounded-[10px] p-4 text-[15px] focus:border-[var(--color-accent)] focus:outline-none"
          placeholder="I want to..."
          maxLength={500}
          value={goal90Day}
          onChange={(e) => setGoal90Day(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 text-[12px] font-inter text-text-hint font-medium bg-white px-1">
          {goal90Day.length} / 500
        </div>
      </div>
      
      <p className="text-[12px] text-text-hint italic mt-3 leading-relaxed">
        Example: I want to score 90% in my board exams by improving focus and studying 3 hours daily with zero phone distractions.
      </p>
      
      <Button 
        className="w-full mt-6 h-[52px]" 
        onClick={nextStep}
        disabled={goal90Day.trim().length < 10}
      >
        Almost Done
      </Button>
    </div>
  );

  const renderStep6 = () => {
    const options = [
      { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳', rec: true, sub: 'Hindi + English mixed' },
      { id: 'english', label: 'English Only', flag: '🇬🇧' },
      { id: 'hindi', label: 'Hindi Only', flag: '🇮🇳' },
      { id: 'gujarati', label: 'Gujarati', flag: '🇮🇳' },
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-poppins font-bold text-[var(--color-text-primary)] text-center">
          How should I talk to you?
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          {options.map(opt => (
            <div 
              key={opt.id}
              onClick={() => setLanguage(opt.id)}
              className={`relative p-4 rounded-[14px] border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all duration-200
                ${language === opt.id 
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-orange-50/50'
                }`}
            >
              {opt.rec && (
                <span className="absolute -top-2.5 -right-2 bg-[var(--color-accent)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Recommended
                </span>
              )}
              <span className="text-[24px]">{opt.flag}</span>
              <span className={`text-[15px] font-poppins font-semibold text-center ${language === opt.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                {opt.label}
              </span>
              {opt.sub && (
                <span className="text-[11px] font-inter text-text-hint text-center mt-0.5">
                  {opt.sub}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full mt-8 h-[52px]" 
          onClick={handleFinish}
          disabled={!language || isSubmitting}
          isLoading={isSubmitting}
        >
          Start My Journey 🚀
        </Button>
      </div>
    );
  };

  const stepRenders = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-[var(--color-accent)] transition-all duration-400 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="max-w-[520px] mx-auto min-h-screen flex flex-col pt-12 pb-8 px-6 lg:px-12 relative">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="absolute top-12 left-6 lg:left-12 flex items-center gap-1 text-[14px] font-inter font-medium text-text-hint hover:text-text-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        
        <div className="text-center mb-8 mt-14">
          <span className="text-[12px] font-inter font-bold text-text-hint uppercase tracking-widest">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {stepRenders[step]()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
