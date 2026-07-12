"use client";

import { useState } from "react";
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
import { ProfileEditDialog } from "@/widgets/mypage/ui/profile-edit-dialog";

const MEMBER_TIER_PROGRESS_BASELINES = {
  BRONZE: { min: 0, max: 999, nextTier: "SILVER" },
  SILVER: { min: 1_000, max: 1_999, nextTier: "GOLD" },
  GOLD: { min: 2_000, max: 2_999, nextTier: "PLATINUM" },
  PLATINUM: { min: 3_000, max: 3_999, nextTier: "EMERALD" },
  EMERALD: { min: 4_000, max: 4_000, nextTier: null },
} as const;

function buildTierProgress(rating: number, tier: keyof typeof MEMBER_TIER_PROGRESS_BASELINES) {
  const baseline = MEMBER_TIER_PROGRESS_BASELINES[tier];

  if (baseline.nextTier === null) {
    return {
      progressPercent: 100,
      nextTierLabel: "최고 티어",
    };
  }

  const range = baseline.max - baseline.min + 1;
  const clampedRating = Math.min(Math.max(rating, baseline.min), baseline.max);
  const progressPercent = Math.max(
    8,
    Math.min(100, Math.round(((clampedRating - baseline.min + 1) / range) * 100)),
  );

  return {
    progressPercent,
    nextTierLabel: MEMBER_TIER_LABELS[baseline.nextTier],
  };
}

function ProfileSummaryCard() {
  const { data: profile } = useSuspenseQuery(memberKeys.me());
  const { data: classroom } = useSuspenseQuery(memberKeys.myClassroom());
  const tierColor = MEMBER_TIER_COLOR_CLASSES[profile.tier];
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const tierProgress = buildTierProgress(profile.rating, profile.tier);

  return (
    <>
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
          <div
            className={`absolute right-0 bottom-0 size-12 rounded-full ${tierColor.background}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-heading font-bold">{profile.name}</h1>
                <span className="bg-surface-subtle text-muted rounded-lg px-3 py-1 text-sm">
                  {classroom.classLabel}
                </span>
              </div>
              <div
                className={`mt-2 flex items-center gap-1 text-sm font-semibold ${tierColor.text}`}
              >
                <TrophyIcon className="size-5" />
                <span>{MEMBER_TIER_LABELS[profile.tier]}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditDialogOpen(true)}
              className="border-line bg-surface-subtle inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
            >
              <EditIcon className="size-3" />
              프로필 수정
            </button>
          </div>

          <div className="mt-8 space-y-3">
            <div className="text-muted flex justify-end text-xs font-medium">
              {profile.rating}점
            </div>
            <div className="bg-surface-subtle h-3 overflow-hidden rounded-md">
              <div
                className={`h-full rounded-md ${tierColor.background}`}
                style={{ width: `${tierProgress.progressPercent}%` }}
              />
            </div>
            <div className="text-muted flex justify-between text-xs font-medium">
              <span>{MEMBER_TIER_LABELS[profile.tier]}</span>
              <span>{tierProgress.nextTierLabel}</span>
            </div>
          </div>
        </div>
      </section>
      <ProfileEditDialog
        open={isEditDialogOpen}
        profile={profile}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
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
