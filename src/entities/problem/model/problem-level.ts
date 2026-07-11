/** 백엔드 level enum. `GET /problems` 의 `level` 필터 값으로 그대로 보낸다. */
export const PROBLEM_LEVELS = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"] as const;

export type ProblemLevel = (typeof PROBLEM_LEVELS)[number];

export function toProblemLevelLabel(level: ProblemLevel) {
  return `lv. ${level.replace("LEVEL_", "")}`;
}
