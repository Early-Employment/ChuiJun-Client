"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { homeProfileKeys } from "@/entities/home/api/home-profile-keys";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function ProfileSummary() {
  const { data: profile } = useSuspenseQuery(homeProfileKeys.detail());

  return (
    <>
      <h2 className="text-foreground text-2xl font-extrabold sm:text-3xl">
        {profile.displayName}, 어서오세요!
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
        {profile.stats.map((item) => (
          <div key={item.label} className="min-w-0 space-y-1">
            <p className="text-body text-muted">{item.label}</p>
            <p className="text-foreground truncate text-xl font-extrabold sm:text-2xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileSummaryLoading() {
  return (
    <>
      <Skeleton className="h-8 w-3/4" />
      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-7 w-2/3" />
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileSummaryError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex min-h-24 flex-col items-center justify-center gap-2 text-sm">
      <p>프로필 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

ProfileSummary.Loading = ProfileSummaryLoading;
ProfileSummary.Error = ProfileSummaryError;

export function ProfileSummaryBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<ProfileSummary.Loading />}
      errorFallback={ProfileSummary.Error}
    >
      <ProfileSummary />
    </QueryBoundary>
  );
}
