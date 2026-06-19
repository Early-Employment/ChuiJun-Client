/** 클라이언트(Pyodide)가 전수 채점한 결과. 분야별 현황·틀린문제 집계의 입력이 된다. */
export interface SubmissionResult {
  problemId: number;
  /** 전 테스트케이스 통과 여부 */
  passed: boolean;
  passedCount: number;
  totalCount: number;
  /** 채점에 걸린 총 실행 시간(ms) */
  durationMs: number;
}

/** 서버에 POST 하는 제출 페이로드 (채점 결과 + 소스 코드). */
export interface SubmissionPayload extends SubmissionResult {
  code: string;
}

/** 서버가 제출을 기록한 뒤 돌려주는 응답. */
export interface SubmissionRecord {
  id: string;
  /** 기록 시각 (ISO 8601) */
  submittedAt: string;
}
