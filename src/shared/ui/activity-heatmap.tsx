export interface ActivityHeatmapCell {
  level: number;
  /** 호버 시 노출할 설명(날짜·문제 수 등). */
  label?: string;
}

interface ActivityHeatmapProps {
  cells: ActivityHeatmapCell[];
  className?: string;
}

export function ActivityHeatmap({ cells, className }: ActivityHeatmapProps) {
  return (
    <div className={`grid grid-flow-col grid-rows-7 gap-1 ${className}`}>
      {cells.map((cell, index) => (
        <span
          key={cell.label ?? index}
          className="size-2.5 rounded-sm text-xs leading-none"
          data-level={cell.level}
          title={cell.label}
        />
      ))}
    </div>
  );
}
