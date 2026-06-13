import React, { useState } from 'react';
import { Copy, BookOpen, CheckCircle2, Sparkles, Brain, Zap, RefreshCw, FileText, Bot, ArrowRight, Wand2, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { auth } from '../../firebase';

const ParagraphTool = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/memory-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: text.trim() })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate story');
      setResult(data);
    } catch (err) {
      console.error('Memory story error:', err);
      setError('Arre yaar! Kuch gadbad ho gayi. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `🧠 MEMORY STORY: ${result.title}\n\n${result.story}\n\n🔑 CONCEPT MAP:\n${result.conceptMap.map(c => `• ${c.storyElement} → ${c.realConcept}`).join('\n')}\n\n⚡ MEMORY HOOK:\n${result.memoryHook}\n\n📖 QUICK REVISION:\n${result.quickRevision}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">
              Memory Story Maker
            </h2>
            <p className="text-[13px] font-inter text-text-secondary">
              Paste any text → Sajan creates an illogical story you'll never forget 🧠✨
            </p>
          </div>
        </div>

        {/* How it works banner */}
        <div className="mt-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[13px] font-inter font-medium text-[var(--color-text-primary)]">Paste text</span>
          </div>
          
          <div className="hidden sm:flex shrink-0">
            <ArrowRight className="w-4 h-4 text-[#4b5563]" />
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Bot className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-[13px] font-inter font-medium text-[var(--color-text-primary)]">Sajan creates an illogical story</span>
          </div>
          
          <div className="hidden sm:flex shrink-0">
            <ArrowRight className="w-4 h-4 text-[#4b5563]" />
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <Brain className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-[13px] font-inter font-medium text-[var(--color-text-primary)]">Concepts lock in your memory</span>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-[var(--color-card)] rounded-[16px] p-6 shadow-card border border-[var(--color-border)]">
        <label className="block text-[14px] font-poppins font-semibold text-[var(--color-text-primary)] mb-3">
          Paste your text below
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any paragraph, chapter, article, notes, or any text here... Sajan will turn it into an illogical but unforgettable memory story!"
          className="w-full min-h-[200px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[15px] font-inter focus:border-purple-500 focus:ring-[3px] focus:ring-purple-500/12 outline-none transition-all resize-y text-[var(--color-text-primary)]"
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] font-inter text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <span className="text-[12px] font-inter text-text-hint">
            {wordCount} words {wordCount > 500 && '· Long text — story may take a moment'}
          </span>
          <Button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            isLoading={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 text-[14px] bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting your memory story...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sajan, Create My Memory Story 🧠
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="mt-6 bg-[var(--color-card)] rounded-[16px] p-8 border border-[var(--color-border)] text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <p className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">
                Sajan is reading your text...
              </p>
              <p className="text-[13px] font-inter text-text-secondary mt-1">
                He's weaving a wild, unforgettable story from your concepts 🎭
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-500"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !isAnalyzing && (
        <div className="mt-6 space-y-4">

          {/* Story Card — Main Hero */}
          <div className="relative rounded-[24px] overflow-hidden border border-[#2D2D44] bg-[#050505] shadow-[0_8px_30px_rgba(139,92,246,0.15)] group">
            {/* Magical Glowing Orbs Background */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <Wand2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <p className="text-purple-400 text-[12px] font-poppins font-bold uppercase tracking-[0.2em]">
                        Your Memory Story
                      </p>
                    </div>
                    <h3 className="text-white text-[24px] lg:text-[28px] font-poppins font-bold leading-tight">
                      {result.title}
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[13px] font-inter font-medium transition-all hover:scale-105 shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  {copied ? 'Copied!' : 'Copy Story'}
                </button>
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-purple-500/10 rotate-180" />
                <p className="relative z-10 text-[#e2e8f0] text-[18px] lg:text-[20px] font-serif tracking-wide leading-[2.2] whitespace-pre-wrap pl-6 border-l-2 border-purple-500/30">
                  {result.story}
                </p>
                <Quote className="absolute -bottom-6 right-0 w-12 h-12 text-indigo-500/10" />
              </div>
            </div>
          </div>

          {/* Concept Decoder */}
          <div className="bg-[var(--color-card)] rounded-[16px] p-6 border border-[var(--color-border)] shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔑</span>
              <h4 className="text-[13px] font-inter font-bold text-[var(--color-text-primary)] uppercase tracking-wide">
                Story → Concept Decoder
              </h4>
            </div>
            <p className="text-[12px] font-inter text-text-secondary mb-4">
              Each crazy element in the story represents a real concept. Here's the cheat sheet:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.conceptMap.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] hover:border-purple-500/30 transition-colors">
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-inter font-semibold text-purple-500 truncate">
                      "{item.storyElement}"
                    </p>
                    <p className="text-[13px] font-inter text-[var(--color-text-primary)] mt-0.5 leading-snug">
                      {item.realConcept}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Hook */}
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-[16px] p-5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-500" />
              <h4 className="text-[13px] font-inter font-bold text-orange-500 uppercase tracking-wide">
                Memory Hook — Repeat This 3 Times!
              </h4>
            </div>
            <p className="text-[17px] font-poppins font-semibold text-[var(--color-text-primary)] leading-snug">
              "{result.memoryHook}"
            </p>
          </div>

          {/* Quick Revision */}
          <div className="bg-[var(--color-card)] rounded-[16px] p-6 border border-[var(--color-border)] shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h4 className="text-[13px] font-inter font-bold text-indigo-500 uppercase tracking-wide">
                Quick Revision — Plain & Simple
              </h4>
            </div>
            <p className="text-[15px] font-inter text-[var(--color-text-primary)] leading-relaxed">
              {result.quickRevision}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1 text-[13px] flex items-center justify-center gap-2"
              onClick={() => { setResult(null); setText(''); }}
            >
              <RefreshCw className="w-4 h-4" />
              Analyze New Text
            </Button>
            <Button
              className="flex-1 text-[13px] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 border-0"
              onClick={() => navigate('/student/chat')}
            >
              <Brain className="w-4 h-4" />
              Discuss with Sajan
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default ParagraphTool;
