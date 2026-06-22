export type ProblemSolveStatus = "안 풀림" | "해결함";

export interface ProblemListItem {
  status: ProblemSolveStatus;
  title: string;
  level: string;
  solvedCount: string;
}
