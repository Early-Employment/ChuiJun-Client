import { fromIsoDate, toIsoDate } from "@/entities/activity/model/activity-date";
import type { ActivityDay } from "@/entities/activity/model/activity-day";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 activity-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.

// 날짜 자체를 시드로 쓰는 결정적 의사난수 — 같은 날짜는 조회 구간과 무관하게 항상 같은 값을 갖는다.
function pseudoCount(date: Date): number {
  const seed = date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
  const noise = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.floor((noise - Math.floor(noise)) * 13); // 0~12
}

/** [from, to] 구간(양끝 포함)의 일별 활동 데이터를 생성한다. from/to 는 ISO 날짜(yyyy-mm-dd). */
export function createActivity(from: string, to: string): ActivityDay[] {
  const end = fromIsoDate(to);
  const cursor = fromIsoDate(from);
  const days: ActivityDay[] = [];

  while (cursor <= end) {
    days.push({ date: toIsoDate(cursor), count: pseudoCount(cursor) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
