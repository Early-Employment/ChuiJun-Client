import { toIsoDate } from "@/shared/lib/date";
import {
  ActivityHeatmapBoardBoundary,
  type ActivityPeriod,
} from "@/entities/activity/ui/activity-heatmap-board";
import { ActivityLegend } from "@/entities/activity/ui/activity-legend";

// 서버 렌더 시점에 한 번 계산해 props 로 내려보낸다 (queryKey 가 클라이언트 시간에 흔들리지 않도록).
function recentYearPeriod(): ActivityPeriod {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - 364); // 오늘 포함 365일
  return { type: "range", from: toIsoDate(from), to: toIsoDate(to) };
}

export function ActivityRecordCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h3 className="text-lg font-semibold">활동 기록</h3>
      <div className="mt-5">
        <ActivityHeatmapBoardBoundary period={recentYearPeriod()} />
      </div>
      <ActivityLegend className="mt-4" />
    </section>
  );
}
