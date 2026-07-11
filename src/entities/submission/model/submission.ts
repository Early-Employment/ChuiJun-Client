/** 프론트 채점기(Pyodide)가 판정할 수 있는 제출 상태. 서버 judgeStatus enum 의 부분집합. */
export type JudgeStatus = "AC" | "WA" | "TLE" | "RE";

/**
 * 서버가 돌려주는 judgeStatus enum 전체 (team.joup.chuijun...JudgeStatus).
 * 프론트가 보내는 JudgeStatus 보다 넓다.
 */
export type ServerJudgeStatus =
  | "QUEUED" // 채점 대기 (큐에 등록됨, 아직 시작 전)
  | "RUNNING" // 채점 진행 중
  | "PASSED" // 통과 (성공)
  | "FAILED" // 실패 (세부 사유 없이 불통과)
  | "AC" // Accepted — 정답 (성공)
  | "WA" // Wrong Answer — 출력이 기대값과 다름
  | "TLE" // Time Limit Exceeded — 실행 시간 초과
  | "MLE" // Memory Limit Exceeded — 메모리 초과
  | "RE" // Runtime Error — 실행 중 예외
  | "CE" // Compile Error — 컴파일 실패
  | "IE"; // Internal Error — 채점 시스템 내부 오류

const PASSING_STATUSES = new Set<ServerJudgeStatus>(["AC", "PASSED"]);

/** 성공/실패 판정의 단일 진실은 서버 응답이다. 프론트 채점(passed)이 아니라 이걸 쓴다. */
export function isSubmissionPassed(record: SubmissionRecord): boolean {
  return PASSING_STATUSES.has(record.judgeStatus);
}

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
  judgeStatus: ServerJudgeStatus;
  score: number;
  /** 제출 반영 후 유저 총점 */
  totalScoreAfter: number;
}
