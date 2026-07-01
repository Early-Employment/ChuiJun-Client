import { fromIsoDate, toIsoDate } from "@/shared/lib/date";
import type { ActivityDay } from "@/entities/activity/model/activity-day";
import type { GrassRecord } from "@/entities/member/model/member-profile";

/** grassRecord(활동이 있었던 날짜만) 를 [from, to] 구간의 빈틈없는 일별 배열로 채운다. */
export function buildActivityDays(
  grassRecord: GrassRecord[],
  from: string,
  to: string,
): ActivityDay[] {
  const solvedCountByDate = new Map(grassRecord.map((record) => [record.date, record.solvedCount]));

  const days: ActivityDay[] = [];
  const end = fromIsoDate(to);
  const cursor = fromIsoDate(from);
  while (cursor <= end) {
    const date = toIsoDate(cursor);
    days.push({ date, count: solvedCountByDate.get(date) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
