import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ error }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Loading your personal mentor...",
    "Preparing your journey...",
    "Almost ready, beta!",
    "Setting things up for you..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-[var(--color-warning)]" />
            <div>
              <p className="text-[14px] font-medium text-[var(--color-text-primary)]">Taking too long to load.</p>
              <p className="text-[13px] text-text-hint mt-1">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 w-full bg-[var(--color-accent)] text-white font-inter font-semibold rounded-xl py-3 shadow-orange hover:bg-[#E55A28] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {/* Pulse rings */}
              <motion.div
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-[var(--color-accent)] rounded-[20px]"
              />
              <motion.div
                animate={{ scale: [1, 1.15], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-0 bg-[var(--color-accent)] rounded-[20px]"
              />
              
              {/* Main logo block */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[80px] h-[80px] rounded-[20px] bg-[var(--color-accent)] flex items-center justify-center z-10"
              >
                <Sparkles className="w-[36px] h-[36px] text-white" />
              </motion.div>
            </div>

            <div className="relative overflow-hidden">
              <h2 className="text-[24px] font-poppins font-bold flex gap-1.5">
                <span className="text-[var(--color-text-primary)]">AI</span>
                <span className="text-[var(--color-accent)]">Sajan Shah</span>
              </h2>
              {/* Shimmer effect overlay could go here */}
            </div>

            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[13px] font-inter italic text-text-hint h-5"
            >
              {messages[messageIndex]}
            </motion.p>

            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-2 rounded-full bg-[var(--color-accent)]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
