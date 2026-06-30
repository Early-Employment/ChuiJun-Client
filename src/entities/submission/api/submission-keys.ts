import { instance } from "@/shared/api/instance";
import { toSubmitProblemRequest } from "@/entities/submission/api/submission-api-mapper";
import type { SubmissionPayload, SubmissionRecord } from "@/entities/submission/model/submission";

export const submissionKeys = {
  all: ["submission"] as const,
  submit: () => ({
    mutationKey: [...submissionKeys.all, "submit"] as const,
    mutationFn: async (payload: SubmissionPayload): Promise<SubmissionRecord> =>
      (await instance.post<SubmissionRecord>("/submissions", toSubmitProblemRequest(payload))).data,
  }),
};
