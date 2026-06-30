import type { SubmitProblemRequest } from "@/entities/submission/api/submission-api-response";
import type { SubmissionPayload } from "@/entities/submission/model/submission";

// ponytail: 현재 단일 언어(python). 다국어 지원 시 payload 로 언어 코드를 받는다.
const LANGUAGE_CODE = "python";

export function toSubmitProblemRequest(payload: SubmissionPayload): SubmitProblemRequest {
  return {
    problemId: payload.problemId,
    languageCode: LANGUAGE_CODE,
    submittedCode: payload.code,
    judgeStatus: payload.judgeStatus,
    score: payload.score,
    studySeconds: payload.studySeconds,
  };
}
