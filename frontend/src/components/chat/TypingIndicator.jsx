import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-3 max-w-[85%] lg:max-w-[75%] mb-6">
      <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex-shrink-0 flex items-center justify-center">
        <span className="text-[var(--color-primary)] font-serif font-bold text-[11px]">SS</span>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-[20px] rounded-bl-[4px] px-5 py-3.5 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-[var(--color-text-hint)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
