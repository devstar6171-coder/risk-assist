export enum RiskCategory {
  CYBERSECURITY = 'Cybersecurity',
  SUPPLY_CHAIN = 'Supply Chain Risk',
  KINETIC_SAFETY = 'Kinetic Safety',
  DOMAIN_SAFETY = 'Domain Safety',
  COMMERCIAL = 'Commercial Compliance',
  ENVIRONMENTAL = 'Environmental Protection',
  EMS = 'Electromagnetic Spectrum',
  OHS = 'Occupational Health',
  LEGAL = 'Legal & Export Controls',
  OPSEC = 'OPSEC & Physical Security'
}

export interface Mitigation {
  strategy: string;
  costScore: number; // 1-10
  complexityScore: number; // 1-10
  timeScore: number; // 1-10
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  vulnerabilities: string[];
  mitigations: Mitigation[];
  status: 'active' | 'archived' | 'baselined';
}

export type AppState = 'upload' | 'processing' | 'dashboard' | 'triage';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress: number;
}
