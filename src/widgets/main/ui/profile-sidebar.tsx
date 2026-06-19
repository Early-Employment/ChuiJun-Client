import { ActivityHeatmapBoardBoundary } from "@/entities/activity/ui/activity-heatmap-board";
import { ActivityLegend } from "@/entities/activity/ui/activity-legend";
import { ProfileSummaryBoundary } from "@/widgets/main/ui/profile-summary";

function getMonthlyColumns() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based
  const previous = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };

  return [
    { label: "저번 달", ...previous },
    { label: "이번 달", year, month },
  ] as const;
}

export function ProfileSidebar() {
  const monthlyColumns = getMonthlyColumns();

  return (
    <aside className="border-line bg-surface self-start rounded-lg border p-5 shadow-sm sm:p-6">
      <ProfileSummaryBoundary />

      <div className="mt-7">
        <h3 className="text-lg font-semibold">활동 기록</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          {monthlyColumns.map((column) => (
            <div key={column.label} className="border-line rounded-md border p-3">
              <p className="text-body text-muted">{column.label}</p>
              <div className="mt-2">
                <ActivityHeatmapBoardBoundary
                  period={{ type: "month", year: column.year, month: column.month }}
                />
              </div>
            </div>
          ))}
        </div>
        <ActivityLegend className="mt-4" />
      </div>
    </aside>
  );
}
