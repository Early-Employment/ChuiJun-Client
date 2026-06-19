import type { SubmissionPayload, SubmissionRecord } from "@/entities/submission/model/submission";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 응답.
// 실데이터 전환 시 submission-keys.ts 의 mutationFn 만 instance.post 으로 교체하면 이 파일은 제거 대상이다.

export function createMockSubmissionRecord(_payload: SubmissionPayload): SubmissionRecord {
  return {
    id: `mock-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
}
