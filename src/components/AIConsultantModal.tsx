import React, { useState } from 'react';
import { X, Sparkles, Brain, Check, Send } from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({ isOpen, onClose }) => {
  const [faceShape, setFaceShape] = useState('Oval');
  const [hairType, setHairType] = useState('Straight, Medium Density');
  const [styleGoal, setStyleGoal] = useState('Modern clean fade with textured top and sharp beard');
  const [useHighThinking, setUseHighThinking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faceShape,
          hairType,
          styleGoal,
          useHighThinking,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate recommendation.');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Error connecting to Gemini AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CinematiCuts AI Grooming Consultant</h2>
              <p className="text-xs text-zinc-400">Powered by Gemini AI (High Thinking Mode)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <form onSubmit={handleConsult} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Face Shape</label>
                <select
                  value={faceShape}
                  onChange={(e) => setFaceShape(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Oval">Oval (Versatile)</option>
                  <option value="Square">Square (Strong Jawline)</option>
                  <option value="Round">Round (Soft Angles)</option>
                  <option value="Diamond / Triangular">Diamond / Triangular</option>
                  <option value="Rectangle / Oblong">Rectangle / Oblong</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Hair Type & Texture</label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Straight, Medium Density">Straight, Medium Density</option>
                  <option value="Wavy / Thick">Wavy / Thick</option>
                  <option value="Curly / Coarse">Curly / Coarse</option>
                  <option value="Fine / Thinning">Fine / Thinning</option>
                  <option value="Afro-textured">Afro-textured</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Desired Look or Specific Goal</label>
              <input
                type="text"
                value={styleGoal}
                onChange={(e) => setStyleGoal(e.target.value)}
                placeholder="e.g. Sharp low fade, professional executive look, beard growth guidance"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHighThinking}
                  onChange={(e) => setUseHighThinking(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Brain className="w-3.5 h-3.5 text-amber-400" /> Enable Gemini High Thinking Mode
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Consulting AI...' : 'Get AI Recommendation'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>CinematiCuts Master AI Recommendation</span>
              </div>
              <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
