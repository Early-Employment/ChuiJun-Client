// 잔디 색이 무엇을 의미하는지 설명하는 범례.
// 왼쪽: 카운트 기준 설명, 오른쪽: Less~More 색 단계(data-level 0~5).
const LEGEND_LEVELS = [0, 1, 2, 3, 4, 5] as const;

export function ActivityLegend({ className }: { className?: string }) {
  return (
    <div
      className={`text-muted flex items-center justify-between text-xs${className ? ` ${className}` : ""}`}
    >
      <span>푼 문제 수가 많을수록 칸이 진해져요</span>
      <div className="flex items-center gap-1">
        <span>Less</span>
        {LEGEND_LEVELS.map((level) => (
          <span key={level} className="size-2.5 rounded-sm" data-level={level} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
