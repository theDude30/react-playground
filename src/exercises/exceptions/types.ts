export type Condition = { field: string; operator: string; value: string };

export type RuleException = {
  id: string;
  name: string;
  ruleId: string;
  spaceId: string;
  enabled: boolean;
  createdAt: string;
  expiresAt: string | null;
  conditions: Condition[];
};

export type Rule = { id: string; name: string; spaceId: string };
