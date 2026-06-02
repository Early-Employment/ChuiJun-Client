import { ActivityHeatmapBoardBoundary } from "@/entities/activity/ui/activity-heatmap-board";
import { ActivityLegend } from "@/entities/activity/ui/activity-legend";

const statItems = [
  { label: "종합 랭킹", value: "1위" },
  { label: "푼 문제", value: "1개" },
  { label: "티어", value: "플래티넘" },
] as const;

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
      <h2 className="text-foreground text-2xl font-extrabold sm:text-3xl">
        000 선생님, 어서오세요!
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
        {statItems.map((item) => (
          <div key={item.label} className="min-w-0 space-y-1">
            <p className="text-body text-muted">{item.label}</p>
            <p className="text-foreground truncate text-xl font-extrabold sm:text-2xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>

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
