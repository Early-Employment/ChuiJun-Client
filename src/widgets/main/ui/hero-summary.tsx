"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { homeSummaryKeys } from "@/entities/home/api/home-summary-keys";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function HeroSummary() {
  const { data: cards } = useSuspenseQuery(homeSummaryKeys.list());

  if (cards.length === 0) {
    return <HeroSummary.Empty />;
  }

  return (
    <aside className="bg-surface self-start rounded-lg p-3">
      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-2">
        {cards.map((card, index) => (
          <SummaryCard
            key={`${card.eyebrow}-${index}`}
            eyebrow={card.eyebrow}
            title={card.title}
            meta={card.meta}
            className={index === 0 || index === 3 ? "md:col-span-2 xl:col-span-2" : ""}
          />
        ))}
      </div>
    </aside>
  );
}

function SummaryCard({
  eyebrow,
  title,
  meta,
  className,
}: {
  eyebrow: string;
  title: string;
  meta: string;
  className?: string;
}) {
  return (
    <article
      className={`bg-surface-accent-soft text-foreground relative rounded-md p-3 ${className}`}
    >
      <p className="text-caption text-accent-strong font-semibold">{eyebrow}</p>
      <div className="mt-1.5 flex items-start justify-between gap-2.5">
        <div>
          <h2 className="text-body text-foreground font-bold">{title}</h2>
          <p className="text-label text-muted mt-1">{meta}</p>
        </div>
        <span className="text-accent-strong pt-0.5 text-xl leading-none">›</span>
      </div>
    </article>
  );
}

function HeroSummaryLoading() {
  return (
    <aside className="bg-surface self-start rounded-lg p-3">
      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className={`h-20 rounded-md ${index === 0 || index === 3 ? "md:col-span-2 xl:col-span-2" : ""}`}
          />
        ))}
      </div>
    </aside>
  );
}

function HeroSummaryError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <aside className="bg-surface text-muted flex min-h-40 flex-col items-center justify-center gap-2 self-start rounded-lg p-3 text-sm">
      <p>요약 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </aside>
  );
}

function HeroSummaryEmpty() {
  return (
    <aside className="bg-surface text-muted flex min-h-40 items-center justify-center self-start rounded-lg p-3 text-sm">
      아직 표시할 정보가 없어요.
    </aside>
  );
}

HeroSummary.Loading = HeroSummaryLoading;
HeroSummary.Error = HeroSummaryError;
HeroSummary.Empty = HeroSummaryEmpty;

export function HeroSummaryBoundary() {
  return (
    <QueryBoundary loadingFallback={<HeroSummary.Loading />} errorFallback={HeroSummary.Error}>
      <HeroSummary />
    </QueryBoundary>
  );
}
