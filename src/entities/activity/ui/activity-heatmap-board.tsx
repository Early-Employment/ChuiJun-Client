"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { activityKeys } from "@/entities/activity/api/activity-keys";
import { getActivityLevel } from "@/entities/activity/model/activity-level";
import { formatActivityTooltip } from "@/entities/activity/model/activity-tooltip";
import { ActivityCalendar } from "@/entities/activity/ui/activity-calendar";
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

// month 는 표시 형태(달력)만 다를 뿐 같은 활동 데이터다. 어떤 기간이든 동일한
// range(from, to) 키로 조회해 useSuspenseQuery 가 단일 옵션 타입으로 추론되게 한다.
function periodQuery(period: ActivityPeriod) {
  if (period.type === "range") return activityKeys.range(period.from, period.to);
  const { from, to } = monthRange(period.year, period.month);
  return activityKeys.range(from, to);
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
