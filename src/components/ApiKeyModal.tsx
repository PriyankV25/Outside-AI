'use client';

import React, { useState } from 'react';
import { Key, Sparkles, X, ExternalLink, Check, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customKey: string;
  onSaveKey: (key: string) => void;
  onClearKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  customKey,
  onSaveKey,
  onClearKey,
}) => {
  const [inputValue, setInputValue] = useState(customKey);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputValue.trim());
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputValue('');
    onClearKey();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nature-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f1d16] text-[#e8efe9] border border-nature-700/60 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-ambermoss-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between pb-4 border-b border-nature-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-nature-800/80 border border-nature-600/50 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-nature-100">Groq API Configuration</h2>
              <p className="text-xs text-nature-400">Powering fast outdoor missions with LLaMA 3.3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-nature-400 hover:text-white hover:bg-nature-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs sm:text-sm text-nature-300 leading-relaxed">
            By default, the server reads <code className="px-1.5 py-0.5 rounded bg-nature-800 text-amber-300 font-mono text-xs">GROQ_API_KEY</code> from environment variables. If you would like to test your own personal key in this session, paste it below.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-nature-300">
              Session Groq API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="gsk_..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-nature-950/80 border border-nature-700 text-nature-100 text-sm placeholder-nature-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-nature-400">
              * Kept strictly in ephemeral memory for your active browser session. Never sent to any database.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-nature-900/60 border border-nature-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-nature-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Need a free Groq API key?</span>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-nature-800/80 flex items-center justify-between">
          {customKey ? (
            <button
              onClick={handleClear}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear custom key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-nature-400 hover:text-nature-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-lg shadow-emerald-950/40"
            >
              {showSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
