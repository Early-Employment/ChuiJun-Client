"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { memberKeys } from "@/entities/member/api/member-keys";
import {
  MEMBER_TIER_COLOR_CLASSES,
  MEMBER_TIER_LABELS,
} from "@/entities/member/model/member-profile";
import { EditIcon } from "@/shared/assets/EditIcon";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { TrophyIcon } from "@/shared/assets/TrophyIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function ProfileSummaryCard() {
  const { data: profile } = useSuspenseQuery(memberKeys.me());
  const tierColor = MEMBER_TIER_COLOR_CLASSES[profile.tier];

  return (
    <section className="border-line bg-surface flex flex-col gap-8 rounded-lg border px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:px-14">
      <div className="relative mx-auto size-40 shrink-0 lg:mx-0">
        <div className="flex size-40 items-center justify-center overflow-hidden rounded-full bg-neutral-300">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profileImageUrl} alt="" className="size-full object-cover" />
          ) : (
            <LogoIcon className="text-accent size-28" />
          )}
        </div>
        <div className={`absolute right-0 bottom-0 size-12 rounded-full ${tierColor.background}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-heading font-bold">{profile.name}</h1>
              {/* TODO(backend): /members/me 는 학년·반을 주지 않음 — placeholder */}
              <span className="bg-surface-subtle text-muted rounded-lg px-3 py-1 text-sm">—</span>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-sm font-semibold ${tierColor.text}`}>
              <TrophyIcon className="size-5" />
              <span>{MEMBER_TIER_LABELS[profile.tier]}</span>
            </div>
          </div>
          <button
            type="button"
            className="border-line bg-surface-subtle inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
          >
            <EditIcon className="size-3" />
            프로필 수정
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="text-muted flex justify-end text-xs font-medium">{profile.rating}점</div>
          {/* TODO(backend): 티어 진행률(다음 티어 임계값)이 응답에 없음 — 막대는 디자인 유지, %는 placeholder */}
          <div className="bg-surface-subtle h-3 overflow-hidden rounded-md">
            <div className={`h-full w-2/5 rounded-md ${tierColor.background}`} />
          </div>
          <div className="text-muted flex justify-between text-xs font-medium">
            <span>{MEMBER_TIER_LABELS[profile.tier]}</span>
            <span>—</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSummaryCardLoading() {
  return (
    <section className="border-line bg-surface flex flex-col gap-8 rounded-lg border px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:px-14">
      <Skeleton className="mx-auto size-40 shrink-0 rounded-full lg:mx-0" />
      <div className="min-w-0 flex-1 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-8 h-3 w-full" />
      </div>
    </section>
  );
}

function ProfileSummaryCardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <section className="border-line bg-surface text-muted flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg border text-sm">
      <p>프로필 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </section>
  );
}

ProfileSummaryCard.Loading = ProfileSummaryCardLoading;
ProfileSummaryCard.Error = ProfileSummaryCardError;

export function ProfileSummaryCardBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<ProfileSummaryCard.Loading />}
      errorFallback={ProfileSummaryCard.Error}
    >
      <ProfileSummaryCard />
    </QueryBoundary>
  );
}
