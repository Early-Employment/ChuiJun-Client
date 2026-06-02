import { ActivityHeatmapBoardBoundary } from "@/entities/activity/ui/activity-heatmap-board";
import { ActivityLegend } from "@/entities/activity/ui/activity-legend";

export function ActivityRecordCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h3 className="text-lg font-semibold">활동 기록</h3>
      <div className="mt-5">
        <ActivityHeatmapBoardBoundary period={{ type: "range", days: 365 }} />
      </div>
      <ActivityLegend className="mt-4" />
    </section>
  );
}
