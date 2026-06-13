import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 max-w-[85%] lg:max-w-[75%] mb-4">
      <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex-shrink-0 flex items-center justify-center">
        <span className="text-white font-poppins font-bold text-[10px]">SS</span>
      </div>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[18px] rounded-bl-[4px] px-4 py-3.5 shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-[#9CA3AF]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
