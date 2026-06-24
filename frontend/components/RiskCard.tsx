import React from 'react';
import { RiskItem } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { ShieldAlert, Activity, Clock, DollarSign, Archive, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskCardProps {
  risk: RiskItem;
  onArchive?: (id: string) => void;
  onBaseline?: (id: string) => void;
  compact?: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onArchive, onBaseline, compact = false }) => {
  const categoryStyle = CATEGORY_COLORS[risk.category] || 'text-slate-400 border-slate-400/30 bg-slate-400/10';

  // Prepare data for the chart based on the first mitigation strategy (or average them)
  const chartData = risk.mitigations.length > 0 ? [
    { name: 'Cost', score: risk.mitigations[0].costScore, fill: '#f59e0b' },
    { name: 'Complexity', score: risk.mitigations[0].complexityScore, fill: '#3b82f6' },
    { name: 'Time', score: risk.mitigations[0].timeScore, fill: '#10b981' },
  ] : [];

  return (
    <div className={`bg-defence-800 border border-defence-700 rounded-xl overflow-hidden flex flex-col ${risk.status === 'archived' ? 'opacity-60 grayscale' : ''}`}>
      <div className="p-5 border-b border-defence-700 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-slate-500 bg-defence-900 px-2 py-1 rounded">{risk.id}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
              {risk.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 leading-tight">{risk.title}</h3>
        </div>
        
        {!compact && risk.status === 'active' && (
          <div className="flex gap-2 shrink-0">
            {onBaseline && (
              <button 
                onClick={() => onBaseline(risk.id)}
                className="p-2 text-slate-400 hover:text-defence-accent hover:bg-defence-accent/10 rounded-lg transition-colors"
                title="Accept & Baseline"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
            {onArchive && (
              <button 
                onClick={() => onArchive(risk.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Archive Risk"
              >
                <Archive className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col gap-6">
        <div>
          <p className="text-sm text-slate-300 leading-relaxed">{risk.description}</p>
        </div>

        {!compact && (
          <>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Identified Vulnerabilities
              </h4>
              <ul className="space-y-2">
                {risk.vulnerabilities.map((vuln, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-defence-700">
              <div className="lg:col-span-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Mitigation Strategies
                </h4>
                <div className="space-y-3">
                  {risk.mitigations.map((mit, idx) => (
                    <div key={idx} className="bg-defence-900 p-3 rounded-lg border border-defence-700/50">
                      <p className="text-sm text-slate-300 mb-3">{mit.strategy}</p>
                      <div className="flex gap-4 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1" title="Cost Score (1-10)"><DollarSign className="w-3 h-3"/> {mit.costScore}/10</span>
                        <span className="flex items-center gap-1" title="Complexity Score (1-10)"><Activity className="w-3 h-3"/> {mit.complexityScore}/10</span>
                        <span className="flex items-center gap-1" title="Time to Deploy (1-10)"><Clock className="w-3 h-3"/> {mit.timeScore}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-40 lg:h-auto bg-defence-900 rounded-lg p-2 border border-defence-700/50 flex flex-col">
                 <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Primary Mitigation Profile
                </h4>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 10]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
