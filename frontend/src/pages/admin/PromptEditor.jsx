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
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
        <div>
          <h2 className="text-[24px] font-poppins font-bold text-[#1A1A2E] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
            System Prompt Editor
          </h2>
          <p className="text-[14px] font-inter text-text-secondary mt-1 max-w-2xl">
            Configure the core persona, tone, and guardrails for Sajan AI. This affects all chat interactions across the platform.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-inter text-text-hint">
            Last saved: {lastSaved}
          </span>
          <Button onClick={handleSave} isLoading={isSaving} className="flex items-center gap-2">
            {!isSaving && <Save className="w-4 h-4" />}
            Save & Deploy
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-6 shrink-0">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[14px] font-poppins font-semibold text-blue-800">High Impact Area</h3>
          <p className="text-[13px] font-inter text-blue-700 mt-1 leading-relaxed">
            Changes here are immediately applied to the OpenAI API context window. Make sure to test the persona thoroughly. Do not remove the emergency helpline guardrails.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-card border border-[#E5E7EB] flex flex-col overflow-hidden relative group">
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[11px] font-mono px-2 py-1 rounded">
          {prompt.length} chars
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-full p-6 text-[14px] font-mono leading-relaxed text-gray-800 resize-none outline-none focus:ring-4 focus:ring-[var(--color-accent)]/10"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default PromptEditor;
