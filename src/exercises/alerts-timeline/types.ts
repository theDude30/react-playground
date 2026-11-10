export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Alert = {
  id: string;
  ruleName: string;
  severity: Severity;
  host: string;
  riskScore: number;
  at: string;
  reviewed: boolean;
  detail: string;
};
