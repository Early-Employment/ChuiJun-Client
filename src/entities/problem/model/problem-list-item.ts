import type { ProblemAlgorithmType } from "@/entities/problem/model/problem-algorithm-type";
import type { ProblemSolveStatus } from "@/entities/problem/model/problem-solve-status";

export interface ProblemListItem {
  id: number;
  code: string;
  title: string;
  level: string;
  algorithmType: ProblemAlgorithmType;
  /** 비로그인 상태에서는 null. */
  solveStatus: ProblemSolveStatus | null;
  acceptRate: number;
}
