import type { ActivityDay } from "@/entities/activity/model/activity-day";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 activity-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// index 기반 결정적 의사난수 — SSR/CSR 결과가 동일해 hydration 불일치가 없다.
function pseudoCount(index: number): number {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const fraction = seed - Math.floor(seed);
  return Math.floor(fraction * 13); // 0~12
}

/** 오늘을 마지막으로 하는 지난 `days` 일치 활동 데이터를 생성한다. */
export function createMockActivity(days: number): ActivityDay[] {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    return { date: toIsoDate(date), count: pseudoCount(index) };
  });
}

/** 특정 캘린더 월(1일~말일)의 활동 데이터를 생성한다. `month`는 1-based. */
export function createMonthlyActivity(year: number, month: number): ActivityDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month - 1, index + 1);
    // 월·일을 시드에 섞어 월마다 다른 결정적 패턴을 만든다.
    return { date: toIsoDate(date), count: pseudoCount(year * 372 + month * 31 + index) };
  });
}
