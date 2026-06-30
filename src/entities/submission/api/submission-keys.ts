import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { toSubmitProblemRequest } from "@/entities/submission/api/submission-api-mapper";
import type { SubmissionPayload, SubmissionRecord } from "@/entities/submission/model/submission";

export const submissionKeys = {
  all: ["submission"] as const,
  /** 친구 풀이 보기 게이트: 이 문제를 1번 이상 제출했는지. 제출 성공 시 캐시를 true로 갱신한다. */
  hasSubmitted: (problemId: number) =>
    queryOptions({
      queryKey: [...submissionKeys.all, "hasSubmitted", problemId] as const,
      // 백엔드 미구현: 항상 false. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<boolean>(`/problems/${problemId}/submitted`)).data,
      queryFn: async () => false,
    }),
  submit: () => ({
    mutationKey: [...submissionKeys.all, "submit"] as const,
    mutationFn: async (payload: SubmissionPayload): Promise<SubmissionRecord> =>
      (await instance.post<SubmissionRecord>("/submissions", toSubmitProblemRequest(payload))).data,
  }),
};
