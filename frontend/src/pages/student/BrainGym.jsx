import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Clock, Puzzle, Play, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';

const BrainGym = () => {
  const { userProfile, setUserProfile } = useAuth();
  
  // Game States: 'menu', 'countdown', 'memorize', 'recall', 'success', 'gameover'
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeSquare, setActiveSquare] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [scoreToSave, setScoreToSave] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const gridSize = 9; // 3x3 grid

  const startGame = () => {
    setLevel(1);
    setScoreToSave(0);
    startLevel(1);
  };

  const startLevel = (currentLevel) => {
    setGameState('countdown');
    setCountdown(3);
    setSequence([]);
    setPlayerSequence([]);
    setActiveSquare(null);
  };

  // Handle countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        generateSequence();
      }
    }
  }, [gameState, countdown]);

  const generateSequence = () => {
    const seqLength = level + 2; // Level 1 = 3 items, Level 2 = 4 items, etc.
    const newSequence = [];
    for (let i = 0; i < seqLength; i++) {
      newSequence.push(Math.floor(Math.random() * gridSize));
    }
    setSequence(newSequence);
    setGameState('memorize');
  };

  // Play sequence automatically
  useEffect(() => {
    if (gameState === 'memorize' && sequence.length > 0) {
      let step = 0;
      
      const playStep = () => {
        if (step >= sequence.length) {
          setActiveSquare(null);
          setGameState('recall');
          return;
        }
        
        setActiveSquare(sequence[step]);
        
        setTimeout(() => {
          setActiveSquare(null); // brief pause between squares
          step++;
          setTimeout(playStep, 200);
        }, 600); // 600ms flash duration
      };

      const initialDelay = setTimeout(playStep, 500);
      return () => clearTimeout(initialDelay);
    }
  }, [gameState, sequence]);

  const handleSquareClick = (index) => {
    if (gameState !== 'recall') return;

    // Flash square briefly
    setActiveSquare(index);
    setTimeout(() => setActiveSquare(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check correctness of current step
    const currentStep = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentStep] !== sequence[currentStep]) {
      // Wrong move -> Game Over
      endGame(false);
      return;
    }

    // Check if sequence is fully completed
    if (newPlayerSequence.length === sequence.length) {
      endGame(true);
    }
  };

  const endGame = async (success) => {
    if (success) {
      setGameState('success');
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startLevel(level + 1);
      }, 1500);
    } else {
      setGameState('gameover');
      const xpEarned = (level - 1) * 20; // 20 XP per completed level
      setScoreToSave(xpEarned);
      
      if (xpEarned > 0) {
        saveScore(xpEarned);
      }
    }
  };

  const saveScore = async (xp) => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/braingym/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpGained: xp })
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(prev => ({ ...prev, xp: data.xp, level: data.level }));
      }
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  if (gameState !== 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <div className="w-full max-w-md mx-auto">
          <button onClick={() => setGameState('menu')} className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Gym
          </button>
          
          <div className="rounded-[20px] p-6 lg:p-8 relative overflow-hidden text-center" style={cardStyle}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[14px] font-poppins font-bold" style={{ color: '#8B5CF6' }}>Level {level}</span>
              <span className="text-[12px] font-inter font-medium px-3 py-1 rounded-full" style={{ background: '#1f2937', color: '#fff' }}>
                Memory Palace
              </span>
            </div>

            {gameState === 'countdown' && (
              <div className="h-[280px] flex flex-col items-center justify-center">
                <h3 className="text-[20px] font-inter text-[#9ca3af] mb-4">Get Ready</h3>
                <span className="text-[64px] font-poppins font-bold text-white animate-pulse">{countdown}</span>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall' || gameState === 'success') && (
              <>
                <h3 className="text-[16px] font-inter font-medium mb-6 min-h-[24px]" style={{ color: gameState === 'memorize' ? '#8B5CF6' : (gameState === 'success' ? '#10B981' : '#fff') }}>
                  {gameState === 'memorize' ? 'Memorize the pattern...' : (gameState === 'success' ? 'Perfect! Level Up!' : 'Your turn! Repeat the pattern.')}
                </h3>
                
                <div className="grid grid-cols-3 gap-3 w-[240px] h-[240px] mx-auto">
                  {Array.from({ length: gridSize }).map((_, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSquareClick(idx)}
                      className={`rounded-xl transition-all duration-200 ${gameState === 'recall' ? 'cursor-pointer hover:bg-white/10' : ''}`}
                      style={{ 
                        background: activeSquare === idx 
                          ? (gameState === 'memorize' ? '#8B5CF6' : '#fff') 
                          : '#1f2937',
                        border: '2px solid rgba(255,255,255,0.05)',
                        boxShadow: activeSquare === idx ? '0 0 20px rgba(139,92,246,0.6)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {gameState === 'gameover' && (
              <div className="h-[280px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-[24px] font-poppins font-bold text-white mb-2">Game Over</h3>
                <p className="text-[14px] font-inter text-[#9ca3af] mb-6">You reached Level {level}</p>
                
                <div className="bg-[#1f2937] px-6 py-3 rounded-xl mb-8 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-[16px] font-bold text-white">+{scoreToSave} XP</span>
                </div>

                <div className="flex gap-4 w-full">
                  <button onClick={() => setGameState('menu')} className="flex-1 py-3 rounded-xl font-inter font-semibold bg-[#1f2937] text-white hover:bg-gray-700 transition-colors">
                    Menu
                  </button>
                  <button onClick={startGame} className="flex-1 py-3 rounded-xl font-inter font-semibold text-white transition-colors"
                    style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}>
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial Menu State
  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
        <div>
          <h2 className="text-[24px] font-poppins font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" style={{ color: '#8B5CF6' }} />
            Brain Gym
          </h2>
          <p className="text-[14px] font-inter mt-2 max-w-xl" style={{ color: '#9ca3af' }}>
            Train your cognitive muscles and level up your brain. Play mini-games based on real neuroscience techniques.
          </p>
        </div>
        
        <div className="rounded-xl p-4 flex items-center gap-4 shrink-0"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div>
            <p className="text-[11px] font-inter font-bold uppercase tracking-widest" style={{ color: '#8B5CF6' }}>
              Total XP
            </p>
            <p className="text-[24px] font-poppins font-bold text-white mt-1">
              {userProfile?.xp || 0}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center bg-[#050505]"
            style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6' }}>
            <span className="text-[12px] font-bold" style={{ color: '#8B5CF6' }}>Lvl {userProfile?.level || 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Dynamic Game Card */}
        <div className="rounded-[16px] p-5 flex flex-col h-full transition-all duration-200 relative overflow-hidden group cursor-pointer"
          style={{ ...cardStyle, border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 8px 32px rgba(139,92,246,0.15)' }}
          onClick={startGame}>
          
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] pointer-events-none group-hover:opacity-30 transition-opacity" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]">
              <Puzzle className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-[18px] font-poppins font-bold text-white">Memory Palace</h3>
            <p className="text-[13px] font-inter mt-2 flex-1 text-gray-300">
              Memorize the flashing sequence. The pattern gets longer with every level you conquer.
            </p>
            
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <span className="text-[11px] font-inter font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#8B5CF6]/20 text-[#A78BFA]">
                +XP Earned
              </span>
            </div>
            
            <button className="w-full mt-4 h-11 text-[14px] font-inter font-bold rounded-xl text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] transition-transform group-hover:scale-[1.02]">
              <Play className="w-4 h-4" /> Play Now
            </button>
          </div>
        </div>

        {/* Future Games */}
        {[
          { title: 'Speed Reading Drills', icon: Zap, gradient: 'from-[#f26522] to-[#d4541a]', requiredLevel: 3, requiredXp: 200 },
          { title: 'Focus Sprinter', icon: Clock, gradient: 'from-[#3B82F6] to-[#1D4ED8]', requiredLevel: 5, requiredXp: 400 }
        ].map((game, idx) => {
          const currentLevel = userProfile?.level || 1;
          const isUnlocked = currentLevel >= game.requiredLevel;
          
          return (
            <div key={idx} className={`rounded-[16px] p-5 flex flex-col h-full relative overflow-hidden transition-all ${isUnlocked ? 'opacity-100' : 'opacity-60'}`} style={cardStyle}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${game.gradient}`}>
                <game.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[16px] font-poppins font-semibold text-white">{game.title}</h3>
              <p className="text-[13px] font-inter mt-2 flex-1 text-gray-400">
                {isUnlocked 
                  ? 'You have unlocked this game! The logic is currently in development and will be available soon.'
                  : `Reach Account Level ${game.requiredLevel} (${game.requiredXp} Total XP) to unlock this exercise.`}
              </p>
              <button className={`w-full mt-4 h-10 text-[13px] font-inter font-bold rounded-xl cursor-not-allowed ${isUnlocked ? 'bg-gradient-to-br text-white opacity-80 ' + game.gradient : 'bg-[#1f2937] text-gray-400'}`}>
                {isUnlocked ? 'Coming Soon' : `Unlocks at Account Lvl ${game.requiredLevel}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrainGym;
