import type { ProblemAlgorithmType } from "@/entities/problem/model/problem-algorithm-type";
import type { ProblemLevel } from "@/entities/problem/model/problem-level";
import type { ProblemSolveStatus } from "@/entities/problem/model/problem-solve-status";

/** `GET /problems` 가 받는 필터 쿼리 파라미터. 값이 없으면 해당 필터를 보내지 않는다. */
export interface ProblemFilter {
  keyword?: string;
  level?: ProblemLevel;
  solveStatus?: ProblemSolveStatus;
  algorithmType?: ProblemAlgorithmType;
}
