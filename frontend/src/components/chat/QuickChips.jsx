import React from 'react';

const QuickChips = ({ onChipClick }) => {
  const chips = [
    "Motivate me 🔥", "Study tips 📚", "I'm stressed 😰", 
    "Set my goal 🎯", "Career advice 💼", "Summarize text 📄", 
    "Memory trick 🧠", "I need help"
  ];

  return (
    <div className="px-4 py-2 flex flex-nowrap overflow-x-auto gap-2 no-scrollbar">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onChipClick(chip)}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[20px] px-3 py-1.5 text-[13px] font-inter font-medium text-text-secondary whitespace-nowrap hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all duration-200"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
