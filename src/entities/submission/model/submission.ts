/** 프론트 채점기(Pyodide)가 판정할 수 있는 제출 상태. Swagger judgeStatus enum 의 부분집합. */
export type JudgeStatus = "AC" | "WA" | "TLE" | "RE";

/** 클라이언트(Pyodide)가 전수 채점한 결과. 분야별 현황·틀린문제 집계의 입력이 된다. */
export interface SubmissionResult {
  problemId: number;
  /** 전 테스트케이스 통과 여부 */
  passed: boolean;
  passedCount: number;
  totalCount: number;
  /** 채점에 걸린 총 실행 시간(ms) */
  durationMs: number;
  /** 채점 판정 (서버 제출 시 그대로 전달) */
  judgeStatus: JudgeStatus;
}

/** 서버에 POST 하는 제출 페이로드. 매퍼가 SubmitProblemRequest 로 변환한다. */
export interface SubmissionPayload {
  problemId: number;
  judgeStatus: JudgeStatus;
  /** 제출 소스 코드 */
  code: string;
  /** 이번 제출로 획득한 점수 (통과 시 문제 점수, 실패 시 0) */
  score: number;
  /** 문제를 푸는 데 걸린 시간(초) */
  studySeconds: number;
}

/** 서버가 제출을 기록한 뒤 돌려주는 응답 (SubmitProblemResponse). */
export interface SubmissionRecord {
  submissionId: number;
  judgeStatus: string;
  score: number;
  /** 제출 반영 후 유저 총점 */
  totalScoreAfter: number;
}
