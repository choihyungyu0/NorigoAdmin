import { FileBarChart, Shield, Timer } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';

const reportCards = [
  {
    title: '일일 혼잡 운영 리포트',
    description: '121개 관광 권역의 시간대별 혼잡과 risk_score 요약',
    icon: FileBarChart,
  },
  {
    title: 'Re-Trip 분산 효과',
    description: '대체 권역 이동 집계와 공지 반응률 비교',
    icon: Timer,
  },
  {
    title: '개인정보 보호 점검',
    description: '개별 위치와 개인 여정 미표시 원칙 준수 확인',
    icon: Shield,
  },
];

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="운영 리포트"
        description="정책 보고와 관광 운영 회고에 필요한 집계 리포트 템플릿입니다."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {reportCards.map((report) => {
          const Icon = report.icon;

          return (
            <Card className="flex min-h-56 flex-col justify-between" key={report.title}>
              <div>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <SectionHeader title={report.title} description={report.description} />
              </div>
              <Button variant="secondary">리포트 템플릿 보기</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
