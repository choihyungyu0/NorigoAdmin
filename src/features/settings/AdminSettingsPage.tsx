import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Code2,
  Crown,
  EllipsisVertical,
  Eye,
  FileDown,
  HardHat,
  Headphones,
  Info,
  KeyRound,
  LockKeyhole,
  MoreHorizontal,
  ScrollText,
  ShieldCheck,
  UserPlus,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import securityStateIconUrl from '../../../asset/image-Photoroom.png';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getAdminSettingsDashboard } from '../../services/adminApi';
import {
  type AdminAuditLog,
  type AdminManager,
  type AdminManagerStatus,
  type AdminMetricTone,
  type AdminRole,
  type AdminRoleTone,
  type AdminSecurityControl,
  type AdminSummaryMetric,
} from '../../types/admin';

const summaryIconMap: Record<Exclude<AdminSummaryMetric['icon'], 'securityAsset'>, LucideIcon> = {
  users: UsersRound,
  role: UserRound,
  permission: LockKeyhole,
  audit: ScrollText,
  api: Code2,
};

const roleIconMap: Record<AdminRole['icon'], LucideIcon> = {
  crown: Crown,
  building: Building2,
  operator: Headphones,
  field: HardHat,
  viewer: Eye,
};

const securityIconMap: Record<AdminSecurityControl['icon'], LucideIcon> = {
  rls: ShieldCheck,
  api: Code2,
  timeout: Clock3,
  mfa: LockKeyhole,
  retention: ClipboardList,
  password: KeyRound,
};

const summaryToneClasses: Record<AdminMetricTone, { icon: string; value: string }> = {
  blue: { icon: 'bg-blue-50 text-blue-600', value: 'text-blue-600' },
  purple: { icon: 'bg-violet-50 text-violet-600', value: 'text-violet-600' },
  orange: { icon: 'bg-orange-50 text-orange-500', value: 'text-red-500' },
  green: { icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-600' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-600' },
};

