"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { buildActivityDays } from "@/entities/activity/model/build-activity-days";
import { getActivityLevel } from "@/entities/activity/model/activity-level";
import { formatActivityTooltip } from "@/entities/activity/model/activity-tooltip";
import { ActivityCalendar } from "@/entities/activity/ui/activity-calendar";
import { memberKeys } from "@/entities/member/api/member-keys";
import { monthRange } from "@/shared/lib/date";
import { ActivityHeatmap } from "@/shared/ui/activity-heatmap";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";

export type ActivityPeriod =
  | { type: "range"; from: string; to: string }
  | { type: "month"; year: number; month: number };

interface ActivityHeatmapBoardProps {
  period: ActivityPeriod;
}

// month 는 표시 형태(달력)만 다를 뿐 같은 활동 데이터다. 어떤 기간이든 [from, to] 로 정규화한다.
function periodRange(period: ActivityPeriod): { from: string; to: string } {
  if (period.type === "range") return { from: period.from, to: period.to };
  return monthRange(period.year, period.month);
}

function ActivityHeatmapBoard({ period }: ActivityHeatmapBoardProps) {
  const { from, to } = periodRange(period);
  // member.me 쿼리를 그대로 구독한다(별도 쿼리 키로 분리하지 않음).
  // devtools 로 member.me 캐시를 바꾸면 select 가 재계산되어 즉시 반영된다.
  const { data } = useSuspenseQuery({
    ...memberKeys.me(),
    select: (profile) => buildActivityDays(profile.grassRecord, from, to),
  });

  if (data.length === 0) {
    return <ActivityHeatmapBoard.Empty />;
  }

  // 월 단위는 달력 형식(7열, 셀이 폭을 채움), 기간 단위는 GitHub식 잔디.
  if (period.type === "month") {
    return <ActivityCalendar days={data} />;
  }

  const cells = data.map((day) => ({
    level: getActivityLevel(day.count),
    label: formatActivityTooltip(day),
  }));

  return (
    <div className="overflow-x-auto">
      <ActivityHeatmap cells={cells} />
    </div>
  );
}

function ActivityHeatmapBoardLoading() {
  return <Skeleton className="h-24 w-full" />;
}

function ActivityHeatmapBoardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-24 flex-col items-center justify-center gap-2 text-sm">
      <p>활동 기록을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function ActivityHeatmapBoardEmpty() {
  return (
    <div className="text-muted flex h-24 items-center justify-center text-sm">
      아직 활동 기록이 없어요.
    </div>
  );
}

ActivityHeatmapBoard.Loading = ActivityHeatmapBoardLoading;
ActivityHeatmapBoard.Error = ActivityHeatmapBoardError;
ActivityHeatmapBoard.Empty = ActivityHeatmapBoardEmpty;

export function ActivityHeatmapBoardBoundary({ period }: ActivityHeatmapBoardProps) {
  return (
    <QueryBoundary
      loadingFallback={<ActivityHeatmapBoard.Loading />}
      errorFallback={ActivityHeatmapBoard.Error}
    >
      <ActivityHeatmapBoard period={period} />
    </QueryBoundary>
  );
}
