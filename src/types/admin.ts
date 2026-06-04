export type AdminAuditLog = {
  id: string;
  actorTeam: string;
  action: string;
  target: string;
  result: 'success' | 'blocked' | 'pending';
  createdAt: string;
};

export type AdminActionRequest = {
  actionType: string;
  targetId: string;
  reason: string;
};
