"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { activityKeys } from "@/entities/activity/api/activity-keys";
import { getActivityLevel } from "@/entities/activity/model/activity-level";
import { formatActivityTooltip } from "@/entities/activity/model/activity-tooltip";
import { ActivityCalendar } from "@/entities/activity/ui/activity-calendar";
import { ActivityHeatmap } from "@/shared/ui/activity-heatmap";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";

export type ActivityPeriod =
  | { type: "range"; days: number }
  | { type: "month"; year: number; month: number };

interface ActivityHeatmapBoardProps {
  period: ActivityPeriod;
}

// range/month 키는 queryKey 튜플 길이가 달라 union이 useSuspenseQuery에 직접 추론되지 않는다.
// queryFn 이 컨텍스트를 쓰지 않으므로 동일한 옵션 형태(range 반환 타입)로 맞춘다.
type ActivityQueryOptions = ReturnType<typeof activityKeys.range>;

function periodQuery(period: ActivityPeriod): ActivityQueryOptions {
  if (period.type === "range") return activityKeys.range(period.days);
  return activityKeys.month(period.year, period.month) as unknown as ActivityQueryOptions;
}

function ActivityHeatmapBoard({ period }: ActivityHeatmapBoardProps) {
  const { data } = useSuspenseQuery(periodQuery(period));

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
