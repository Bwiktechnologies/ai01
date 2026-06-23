import React from 'react';

const QuickChips = ({ onChipClick }) => {
  const chips = [
    "Motivate me 🔥", "Study tips 📚", "I'm stressed 😰", 
    "Set my goal 🎯", "Career advice 💼", "Summarize text 📄", 
    "Memory trick 🧠", "I need help"
  ];

  return (
    <div className="px-4 py-3 flex flex-nowrap overflow-x-auto gap-2 no-scrollbar border-b border-[var(--color-border)]">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onChipClick(chip)}
          className="bg-white border border-[var(--color-border)] rounded-full px-4 py-1.5 text-[13px] font-sans font-medium text-[var(--color-primary)] whitespace-nowrap hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
