import type { ActivityDay } from "@/entities/activity/model/activity-day";

/** 잔디/달력 셀 호버 시 보여줄 설명을 만든다. 예: "2026.06.01 · 3문제 해결" */
export function formatActivityTooltip(day: ActivityDay): string {
  const dateLabel = day.date.replaceAll("-", ".");
  return day.count > 0 ? `${dateLabel} · ${day.count}문제 해결` : `${dateLabel} · 푼 문제 없음`;
}
