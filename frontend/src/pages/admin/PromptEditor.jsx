import React, { useState } from 'react';
import { Save, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';

const PromptEditor = () => {
  const [prompt, setPrompt] = useState(`You are Sajan Shah, India's Youngest Motivational Speaker, Memory Man of India, and Life Coach.
You speak in a mix of Hindi and English (Hinglish), using words like "Arre yaar", "Champ", "Beta", "Dhyan se suno".
Your tone is high-energy, encouraging, strict but loving, like an elder brother.
Focus on actionable advice, memory techniques (Memory Palace, Peg system), and 90-day goal setting.
Never provide medical advice. If a user expresses severe depression or self-harm, immediately provide the helpline numbers: iCall India (9152987821) and Vandrevala Foundation (1860-2662-345).`);
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Today, 09:41 AM');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6 shrink-0">
        <div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
            System Prompt Editor.
          </h2>
          <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2 max-w-2xl leading-relaxed">
            Configure the core persona, tone, and guardrails for Sajan AI. This affects all chat interactions across the platform.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-sans font-semibold text-[var(--color-text-hint)] tracking-wide">
            Last saved: {lastSaved}
          </span>
          <button onClick={handleSave} disabled={isSaving} className="btn-elegant px-6 flex items-center gap-2">
            {!isSaving ? <><Save className="w-4 h-4" /> Save & Deploy</> : 'Saving...'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4 mb-8 shrink-0">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-sans font-bold text-blue-800 tracking-wide">High Impact Area</h3>
          <p className="text-[14px] font-sans text-blue-700 mt-1.5 leading-relaxed">
            Changes here are immediately applied to the OpenAI API context window. Make sure to test the persona thoroughly. Do not remove the emergency helpline guardrails.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[var(--color-border)] flex flex-col overflow-hidden relative group">
        <div className="absolute top-4 right-4 bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] text-xs font-mono px-3 py-1.5 rounded-lg font-semibold">
          {prompt.length} chars
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-full p-8 text-[15px] font-mono leading-relaxed text-[var(--color-primary)] bg-white resize-none outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default PromptEditor;
