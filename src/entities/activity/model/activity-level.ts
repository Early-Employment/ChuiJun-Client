/**
 * 활동 수(count)를 잔디 레벨(0~5)로 변환한다.
 * 레벨 색상은 app/globals.css 의 `[data-level]` 규칙에 대응한다.
 */
export function getActivityLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  if (count <= 10) return 4;
  return 5;
}
