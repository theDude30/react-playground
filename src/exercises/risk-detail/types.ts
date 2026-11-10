export type Criticality = 'low' | 'medium' | 'high' | 'extreme';

export type Entity = { id: string; name: string; criticality: Criticality };
export type HistoryPoint = { at: string; score: number };
export type ScoreResponse = {
  id: string;
  score: number;
  criticality: Criticality;
  history: HistoryPoint[];
};
export type Alert = { id: string; ruleName: string; severity: string; at: string };
