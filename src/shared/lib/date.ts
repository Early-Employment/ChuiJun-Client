/** Date 를 ISO 날짜(yyyy-mm-dd)로 포맷한다. 로컬 시간대 기준. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** ISO 날짜(yyyy-mm-dd)를 로컬 자정 Date 로 파싱한다. (new Date("yyyy-mm-dd") 의 UTC 파싱 회피) */
export function fromIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  return new Date(year, month - 1, day);
}

/** 특정 캘린더 월(month 는 1-based)의 [from, to] 구간을 ISO 날짜로 반환한다. */
export function monthRange(year: number, month: number): { from: string; to: string } {
  const lastDay = new Date(year, month, 0).getDate();
  const mm = String(month).padStart(2, "0");
  return {
    from: `${year}-${mm}-01`,
    to: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
  };
}

/** ISO 날짜(yyyy-mm-dd)의 요일을 로컬 기준(0=일)으로 반환한다. */
export function weekdayOf(iso: string): number {
  return fromIsoDate(iso).getDay();
}
