"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { memberKeys } from "@/entities/member/api/member-keys";
import { CheckCircleIcon } from "@/shared/assets/CheckCircleIcon";
import { TrendIcon } from "@/shared/assets/TrendIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function ProfileStatCards() {
  const { data: profile } = useSuspenseQuery(memberKeys.me());

  const profileStats = [
    {
      label: "맞춘 문제",
      value: `${profile.totalSolvedCount}`,
      icon: <CheckCircleIcon className="size-5" />,
    },
    {
      label: "연속 풀이 기록",
      value: `${profile.currentStreak}일`,
      icon: <TrendIcon className="size-5" />,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {profileStats.map((stat) => (
        <article
          key={stat.label}
          className="border-line bg-surface flex h-36 flex-col justify-between rounded-lg border px-5 py-6 sm:px-8 sm:py-7"
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            {stat.icon}
            <span>{stat.label}</span>
          </div>
          <strong className="self-end text-4xl font-semibold">{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}

function ProfileStatCardsLoading() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className="border-line bg-surface flex h-36 flex-col justify-between rounded-lg border px-5 py-6 sm:px-8 sm:py-7"
        >
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-10 w-16 self-end" />
        </div>
      ))}
    </section>
  );
}

function ProfileStatCardsError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <section className="border-line bg-surface text-muted flex h-36 flex-col items-center justify-center gap-2 rounded-lg border text-sm">
      <p>통계를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </section>
  );
}

ProfileStatCards.Loading = ProfileStatCardsLoading;
ProfileStatCards.Error = ProfileStatCardsError;

export function ProfileStatCardsBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<ProfileStatCards.Loading />}
      errorFallback={ProfileStatCards.Error}
    >
      <ProfileStatCards />
    </QueryBoundary>
  );
}
