export type AdminMetricTone = 'blue' | 'purple' | 'orange' | 'green' | 'emerald';

export type AdminSummaryMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  supportingText: string;
  deltaText?: string;
  deltaTone?: 'danger' | 'neutral' | 'success';
  tone: AdminMetricTone;
  icon: 'users' | 'role' | 'permission' | 'audit' | 'securityAsset' | 'api';
};

export type AdminRoleTone = 'blue' | 'purple' | 'orange' | 'green' | 'slate';

export type AdminRole = {
  id: string;
  name: string;
  countLabel: string;
  description: string;
  permissions: string[];
  tone: AdminRoleTone;
  icon: 'crown' | 'building' | 'operator' | 'field' | 'viewer';
};

export type AdminManagerStatus = 'active' | 'inactive';

export type AdminManager = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleTone: AdminRoleTone;
  scope: string;
  lastLoginAt: string;
  status: AdminManagerStatus;
};

export type AdminSecurityControl = {
  id: string;
  label: string;
  description: string;
  value: string;
  valueTone: 'success' | 'neutral' | 'strong';
  icon: 'rls' | 'api' | 'timeout' | 'mfa' | 'retention' | 'password';
  controlType: 'badge' | 'select' | 'button';
};

export type AdminAuditLog = {
  id: string;
  time: string;
  actor: string;
  action: string;
  actionTone: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  target: string;
  reason: string;
};

export type AdminSettingsDashboard = {
  summaryMetrics: AdminSummaryMetric[];
  roles: AdminRole[];
  managers: AdminManager[];
  securityControls: AdminSecurityControl[];
  auditLogs: AdminAuditLog[];
};

export type AdminActionRequest = {
  actionType: string;
  targetId: string;
  reason: string;
};