const roleToneClasses: Record<AdminRoleTone, { icon: string; badge: string; text: string; managerBadge: string }> = {
  blue: {
    icon: 'bg-blue-600 text-white',
    badge: 'bg-blue-50 text-blue-600',
    text: 'text-blue-600',
    managerBadge: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  purple: {
    icon: 'bg-violet-600 text-white',
    badge: 'bg-violet-50 text-violet-600',
    text: 'text-violet-600',
    managerBadge: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  orange: {
    icon: 'bg-orange-500 text-white',
    badge: 'bg-orange-50 text-orange-600',
    text: 'text-orange-600',
    managerBadge: 'bg-orange-50 text-orange-700 border-orange-100',
  },
  green: {
    icon: 'bg-emerald-600 text-white',
    badge: 'bg-emerald-50 text-emerald-600',
    text: 'text-emerald-600',
    managerBadge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  slate: {
    icon: 'bg-slate-500 text-white',
    badge: 'bg-slate-100 text-slate-600',
    text: 'text-slate-600',
    managerBadge: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

const deltaToneClasses: Record<NonNullable<AdminSummaryMetric['deltaTone']>, string> = {
  danger: 'text-red-500',
  neutral: 'text-slate-500',
  success: 'text-emerald-600',
};

const securityValueClasses: Record<AdminSecurityControl['valueTone'], string> = {
  success: 'bg-emerald-50 text-emerald-700',
  neutral: 'border border-slate-200 bg-white text-slate-700',
  strong: 'bg-emerald-50 text-emerald-700',
};

const actionToneClasses: Record<AdminAuditLog['actionTone'], string> = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  orange: 'text-orange-500',
  purple: 'text-violet-600',
  red: 'text-red-500',
};

const managerStatusLabels: Record<AdminManagerStatus, string> = {
  active: '활성',
  inactive: '비활성',
};

function PanelTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="whitespace-nowrap text-[18px] font-black text-slate-950">{title}</h2>
      <Info aria-hidden="true" className="text-slate-400" size={17} />
    </div>
  );
}

function SummaryMetricCard({ metric }: { metric: AdminSummaryMetric }) {
  const tone = summaryToneClasses[metric.tone];
  const isLongValue = metric.value.length > 4;

  return (
    <Card className="h-[116px] rounded-lg p-4">
      <div className="flex h-full items-center gap-4">
        <div className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-lg ${tone.icon}`}>
          {metric.icon === 'securityAsset' ? (
            <>
              <img alt="" className="absolute inset-0 h-14 w-14 object-contain opacity-80" src={securityStateIconUrl} />
              <ShieldCheck aria-hidden="true" className="relative text-emerald-600" size={34} strokeWidth={2.4} />
            </>
          ) : null}
          {metric.icon !== 'securityAsset' ? (
            (() => {
              const Icon = summaryIconMap[metric.icon];

              return <Icon aria-hidden="true" size={35} strokeWidth={2.4} />;
            })()
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-700">{metric.label}</p>
          <p className={`${tone.value} mt-1 whitespace-nowrap font-black ${isLongValue ? 'text-[24px]' : 'text-[30px]'}`}>
            {metric.value}
            {metric.unit ? <span className="ml-1 text-base font-black text-slate-700">{metric.unit}</span> : null}
          </p>
          <p className="mt-1 truncate text-xs font-bold text-slate-500">
            {metric.supportingText}
            {metric.deltaText ? (
              <span className={`ml-3 font-black ${deltaToneClasses[metric.deltaTone ?? 'neutral']}`}>{metric.deltaText}</span>
            ) : null}
          </p>
        </div>
      </div>
    </Card>
  );
}

function RoleCard({ role }: { role: AdminRole }) {
  const Icon = roleIconMap[role.icon];
  const tone = roleToneClasses[role.tone];

  return (
    <div className="flex min-h-[268px] flex-col rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${tone.icon}`}>
          <Icon aria-hidden="true" size={24} strokeWidth={2.3} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-black leading-5 text-slate-800">{role.name}</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-black ${tone.badge}`}>{role.countLabel}</span>
        </div>
      </div>

      <p className="mt-4 min-h-[46px] border-b border-slate-200 pb-3 text-sm font-bold leading-6 text-slate-600">
        {role.description}
      </p>

      <ul className="mt-3 space-y-2">
        {role.permissions.map((permission) => (
          <li className="flex items-center gap-2 text-sm font-bold text-slate-600" key={permission}>
            <Check aria-hidden="true" className="shrink-0 text-emerald-600" size={14} strokeWidth={3} />
            <span>{permission}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RolePanel({ roles }: { roles: AdminRole[] }) {
  return (
    <Card className="min-h-0 rounded-lg p-4 xl:h-full">
      <PanelTitle title="권한 역할" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </Card>
  );
}

function ManagerStatusBadge({ status }: { status: AdminManagerStatus }) {
  const statusClass = status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500';

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>{managerStatusLabels[status]}</span>;
}

function ManagersPanel({ managers }: { managers: AdminManager[] }) {
  return (
    <Card className="flex min-h-0 flex-col rounded-lg p-0 xl:h-full">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4">
        <PanelTitle title="관리자 목록 / 권한 범위" />
        <div className="flex items-center gap-2">
          <Button className="h-9 px-4 text-sm" variant="secondary">
            권한 수정
          </Button>
          <Button className="h-9 px-4 text-sm" variant="primary">
            <UserPlus aria-hidden="true" size={17} />
            새 관리자 초대
          </Button>
          <button
            aria-label="관리자 목록 추가 작업"
            className="grid h-9 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600"
            type="button"
          >
            <MoreHorizontal aria-hidden="true" size={20} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="h-10 text-xs font-black text-slate-600">
              <th className="w-[30%] border-b border-slate-200 px-3">이름</th>
              <th className="w-[22%] border-b border-slate-200 px-3">역할</th>
              <th className="w-[20%] border-b border-slate-200 px-3">권한 범위</th>
              <th className="w-[18%] border-b border-slate-200 px-3">마지막 로그인</th>
              <th className="w-[10%] border-b border-slate-200 px-3 text-center">상태</th>
              <th className="w-10 border-b border-slate-200 px-1" />
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr className="h-[52px] hover:bg-slate-50" key={manager.id}>
                <td className="border-b border-slate-100 px-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600">
                      <UserRound aria-hidden="true" size={21} />
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-black text-slate-800">{manager.name}</p>
                      <p className="truncate text-xs font-bold text-slate-500">{manager.email}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-3">
                  <span
                    className={`inline-flex max-w-full rounded-md border px-3 py-1 text-xs font-black ${
                      roleToneClasses[manager.roleTone].managerBadge
                    }`}
                  >
                    <span className="truncate">{manager.role}</span>
                  </span>
                </td>
                <td className="truncate border-b border-slate-100 px-3 text-sm font-bold text-slate-700">{manager.scope}</td>
                <td className="truncate border-b border-slate-100 px-3 text-sm font-bold text-slate-700">{manager.lastLoginAt}</td>
                <td className="border-b border-slate-100 px-3 text-center">
                  <ManagerStatusBadge status={manager.status} />
                </td>
                <td className="border-b border-slate-100 px-1 text-center">
                  <button
                    aria-label={`${manager.name} 추가 작업`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                    type="button"
                  >
                    <EllipsisVertical aria-hidden="true" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex h-12 shrink-0 items-center justify-end gap-4 border-t border-slate-100 px-4 text-sm font-bold text-slate-600">
        <span>1 - 5 / 18</span>
        <div className="flex items-center gap-2">
          <button
            aria-label="이전 관리자 페이지"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-300"
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={17} />
          </button>
          {[1, 2, 3, 4].map((page) => (
            <button
              className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm font-black ${
                page === 1 ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
              key={page}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            aria-label="다음 관리자 페이지"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-700"
            type="button"
          >
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
    </Card>
  );
}

function SecurityControlRow({ control }: { control: AdminSecurityControl }) {
  const Icon = securityIconMap[control.icon];
  const isSelect = control.controlType === 'select';

  return (
    <div className="flex min-h-[48px] items-center gap-3 border-b border-slate-100 px-2 py-1.5 last:border-b-0">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-600">
        <Icon aria-hidden="true" size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-800">{control.label}</p>
        <p className="truncate text-xs font-bold text-slate-500">{control.description}</p>
      </div>
      <button
        className={`inline-flex h-7 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-black ${securityValueClasses[control.valueTone]}`}
        type="button"
      >
        {control.value}
        {isSelect ? <ChevronDown aria-hidden="true" size={15} /> : null}
      </button>
    </div>
  );
}

function SecurityPanel({ controls }: { controls: AdminSecurityControl[] }) {
  return (
    <Card className="flex min-h-0 flex-col rounded-lg p-4 xl:h-full">
      <PanelTitle title="보안 및 운영 설정" />
      <div className="mt-2 min-h-0 flex-1">
        {controls.map((control) => (
          <SecurityControlRow control={control} key={control.id} />
        ))}
      </div>
      <button
        className="mt-1 flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-black text-blue-600"
        type="button"
      >
        보안 설정 관리
        <ChevronRight aria-hidden="true" size={17} />
      </button>
    </Card>
  );
}

function AuditPanel({ logs }: { logs: AdminAuditLog[] }) {
  return (
    <Card className="flex min-h-0 flex-col rounded-lg p-0 xl:h-full">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4">
        <PanelTitle title="Audit Log / 운영 이력" />
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
            type="button"
          >
            전체 작업
            <ChevronDown aria-hidden="true" size={15} />
          </button>
          <button
            className="hidden h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 2xl:inline-flex"
            type="button"
          >
            2025.05.19
            <CalendarDays aria-hidden="true" size={15} />
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-blue-100 bg-blue-50 px-3 text-xs font-black text-blue-600"
            type="button"
          >
            <FileDown aria-hidden="true" size={16} />
            로그 내보내기
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="h-9 text-xs font-black text-slate-600">
              <th className="w-[12%] border-b border-slate-200 px-2">시간</th>
              <th className="w-[18%] border-b border-slate-200 px-2">사용자</th>
              <th className="w-[24%] border-b border-slate-200 px-2">작업</th>
              <th className="w-[27%] border-b border-slate-200 px-2">대상 지역/장소</th>
              <th className="w-[19%] border-b border-slate-200 px-2">사유</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr className="h-9 hover:bg-slate-50" key={log.id}>
                <td className="truncate border-b border-slate-100 px-2 text-xs font-bold text-slate-700">{log.time}</td>
                <td className="truncate border-b border-slate-100 px-2 text-xs font-bold text-slate-700">{log.actor}</td>
                <td className={`truncate border-b border-slate-100 px-2 text-xs font-black ${actionToneClasses[log.actionTone]}`}>
                  {log.action}
                </td>
                <td className="truncate border-b border-slate-100 px-2 text-xs font-bold text-slate-700">{log.target}</td>
                <td className="truncate border-b border-slate-100 px-2 text-xs font-bold text-slate-700">{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex h-12 shrink-0 items-center justify-end gap-4 border-t border-slate-100 px-4 text-sm font-bold text-slate-600">
        <span>1 - 7 / 42</span>
        <div className="flex items-center gap-2">
          <button
            aria-label="이전 감사 로그 페이지"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-300"
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={17} />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm font-black ${
                page === 1 ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
              key={page}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            aria-label="다음 감사 로그 페이지"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-700"
            type="button"
          >
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
    </Card>
  );
}

export function AdminSettingsPage() {
  const { data } = useQuery({ queryKey: ['admin-settings-dashboard'], queryFn: getAdminSettingsDashboard });

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 xl:h-[calc(100vh-104px)] xl:min-h-0 xl:overflow-hidden">
      <div className="grid shrink-0 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {data.summaryMetrics.map((metric) => (
          <SummaryMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(430px,0.9fr)] xl:grid-rows-[minmax(310px,0.95fr)_minmax(315px,1fr)]">
        <RolePanel roles={data.roles} />
        <SecurityPanel controls={data.securityControls} />
        <ManagersPanel managers={data.managers} />
        <AuditPanel logs={data.auditLogs} />
      </div>
    </div>
  );
}
