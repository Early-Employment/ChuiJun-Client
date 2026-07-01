import type { JudgeStatus } from "@/entities/submission/model/submission";

/** Swagger SubmitProblemRequest. 프론트 컴파일러가 판정한 결과 + 소스코드. */
export interface SubmitProblemRequest {
  problemId: number;
  languageCode: string;
  submittedCode: string;
  judgeStatus: JudgeStatus;
  score: number;
  studySeconds: number;
}
