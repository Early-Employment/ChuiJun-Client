"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { memberKeys } from "@/entities/member/api/member-keys";
import type { RecentActivity } from "@/entities/member/model/member-profile";
import { CheckCircleIcon } from "@/shared/assets/CheckCircleIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

// ISO 일시 → "7월 1일 15:10" 형태의 안내 문구.
function formatSubmittedAt(submittedAt: string) {
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return submittedAt;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hours}:${minutes}`;
}

function RecentActivityCard() {
  const { data: profile } = useSuspenseQuery(memberKeys.me());

  if (profile.recentActivities.length === 0) {
    return <RecentActivityCard.Empty />;
  }

  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg font-semibold">최근 활동</h2>
      <ul className="divide-line mt-5 divide-y">
        {profile.recentActivities.map((activity, index) => (
          <RecentActivityRow key={`${activity.submissionId}-${index}`} activity={activity} />
        ))}
      </ul>
    </section>
  );
}

function RecentActivityRow({ activity }: { activity: RecentActivity }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2">
        <CheckCircleIcon className="text-accent size-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">{activity.problemTitle}</p>
          <p className="text-muted mt-0.5 text-xs">
            lv. {activity.problemLevel} · {formatSubmittedAt(activity.submittedAt)}
          </p>
        </div>
      </div>
      <strong className="shrink-0 text-sm font-semibold">{activity.score}점</strong>
    </li>
  );
}

function RecentActivityCardLoading() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <Skeleton className="h-6 w-24" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </section>
  );
}

function RecentActivityCardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <section className="border-line bg-surface text-muted flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg border text-sm">
      <p>최근 활동을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </section>
  );
}

function RecentActivityCardEmpty() {
  return (
    <section className="border-line bg-surface text-muted flex min-h-48 items-center justify-center rounded-lg border text-sm">
      아직 활동 기록이 없어요.
    </section>
  );
}

RecentActivityCard.Loading = RecentActivityCardLoading;
RecentActivityCard.Error = RecentActivityCardError;
RecentActivityCard.Empty = RecentActivityCardEmpty;

export function RecentActivityCardBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<RecentActivityCard.Loading />}
      errorFallback={RecentActivityCard.Error}
    >
      <RecentActivityCard />
    </QueryBoundary>
  );
}
