export type CaseStatus = 'open' | 'in-progress' | 'closed';

export type SecurityCase = {
  id: string;
  title: string;
  status: CaseStatus;
  assignee: string;
  severity: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  author: string;
  at: string;
  body: string;
};
