export type Entity = {
  id: string;
  name: string;
  kind: 'user' | 'host';
  spaceId: string;
  riskScore: number;
  acknowledged: boolean;
  note: string;
  reason: string;
};

export type BulkResult = {
  succeeded: string[];
  failed: { id: string; reason: string }[];
};
