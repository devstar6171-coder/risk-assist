import React, { useState } from 'react';
import { RiskItem } from '../types';
import { RiskCard } from './RiskCard';
import { ArrowLeft, ArrowRight, CheckCircle, Archive, X } from 'lucide-react';

interface TriageProps {
  risks: RiskItem[];
  onArchive: (id: string) => void;
  onBaseline: (id: string) => void;
  onExit: () => void;
}

export const Triage: React.FC<TriageProps> = ({ risks, onArchive, onBaseline, onExit }) => {
  const activeRisks = risks.filter(r => r.status === 'active');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (activeRisks.length === 0) {
    return (
      <div className="text-center py-20 bg-defence-800 rounded-xl border border-defence-700">
        <CheckCircle className="w-16 h-16 text-defence-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Triage Complete</h2>
        <p className="text-slate-400 mb-6">All active risks have been reviewed.</p>
        <button 
          onClick={onExit}
          className="bg-defence-700 hover:bg-defence-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Ensure index is valid if items are removed
  const safeIndex = Math.min(currentIndex, activeRisks.length - 1);
  const currentRisk = activeRisks[safeIndex];

  const handleNext = () => {
    if (safeIndex < activeRisks.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleAction = (action: 'archive' | 'baseline') => {
    if (action === 'archive') {
      onArchive(currentRisk.id);
    } else {
      onBaseline(currentRisk.id);
    }
    // Don't increment index, as the array shrinks, the next item falls into the current index
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Interactive Risk Triage
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Reviewing {safeIndex + 1} of {activeRisks.length} active risks
          </p>
        </div>
        <button 
          onClick={onExit}
          className="p-2 text-slate-400 hover:text-white hover:bg-defence-800 rounded-lg transition-colors"
          title="Exit Triage"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-defence-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((safeIndex + 1) / activeRisks.length) * 100}%` }}
        />
      </div>

      <div className="mb-8">
        <RiskCard risk={currentRisk} />
      </div>

      <div className="flex justify-between items-center bg-defence-800 p-4 rounded-xl border border-defence-700">
        <button 
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Previous
        </button>

        <div className="flex gap-4">
          <button 
            onClick={() => handleAction('archive')}
            className="flex items-center gap-2 bg-defence-900 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Archive className="w-5 h-5" /> Archive Risk
          </button>
          <button 
            onClick={() => handleAction('baseline')}
            className="flex items-center gap-2 bg-defence-accent hover:bg-emerald-400 text-defence-900 px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-defence-accent/20"
          >
            <CheckCircle className="w-5 h-5" /> Accept & Baseline
          </button>
        </div>

        <button 
          onClick={handleNext}
          disabled={safeIndex === activeRisks.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Skip <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
