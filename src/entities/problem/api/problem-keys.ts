import { queryOptions } from "@tanstack/react-query";
import { createMockWrongProblems } from "@/entities/problem/api/wrong-problem-mock";
import { createMockProblemDetail } from "@/entities/problem/api/problem-detail-mock";

export const problemKeys = {
  all: ["problem"] as const,
  wrong: () =>
    queryOptions({
      queryKey: [...problemKeys.all, "wrong"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<WrongProblem[]>("/problems/wrong")).data,
      queryFn: async () => createMockWrongProblems(),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...problemKeys.all, "detail", id] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ProblemDetail>(`/problems/${id}`)).data,
      queryFn: async () => createMockProblemDetail(id),
    }),
};
