import { RiskCategory } from './types';

export const MOCK_DEFENCE_PROJECT_TEXT = `
Project Name: Operation Sentinel Vanguard
Description: Deployment of a new autonomous drone swarm system for maritime border surveillance. 
The system utilizes commercial off-the-shelf (COTS) AI processors and communicates via a mesh network using standard RF frequencies. 
Drones are equipped with high-resolution optical and thermal cameras. 
The control station will be integrated into existing legacy naval command centers running Windows Server 2016.
Maintenance will be outsourced to a third-party contractor based in a non-NATO allied country.
Batteries used are high-density lithium-ion, requiring specialized storage.
`;

export const CATEGORY_COLORS: Record<string, string> = {
  [RiskCategory.CYBERSECURITY]: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  [RiskCategory.SUPPLY_CHAIN]: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  [RiskCategory.KINETIC_SAFETY]: 'text-red-400 border-red-400/30 bg-red-400/10',
  [RiskCategory.DOMAIN_SAFETY]: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  [RiskCategory.COMMERCIAL]: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  [RiskCategory.ENVIRONMENTAL]: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  [RiskCategory.EMS]: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
  [RiskCategory.OHS]: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  [RiskCategory.LEGAL]: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  [RiskCategory.OPSEC]: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
};
