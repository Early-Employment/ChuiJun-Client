export interface WrongProblem {
  /** 문제 고유 ID (테이블 순번 표기에도 사용) */
  id: number;
  /** 문제명 */
  title: string;
  /** 시도 횟수 */
  attempts: number;
  /** 마지막 시도 날짜 (yyyy.mm.dd) */
  date: string;
  /** 실패 이유 */
  reason: string;
}
