export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Rule = {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  riskScore: number;
  query: string;
  enabled: boolean;
};
