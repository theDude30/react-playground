export type AlertRule = {
  id: string;
  name: string;
  spaceId: string;
  ownerName: string;
  threshold: number;
  muted: boolean;
  locked: boolean;
  deletedAt: number | null;
  claimedBy: string;
};
